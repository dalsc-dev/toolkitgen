import { describe, it, expect } from 'vitest';
import { calculateAspectRatioGcd, classifyDpr, classifyColorGamut } from './logic';

describe('Screen & GPU Capability Logic', () => {
  it('identifies display aspect ratios accurately', () => {
    expect(calculateAspectRatioGcd(1920, 1080)).toBe('16:9 (Widescreen)');
    expect(calculateAspectRatioGcd(2560, 1600)).toBe('16:10 (Productivity)');
    expect(calculateAspectRatioGcd(3440, 1440)).toBe('21:9 (Ultrawide)');
  });

  it('classifies device pixel ratio categories', () => {
    expect(classifyDpr(1.0)).toBe('Standard Density (1x)');
    expect(classifyDpr(2.0)).toBe('Retina / HiDPI (2x)');
  });

  it('determines supported display color gamuts', () => {
    expect(classifyColorGamut(true, false)).toBe('DCI-P3 (Wide Color Gamut)');
    expect(classifyColorGamut(false, false)).toBe('sRGB (Standard Dynamic Gamut)');
  });
});
