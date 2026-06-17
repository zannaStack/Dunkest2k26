export function normalizePlayer(p) {
  const parsedCost = parseFloat(p.cr);
  return {
    ...p,
    id: p.id,
    nome: p.first_name,
    cognome: p.last_name,
    fullname: `${p.first_name} ${p.last_name}`,
    cost: !isNaN(parsedCost) ? parsedCost : 4,
    pdk: parseFloat(p.pdk) || 0.0,
    pts: parseFloat(p.pts) || 0.0,
    reb: parseFloat(p.reb) || 0.0,
    ast: parseFloat(p.ast) || 0.0,
    role: p.position,
    team: p.team_code,
    teamName: p.team_name,
  };
}

export function getTeamList(players) {
  const teams = new Set(players.map(p => p.team));
  return ['Tutte', ...Array.from(teams).sort()];
}

export function getRosterPlayerIds(roster) {
  return new Set(Object.values(roster).filter(Boolean).map(p => p.id));
}

export function isCompatibleRole(playerRole, slotKey) {
  // Gestione Guardie (Titolari, Panchina BG1/BG2, Tribuna TG)
  if (slotKey.startsWith('G') || slotKey.startsWith('BG') || slotKey === 'TG') {
    return playerRole === 'G';
  }
  
  // Gestione Ali (Titolari, Panchina BF1/BF2, Tribuna TF)
  if (slotKey.startsWith('F') || slotKey.startsWith('BF') || slotKey === 'TF') {
    return playerRole === 'F';
  }
  
  // Gestione Centri (Titolare C, Panchina BC, Tribuna TC)
  if (slotKey === 'C' || slotKey === 'BC' || slotKey === 'TC') {
    return playerRole === 'C';
  }
  
  return false;
}

export function compareByField(field, direction) {
  return (a, b) => {
    let valA = a[field];
    let valB = b[field];

    // Fallback: se ordiniamo per ratingAsta ma è 0/non definito (es. rookie senza storico), ordiniamo per costo
    if (field === 'ratingAsta') {
      if (!valA) valA = a.cost || 0;
      if (!valB) valB = b.cost || 0;
    }

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  };
}

