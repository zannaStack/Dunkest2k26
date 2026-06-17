export const AVAILABLE_SEASONS = [
  { value: '26/27', label: 'Stagione 2026/27', file: '/data/Giocatori2627.txt' },
  { value: '25/26', label: 'Stagione 2025/26', file: '/data/Giocatori2526.txt' },
  { value: '24/25', label: 'Stagione 2024/25', file: '/data/Giocatori2425.txt' },
  { value: '23/24', label: 'Stagione 2023/24', file: '/data/Giocatori2324.txt' }
];

export const MIN_PLAYER_COST = 4.0;
export const DEFAULT_BUDGET = 500;
export const MIN_BUDGET = 40;
export const MAX_BUDGET = 1000;

export const ROLE_FILTERS = ['Tutti', 'G', 'F', 'C'];
export const ROLE_LABELS = {
  G: 'Guardie (G)',
  F: 'Ali (F)',
  C: 'Centri (C)'
};

// TITOLARI: 2 Guardie, 2 Ali, 1 Centro
export const COURT_SLOTS_MAIN = [
  { slotKey: 'G1', roleLabel: 'Guardia 1 (G)' },
  { slotKey: 'G2', roleLabel: 'Guardia 2 (G)' },
  { slotKey: 'F1', roleLabel: 'Ala 1 (F)' },
  { slotKey: 'F2', roleLabel: 'Ala 2 (F)' },
  { slotKey: 'C', roleLabel: 'Centro (C)' },
];

// PANCHINA: 2 Guardie, 2 Ali, 1 Centro
export const BENCH_SLOTS = [
  { slotKey: 'BG1', roleLabel: 'Panchina G1' },
  { slotKey: 'BG2', roleLabel: 'Panchina G2' },
  { slotKey: 'BF1', roleLabel: 'Panchina F1' },
  { slotKey: 'BF2', roleLabel: 'Panchina F2' },
  { slotKey: 'BC', roleLabel: 'Panchina C' },
];

// TRIBUNA: 1 Guardia, 1 Ala, 1 Centro
export const TRIBUNA_SLOTS = [
  { slotKey: 'TG', roleLabel: 'Tribuna G' },
  { slotKey: 'TF', roleLabel: 'Tribuna F' },
  { slotKey: 'TC', roleLabel: 'Tribuna C' },
];

export const SLOT_PRIORITY = {
  G1: 1, G2: 1, F1: 1, F2: 1, C: 1,
  BG1: 2, BG2: 2, BF1: 2, BF2: 2, BC: 2,
  TG: 3, TF: 3, TC: 3
};

// Definiamo esattamente dove può andare ogni ruolo (Prima Titolari, poi Panchina, poi Tribuna)
export const SLOT_PATHS_BY_ROLE = {
  G: ['G1', 'G2', 'BG1', 'BG2', 'TG'],
  F: ['F1', 'F2', 'BF1', 'BF2', 'TF'],
  C: ['C', 'BC', 'TC']
};

export function getDefaultRoster() {
  return {
    G1: null, G2: null, F1: null, F2: null, C: null,
    BG1: null, BG2: null, BF1: null, BF2: null, BC: null,
    TG: null, TF: null, TC: null
  };
}