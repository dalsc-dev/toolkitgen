import { describe, it, expect } from 'vitest';
import { calculateCompressionSettings, calculateSavings } from './logic';

describe('PDF Compressor Logic', () => {
  it('assigns correct compression profiles', () => {
    expect(calculateCompressionSettings('high_compression').dpi).toBe(72);
    expect(calculateCompressionSettings('balanced').quality).toBe(0.75);
    expect(calculateCompressionSettings('high_quality').scale).toBe(1.0);
  });

  it('calculates byte savings and compression percentages accurately', () => {
    const res = calculateSavings(1000, 400);
    expect(res.savedBytes).toBe(600);
    expect(res.percent).toBe(60);

    const noSavings = calculateSavings(500, 600);
    expect(noSavings.savedBytes).toBe(0);
    expect(noSavings.percent).toBe(0);
  });
});
