import { describe, it, expect } from 'vitest';
import { calculateScaledDimensions, formatByteSize } from './logic';

describe('Image Compressor & Converter Logic', () => {
  it('scales dimensions while preserving aspect ratio', () => {
    const scaled = calculateScaledDimensions(3840, 2160, 1920, 1080);
    expect(scaled.width).toBe(1920);
    expect(scaled.height).toBe(1080);
    expect(scaled.scaled).toBe(true);

    const noScale = calculateScaledDimensions(800, 600, 1920, 1080);
    expect(noScale.width).toBe(800);
    expect(noScale.height).toBe(600);
    expect(noScale.scaled).toBe(false);
  });

  it('formats byte sizes cleanly', () => {
    expect(formatByteSize(450)).toBe('450 B');
    expect(formatByteSize(1024 * 120)).toBe('120.0 KB');
    expect(formatByteSize(1024 * 1024 * 2.25)).toBe('2.25 MB');
  });
});
