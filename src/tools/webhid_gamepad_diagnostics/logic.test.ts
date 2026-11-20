import { describe, it, expect } from 'vitest';
import {
  calculateCircularityError,
  calculateCenterJitter,
  evaluateTriggerResolution,
  generateScorecard,
} from './logic';

describe('WebHID & Gamepad Diagnostic Suite Logic', () => {
  it('calculates circularity error for near-perfect unit circle points', () => {
    // Generate unit circle points at r=1.0 with small noise
    const circlePoints = [];
    for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
      circlePoints.push({
        x: Math.cos(angle) * 1.02,
        y: Math.sin(angle) * 1.02,
      });
    }

    const res = calculateCircularityError(circlePoints);
    expect(res.averageCircularityErrorPct).toBeLessThan(5.0);
    expect(res.isSquareGated).toBe(false);
    expect(res.verdict).toBe('Excellent');
  });

  it('detects square-gated diagonal coordinate overshoot', () => {
    // Square points where diagonal reaches (1.0, 1.0) -> r = 1.414
    const squarePoints = [
      { x: 1.0, y: 1.0 },
      { x: 1.0, y: 0.9 },
      { x: -1.0, y: 1.0 },
      { x: -1.0, y: -1.0 },
      { x: 1.0, y: -1.0 },
      { x: 0.0, y: 1.0 },
      { x: 1.0, y: 0.0 },
    ];

    const res = calculateCircularityError(squarePoints);
    expect(res.isSquareGated).toBe(true);
    expect(res.averageCircularityErrorPct).toBeGreaterThan(15.0);
  });

  it('evaluates resting stick centering offset and deadzone recommendation', () => {
    // Controller with stick drift offset to (0.08, 0.04)
    const driftSamples = [
      { x: 0.08, y: 0.04 },
      { x: 0.082, y: 0.039 },
      { x: 0.079, y: 0.041 },
    ];

    const res = calculateCenterJitter(driftSamples);
    expect(res.totalOffsetMagnitude).toBeGreaterThan(0.08);
    expect(res.recommendedInnerDeadzonePct).toBeGreaterThan(8.0);
  });

  it('detects smooth analog trigger resolution vs stepped inputs', () => {
    // Generate 100 smooth analog samples from 0 to 1
    const smoothSamples = [];
    for (let i = 0; i < 100; i++) {
      smoothSamples.push(i / 100);
    }

    const resSmooth = evaluateTriggerResolution(smoothSamples);
    expect(resSmooth.isSmoothAnalog).toBe(true);
    expect(resSmooth.stepsDetected).toBeGreaterThanOrEqual(64);

    // Stepped trigger (e.g. digital on/off only)
    const stepped = [0, 0, 1, 1, 0, 1];
    const resStepped = evaluateTriggerResolution(stepped);
    expect(resStepped.isSmoothAnalog).toBe(false);
  });

  it('formats clean text scorecard for warranty RMA export', () => {
    const card = generateScorecard({
      controllerName: 'DualSense Wireless Controller',
      pollingHz: 500,
      circularityErrorPct: 8.5,
      centerOffsetPct: 2.1,
      jitterVariance: 0.0001,
      triggerResolution: 'High-Precision Analog (128+ Steps)',
    });

    expect(card).toContain('ToolkitGen Gamepad Diagnostic Scorecard');
    expect(card).toContain('DualSense Wireless Controller');
    expect(card).toContain('Passed Standard Precision Verification');
  });
});
