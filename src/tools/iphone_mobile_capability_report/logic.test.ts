import { describe, it, expect } from 'vitest';
import {
  evaluateMobileDisplay,
  evaluateProMotionStatus,
  auditWebApis,
  parseSafeAreaInsets,
} from './logic';

describe('iPhone & Mobile Browser Capability Checker Logic', () => {
  describe('evaluateMobileDisplay', () => {
    it('classifies iPhone 15 Pro / 16 Pro display geometry correctly', () => {
      // iPhone 15 Pro: 393 x 852 CSS points @ 3x DPR = 1179 x 2556 physical pixels
      const metrics = evaluateMobileDisplay({
        width: 393,
        height: 852,
        dpr: 3,
        isP3: true,
        isHdr: true,
        refreshHz: 120,
      });

      expect(metrics.physicalWidth).toBe(1179);
      expect(metrics.physicalHeight).toBe(2556);
      expect(metrics.devicePixelRatio).toBe(3);
      expect(metrics.isP3ColorGamut).toBe(true);
      expect(metrics.screenCategory).toBe('ProMotion Super Retina XDR');
    });

    it('classifies standard Retina display correctly', () => {
      const metrics = evaluateMobileDisplay({
        width: 375,
        height: 667,
        dpr: 2,
        isP3: false,
        isHdr: false,
        refreshHz: 60,
      });

      expect(metrics.screenCategory).toBe('Retina');
    });
  });

  describe('evaluateProMotionStatus', () => {
    it('identifies Safari 60fps power-saving throttle on ProMotion hardware', () => {
      const res = evaluateProMotionStatus(60, true, true);
      expect(res.isProMotionHardwareLikely).toBe(true);
      expect(res.isSafari60HzCapped).toBe(true);
      expect(res.explanation).toContain('Prefer Page Rendering Updates near 60fps');
      expect(res.remedySteps.length).toBeGreaterThanOrEqual(4);
      expect(res.remedySteps[2]).toContain('Prefer Page Rendering Updates near 60fps');
    });

    it('recognizes unthrottled 120Hz ProMotion delivery', () => {
      const res = evaluateProMotionStatus(120, true, true);
      expect(res.isProMotionHardwareLikely).toBe(true);
      expect(res.isSafari60HzCapped).toBe(false);
      expect(res.explanation).toContain('ProMotion 120Hz Active');
      expect(res.remedySteps.length).toBe(0);
    });
  });

  describe('auditWebApis', () => {
    it('generates complete support matrix distinguishing supported from WebKit-blocked APIs', () => {
      const audit = auditWebApis({
        hasWebGpu: true,
        hasWebXr: false,
        hasWebHid: false,
        hasWebBluetooth: false,
        hasFileSystemAccess: false,
        hasSharedArrayBuffer: true,
        hasWebCodecs: true,
      });

      expect(audit.length).toBe(7);
      const webGpu = audit.find((a) => a.apiName === 'WebGPU');
      expect(webGpu?.isSupported).toBe(true);
      expect(webGpu?.safariStatus).toBe('Native Support');

      const webHid = audit.find((a) => a.apiName === 'WebHID (Human Interface Devices)');
      expect(webHid?.isSupported).toBe(false);
      expect(webHid?.safariStatus).toBe('WebKit Blocked / Unsupported');
    });
  });

  describe('parseSafeAreaInsets', () => {
    it('detects Dynamic Island and Home Indicator insets', () => {
      // iPhone 15 Pro portrait safe areas: top 59px, bottom 34px
      const insets = parseSafeAreaInsets(59, 0, 34, 0);
      expect(insets.top).toBe(59);
      expect(insets.bottom).toBe(34);
      expect(insets.hasNotchOrDynamicIsland).toBe(true);
      expect(insets.hasHomeIndicatorBar).toBe(true);
    });

    it('handles flat desktop screens without insets', () => {
      const insets = parseSafeAreaInsets(0, 0, 0, 0);
      expect(insets.hasNotchOrDynamicIsland).toBe(false);
      expect(insets.hasHomeIndicatorBar).toBe(false);
    });
  });
});
