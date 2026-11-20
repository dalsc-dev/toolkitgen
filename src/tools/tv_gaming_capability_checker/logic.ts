/**
 * TV & Gaming Display Capability Checker logic
 */

export interface RefreshRateEvaluation {
  fps: number;
  standardClass: '60Hz' | '120Hz' | '144Hz' | '240Hz' | 'Other';
  stabilityScore: number; // 0 to 100%
  meanDeltaMs: number;
}

export function evaluateRefreshRateDeltas(deltasMs: number[]): RefreshRateEvaluation {
  if (!deltasMs || deltasMs.length === 0) {
    return { fps: 60, standardClass: '60Hz', stabilityScore: 100, meanDeltaMs: 16.67 };
  }

  const validDeltas = deltasMs.filter((d) => d > 2 && d < 50);
  if (validDeltas.length === 0) {
    return { fps: 60, standardClass: '60Hz', stabilityScore: 100, meanDeltaMs: 16.67 };
  }

  const sum = validDeltas.reduce((a, b) => a + b, 0);
  const meanDelta = sum / validDeltas.length;
  const rawFps = Math.round(1000 / meanDelta);

  // Variance / stability
  const variance = validDeltas.reduce((a, b) => a + Math.pow(b - meanDelta, 2), 0) / validDeltas.length;
  const stdDev = Math.sqrt(variance);
  const stabilityScore = Math.max(0, Math.min(100, Math.round(100 - stdDev * 15)));

  let standardClass: '60Hz' | '120Hz' | '144Hz' | '240Hz' | 'Other' = 'Other';
  if (rawFps >= 57 && rawFps <= 63) standardClass = '60Hz';
  else if (rawFps >= 115 && rawFps <= 125) standardClass = '120Hz';
  else if (rawFps >= 138 && rawFps <= 148) standardClass = '144Hz';
  else if (rawFps >= 230 && rawFps <= 248) standardClass = '240Hz';

  return {
    fps: rawFps,
    standardClass,
    stabilityScore,
    meanDeltaMs: Math.round(meanDelta * 100) / 100,
  };
}

export interface HdmiBandwidthResult {
  bandwidthGbps: number;
  requiresHdmi21: boolean;
  compatibleStandard: 'HDMI 2.0 (18 Gbps)' | 'HDMI 2.1 (40/48 Gbps)' | 'Exceeds Standard';
}

export function calculateHdmiBandwidth(
  width: number,
  height: number,
  refreshHz: number,
  bitDepth: 8 | 10 | 12,
  chroma: '444' | '422' | '420'
): HdmiBandwidthResult {
  const safeW = Math.max(640, width);
  const safeH = Math.max(480, height);
  const safeHz = Math.max(24, refreshHz);

  // Total active pixels per second
  const totalPixelsPerSec = safeW * safeH * safeHz;

  // Add 15% standard VESA CVT-RB (reduced blanking) timing overhead
  const totalClockPixels = totalPixelsPerSec * 1.15;

  let bitsPerPixel = bitDepth * 3; // 4:4:4 or RGB
  if (chroma === '422') {
    bitsPerPixel = bitDepth * 2;
  } else if (chroma === '420') {
    bitsPerPixel = bitDepth * 1.5;
  }

  // Data transmission bit rate in Gbps (accounting for 10b/12b or 16b/18b coding)
  const rawBitsPerSec = totalClockPixels * bitsPerPixel;
  // With 16b/18b FRL or 8b/10b TMDS overhead (~20%)
  const bandwidthGbps = Math.round((rawBitsPerSec / 1e9) * 1.2 * 100) / 100;

  const requiresHdmi21 = bandwidthGbps > 18.0;
  let compatibleStandard: 'HDMI 2.0 (18 Gbps)' | 'HDMI 2.1 (40/48 Gbps)' | 'Exceeds Standard' = 'HDMI 2.0 (18 Gbps)';
  if (bandwidthGbps > 48.0) {
    compatibleStandard = 'Exceeds Standard';
  } else if (requiresHdmi21) {
    compatibleStandard = 'HDMI 2.1 (40/48 Gbps)';
  }

  return {
    bandwidthGbps,
    requiresHdmi21,
    compatibleStandard,
  };
}

export interface DisplayCapabilities {
  hdrSupported: boolean;
  wideGamutSupported: boolean;
  colorDepthBits: number;
  panelRating: 'Pro HDR Gaming' | 'Standard SDR Gaming' | 'Entry Display';
  recommendedPictureMode: string;
}

export function evaluateDisplayCapabilities(inputs: {
  isHighDynamicRange: boolean;
  isP3Gamut: boolean;
  colorDepth: number;
}): DisplayCapabilities {
  const hdrSupported = inputs.isHighDynamicRange;
  const wideGamutSupported = inputs.isP3Gamut;
  const colorDepthBits = Math.max(8, inputs.colorDepth || 8);

  let panelRating: 'Pro HDR Gaming' | 'Standard SDR Gaming' | 'Entry Display' = 'Standard SDR Gaming';
  let recommendedPictureMode = 'Game Mode (ALLM Active, Warm 50 / Warm 2 Color Temperature)';

  if (hdrSupported && wideGamutSupported) {
    panelRating = 'Pro HDR Gaming';
    recommendedPictureMode =
      'Game Mode + HGiG (Disable Dynamic Tone Mapping, Set Console Peak Clipping to Display Spec)';
  } else if (!hdrSupported && colorDepthBits < 8) {
    panelRating = 'Entry Display';
    recommendedPictureMode = 'Standard Game Mode (Disable Motion Interpolation & Noise Filters)';
  }

  return {
    hdrSupported,
    wideGamutSupported,
    colorDepthBits,
    panelRating,
    recommendedPictureMode,
  };
}

export function getHdmiCalibrationChecklist(): Array<{ step: string; recommendation: string; description: string }> {
  return [
    {
      step: '1. Enable Game Optimizer / Game Mode',
      recommendation: 'Active',
      description: 'Bypasses television video processing pipelines, reducing input lag from 80ms+ down to under 10ms.',
    },
    {
      step: '2. HDMI Enhanced / Ultra Deep Color',
      recommendation: 'Enable on Input Port',
      description: 'Unlocks full 40/48 Gbps HDMI 2.1 bandwidth for 4K 120Hz 10-bit HDR on the television port.',
    },
    {
      step: '3. HDR Tone Mapping (HGiG)',
      recommendation: 'Set to HGiG (Dynamic Tone Mapping: OFF)',
      description:
        'Prevents double-tone-mapping by allowing the console to tone map directly to your displays exact peak luminance clipping point.',
    },
    {
      step: '4. Variable Refresh Rate (VRR / ALLM)',
      recommendation: 'Set to Automatic',
      description: 'Eliminates screen tearing without input latency penalties across 48Hz - 120Hz frame fluctuations.',
    },
    {
      step: '5. RGB Color Range',
      recommendation: 'Automatic on Console and TV',
      description: 'Ensures black levels match (Full 0-255 vs Limited 16-235) to prevent crushed shadows or washed-out gray blacks.',
    },
  ];
}
