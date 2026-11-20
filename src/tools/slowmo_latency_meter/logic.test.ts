import { describe, it, expect } from 'vitest';
import { calculateInputLag, formatMeasurementReport } from './logic';

describe('Slow-Motion Video Input Lag Meter Logic', () => {
  it('calculates latency accurately at 240 FPS slow-motion', () => {
    // At 240 FPS, each frame represents ~4.17ms
    // Press at frame 100, Reaction at frame 106 -> 6 frames elapsed
    // Latency = 6 / 240 * 1000 = 25.0 ms
    const res = calculateInputLag(100, 106, 240);

    expect(res.deltaFrames).toBe(6);
    expect(res.latencyMs).toBe(25.0);
    expect(res.frameIntervalMs).toBeCloseTo(4.17, 1);
    expect(res.jitterToleranceMs).toBeCloseTo(2.1, 1);
    expect(res.confidenceRating).toBe('High');
    expect(res.tier).toBe('Fast Gaming (< 35ms)');
  });

  it('calculates latency accurately at 120 FPS slow-motion', () => {
    // At 120 FPS, each frame represents ~8.33ms
    // Press at frame 10, Reaction at frame 12 -> 2 frames
    // Latency = 2 / 120 * 1000 = 16.7 ms
    const res = calculateInputLag(10, 12, 120);

    expect(res.deltaFrames).toBe(2);
    expect(res.latencyMs).toBe(16.7);
    expect(res.confidenceRating).toBe('Medium');
  });

  it('classifies esports tier and noticeable input lag tiers', () => {
    const esports = calculateInputLag(0, 2, 240); // 8.3ms
    expect(esports.tier).toBe('Esports Tier (< 15ms)');

    const laggy = calculateInputLag(0, 24, 240); // 100ms
    expect(laggy.tier).toBe('Noticeable Input Lag (> 65ms)');
  });

  it('formats clean optical input lag report', () => {
    const meas = calculateInputLag(100, 106, 240);
    const report = formatMeasurementReport({
      pressFrame: 100,
      reactionFrame: 106,
      cameraFps: 240,
      measurement: meas,
    });

    expect(report).toContain('ToolkitGen Optical Input Lag Report');
    expect(report).toContain('End-to-End Latency: 25 ms');
    expect(report).toContain('Fast Gaming (< 35ms)');
  });
});
