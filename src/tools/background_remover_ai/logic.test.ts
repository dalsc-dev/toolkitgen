import { describe, it, expect } from 'vitest';
import { colorDistanceRgb, isBackgroundPixel, calculateAlphaBoundingBox } from './logic';

describe('Background Remover Logic', () => {
  it('computes Euclidean RGB distance correctly', () => {
    expect(colorDistanceRgb(255, 255, 255, 255, 255, 255)).toBe(0);
    expect(colorDistanceRgb(0, 0, 0, 3, 4, 0)).toBe(5);
  });

  it('identifies background pixels within tolerance', () => {
    expect(isBackgroundPixel(250, 250, 250, 255, 255, 255, 15)).toBe(true);
    expect(isBackgroundPixel(200, 50, 50, 255, 255, 255, 20)).toBe(false);
  });

  it('determines alpha bounding box boundaries', () => {
    const width = 10;
    const height = 10;
    const data = new Uint8ClampedArray(width * height * 4);
    // Mark pixel at x=3, y=4
    data[(4 * 10 + 3) * 4 + 3] = 255;
    // Mark pixel at x=7, y=8
    data[(8 * 10 + 7) * 4 + 3] = 255;

    const box = calculateAlphaBoundingBox(data, width, height);
    expect(box.hasContent).toBe(true);
    expect(box.minX).toBe(3);
    expect(box.maxX).toBe(7);
    expect(box.minY).toBe(4);
    expect(box.maxY).toBe(8);
  });
});