const normalizeText = (text) => {
  if (!text) return '';
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export function filterAndSortPlayers(players, roster, filters) {
  const rosterPlayerIds = getRosterPlayerIds(roster);

  return players
    .filter(p => !rosterPlayerIds.has(p.id))
    .filter(p => {
      if (filters.searchQuery.trim() !== '') {
        const normName = normalizeText(p.fullname);
        const normQuery = normalizeText(filters.searchQuery);
        return normName.includes(normQuery);
      }
      return true;
    })
    .filter(p => filters.selectedTeam === 'Tutte' || p.team === filters.selectedTeam)
    .filter(p => filters.selectedRole === 'Tutti' || p.role === filters.selectedRole)
    .filter(p => filters.tagFilter === 'Tutti' || filters.playerTags[p.id] === filters.tagFilter)
    .sort(compareByField(filters.sortField, filters.sortDirection));
}

// =====================================================
// RATING ASTA - CALCOLO MULTILIVELLO
// =====================================================

/**
 * PARTE 1: Calcolo del valore base ponderato (PDK_base)
 * - Pesi stagionali: T-1 (50%), T-2 (35%), T-3 (15%)
 * - Modificatore di presenza: 0.4 se < 55% partite, 1.0 altrimenti
 * - Ritorna PDK_base ponderato
 */
function calculatePDKBase(seasonalData) {
  const weights = { 0: 0.50, 1: 0.35, 2: 0.15 }; // T-1, T-2, T-3
  
  let weightedSum = 0;
  let totalWeight = 0;

  seasonalData.forEach((season, index) => {
    if (!season || season.pdk === undefined) return;

    const weight = weights[index] || 0;
    const maxGp = season.maxGp || 82;
    const presenceRatio = season.gp / maxGp;
    const presenceModifier = presenceRatio >= 0.55 ? 1.0 : 0.4;

    const adjustedPdk = season.pdk * presenceModifier;
    weightedSum += adjustedPdk * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * PARTE 2: Calcolo dei modificatori oggettivi (CC, MT)
 * - CC: Coefficiente di Costanza (variabilità stagionale)
 * - MT: Moltiplicatore di Trend (crescita/calo nel tempo)
 */
function calculateObjectiveModifiers(seasonalData, pdkBase) {
  // Coefficiente di Costanza (CC)
  // Calcola la deviazione standard dei PDK stagionali
  const pdkValues = seasonalData
    .filter(s => s && s.pdk !== undefined)
    .map(s => s.pdk);

  let CC = 1.0;
  if (pdkValues.length > 1) {
    const mean = pdkValues.reduce((a, b) => a + b, 0) / pdkValues.length;
    const variance = pdkValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / pdkValues.length;
    const stdDev = Math.sqrt(variance);
    const costanzaPenalty = pdkBase > 0 ? stdDev / pdkBase : 0;
    CC = Math.max(0.9, 1.0 - Math.min(costanzaPenalty, 0.1));
  }

  // Moltiplicatore di Trend (MT)
  let MT = 1.0;
  if (seasonalData.length >= 2) {
    const t1 = seasonalData[0]?.pdk || 0;
    const t3 = seasonalData[seasonalData.length - 1]?.pdk || 0;
    const trend = t1 - t3;

    if (trend > 0) {
      MT = Math.min(1.1, 1.0 + (trend / Math.max(t3, 1) * 0.1));
    } else if (trend < 0) {
      MT = Math.max(0.85, 1.0 + (trend / Math.max(t1, 1) * 0.15));
    }
  }

  return { CC, MT };
}

/**
 * Calcola il prezzo d'asta consigliato (Target Bid) basato su Rating_Asta e budget totale (500 cr di default).
 * Curva non lineare calibrata su fanta-rose Dunkest da 13 giocatori (5 titolari, 5 panchina, 3 tribuna).
 */
export function calculateEstimatedPrice(ratingAsta, budget = 500) {
  if (!ratingAsta || ratingAsta <= 5) return 1;
  const r = Math.max(0, Math.min(100, ratingAsta)) / 100;
  const maxShare = 0.26; // Un Top 1 assoluto (Jokic) assorbe circa il 26% del budget (~130 cr su 500)
  const rawPrice = 1 + Math.pow(r, 1.85) * (budget * maxShare);
  return Math.max(1, Math.round(rawPrice));
}

/**
 * PARTE 3: Calcolo del Rating_Asta finale e Prezzo Stimato
 * - Combina PDK_base con modificatori
 * - Normalizza su scala 0-100
 * - Applica fattore scarsità per ruolo
 * - Calcola il prezzo consigliato per budget d'asta
 */
export function calculateRatingAsta(allPlayersSeasonalData, budget = 500) {
  // allPlayersSeasonalData = array di giocatori con i loro dati per stagione
  // Struttura: { id, fullname, role, seasonalData: [{ pdk, gp, maxGp }] }

  // Step 1: Calcola il valore rettificato per ogni giocatore
  const playerRatings = allPlayersSeasonalData.map(playerData => {
    const pdkBase = calculatePDKBase(playerData.seasonalData);
    const modifiers = calculateObjectiveModifiers(playerData.seasonalData, pdkBase);
    
    const rectifiedValue = pdkBase * modifiers.CC * modifiers.MT;

    return {
      ...playerData,
      pdkBase,
      modifiers,
      rectifiedValue
    };
  });

  // Step 2: Normalizza su scala 0-100 rispetto al valore massimo
  const maxRectified = Math.max(...playerRatings.map(p => p.rectifiedValue), 0.001);
  
  const normalizedRatings = playerRatings.map(player => {
    let normalized = (player.rectifiedValue / maxRectified) * 100;

    // Fallback per newcomer / rookie senza storico NBA ma con costo listino Dunkest > 4
    if (normalized === 0 && player.cost > 4) {
      normalized = Math.min(75, (player.cost / 30) * 75);
    }

    // Step 3: Applica fattore scarsità ruolo (Centro = 1.05, altri = 1.0)
    const scarcityFactor = player.role === 'C' ? 1.05 : 1.0;
    let finalRating = normalized * scarcityFactor;

    finalRating = Math.min(finalRating, 100);

    // Calcola il PDK medio dalle stagioni
    const avgPdk = player.seasonalData.length > 0 
      ? player.seasonalData.reduce((sum, s) => sum + (s.pdk || 0), 0) / player.seasonalData.length
      : (player.cost > 4 ? player.cost * 1.8 : 0);

    const roundedRating = Math.round(finalRating * 10) / 10;
    const stimaAsta = calculateEstimatedPrice(roundedRating, budget);

    return {
      ...player,
      id: player.id,
      fullname: player.fullname,
      role: player.role,
      team: player.team,
      teamName: player.teamName,
      cost: player.cost,
      pts: Math.round(player.pts * 10) / 10,
      reb: Math.round(player.reb * 10) / 10,
      ast: Math.round(player.ast * 10) / 10,
      pdk: Math.round(avgPdk * 10) / 10,
      ratingAsta: roundedRating,
      stimaAsta: stimaAsta,
      prezzoConsigliato: stimaAsta
    };
  });

  return normalizedRatings;
}