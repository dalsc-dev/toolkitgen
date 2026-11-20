import { describe, it, expect } from 'vitest';
import {
  evaluateRefreshRateDeltas,
  calculateHdmiBandwidth,
  evaluateDisplayCapabilities,
  getHdmiCalibrationChecklist,
} from './logic';

describe('TV & Gaming Display Capability Checker Logic', () => {
  it('identifies 60Hz and 120Hz refresh rates from frame deltas', () => {
    // 60Hz delta is ~16.67ms
    const deltas60 = [16.6, 16.7, 16.65, 16.72, 16.68];
    const res60 = evaluateRefreshRateDeltas(deltas60);
    expect(res60.fps).toBe(60);
    expect(res60.standardClass).toBe('60Hz');
    expect(res60.stabilityScore).toBeGreaterThanOrEqual(90);

    // 120Hz delta is ~8.33ms
    const deltas120 = [8.32, 8.35, 8.31, 8.34, 8.33];
    const res120 = evaluateRefreshRateDeltas(deltas120);
    expect(res120.fps).toBe(120);
    expect(res120.standardClass).toBe('120Hz');
  });

  it('calculates HDMI bandwidth requirements accurately', () => {
    // 4K 60Hz 8-bit 4:4:4 fits within HDMI 2.0 (18 Gbps)
    const bw4k60 = calculateHdmiBandwidth(3840, 2160, 60, 8, '444');
    expect(bw4k60.requiresHdmi21).toBe(false);
    expect(bw4k60.compatibleStandard).toBe('HDMI 2.0 (18 Gbps)');

    // 4K 120Hz 10-bit 4:4:4 exceeds HDMI 2.0 and requires HDMI 2.1
    const bw4k120 = calculateHdmiBandwidth(3840, 2160, 120, 10, '444');
    expect(bw4k120.requiresHdmi21).toBe(true);
    expect(bw4k120.bandwidthGbps).toBeGreaterThan(18.0);
    expect(bw4k120.compatibleStandard).toBe('HDMI 2.1 (40/48 Gbps)');
  });

  it('evaluates HDR and wide color gamut capabilities', () => {
    const hdrPro = evaluateDisplayCapabilities({
      isHighDynamicRange: true,
      isP3Gamut: true,
      colorDepth: 10,
    });
    expect(hdrPro.panelRating).toBe('Pro HDR Gaming');
    expect(hdrPro.recommendedPictureMode).toContain('HGiG');

    const sdr = evaluateDisplayCapabilities({
      isHighDynamicRange: false,
      isP3Gamut: false,
      colorDepth: 8,
    });
    expect(sdr.panelRating).toBe('Standard SDR Gaming');
  });

  it('provides complete HDMI 2.1 calibration checklist', () => {
    const list = getHdmiCalibrationChecklist();
    expect(list.length).toBe(5);
    expect(list[0].step).toContain('Game Optimizer');
    expect(list[2].step).toContain('HGiG');
  });
});
