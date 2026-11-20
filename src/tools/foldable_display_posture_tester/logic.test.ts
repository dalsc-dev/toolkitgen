import { describe, it, expect } from 'vitest';
import {
  evaluateDevicePosture,
  calculateFoldableGeometry,
  evaluateCreaseTouchContinuity,
  type TouchSample,
} from './logic';

describe('Foldable & Dual-Screen Device Tester Logic', () => {
  describe('evaluateDevicePosture', () => {
    it('evaluates folded posture with dual-pane layout recommendation', () => {
      const res = evaluateDevicePosture('folded');
      expect(res.posture).toBe('folded');
      expect(res.isFolded).toBe(true);
      expect(res.recommendedLayout).toBe('Dual-Pane Master-Detail');
      expect(res.postureDescription).toContain('Book Posture');
    });

    it('evaluates continuous flat posture', () => {
      const res = evaluateDevicePosture('continuous');
      expect(res.posture).toBe('continuous');
      expect(res.isFolded).toBe(false);
      expect(res.recommendedLayout).toBe('Single Unified Viewport');
    });

    it('handles null or unsupported posture gracefully', () => {
      const res = evaluateDevicePosture(null);
      expect(res.posture).toBe('unsupported');
      expect(res.isFolded).toBe(false);
    });
  });

  describe('calculateFoldableGeometry', () => {
    it('calculates vertical dual-segment fold geometry (Book fold)', () => {
      // 800px wide display split into two 380px segments with a 40px physical hinge gap (Surface Duo style)
      const geom = calculateFoldableGeometry({
        viewportWidth: 800,
        viewportHeight: 600,
        segment00Width: 380,
        segment00Height: 600,
        segment10Left: 420,
      });

      expect(geom.isFoldableDetected).toBe(true);
      expect(geom.foldOrientation).toBe('vertical');
      expect(geom.creasePositionPx).toBe(380);
      expect(geom.creaseThicknessPx).toBe(40);
      expect(geom.segments.length).toBe(2);
      expect(geom.segments[0].width).toBe(380);
      expect(geom.segments[1].left).toBe(420);
    });

    it('calculates horizontal clamshell fold geometry (Flip style)', () => {
      // 400x900 viewport split horizontally at 440px with a 20px hinge
      const geom = calculateFoldableGeometry({
        viewportWidth: 400,
        viewportHeight: 900,
        segment00Width: 400,
        segment00Height: 440,
        segment01Top: 460,
      });

      expect(geom.isFoldableDetected).toBe(true);
      expect(geom.foldOrientation).toBe('horizontal');
      expect(geom.creasePositionPx).toBe(440);
      expect(geom.creaseThicknessPx).toBe(20);
    });

    it('returns single planar segment when no segments exist', () => {
      const geom = calculateFoldableGeometry({
        viewportWidth: 1200,
        viewportHeight: 800,
      });

      expect(geom.isFoldableDetected).toBe(false);
      expect(geom.foldOrientation).toBe('none');
      expect(geom.segments.length).toBe(1);
    });
  });

  describe('evaluateCreaseTouchContinuity', () => {
    it('detects smooth continuous drag across a fold hinge', () => {
      // Smooth drag across x = 300
      const samples: TouchSample[] = [
        { x: 260, y: 100, timestamp: 1000 },
        { x: 280, y: 100, timestamp: 1016 },
        { x: 300, y: 100, timestamp: 1032 },
        { x: 320, y: 100, timestamp: 1048 },
        { x: 340, y: 100, timestamp: 1064 },
      ];

      const res = evaluateCreaseTouchContinuity(samples, 300, true);
      expect(res.creaseTraversals).toBeGreaterThanOrEqual(1);
      expect(res.hasDeadZone).toBe(false);
      expect(res.touchSmoothnessScore).toBeGreaterThanOrEqual(80);
    });

    it('flags touch coordinate snapping or dead zones across the hinge', () => {
      // Discontinuous jump across x = 300 (jumps from 280 to 360 = 80px snap)
      const samples: TouchSample[] = [
        { x: 240, y: 100, timestamp: 1000 },
        { x: 260, y: 100, timestamp: 1016 },
        { x: 280, y: 100, timestamp: 1032 },
        { x: 360, y: 100, timestamp: 1048 },
        { x: 380, y: 100, timestamp: 1064 },
      ];

      const res = evaluateCreaseTouchContinuity(samples, 300, true);
      expect(res.creaseTraversals).toBe(1);
      expect(res.hasDeadZone).toBe(true);
      expect(res.maxCoordinateJumpPx).toBe(80);
    });
  });
});
