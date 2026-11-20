import { describe, it, expect } from 'vitest';
import { calculateZfsCapacity, calculateSlogL2arcRecommendation } from './logic';

describe('ZFS RAID Storage Calculator Logic', () => {
  it('calculates RAIDZ2 capacity and 80% pool fill threshold', () => {
    // 6x 10TB drives in RAIDZ2
    const res = calculateZfsCapacity(6, 10, 'raidz2');
    expect(res.rawCapacityTb).toBe(60);
    expect(res.faultToleranceDrives).toBe(2);
    expect(res.usableCapacityTb).toBeLessThan(40); // 4 data disks minus 3% slop space
    expect(res.safePoolLimitTib).toBeCloseTo(res.usableCapacityTib * 0.8, 1);
  });

  it('calculates 2-way mirror capacity correctly', () => {
    const res = calculateZfsCapacity(4, 8, 'mirror');
    expect(res.rawCapacityTb).toBe(32);
    expect(res.faultToleranceDrives).toBe(1);
    expect(res.usableCapacityTb).toBeCloseTo(16 * 0.97, 1);
  });

  it('provides sensible SLOG and L2ARC sizing guidance', () => {
    const rec = calculateSlogL2arcRecommendation(20);
    expect(rec.slogGb).toBe(32);
    expect(rec.l2arcGb).toBeGreaterThan(500);
  });
});
