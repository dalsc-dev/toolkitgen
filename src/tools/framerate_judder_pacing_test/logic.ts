/**
 * Frame Rate Judder & Pacing Test Logic
 * Client-side calculation algorithms for refresh rate detection, cadence dividers,
 * micro-stutter variance, and VRR / LFC status.
 */

export interface FrameRateEvaluation {
  fps: number;
  meanDeltaMs: number;
  jitterMs: number;
  stabilityScore: number; // 0 to 100%
  standardClass: '60Hz' | '75Hz' | '120Hz' | '144Hz' | '165Hz' | '240Hz' | '360Hz' | 'Other';
}

export function evaluateFrameDeltas(deltasMs: number[]): FrameRateEvaluation {
  if (!deltasMs || deltasMs.length === 0) {
    return {
      fps: 60,
      meanDeltaMs: 16.67,
      jitterMs: 0,
      stabilityScore: 100,
      standardClass: '60Hz',
    };
  }

  // Filter out suspension / tab-switch outliers (< 1ms or > 100ms)
  const validDeltas = deltasMs.filter((d) => d >= 1.5 && d <= 100);
  if (validDeltas.length === 0) {
    return {
      fps: 60,
      meanDeltaMs: 16.67,
      jitterMs: 0,
      stabilityScore: 100,
      standardClass: '60Hz',
    };
  }

  const sum = validDeltas.reduce((a, b) => a + b, 0);
  const meanDelta = sum / validDeltas.length;
  const rawFps = Math.round(1000 / meanDelta);

  // Variance / jitter standard deviation
  const variance = validDeltas.reduce((a, b) => a + Math.pow(b - meanDelta, 2), 0) / validDeltas.length;
  const stdDev = Math.sqrt(variance);
  const jitterMs = Math.round(stdDev * 100) / 100;
  const stabilityScore = Math.max(0, Math.min(100, Math.round(100 - jitterMs * 15)));

  let standardClass: '60Hz' | '75Hz' | '120Hz' | '144Hz' | '165Hz' | '240Hz' | '360Hz' | 'Other' = 'Other';
  if (rawFps >= 57 && rawFps <= 63) standardClass = '60Hz';
  else if (rawFps >= 72 && rawFps <= 78) standardClass = '75Hz';
  else if (rawFps >= 115 && rawFps <= 125) standardClass = '120Hz';
  else if (rawFps >= 138 && rawFps <= 148) standardClass = '144Hz';
  else if (rawFps >= 160 && rawFps <= 170) standardClass = '165Hz';
  else if (rawFps >= 230 && rawFps <= 248) standardClass = '240Hz';
  else if (rawFps >= 350 && rawFps <= 370) standardClass = '360Hz';

  return {
    fps: rawFps,
    meanDeltaMs: Math.round(meanDelta * 100) / 100,
    jitterMs,
    stabilityScore,
    standardClass,
  };
}

export interface CadenceAnalysis {
  targetFps: number;
  displayHz: number;
  ratio: number;
  isIntegerDivider: boolean;
  refreshesPerFrame: number | string;
  frameHoldMs: number;
  judderSeverity: 'None (Perfect Cadence)' | 'Mild (3:2 Pulldown)' | 'Severe (Uneven Repeat)';
  cadencePattern: string;
  vrrStatus: string;
  lfcActive: boolean;
  recommendation: string;
}

