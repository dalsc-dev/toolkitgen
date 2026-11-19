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
}

export const CONSOLE_PROFILES: Record<string, ConsoleProfile> = {
  ps5_original: {
    id: 'ps5_original',
    name: 'PlayStation 5 (Original 825GB)',
    usableCapacityGb: 667,
  },
  ps5_slim: {
    id: 'ps5_slim',
    name: 'PlayStation 5 Slim / Pro (1TB)',
    usableCapacityGb: 848,
  },
  xbox_series_x: {
    id: 'xbox_series_x',
    name: 'Xbox Series X (1TB)',
    usableCapacityGb: 802,
  },
  xbox_series_s: {
    id: 'xbox_series_s',
    name: 'Xbox Series S (512GB)',
    usableCapacityGb: 364,
  },
  expansion_1tb: {
    id: 'expansion_1tb',
    name: 'M.2 NVMe SSD / Storage Card (1TB)',
    usableCapacityGb: 931,
  },
  expansion_2tb: {
    id: 'expansion_2tb',
    name: 'M.2 NVMe SSD / Storage Card (2TB)',
    usableCapacityGb: 1862,
  },
};

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
  const freeSpaceAfterNewGameGb = fitsComfortably ? Math.round((freeSpaceBeforeNewGameGb - newGameSafe) * 10) / 10 : 0;
  const totalProjectedUsage = installedGamesTotalGb + newGameSafe;
  const percentCapacityUsed = Math.min(100, Math.round((totalProjectedUsage / safeCapacity) * 1000) / 10);

  // Determine optimal games to remove if not fitting (greedy smallest combination exceeding shortfall)
  const suggestedRemovals: GameEntry[] = [];
  if (!fitsComfortably && shortfallGb > 0) {
    // Sort installed games by size descending
    const sorted = [...installedGames].sort((a, b) => b.sizeGb - a.sizeGb);
    let freedSpace = 0;
    for (const game of sorted) {
      if (freedSpace >= shortfallGb) break;
      suggestedRemovals.push(game);
      freedSpace += game.sizeGb;
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
