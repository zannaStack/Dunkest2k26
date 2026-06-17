export function calculateRosterStats(roster) {
  const players = Object.values(roster).filter(Boolean);
  if (players.length === 0) {
    return { pdk: '0.0', pts: '0.0', reb: '0.0', ast: '0.0' };
  }

  const total = players.reduce((acc, player) => ({
    pdk: acc.pdk + player.pdk,
    pts: acc.pts + player.pts,
    reb: acc.reb + player.reb,
    ast: acc.ast + player.ast,
  }), { pdk: 0, pts: 0, reb: 0, ast: 0 });

  return {
    pdk: total.pdk.toFixed(1),
    pts: (total.pts / players.length).toFixed(1),
    reb: (total.reb / players.length).toFixed(1),
    ast: (total.ast / players.length).toFixed(1),
  };
}

export function calculateRosterValidation(roster, budgetRemaining) {
  const playerCount = Object.values(roster).filter(Boolean).length;
  const ids = Object.values(roster).filter(Boolean).map(p => p.id);
  const hasDuplicates = new Set(ids).size !== ids.length;

  return {
    count: playerCount,
    isFull: playerCount === 13,
    isBudgetOk: budgetRemaining >= 0,
    hasDuplicates,
    isValid: playerCount === 13 && budgetRemaining >= 0 && !hasDuplicates
  };
}

export function getEmptySlots(roster) {
  return Object.keys(roster).filter(slot => roster[slot] === null);
}

export function getSlotOrderForRole(role, slotPathsByRole) {
  return slotPathsByRole[role] || slotPathsByRole.C;
}
