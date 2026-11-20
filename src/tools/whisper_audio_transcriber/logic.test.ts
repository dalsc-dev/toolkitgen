import { describe, it, expect } from 'vitest';
import { formatSrtTimestamp, formatVttTimestamp, calculateSpeakingRate } from './logic';

describe('Whisper Audio Transcriber Logic', () => {
  it('formats SRT and VTT timestamps with millisecond accuracy', () => {
    expect(formatSrtTimestamp(65.123)).toBe('00:01:05,123');
    expect(formatVttTimestamp(65.123)).toBe('00:01:05.123');
  });

  it('calculates speaking rate words per minute accurately', () => {
    const normal = calculateSpeakingRate(140, 60);
    expect(normal.wpm).toBe(140);
    expect(normal.rating).toBe('Conversational');

    const rapid = calculateSpeakingRate(200, 60);
    expect(rapid.wpm).toBe(200);
    expect(rapid.rating).toBe('Rapid');
  });
});
