import { describe, it, expect } from 'vitest';
import { generateTestTrials, evaluateCSFPerformance, computeGaborPixel } from './logic';

describe('Contrast Sensitivity Function Logic', () => {
  it('generates 8 balanced trials across 4 standard spatial frequency phases', () => {
    const trials = generateTestTrials();
    expect(trials).toHaveLength(8);
    expect(trials[0].phase).toBe(1);
    expect(trials[7].phase).toBe(4);
  });

  it('computes Gabor pixel luminance centered at mid-gray (128)', () => {
    // Center point (150, 150) with peak carrier cosine
    const pixelCenter = computeGaborPixel(150, 150, 150, 150, 40, 0.05, 'horizontal', 0.20);
    // Envelope at center is 1, cosine(0) is 1 -> 128 * 1.2 = 153.6 -> 154
    expect(pixelCenter).toBe(154);

    // Far from center (beyond 3 sigma) -> envelope approaches 0 -> pixel approaches 128
    const pixelEdge = computeGaborPixel(0, 0, 150, 150, 40, 0.05, 'horizontal', 0.20);
    expect(pixelEdge).toBe(128);
  });

  it('evaluates user responses and calculates sensitivity and accuracy metrics', () => {
    const trials = generateTestTrials();
    // Simulate all correct responses
    const responses = trials.map((t) => t.orientation);
    const result = evaluateCSFPerformance(trials, responses);

    expect(result.totalTrials).toBe(8);
    expect(result.correctTrials).toBe(8);
    expect(result.accuracyPercent).toBe(100);
    expect(result.peakSensitivity).toBeGreaterThan(10);
    expect(result.curveData).toHaveLength(4);
    expect(result.curveData[0].sensitivity).toBeGreaterThan(0);
    expect(result.clinicalRating).toContain('High Contrast Sensitivity');
  });

  it('handles partial or reduced sensitivity correctly', () => {
    const trials = generateTestTrials();
    // Simulate only 2 correct out of 8
    const responses = trials.map((t, idx) => (idx < 2 ? t.orientation : (t.orientation === 'horizontal' ? 'vertical' : 'horizontal')));
    const result = evaluateCSFPerformance(trials, responses);

    expect(result.correctTrials).toBe(2);
    expect(result.accuracyPercent).toBe(25);
    expect(result.clinicalRating).toContain('Reduced Contrast Sensitivity');
  });
});
