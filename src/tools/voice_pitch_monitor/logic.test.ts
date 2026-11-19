import { describe, it, expect } from 'vitest';
import { frequencyToNote } from './logic';

describe('Voice Pitch Frequency-to-Musical Note Conversion', () => {
  it('correctly identifies concert A4 at 440 Hz', () => {
    const res = frequencyToNote(440);
    expect(res).not.toBeNull();
    expect(res?.note).toBe('A');
    expect(res?.octave).toBe(4);
    expect(res?.centsOff).toBe(0);
  });

  it('correctly identifies middle C (C4) at ~261.63 Hz', () => {
    const res = frequencyToNote(261.63);
    expect(res).not.toBeNull();
    expect(res?.note).toBe('C');
    expect(res?.octave).toBe(4);
    expect(Math.abs(res?.centsOff || 0)).toBeLessThanOrEqual(1);
  });

  it('returns null for inaudible out-of-range frequencies', () => {
    expect(frequencyToNote(10)).toBeNull();
    expect(frequencyToNote(25000)).toBeNull();
  });
});
