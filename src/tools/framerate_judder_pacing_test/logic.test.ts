import { describe, it, expect } from 'vitest';
import {
  evaluateFrameDeltas,
  calculateDisplayCadence,
  calculatePacingMetrics,
} from './logic';

describe('Frame Rate Judder & Pacing Test Logic', () => {
  describe('evaluateFrameDeltas', () => {
    it('detects 60Hz and 120Hz display refresh rates accurately', () => {
      // 60Hz: ~16.67ms per frame
      const deltas60 = [16.65, 16.68, 16.66, 16.71, 16.67];
      const res60 = evaluateFrameDeltas(deltas60);
      expect(res60.fps).toBe(60);
      expect(res60.standardClass).toBe('60Hz');
      expect(res60.stabilityScore).toBeGreaterThanOrEqual(90);

      // 120Hz: ~8.33ms per frame
      const deltas120 = [8.32, 8.35, 8.33, 8.34, 8.31];
      const res120 = evaluateFrameDeltas(deltas120);
      expect(res120.fps).toBe(120);
      expect(res120.standardClass).toBe('120Hz');
    });

    it('handles empty or aberrant inputs gracefully', () => {
      const fallback = evaluateFrameDeltas([]);
      expect(fallback.fps).toBe(60);
      expect(fallback.standardClass).toBe('60Hz');
    });
  });

  describe('calculateDisplayCadence', () => {
    it('verifies the mathematical perfection of 40 FPS in a 120Hz container', () => {
      const res = calculateDisplayCadence(40, 120, false);
      expect(res.ratio).toBe(3);
      expect(res.isIntegerDivider).toBe(true);
      expect(res.refreshesPerFrame).toBe(3);
      expect(res.frameHoldMs).toBe(25);
      expect(res.judderSeverity).toBe('None (Perfect Cadence)');
      expect(res.cadencePattern).toContain('3 display refreshes per game frame');
      expect(res.recommendation).toContain('Optimal 40 FPS balanced mode');
    });

    it('detects severe judder when 40 FPS is placed in a 60Hz container', () => {
      const res = calculateDisplayCadence(40, 60, false);
      expect(res.ratio).toBe(1.5);
      expect(res.isIntegerDivider).toBe(false);
      expect(res.judderSeverity).toBe('Severe (Uneven Repeat)');
      expect(res.cadencePattern).toContain('Alternating 1 and 2 refreshes');
      expect(res.recommendation).toContain('Severe rhythmic judder');
    });

    it('models 30 FPS in 60Hz integer cadence with sample-and-hold notice', () => {
      const res = calculateDisplayCadence(30, 60, false);
      expect(res.ratio).toBe(2);
      expect(res.isIntegerDivider).toBe(true);
      expect(res.judderSeverity).toBe('None (Perfect Cadence)');
      expect(res.frameHoldMs).toBe(33.33);
      expect(res.recommendation).toContain('OLED displays produce perceived stutter');
    });

    it('models 24 FPS in 60Hz 3:2 pulldown', () => {
      const res = calculateDisplayCadence(24, 60, false);
      expect(res.ratio).toBe(2.5);
      expect(res.judderSeverity).toBe('Mild (3:2 Pulldown)');
      expect(res.cadencePattern).toContain('3:2 pulldown');
    });

    it('evaluates VRR behavior above and below the 48Hz hardware floor', () => {
      // 60 FPS VRR (above 48Hz floor)
      const vrrNative = calculateDisplayCadence(60, 120, true);
      expect(vrrNative.lfcActive).toBe(false);
      expect(vrrNative.vrrStatus).toContain('Native VRR Active');

      // 30 FPS VRR (below 48Hz floor -> triggers LFC)
      const vrrLfc = calculateDisplayCadence(30, 120, true);
      expect(vrrLfc.lfcActive).toBe(true);
      expect(vrrLfc.vrrStatus).toContain('LFC (Low Framerate Compensation) Active');
      expect(vrrLfc.recommendation).toContain('gamma flicker');
    });
  });

  describe('calculatePacingMetrics', () => {
    it('calculates average FPS, 1% lows, and detects stutters correctly', () => {
      // Baseline 60 FPS (16.67ms) with one major hitch (50ms)
      const times = [16.6, 16.7, 16.6, 16.8, 16.7, 50.0, 16.6, 16.7, 16.7, 16.6];
      const metrics = calculatePacingMetrics(times);
      expect(metrics.averageFps).toBeGreaterThanOrEqual(45);
      expect(metrics.stutterCount).toBe(1);
      expect(metrics.onePercentLowFps).toBeLessThan(metrics.averageFps);
    });
  });
});
