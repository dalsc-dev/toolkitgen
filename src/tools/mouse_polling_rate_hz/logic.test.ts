import { describe, it, expect } from 'vitest';
import { calculatePollingRate, generatePollingReport } from './logic';

describe('Mouse Polling Rate Calculation Logic', () => {
  it('correctly calculates 1000Hz polling rate with zero jitter', () => {
    // 1ms intervals -> 1000Hz
    const timestamps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const res = calculatePollingRate(timestamps, 1000);
    expect(res.hz).toBe(1000);
    expect(res.jitterMs).toBe(0);
    expect(res.sampleCount).toBe(10);
    expect(res.verdict).toBe('PASS');
    expect(res.stabilityScore).toBe(100);
  });

  it('correctly calculates 500Hz polling rate', () => {
    // 2ms intervals -> 500Hz
    const timestamps = [0, 2, 4, 6, 8, 10];
    const res = calculatePollingRate(timestamps, 500);
    expect(res.hz).toBe(500);
    expect(res.jitterMs).toBe(0);
    expect(res.verdict).toBe('PASS');
  });

  it('measures jitter with noisy intervals and classifies stability', () => {
    const timestamps = [0, 1, 3, 4, 6, 7, 9, 10]; // intervals: 1, 2, 1, 2, 1, 2, 1
    const res = calculatePollingRate(timestamps, 1000);
    expect(res.hz).toBe(700); // 1000 / (10/7) = 700Hz
    expect(res.jitterMs).toBeGreaterThan(0.4);
    expect(res.verdict).toBeDefined();
  });

  it('generates a formatted benchmark report with attribution', () => {
    const report = generatePollingReport({
      currentHz: 1000,
      peakHz: 1005,
      avgHz: 998,
      minDeltaMs: 0.98,
      jitterMs: 0.04,
      sampleCount: 500,
      targetHz: 1000,
      connectionType: 'wired',
    });
    expect(report).toContain('ToolkitGen Mouse Polling Rate Benchmark');
    expect(report).toContain('Target Rate: 1000 Hz');
    expect(report).toContain('Connection: WIRED');
    expect(report).toContain('https://toolkitgen.com/tool/mouse_polling_rate_hz');
  });
});
