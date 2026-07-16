import { useState, useEffect, useMemo } from 'react';
import {
  AVAILABLE_SEASONS,
  MIN_PLAYER_COST,
  DEFAULT_BUDGET,
  MIN_BUDGET,
  MAX_BUDGET,
  COURT_SLOTS_MAIN,
  BENCH_SLOTS,
  TRIBUNA_SLOTS,
  SLOT_PRIORITY,
  SLOT_PATHS_BY_ROLE,
  getDefaultRoster
} from '../utils/config';
import {
  normalizePlayer,
  getTeamList,
  getRosterPlayerIds,
  isCompatibleRole,
  filterAndSortPlayers,
  calculateRatingAsta
} from '../utils/playerUtils';
import {
  calculateRosterStats,
  calculateRosterValidation,
  getEmptySlots,
  getSlotOrderForRole
} from '../utils/rosterUtils';

function buildListone2627WithHistory(listone2627Raw, historicalSeasonsRaw) {
  const playersMap = new Map();
  const slugMap = new Map();
  const nameMap = new Map();

  // 1. Popoliamo la mappa esclusivamente con i giocatori del Listone 26/27
  listone2627Raw.forEach(p => {
    const norm = normalizePlayer(p);
    const entry = {
      ...norm,
      cost: norm.cost, // Crediti ufficiali 26/27
      seasonalData: [],
      ptsSum: 0,
      rebSum: 0,
      astSum: 0,
      histCount: 0
    };
    playersMap.set(norm.id, entry);
    if (p.slug) slugMap.set(p.slug, entry);
    if (norm.fullname) nameMap.set(norm.fullname.toLowerCase(), entry);
  });

  // 2. Arricchiamo con i dati storici delle stagioni passate (25/26, 24/25, 23/24)
  historicalSeasonsRaw.forEach(seasonData => {
    if (!Array.isArray(seasonData)) return;
    seasonData.forEach(hp => {
      const hNorm = normalizePlayer(hp);
      const target = playersMap.get(hNorm.id) ||
                     (hp.slug ? slugMap.get(hp.slug) : null) ||
                     (hNorm.fullname ? nameMap.get(hNorm.fullname.toLowerCase()) : null);

      if (target) {
        target.seasonalData.push({
          pdk: hNorm.pdk,
          gp: parseInt(hp.gp) || 0,
          maxGp: 82
        });
        target.ptsSum += hNorm.pts;
        target.rebSum += hNorm.reb;
        target.astSum += hNorm.ast;
        target.histCount += 1;
      }
    });
  });

  // 3. Calcoliamo le statistiche dell'ultima stagione per ciascun giocatore
  const aggregatedList = Array.from(playersMap.values()).map(player => {
    const lastSeason = player.seasonalData[0]; // Stagione 25/26 (o fallback su precedente)
    return {
      ...player,
      pts: lastSeason ? lastSeason.pts : player.pts,
      reb: lastSeason ? lastSeason.reb : player.reb,
      ast: lastSeason ? lastSeason.ast : player.ast,
      pdk: lastSeason ? lastSeason.pdk : player.pdk,
    };
  });

  // 4. Generiamo il Rating_Asta multilivello
  return calculateRatingAsta(aggregatedList);
}

