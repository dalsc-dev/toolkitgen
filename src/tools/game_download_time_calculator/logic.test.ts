import { describe, it, expect } from 'vitest';
import { calculateDownloadTime, formatDuration } from './logic';

describe('Game Download Time Calculator Logic', () => {
  it('formats duration into human readable units', () => {
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(125)).toBe('2m 5s');
    expect(formatDuration(3665)).toBe('1h 1m 5s');
    expect(formatDuration(90061)).toBe('1d 1h 1m 1s');
  });

  it('calculates theoretical and real-world download time accurately', () => {
    // 50 GB at 100 Mbps
    // 50 * 8192 = 409,600 Mbits
    // Ideal: 409,600 / 100 = 4096 seconds (~1h 8m 16s)
    // Real-world (10% overhead = 90 Mbps): 409,600 / 90 = 4551 seconds (~1h 15m 51s)
    const result = calculateDownloadTime({
      fileSizeGb: 50,
      speedMbps: 100,
      overheadPercent: 10,
    });

    expect(result.idealSeconds).toBe(4096);
    expect(result.realWorldSeconds).toBe(4551);
    expect(result.transferRateMBps).toBe(11.25); // 90 / 8
    expect(result.idealFormatted).toBe('1h 8m 16s');
    expect(result.realWorldFormatted).toBe('1h 15m 51s');
  });

  it('computes monthly data cap impact correctly', () => {
    const result = calculateDownloadTime({
      fileSizeGb: 100,
      speedMbps: 300,
      overheadPercent: 10,
      dataCapGb: 1000,
    });

    expect(result.capPercentUsed).toBe(10);
    expect(result.capRemainingGb).toBe(900);
  });

  it('handles zero or invalid input gracefully', () => {
    const result = calculateDownloadTime({
      fileSizeGb: 0,
      speedMbps: 100,
    });

    expect(result.idealSeconds).toBe(0);
    expect(result.idealFormatted).toBe('0s');
  });
});