export function calculateDisplayCadence(
  targetFps: number,
  displayHz: number,
  isVrrEnabled: boolean = false
): CadenceAnalysis {
  const safeFps = Math.max(1, targetFps);
  const safeHz = Math.max(1, displayHz);
  const ratio = Math.round((safeHz / safeFps) * 100) / 100;
  const frameHoldMs = Math.round((1000 / safeFps) * 100) / 100;

  const isInteger = Math.abs(ratio - Math.round(ratio)) < 0.01;
  const intDivider = Math.round(ratio);

  let judderSeverity: 'None (Perfect Cadence)' | 'Mild (3:2 Pulldown)' | 'Severe (Uneven Repeat)' =
    'Severe (Uneven Repeat)';
  let cadencePattern = '';
  let recommendation = '';

  if (isInteger) {
    judderSeverity = 'None (Perfect Cadence)';
    cadencePattern = `${intDivider} display refreshes per game frame (${Array(intDivider).fill('1').join(':')} cadence)`;
    if (safeFps === 40 && safeHz === 120) {
      recommendation =
        'Optimal 40 FPS balanced mode: 120Hz / 40 = exactly 3 refreshes per frame (25.0 ms hold). Retinal judder is eliminated without paying the 60 FPS GPU rendering penalty.';
    } else if (safeFps === 30 && safeHz === 60) {
      recommendation =
        'Even 2:2 cadence (33.3 ms hold). While mathematically even, sample-and-hold OLED displays produce perceived stutter during panning due to long static frame hold times.';
    } else if (safeFps === 60 && safeHz === 60) {
      recommendation = 'Perfect 1:1 sync (16.67 ms hold). Every display refresh delivers a fresh rendered frame.';
    } else if (safeFps === 60 && safeHz === 120) {
      recommendation = 'Even 2:2 sync (16.67 ms frame time, 8.33 ms display cycle). Flawless motion delivery.';
    } else {
      recommendation = `Even integer cadence (${intDivider}:1 ratio). Frame delivery is perfectly uniform across display scan cycles.`;
    }
  } else if (Math.abs(ratio - 2.5) < 0.05) {
    // 24 FPS in 60Hz: 3:2 pulldown
    judderSeverity = 'Mild (3:2 Pulldown)';
    cadencePattern = 'Alternating 3 and 2 refreshes per frame (3:2 pulldown = 50.0 ms / 33.3 ms alternating hold)';
    recommendation =
      'Classic 3:2 pulldown judder. To achieve judder-free 24 FPS cinema playback, switch display output to 120Hz (5:5 pulldown) or 24Hz.';
  } else if (Math.abs(ratio - 1.5) < 0.05) {
    // 40 FPS in 60Hz: 1:2 judder
    judderSeverity = 'Severe (Uneven Repeat)';
    cadencePattern = 'Alternating 1 and 2 refreshes per frame (16.7 ms / 33.3 ms asymmetric repeat)';
    recommendation =
      'Severe rhythmic judder! 40 FPS cannot divide into a 60Hz container cleanly. Enable 120Hz mode on your television or switch the console to standard 30 FPS or 60 FPS.';
  } else {
    judderSeverity = 'Severe (Uneven Repeat)';
    cadencePattern = `Fractional cadence (${ratio} refreshes per frame). Frames repeat with irregular timing across display refresh intervals.`;
    recommendation =
      'Asymmetric frame cadence detected. Micro-stutters and visual tearing will occur unless Variable Refresh Rate (VRR) is active.';
  }

  // VRR and LFC Analysis
  // Standard HDMI 2.1 VRR has a hardware operating floor of 48 Hz.
  let vrrStatus = '';
  let lfcActive = false;

  if (isVrrEnabled) {
    if (safeFps >= 48 && safeFps <= safeHz) {
      vrrStatus = `Native VRR Active: Panel refresh rate dynamically tracks frame rendering directly from ${safeFps} Hz to ${safeHz} Hz without fixed pulldown cadences.`;
      judderSeverity = 'None (Perfect Cadence)';
      recommendation = 'Flawless VRR motion delivery within the native hardware window (48Hz-120Hz).';
    } else if (safeFps < 48) {
      lfcActive = true;
      const multiplier = Math.ceil(48 / safeFps);
      const effectiveDisplayHz = safeFps * multiplier;
      vrrStatus = `Below 48Hz VRR Floor - LFC (Low Framerate Compensation) Active: The GPU frame-doubles by ${multiplier}x to drive the panel at ~${effectiveDisplayHz} Hz.`;
      recommendation =
        'LFC frame-multiplication is active. On OLED displays, rapid transitions across the 48Hz threshold can cause visible near-black gamma flicker due to panel voltage variations.';
    } else {
      vrrStatus = `Frame rate (${safeFps} FPS) exceeds display maximum refresh rate (${safeHz} Hz). VRR disengages at upper boundary; V-Sync or frame capping is advised.`;
    }
  } else {
    vrrStatus = 'Fixed Refresh Rate (VRR Disabled): Delivery is constrained to fixed hardware scan cycles.';
  }

  return {
    targetFps: safeFps,
    displayHz: safeHz,
    ratio,
    isIntegerDivider: isInteger,
    refreshesPerFrame: isInteger ? intDivider : ratio,
    frameHoldMs,
    judderSeverity,
    cadencePattern,
    vrrStatus,
    lfcActive,
    recommendation,
  };
}

export interface PacingMetrics {
  averageFps: number;
  onePercentLowFps: number;
  zeroPointOnePercentLowFps: number;
  meanFrameTimeMs: number;
  stutterCount: number;
  pacingQuality: 'Stable' | 'Minor Stutters' | 'Severe Inconsistency';
}

export function calculatePacingMetrics(frameTimesMs: number[]): PacingMetrics {
  if (!frameTimesMs || frameTimesMs.length === 0) {
    return {
      averageFps: 60,
      onePercentLowFps: 60,
      zeroPointOnePercentLowFps: 60,
      meanFrameTimeMs: 16.67,
      stutterCount: 0,
      pacingQuality: 'Stable',
    };
  }

  const validTimes = frameTimesMs.filter((t) => t > 1 && t < 200);
  if (validTimes.length === 0) {
    return {
      averageFps: 60,
      onePercentLowFps: 60,
      zeroPointOnePercentLowFps: 60,
      meanFrameTimeMs: 16.67,
      stutterCount: 0,
      pacingQuality: 'Stable',
    };
  }

  const sum = validTimes.reduce((a, b) => a + b, 0);
  const meanFrameTime = sum / validTimes.length;
  const averageFps = Math.round(1000 / meanFrameTime);

  // Sort descending by frame time to calculate worst 1% and 0.1% percentiles (highest frame times = lowest FPS)
  const sortedDesc = [...validTimes].sort((a, b) => b - a);

  const idx1Pct = Math.max(0, Math.floor(sortedDesc.length * 0.01));
  const idx01Pct = Math.max(0, Math.floor(sortedDesc.length * 0.001));

  const worst1PctTime = sortedDesc[idx1Pct] || meanFrameTime;
  const worst01PctTime = sortedDesc[idx01Pct] || worst1PctTime;

  const onePercentLowFps = Math.round(1000 / worst1PctTime);
  const zeroPointOnePercentLowFps = Math.round(1000 / worst01PctTime);

  // Stutter count: frame times exceeding 1.5x of the mean frame time
  const stutterThreshold = meanFrameTime * 1.5;
  const stutterCount = validTimes.filter((t) => t > stutterThreshold).length;

  let pacingQuality: 'Stable' | 'Minor Stutters' | 'Severe Inconsistency' = 'Stable';
  const stutterRate = stutterCount / validTimes.length;
  if (stutterRate > 0.05) {
    pacingQuality = 'Severe Inconsistency';
  } else if (stutterRate > 0.01) {
    pacingQuality = 'Minor Stutters';
  }

  return {
    averageFps,
    onePercentLowFps,
    zeroPointOnePercentLowFps,
    meanFrameTimeMs: Math.round(meanFrameTime * 100) / 100,
    stutterCount,
    pacingQuality,
  };
}
