import { describe, it, expect } from 'vitest';
import { calculateLatencyStats, calculateFrameBudget, evaluateLatencyTier } from './logic';

describe('TV Game Mode and Input Lag Tester Logic', () => {
  it('computes frame budget in milliseconds for standard display refresh rates', () => {
    expect(calculateFrameBudget(60)).toBe(16.67);
    expect(calculateFrameBudget(120)).toBe(8.33);
    expect(calculateFrameBudget(144)).toBe(6.94);
    expect(calculateFrameBudget(240)).toBe(4.17);
  });

  it('calculates mean, min, max, and standard deviation accurately', () => {
    const samples = [200, 220, 210, 230, 190];
    const stats = calculateLatencyStats(samples);

    expect(stats.samplesCount).toBe(5);
    expect(stats.meanMs).toBe(210);
    expect(stats.minMs).toBe(190);
    expect(stats.maxMs).toBe(230);
    expect(stats.stdDevMs).toBeCloseTo(14.14, 1);
    expect(stats.ratingTier).toBe('optimal');
  });

  it('classifies latency tiers appropriately', () => {
    expect(evaluateLatencyTier(195).tier).toBe('competitive');
    expect(evaluateLatencyTier(245).tier).toBe('optimal');
    expect(evaluateLatencyTier(310).tier).toBe('moderate');
    expect(evaluateLatencyTier(450).tier).toBe('excessive_processing');
  });
});
