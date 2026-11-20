import { describe, it, expect } from 'vitest';
import {
  evaluatePressureRecord,
  calculatePressureAverage,
  isComputePressureSupported,
} from './logic';

describe('Compute Pressure CPU Monitor Logic', () => {
  it('correctly maps all four W3C pressure states', () => {
    expect(evaluatePressureRecord('nominal').score).toBe(100);
    expect(evaluatePressureRecord('fair').score).toBe(75);
    expect(evaluatePressureRecord('serious').score).toBe(40);
    expect(evaluatePressureRecord('critical').score).toBe(10);
  });

  it('handles unknown or malformed pressure states gracefully', () => {
    const fallback = evaluatePressureRecord('unknown_state');
    expect(fallback.state).toBe('nominal');
    expect(fallback.score).toBe(100);
  });

  it('computes rolling average score and dominant state', () => {
    const states = ['nominal', 'fair', 'fair', 'serious'] as const;
    const result = calculatePressureAverage([...states]);

    // (100 + 75 + 75 + 40) / 4 = 290 / 4 = 72.5 -> 73
    expect(result.averageScore).toBe(73);
    expect(result.dominantState).toBe('fair');
  });

  it('detects browser support safely without throwing in node environment', () => {
    // In node/vitest, window is undefined or PressureObserver is not mocked
    const supported = isComputePressureSupported();
    expect(typeof supported).toBe('boolean');
  });
});
