import { describe, it, expect } from 'vitest';
import { blackScholes } from './logic';

describe('Black-Scholes Options Model Logic', () => {
  it('computes standard ATM call and put prices matching textbook values', () => {
    // S = $100, K = $100, T = 1.0 yr, r = 5% (0.05), sigma = 20% (0.20)
    // Benchmark values: Call = $10.45, Put = $5.57
    const result = blackScholes(100, 100, 1.0, 0.05, 0.2);
    expect(result.call).toBe(10.45);
    expect(result.put).toBe(5.57);
  });

  it('satisfies Put-Call Parity: C - P = S - K * e^(-r*T)', () => {
    const s = 100;
    const k = 100;
    const t = 1.0;
    const r = 0.05;
    const sigma = 0.2;

    const { call, put } = blackScholes(s, k, t, r, sigma);
    const leftSide = call - put;
    const rightSide = s - k * Math.exp(-r * t);

    // Difference within 2 cents due to rounding
    expect(Math.abs(leftSide - rightSide)).toBeLessThan(0.02);
  });
});
