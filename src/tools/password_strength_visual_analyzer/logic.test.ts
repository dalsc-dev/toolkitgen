import { describe, it, expect } from 'vitest';
import { calculatePasswordEntropy } from './logic';

describe('Password Entropy & Strength Analyzer', () => {
  it('returns zero entropy for empty string', () => {
    const res = calculatePasswordEntropy('');
    expect(res.entropyBits).toBe(0);
    expect(res.poolSize).toBe(0);
    expect(res.rating).toBe('Very Weak');
  });

  it('calculates entropy for simple 8-digit numeric PIN', () => {
    // 8 chars, pool = 10 (digits). H = 8 * log2(10) ~ 26.57 -> 26.6
    const res = calculatePasswordEntropy('12345678');
    expect(res.poolSize).toBe(10);
    expect(res.hasNumber).toBe(true);
    expect(res.hasLower).toBe(false);
    expect(res.entropyBits).toBeCloseTo(26.6, 1);
    expect(res.rating).toBe('Very Weak');
  });

  it('calculates entropy for 16-character complex passphrase', () => {
    // 16 chars, pool = 26 + 26 + 10 + 33 = 95. H = 16 * log2(95) ~ 105 bits
    const res = calculatePasswordEntropy('K9#mQ!9vL@2w$8xZ');
    expect(res.poolSize).toBe(95);
    expect(res.hasLower).toBe(true);
    expect(res.hasUpper).toBe(true);
    expect(res.hasNumber).toBe(true);
    expect(res.hasSpecial).toBe(true);
    expect(res.entropyBits).toBeGreaterThan(100);
    expect(res.rating).toBe('Very Strong');
  });

  it('correctly classifies a moderate 9-character alphanumeric password', () => {
    // 9 chars, pool = 26 + 10 = 36. H = 9 * log2(36) ~ 46.5 bits
    const res = calculatePasswordEntropy('apple2026');
    expect(res.poolSize).toBe(36);
    expect(res.entropyBits).toBeCloseTo(46.5, 1);
    expect(res.rating).toBe('Moderate');
  });
});
