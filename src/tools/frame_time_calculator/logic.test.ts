import { describe, it, expect } from 'vitest';
import { fpsToFrameTimeMs, frameTimeToFps, parseFrameTimesInput, calculateFrameTimeStats } from './logic';

describe('Frame Time Calculator Logic', () => {
  it('converts FPS to frame time in milliseconds and vice versa', () => {
    expect(fpsToFrameTimeMs(60)).toBe(16.67);
    expect(fpsToFrameTimeMs(120)).toBe(8.33);
    expect(fpsToFrameTimeMs(30)).toBe(33.33);

    expect(frameTimeToFps(16.67)).toBe(59.99);
    expect(frameTimeToFps(8.33)).toBe(120.05);
  });

  it('parses raw frame times from text input', () => {
    const raw = '16.6, 16.7 16.5\n33.2; 16.8';
    const parsed = parseFrameTimesInput(raw, 'frame_time_ms');
    expect(parsed).toHaveLength(5);
    expect(parsed[0]).toBe(16.6);
    expect(parsed[3]).toBe(33.2);
  });

  it('computes mean, 1% low, 0.1% low, and stutter counts accurately', () => {
    // Generate 100 sample frames: 98 at 16.67ms (60 fps), 1 at 33.33ms (30 fps), 1 at 50ms (20 fps)
    const samples: number[] = [];
    for (let i = 0; i < 98; i++) samples.push(16.67);
    samples.push(33.33);
    samples.push(50.0);

    const stats = calculateFrameTimeStats(samples);
    expect(stats.totalFrames).toBe(100);
    expect(stats.meanFps).toBe(58.2);
    // 99th percentile frame time should be the slow 33.33ms or 50ms spike
    expect(stats.percentile99FrameTimeMs).toBe(50.0);
    expect(stats.onePercentLowFps).toBe(20.0);
    expect(stats.stutterCount).toBe(2);
  });
});
