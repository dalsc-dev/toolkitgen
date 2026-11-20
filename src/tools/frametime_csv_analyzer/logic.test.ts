import { describe, it, expect } from 'vitest';
import { parseFrameTimeCsv, calculateBenchmarkSummary } from './logic';

describe('Frame-Time CSV Benchmark Analyzer Logic', () => {
  it('parses PresentMon style CSV columns', () => {
    const csv = `Application,msBetweenPresents,DateTime
game.exe,16.66,12:00:00
game.exe,16.70,12:00:01
game.exe,33.33,12:00:02`;
    const times = parseFrameTimeCsv(csv);
    expect(times).toHaveLength(3);
    expect(times[0]).toBeCloseTo(16.66);
  });

  it('calculates average FPS, 1% lows, and stutter counts accurately', () => {
    // 100 frames at 16.66ms (~60 FPS) + 1 stutter at 50ms
    const times = Array(99).fill(16.66);
    times.push(50.0);

    const summary = calculateBenchmarkSummary(times);
    expect(summary.avgFps).toBeGreaterThanOrEqual(58);
    expect(summary.stutterCount).toBe(1);
    expect(summary.p1LowFps).toBeLessThan(summary.avgFps);
  });
});
