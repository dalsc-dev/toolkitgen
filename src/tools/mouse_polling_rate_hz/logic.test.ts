import { describe, it, expect } from 'vitest';
import { calculatePollingRate } from './logic';

describe('Mouse Polling Rate Calculation Logic', () => {
  it('correctly calculates 1000Hz polling rate with zero jitter', () => {
    // 1ms intervals -> 1000Hz
    const timestamps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const res = calculatePollingRate(timestamps);
    expect(res.hz).toBe(1000);
    expect(res.jitterMs).toBe(0);
    expect(res.sampleCount).toBe(10);
  });

  it('correctly calculates 500Hz polling rate', () => {
    // 2ms intervals -> 500Hz
    const timestamps = [0, 2, 4, 6, 8, 10];
    const res = calculatePollingRate(timestamps);
    expect(res.hz).toBe(500);
    expect(res.jitterMs).toBe(0);
  });

  it('measures jitter with noisy intervals', () => {
    const timestamps = [0, 1, 3, 4, 6, 7, 9, 10]; // intervals: 1, 2, 1, 2, 1, 2, 1
    const res = calculatePollingRate(timestamps);
    expect(res.hz).toBe(700); // 1000 / (10/7) = 700Hz
    expect(res.jitterMs).toBeGreaterThan(0.4);
  });
});