export default function useDunkestApp() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [history, setHistory] = useState([]);
  const [canUndo, setCanUndo] = useState(false);

  const [stagione, setStagione] = useState(() => {
    return 'Tutte';
  });

  const [theme, setTheme] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('dunkest-theme') || 'dark' : 'dark';
  });

  const [startingBudget, setStartingBudget] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dunkest-starting-budget');
      return saved ? parseInt(saved, 10) : DEFAULT_BUDGET;
    }
    return DEFAULT_BUDGET;
  });
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dunkest-starting-budget');
      return saved || DEFAULT_BUDGET.toString();
    }
    return DEFAULT_BUDGET.toString();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Tutte');
  const [selectedRole, setSelectedRole] = useState('Tutti');
  const [tagFilter, setTagFilter] = useState('Tutti');
  const [playerTags, setPlayerTags] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dunkest-player-tags');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [sortField, setSortField] = useState('pdk');
  const [sortDirection, setSortDirection] = useState('desc');

  const [roster, setRoster] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dunkest-roster');
      return saved ? JSON.parse(saved) : getDefaultRoster();
    }
    return getDefaultRoster();
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activePurchase, setActivePurchase] = useState(null);

  // Live Auction & Opponents States
  const [opponents, setOpponents] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dunkest-opponents');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [auctionLog, setAuctionLog] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dunkest-auction-log');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isDraftConfigured, setIsDraftConfigured] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dunkest-is-draft-configured');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Auto-save to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dunkest-starting-budget', startingBudget.toString());
      localStorage.setItem('dunkest-roster', JSON.stringify(roster));
      localStorage.setItem('dunkest-opponents', JSON.stringify(opponents));
      localStorage.setItem('dunkest-auction-log', JSON.stringify(auctionLog));
      localStorage.setItem('dunkest-is-draft-configured', JSON.stringify(isDraftConfigured));
      localStorage.setItem('dunkest-player-tags', JSON.stringify(playerTags));
    }
  }, [startingBudget, roster, opponents, auctionLog, isDraftConfigured, playerTags]);

  const getSnapshot = () => ({
    players: [...players],
    roster: { ...roster },
    startingBudget,
    tempBudgetInput,
    searchQuery,
    selectedTeam,
    selectedRole,
    tagFilter,
    playerTags: { ...playerTags },
    sortField,
    sortDirection,
    selectedSlot,
    activePurchase: activePurchase ? { ...activePurchase } : null,
    stagione,
    opponents: opponents.map(opp => ({
      ...opp,
      roster: [...opp.roster],
      roleCounts: { ...opp.roleCounts }
    })),
    auctionLog: auctionLog.map(log => ({ ...log })),
    isDraftConfigured
  });

  const pushHistory = () => {
    setHistory(prev => {
      const newHistory = [...prev, getSnapshot()].slice(-20);
      setCanUndo(newHistory.length > 0);
      return newHistory;
    });
  };

  const undoLastAction = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const previous = prev[prev.length - 1];
      const nextHistory = prev.slice(0, -1);

      setPlayers(previous.players);
      setRoster(previous.roster);
      setStartingBudget(previous.startingBudget);
      setTempBudgetInput(previous.tempBudgetInput);
      setSearchQuery(previous.searchQuery);
      setSelectedTeam(previous.selectedTeam);
      setSelectedRole(previous.selectedRole);
      setTagFilter(previous.tagFilter || 'Tutti');
      setPlayerTags(previous.playerTags || {});
      setSortField(previous.sortField);
      setSortDirection(previous.sortDirection);
      setActivePurchase(previous.activePurchase);
      setSelectedSlot(previous.selectedSlot);
      setStagione(previous.stagione);
      setOpponents(previous.opponents || []);
      setAuctionLog(previous.auctionLog || []);
      setIsDraftConfigured(previous.isDraftConfigured || false);
      setCanUndo(nextHistory.length > 0);
      setError(null);
      setLoading(false);

      return nextHistory;
    });
  };

  const setAppStagione = (value) => {
    pushHistory();
    setStagione(value);
  };

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
    localStorage.setItem('dunkest-theme', theme);
  }, [theme]);

  useEffect(() => {
    setLoading(true);
    setPlayers([]);

    // 1. Prova prima a caricare il database unificato già calcolato (89KB, istantaneo)
    fetch('/data/Giocatori2627_computed.json')
      .then(res => {
        if (!res.ok) throw new Error('File precompilato non trovato');
        return res.json();
      })
      .then(precomputed => {
        if (Array.isArray(precomputed) && precomputed.length > 0) {
          setPlayers(precomputed);
          setLoading(false);
          return;
        }
        throw new Error('Dati precalcolati non validi');
      })
      .catch(() => {
        // 2. Fallback trasparente sui 4 file grezzi storici
        const seasonFiles = [
          '/data/Giocatori2627.txt',
          '/data/Giocatori2526.txt',
          '/data/Giocatori2425.txt',
          '/data/Giocatori2324.txt'
        ];

        Promise.all(
          seasonFiles.map(url =>
            fetch(url)
              .then(res => {
                if (!res.ok) throw new Error(`Manca il file: ${url}`);
                return res.json();
              })
              .catch(() => [])
          )
        )
          .then(([listone2627, data2526, data2425, data2324]) => {
            if (!listone2627 || listone2627.length === 0) {
              throw new Error('Nessun giocatore trovato nel Listone 26/27');
            }

            const sanitized = buildListone2627WithHistory(listone2627, [data2526, data2425, data2324]);
            setPlayers([...sanitized]);
            setLoading(false);
          })
          .catch(err => {
            setError(err.message);
            setLoading(false);
          });
      });
  }, []);

  const teamList = useMemo(() => getTeamList(players), [players]);

  const budgetSpent = useMemo(() => {
    return Object.values(roster).reduce((sum, player) => {
      return sum + (player ? player.purchasePrice : 0);
    }, 0);
  }, [roster]);

  const budgetRemaining = startingBudget - budgetSpent;

  const rosterStats = useMemo(() => calculateRosterStats(roster), [roster]);

  const rosterValidation = useMemo(
    // Estende la validazione per tenere conto del nuovo totale slot (13 invece di 10)
    () => {
      const baseValidation = calculateRosterValidation(roster, budgetRemaining);
      const count = Object.values(roster).filter(Boolean).length;
      return {
        ...baseValidation,
        count,
        isFull: count === 13 // Titolari (5) + Panchina (5) + Tribuna (3)
      };
    },
    [roster, budgetRemaining]
  );

  const undraftedPlayers = useMemo(() => {
    const ids = new Set();
    Object.values(roster).forEach(p => { if (p) ids.add(p.id); });
    opponents.forEach(opp => {
      opp.roster.forEach(p => ids.add(p.id));
    });
    return players.filter(p => !ids.has(p.id));
  }, [players, roster, opponents]);

  const filteredPlayers = useMemo(
    () => filterAndSortPlayers(undraftedPlayers, roster, {
      searchQuery,
      selectedTeam,
      selectedRole,
      tagFilter,
      playerTags,
      sortField,
      sortDirection
    }),
    [undraftedPlayers, roster, searchQuery, selectedTeam, selectedRole, tagFilter, playerTags, sortField, sortDirection]
  );

  const updatePlayerTag = (playerId, tag) => {
    pushHistory();
    setPlayerTags(prev => ({
      ...prev,
      [playerId]: tag || undefined
    }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const openPurchasePopup = (player) => {
    setActivePurchase({
      player,
      priceInput: '1',
      defaultPrice: player.cost
    });
  };

  const closePurchasePopup = () => {
    setActivePurchase(null);
  };

  const handleSlotClick = (slotKey) => {
    if (selectedSlot && selectedSlot !== slotKey) {
      const fromKey = selectedSlot;
      const toKey = slotKey;
      
      const playerFrom = roster[fromKey];
      const playerTo = roster[toKey];
      
      // Se entrambi gli slot sono vuoti, cambiamo solo la selezione dello slot
      if (!playerFrom && !playerTo) {
        setSelectedSlot(toKey);
        return;
      }
      
      // Verifichiamo la compatibilità del ruolo dei giocatori con i nuovi slot
      let compatible = true;
      if (playerFrom && !isCompatibleRole(playerFrom.role, toKey)) {
        compatible = false;
      }
      if (playerTo && !isCompatibleRole(playerTo.role, fromKey)) {
        compatible = false;
      }
      
      if (compatible) {
        pushHistory();
        
        // Eseguiamo lo scambio nel roster
        setRoster(prev => ({
          ...prev,
          [fromKey]: playerTo,
          [toKey]: playerFrom
        }));
        
        // Aggiorniamo anche il registro dell'asta per coerenza
        setAuctionLog(prev => prev.map(log => {
          if (log.teamId === 'mia_squadra') {
            if (log.slotKey === fromKey) {
              return { ...log, slotKey: toKey };
            }
            if (log.slotKey === toKey) {
              return { ...log, slotKey: fromKey };
            }
          }
          return log;
        }));
        
        setSelectedSlot(null);
        return;
      } else {
        // Se i ruoli non sono compatibili, selezioniamo semplicemente il nuovo slot cliccato
        setSelectedSlot(toKey);
        return;
      }
    }
    
    // Comportamento base: seleziona o deseleziona lo slot
    setSelectedSlot(prev => prev === slotKey ? null : slotKey);
  };

  const startAuction = () => {
    if (isDraftConfigured) {
      if (!confirm('Sei sicuro di voler resettare l\'asta in corso? Perderai tutti i roster e i budget degli avversari.')) {
        return;
      }
    }
    pushHistory();
    setStartingBudget(500);
    setTempBudgetInput('500');
    
    const opponentNames = [
      'nicco',
      'cacca',
      'francia',
      'sime',
      'tork',
      'pizz',
      'sparaco',
      'tioli',
      'monte',
      'coach',
      'fre'
    ];
    
    const newOpponents = opponentNames.map((name, i) => ({
      id: `opp_${i}`,
      name: name,
      budget: 500,
      roster: [],
      roleCounts: { G: 0, F: 0, C: 0 }
    }));
    
    setOpponents(newOpponents);
    setAuctionLog([]);
    setIsDraftConfigured(true);
  };

  const stopAuction = () => {
    if (!confirm('Sei sicuro di voler terminare l\'asta? I roster degli avversari e il registro verranno cancellati, ma la tua squadra verrà mantenuta.')) {
      return;
    }
    pushHistory();
    setOpponents([]);
    setAuctionLog([]);
    setIsDraftConfigured(false);
  };

  const executePurchase = (cost, targetTeamId = 'mia_squadra') => {
    if (!activePurchase) return;
    const player = activePurchase.player;

    if (targetTeamId === 'mia_squadra') {
      if (budgetRemaining < cost) {
        alert('Crediti insufficienti per questa offerta d\'asta!');
        return;
      }

      pushHistory();

      let targetSlot = selectedSlot;

      if (targetSlot) {
        if (!isCompatibleRole(player.role, targetSlot)) {
          alert(`Il giocatore è un ${player.role} e non può essere inserito nello slot ${targetSlot}!`);
          return;
        }
        if (roster[targetSlot]) {
          if (!confirm(`Lo slot ${targetSlot} è già occupato da ${roster[targetSlot].fullname}. Vuoi sostituirlo?`)) {
            return;
          }
        }
      } else {
        const slotOrder = getSlotOrderForRole(player.role, SLOT_PATHS_BY_ROLE);
        targetSlot = slotOrder.find(s => roster[s] === null);

        if (!targetSlot) {
          alert('Non ci sono slot liberi compatibili con il ruolo di ' + player.role + '! Vendi un giocatore prima di acquistarne un altro.');
          closePurchasePopup();
          return;
        }
      }

      setRoster(prev => ({
        ...prev,
        [targetSlot]: {
          ...player,
          purchasePrice: cost
        }
      }));

      setAuctionLog(prev => [
        {
          id: `log_${Date.now()}`,
          player: player,
          teamId: 'mia_squadra',
          teamName: 'Mia Squadra',
          purchasePrice: cost,
          slotKey: targetSlot
        },
        ...prev
      ]);

      setSelectedSlot(null);
    } else {
      const opponent = opponents.find(opp => opp.id === targetTeamId);
      if (!opponent) {
        alert('Avversario non trovato!');
        return;
      }

      if (opponent.budget < cost) {
        alert(`Crediti insufficienti per ${opponent.name}!`);
        return;
      }

      if (opponent.roster.length >= 13) {
        alert(`La squadra di ${opponent.name} è già completa (13 giocatori)!`);
        return;
      }

      pushHistory();

      setOpponents(prev =>
        prev.map(opp => {
          if (opp.id === targetTeamId) {
            return {
              ...opp,
              budget: opp.budget - cost,
              roster: [...opp.roster, { ...player, purchasePrice: cost }],
              roleCounts: {
                ...opp.roleCounts,
                [player.role]: opp.roleCounts[player.role] + 1
              }
            };
          }
          return opp;
        })
      );

      setAuctionLog(prev => [
        {
          id: `log_${Date.now()}`,
          player: player,
          teamId: targetTeamId,
          teamName: opponent.name,
          purchasePrice: cost
        },
        ...prev
      ]);
    }

    setSearchQuery('');
    closePurchasePopup();
  };

  const revertPurchase = (logId) => {
    const logEntry = auctionLog.find(log => log.id === logId);
    if (!logEntry) return;

    if (!confirm(`Vuoi annullare l'acquisto di ${logEntry.player.fullname}? Il giocatore tornerà sul mercato.`)) {
      return;
    }

    pushHistory();

    if (logEntry.teamId === 'mia_squadra') {
      setRoster(prev => ({
        ...prev,
        [logEntry.slotKey]: null
      }));
    } else {
      setOpponents(prev =>
        prev.map(opp => {
          if (opp.id === logEntry.teamId) {
            return {
              ...opp,
              budget: opp.budget + logEntry.purchasePrice,
              roster: opp.roster.filter(p => p.id !== logEntry.player.id),
              roleCounts: {
                ...opp.roleCounts,
                [logEntry.player.role]: Math.max(0, opp.roleCounts[logEntry.player.role] - 1)
              }
            };
          }
          return opp;
        })
      );
    }

    setAuctionLog(prev => prev.filter(log => log.id !== logId));
  };

  const editPurchase = (logId, newPrice, newTeamId) => {
    const logEntry = auctionLog.find(log => log.id === logId);
    if (!logEntry) return;

    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Inserisci un prezzo d\'acquisto numerico valido!');
      return;
    }

    const isSameTeam = logEntry.teamId === newTeamId;

    if (newTeamId === 'mia_squadra') {
      const currentRemaining = budgetRemaining + (isSameTeam ? logEntry.purchasePrice : 0);
      if (currentRemaining < newPrice) {
        alert('Crediti insufficienti per la tua squadra per questa nuova offerta!');
        return;
      }
      if (!isSameTeam) {
        const slotOrder = getSlotOrderForRole(logEntry.player.role, SLOT_PATHS_BY_ROLE);
        const targetSlot = slotOrder.find(s => roster[s] === null);
        if (!targetSlot) {
          alert(`Non ci sono slot liberi per il ruolo di ${logEntry.player.role} nella tua squadra!`);
          return;
        }
      }
    } else {
      const opp = opponents.find(o => o.id === newTeamId);
      if (!opp) {
        alert('Avversario di destinazione non trovato!');
        return;
      }
      const currentRemaining = opp.budget + (isSameTeam ? logEntry.purchasePrice : 0);
      if (currentRemaining < newPrice) {
        alert(`Crediti insufficienti per ${opp.name} per questa nuova offerta!`);
        return;
      }
      if (!isSameTeam && opp.roster.length >= 13) {
        alert(`La squadra di ${opp.name} è già completa (13 giocatori)!`);
        return;
      }
    }

    pushHistory();

    // Calcoliamo lo slotKey finale se l'assegnazione va al nostro team
    let finalSlotKey = null;
    if (newTeamId === 'mia_squadra') {
      const tempRoster = { ...roster };
      if (logEntry.teamId === 'mia_squadra') {
        tempRoster[logEntry.slotKey] = null;
      }
      let targetSlot = isSameTeam ? logEntry.slotKey : null;
      if (!targetSlot || tempRoster[targetSlot] !== null) {
        const slotOrder = getSlotOrderForRole(logEntry.player.role, SLOT_PATHS_BY_ROLE);
        targetSlot = slotOrder.find(s => tempRoster[s] === null || s === logEntry.slotKey);
      }
      finalSlotKey = targetSlot;
    }

    // Risolviamo il nome del team di destinazione
    let finalTeamName = '';
    if (newTeamId === 'mia_squadra') {
      finalTeamName = 'Mia Squadra';
    } else {
      const opp = opponents.find(o => o.id === newTeamId);
      finalTeamName = opp ? opp.name : 'Avversario';
    }

    // Eseguiamo gli aggiornamenti di stato per gli avversari
    setOpponents(prev => {
      let step1 = prev;
      // 1. Rimuoviamo se il vecchio proprietario era un avversario
      if (logEntry.teamId !== 'mia_squadra') {
        step1 = prev.map(o => {
          if (o.id === logEntry.teamId) {
            return {
              ...o,
              budget: o.budget + logEntry.purchasePrice,
              roster: o.roster.filter(p => p.id !== logEntry.player.id),
              roleCounts: {
                ...o.roleCounts,
                [logEntry.player.role]: Math.max(0, o.roleCounts[logEntry.player.role] - 1)
              }
            };
          }
          return o;
        });
      }

      // 2. Aggiungiamo (o aggiorniamo se era lo stesso) al nuovo avversario proprietario
      if (newTeamId !== 'mia_squadra') {
        return step1.map(o => {
          if (o.id === newTeamId) {
            const updatedBudget = isSameTeam
              ? o.budget + logEntry.purchasePrice - newPrice
              : o.budget - newPrice;

            const updatedRoster = isSameTeam
              ? o.roster.map(p => p.id === logEntry.player.id ? { ...p, purchasePrice: newPrice } : p)
              : [...o.roster, { ...logEntry.player, purchasePrice: newPrice }];

            const updatedRoleCounts = isSameTeam
              ? o.roleCounts
              : { ...o.roleCounts, [logEntry.player.role]: o.roleCounts[logEntry.player.role] + 1 };

            return {
              ...o,
              budget: updatedBudget,
              roster: updatedRoster,
              roleCounts: updatedRoleCounts
            };
          }
          return o;
        });
      }

      return step1;
    });

    // Eseguiamo gli aggiornamenti di stato per la nostra squadra
    setRoster(prev => {
      let step1 = { ...prev };
      // 1. Rimuoviamo se era nostra
      if (logEntry.teamId === 'mia_squadra') {
        step1[logEntry.slotKey] = null;
      }
      // 2. Aggiungiamo nello slot calcolato se va a noi
      if (newTeamId === 'mia_squadra') {
        step1[finalSlotKey] = {
          ...logEntry.player,
          purchasePrice: newPrice
        };
      }
      return step1;
    });

    // Aggiorniamo il registro di asta
    setAuctionLog(prev =>
      prev.map(log => {
        if (log.id === logId) {
          return {
            ...log,
            teamId: newTeamId,
            teamName: finalTeamName,
            purchasePrice: newPrice,
            slotKey: finalSlotKey
          };
        }
        return log;
      })
    );
  };

  const removePlayerFromMarket = (playerId) => {
    if (!confirm('Vuoi rimuovere questo giocatore dalla tabella dei giocatori?')) return;
    pushHistory();
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  const sellPlayer = (slotKey) => {
    const player = roster[slotKey];
    if (!player) return;
    pushHistory();
    setRoster(prev => ({
      ...prev,
      [slotKey]: null
    }));
    setAuctionLog(prev => prev.filter(log => !(log.teamId === 'mia_squadra' && log.slotKey === slotKey)));
  };

  const clearRoster = () => {
    if (confirm('Vuoi svuotare interamente la tua fanta-squadra?')) {
      pushHistory();
      setRoster(getDefaultRoster());
      setSelectedSlot(null);
    }
  };



  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleBudgetChangeSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(tempBudgetInput);
    if (!isNaN(val) && val >= MIN_BUDGET && val <= MAX_BUDGET) {
      setStartingBudget(val);
      setEditingBudget(false);
    } else {
      alert('Inserisci un valore di budget valido tra 40 e 1000 crediti!');
    }
  };

  const updatePurchasePriceInput = (value) => {
    setActivePurchase(prev => prev ? {
      ...prev,
      priceInput: value
    } : prev);
  };

  const exportBackupJSON = () => {
    const dataStr = JSON.stringify({
      startingBudget,
      roster,
      opponents,
      auctionLog,
      isDraftConfigured,
      playerTags
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `dunkest_backup_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportRostersCSV = () => {
    let csvContent = "\uFEFF"; // UTF-8 BOM so Excel opens it correctly
    csvContent += "Squadra;Giocatore;Ruolo;Squadra NBA;Prezzo d'acquisto\n";
    
    // 1. Mia Squadra
    Object.entries(roster).forEach(([slotKey, player]) => {
      if (player) {
        csvContent += `Mia Squadra;${player.fullname};${player.role};${player.team};${Math.round(player.purchasePrice)}\n`;
      }
    });
    
    // 2. Avversari
    opponents.forEach(opp => {
      opp.roster.forEach(player => {
        csvContent += `${opp.name};${player.fullname};${player.role};${player.team};${Math.round(player.purchasePrice)}\n`;
      });
    });
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `asta_dunkest_roster_${Date.now()}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importBackupJSON = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.roster && imported.startingBudget !== undefined) {
          pushHistory();
          setStartingBudget(imported.startingBudget);
          setRoster(imported.roster);
          setOpponents(imported.opponents || []);
          setAuctionLog(imported.auctionLog || []);
          setIsDraftConfigured(imported.isDraftConfigured || false);
          setPlayerTags(imported.playerTags || {});
          alert('Backup caricato con successo!');
        } else {
          alert('File di backup non valido.');
        }
      } catch (err) {
        alert('Errore nel caricamento del file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return {
    players,
    loading,
    error,
    theme,
    toggleTheme,
    startingBudget,
    editingBudget,
    tempBudgetInput,
    setTempBudgetInput,
    setEditingBudget,
    handleBudgetChangeSubmit,
    teamList,
    searchQuery,
    setSearchQuery,
    selectedTeam,
    setSelectedTeam,
    selectedRole,
    setSelectedRole,
    tagFilter,
    setTagFilter,
    playerTags,
    updatePlayerTag,
    sortField,
    sortDirection,
    roster,
    selectedSlot,
    activePurchase,
    budgetRemaining,
    rosterStats,
    rosterValidation,
    filteredPlayers,
    openPurchasePopup,
    closePurchasePopup,
    updatePurchasePriceInput,
    handleSlotClick,
    executePurchase,
    sellPlayer,
    clearRoster,
    handleSort,
    removePlayerFromMarket,

    canUndo,
    undoLastAction,
    stagione,
    setStagione: setAppStagione,
    COURT_SLOTS_MAIN,
    BENCH_SLOTS,
    TRIBUNA_SLOTS,
    // Live Draft & Opponents
    opponents,
    auctionLog,
    isDraftConfigured,
    setIsDraftConfigured,
    showSetupModal,
    setShowSetupModal,
    startAuction,
    stopAuction,
    revertPurchase,
    editPurchase,
    exportBackupJSON,
    exportRostersCSV,
    importBackupJSON
  };
}