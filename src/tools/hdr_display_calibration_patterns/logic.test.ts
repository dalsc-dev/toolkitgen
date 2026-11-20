import { describe, it, expect } from 'vitest';
import {
  generateGradientSteps,
  calculateOledNearBlack,
  evaluateHdrClipping,
} from './logic';

describe('HDR Display Calibration Patterns Logic', () => {
  it('generates consistent 8-bit and 10-bit gradient steps', () => {
    const steps = generateGradientSteps(64);
    expect(steps.length).toBe(65);
    expect(steps[0].rgb8Bit).toBe(0);
    expect(steps[0].rgb10Bit).toBe(0);
    expect(steps[64].rgb8Bit).toBe(255);
    expect(steps[64].rgb10Bit).toBe(1023);
  });

  it('calculates OLED near-black luminance accurately', () => {
    // 0% is true absolute black (0 nits) on OLED
    const pureBlack = calculateOledNearBlack(0, 800);
    expect(pureBlack.isTrueBlack).toBe(true);
    expect(pureBlack.luminanceNitsApprox).toBe(0);

    // 5% near-black test pattern
    const nearBlack5 = calculateOledNearBlack(5, 800);
    expect(nearBlack5.isTrueBlack).toBe(false);
    expect(nearBlack5.luminanceNitsApprox).toBeGreaterThan(0.5);
    expect(nearBlack5.rgbValue).toBe(13); // round(0.05 * 255) = 13
  });

  it('evaluates HDR clipping against target display peak luminance', () => {
    // On an 800 nit OLED, a 1000 nit patch is clipped
    const clip1000 = evaluateHdrClipping(1000, 800);
    expect(clip1000.isClipped).toBe(true);

    // A 600 nit specular highlight is within range
    const clip600 = evaluateHdrClipping(600, 800);
    expect(clip600.isClipped).toBe(false);
  });
});
