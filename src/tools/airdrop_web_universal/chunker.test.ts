import { describe, it, expect } from 'vitest';
import {
  calculateTotalChunks,
  calculateProgress,
  calculateTransferStats,
  generateRoomPin,
  DEFAULT_CHUNK_SIZE,
} from './chunker';

describe('WebRTC File Chunker Logic', () => {
  it('calculates correct chunk counts for various file sizes', () => {
    expect(calculateTotalChunks(0)).toBe(0);
    expect(calculateTotalChunks(DEFAULT_CHUNK_SIZE)).toBe(1);
    expect(calculateTotalChunks(DEFAULT_CHUNK_SIZE + 1)).toBe(2);
    expect(calculateTotalChunks(10 * 1024 * 1024)).toBe(160); // 10 MB / 64 KB
  });

  it('calculates progress percentage accurately', () => {
    expect(calculateProgress(0, 1000)).toBe(0);
    expect(calculateProgress(500, 1000)).toBe(50);
    expect(calculateProgress(1000, 1000)).toBe(100);
    expect(calculateProgress(1500, 1000)).toBe(100);
  });

  it('computes transfer speed and ETA correctly', () => {
    // 5MB transferred in 2 seconds of 10MB total
    const stats = calculateTransferStats(5 * 1024 * 1024, 10 * 1024 * 1024, 2);
    expect(stats.progressPercent).toBe(50);
    expect(stats.speedMbps).toBe(2.5);
    expect(stats.etaSeconds).toBe(2);
  });

  it('generates a 4-digit room pin', () => {
    const pin = generateRoomPin();
    expect(pin).toMatch(/^\d{4}$/);
  });
});
