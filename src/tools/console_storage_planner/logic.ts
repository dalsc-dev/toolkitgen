/**
 * Console Storage Planner logic
 */

export interface GameEntry {
  id: string;
  title: string;
  sizeGb: number;
}

export interface ConsoleProfile {
  id: string;
  name: string;
  usableCapacityGb: number;
  totalAdvertisedGb: number;
}

export const CONSOLE_PROFILES: Record<string, ConsoleProfile> = {
  ps5_original: {
    id: 'ps5_original',
    name: 'PlayStation 5 (Original 825GB)',
    usableCapacityGb: 667,
    totalAdvertisedGb: 825,
  },
  ps5_slim: {
    id: 'ps5_slim',
    name: 'PlayStation 5 Slim (1TB)',
    usableCapacityGb: 848,
    totalAdvertisedGb: 1000,
  },
  ps5_pro: {
    id: 'ps5_pro',
    name: 'PlayStation 5 Pro (2TB)',
    usableCapacityGb: 1890,
    totalAdvertisedGb: 2000,
  },
  xbox_series_x: {
    id: 'xbox_series_x',
    name: 'Xbox Series X (1TB)',
    usableCapacityGb: 802,
    totalAdvertisedGb: 1000,
  },
  xbox_series_s: {
    id: 'xbox_series_s',
    name: 'Xbox Series S (512GB)',
    usableCapacityGb: 364,
    totalAdvertisedGb: 512,
  },
  xbox_series_s_1tb: {
    id: 'xbox_series_s_1tb',
    name: 'Xbox Series S (1TB Black/White)',
    usableCapacityGb: 802,
    totalAdvertisedGb: 1000,
  },
  expansion_1tb: {
    id: 'expansion_1tb',
    name: 'M.2 NVMe SSD / Storage Card (1TB)',
    usableCapacityGb: 931,
    totalAdvertisedGb: 1000,
  },
  expansion_2tb: {
    id: 'expansion_2tb',
    name: 'M.2 NVMe SSD / Storage Card (2TB)',
    usableCapacityGb: 1862,
    totalAdvertisedGb: 2000,
  },
  expansion_4tb: {
    id: 'expansion_4tb',
    name: 'M.2 NVMe SSD / Storage Card (4TB)',
    usableCapacityGb: 3724,
    totalAdvertisedGb: 4000,
  },
};

export const POPULAR_GAME_PRESETS: GameEntry[] = [
  { id: 'gta6', title: 'Grand Theft Auto VI (Estimated)', sizeGb: 175 },
  { id: 'cod_warzone', title: 'Call of Duty: Warzone / MW3', sizeGb: 200 },
  { id: 'spiderman2', title: "Marvel's Spider-Man 2", sizeGb: 98 },
  { id: 'bg3', title: "Baldur's Gate 3", sizeGb: 140 },
  { id: 'jedi_survivor', title: 'Star Wars Jedi: Survivor', sizeGb: 150 },
  { id: 'ff7_rebirth', title: 'Final Fantasy VII Rebirth', sizeGb: 145 },
  { id: 'cyberpunk', title: 'Cyberpunk 2077: Phantom Liberty', sizeGb: 70 },
  { id: 'nba2k25', title: 'NBA 2K25', sizeGb: 150 },
];

export interface StoragePlanAnalysis {
  usableCapacityGb: number;
  installedGamesTotalGb: number;
  freeSpaceBeforeNewGameGb: number;
  newGameSizeGb: number;
  freeSpaceAfterNewGameGb: number;
  fitsComfortably: boolean;
  shortfallGb: number;
  percentCapacityUsed: number;
  suggestedRemovals: GameEntry[];
}

export function analyzeStoragePlan(
  capacityGb: number,
  installedGames: GameEntry[],
  newGameSizeGb: number
): StoragePlanAnalysis {
  const safeCapacity = Math.max(1, capacityGb);
  const installedGamesTotalGb = installedGames.reduce((acc, g) => acc + Math.max(0, g.sizeGb), 0);
  const freeSpaceBeforeNewGameGb = Math.max(0, safeCapacity - installedGamesTotalGb);
  const newGameSafe = Math.max(0, newGameSizeGb);
  const fitsComfortably = freeSpaceBeforeNewGameGb >= newGameSafe;
  const shortfallGb = fitsComfortably ? 0 : Math.round((newGameSafe - freeSpaceBeforeNewGameGb) * 10) / 10;
  const freeSpaceAfterNewGameGb = fitsComfortably
    ? Math.round((freeSpaceBeforeNewGameGb - newGameSafe) * 10) / 10
    : 0;

  const totalUsedAfter = Math.min(safeCapacity, installedGamesTotalGb + (fitsComfortably ? newGameSafe : 0));
  const percentCapacityUsed = Math.min(100, Math.round((totalUsedAfter / safeCapacity) * 1000) / 10);

  const suggestedRemovals: GameEntry[] = [];
  if (!fitsComfortably && shortfallGb > 0) {
    const sorted = [...installedGames].sort((a, b) => b.sizeGb - a.sizeGb);
    let freedSpace = 0;
    for (const g of sorted) {
      if (freedSpace >= shortfallGb) break;
      suggestedRemovals.push(g);
      freedSpace += g.sizeGb;
    }
  }

  return {
    usableCapacityGb: safeCapacity,
    installedGamesTotalGb: Math.round(installedGamesTotalGb * 10) / 10,
    freeSpaceBeforeNewGameGb: Math.round(freeSpaceBeforeNewGameGb * 10) / 10,
    newGameSizeGb: newGameSafe,
    freeSpaceAfterNewGameGb,
    fitsComfortably,
    shortfallGb,
    percentCapacityUsed,
    suggestedRemovals,
  };
}

export interface DownloadCalculation {
  fileSizeGb: number;
  speedMbps: number;
  protocolOverheadPct: number;
  effectiveSpeedMbps: number;
  downloadTimeSeconds: number;
  formattedTime: string;
}

export function calculateDownloadTime(
  fileSizeGb: number,
  speedMbps: number,
  overheadPct: number = 7.5
): DownloadCalculation {
  const safeGb = Math.max(0.1, fileSizeGb);
  const safeMbps = Math.max(0.5, speedMbps);
  const totalMbits = safeGb * 1024 * 8 * (1 + overheadPct / 100);
  const downloadSeconds = Math.round(totalMbits / safeMbps);

  const hours = Math.floor(downloadSeconds / 3600);
  const minutes = Math.floor((downloadSeconds % 3600) / 60);
  const seconds = downloadSeconds % 60;

  let formattedTime = '';
  if (hours > 0) {
    formattedTime = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    formattedTime = `${minutes}m ${seconds}s`;
  } else {
    formattedTime = `${seconds}s`;
  }

  return {
    fileSizeGb: safeGb,
    speedMbps: safeMbps,
    protocolOverheadPct: overheadPct,
    effectiveSpeedMbps: Math.round((safeMbps / (1 + overheadPct / 100)) * 10) / 10,
    downloadTimeSeconds: downloadSeconds,
    formattedTime,
  };
}
