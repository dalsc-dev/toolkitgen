import { describe, it, expect } from 'vitest';
import { analyzeStoragePlan, CONSOLE_PROFILES, type GameEntry } from './logic';

describe('Console Storage Planner Logic', () => {
  const sampleGames: GameEntry[] = [
    { id: '1', title: 'Open World RPG', sizeGb: 120 },
    { id: '2', title: 'Tactical Shooter', sizeGb: 95 },
    { id: '3', title: 'Racing Sim', sizeGb: 80 },
    { id: '4', title: 'Sports Title', sizeGb: 65 },
  ];

  it('calculates available space when a new game fits', () => {
    // PS5 original usable capacity: 667 GB
    // Installed: 120 + 95 + 80 + 65 = 360 GB
    // Free: 667 - 360 = 307 GB
    // New game: 110 GB -> fits, leaving 197 GB
    const capacity = CONSOLE_PROFILES.ps5_original.usableCapacityGb;
    const result = analyzeStoragePlan(capacity, sampleGames, 110);

    expect(result.installedGamesTotalGb).toBe(360);
    expect(result.freeSpaceBeforeNewGameGb).toBe(307);
    expect(result.fitsComfortably).toBe(true);
    expect(result.freeSpaceAfterNewGameGb).toBe(197);
    expect(result.shortfallGb).toBe(0);
    expect(result.suggestedRemovals).toHaveLength(0);
  });

  it('detects storage shortfall and suggests games to remove', () => {
    // Xbox Series S usable capacity: 364 GB
    // Installed: 360 GB
    // Free: 4 GB
    // New game: 85 GB -> shortfall of 81 GB
    const capacity = CONSOLE_PROFILES.xbox_series_s.usableCapacityGb;
    const result = analyzeStoragePlan(capacity, sampleGames, 85);

    expect(result.fitsComfortably).toBe(false);
    expect(result.shortfallGb).toBe(81);
    expect(result.freeSpaceAfterNewGameGb).toBe(0);
    // Suggested removal should pick the largest game first (Open World RPG, 120 GB), which covers the 81 GB shortfall
    expect(result.suggestedRemovals.length).toBeGreaterThan(0);
    expect(result.suggestedRemovals[0].title).toBe('Open World RPG');
  });
});
