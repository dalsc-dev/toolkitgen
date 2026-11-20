/**
 * WebHID & Gamepad Diagnostic Suite logic
 */

export interface CircularityResult {
  averageCircularityErrorPct: number;
  maxCircularityErrorPct: number;
  isSquareGated: boolean;
  verdict: 'Excellent' | 'Good' | 'Noticeable Drift / Gating' | 'Severe Gating';
}

export function calculateCircularityError(points: Array<{ x: number; y: number }>): CircularityResult {
  if (!points || points.length === 0) {
    return {
      averageCircularityErrorPct: 0,
      maxCircularityErrorPct: 0,
      isSquareGated: false,
      verdict: 'Good',
    };
  }

  // Filter for outer perimeter points (magnitude > 0.7)
  const perimeterPoints = points.filter((p) => {
    const mag = Math.sqrt(p.x * p.x + p.y * p.y);
    return mag >= 0.7;
  });

  if (perimeterPoints.length === 0) {
    return {
      averageCircularityErrorPct: 0,
      maxCircularityErrorPct: 0,
      isSquareGated: false,
      verdict: 'Good',
    };
  }

  let totalErr = 0;
  let maxErr = 0;
  let squarePointsCount = 0;

  for (const p of perimeterPoints) {
    const mag = Math.sqrt(p.x * p.x + p.y * p.y);
    const err = Math.abs(1.0 - mag);
    totalErr += err;
    if (err > maxErr) maxErr = err;

    // In a square-gated stick, diagonal magnitude can reach sqrt(2) ~= 1.414
    if (mag > 1.25) squarePointsCount++;
  }

  const avgErrPct = Math.round((totalErr / perimeterPoints.length) * 1000) / 10;
  const maxErrPct = Math.round(maxErr * 1000) / 10;
  const isSquareGated = squarePointsCount > perimeterPoints.length * 0.15;

  let verdict: 'Excellent' | 'Good' | 'Noticeable Drift / Gating' | 'Severe Gating' = 'Good';
  if (avgErrPct <= 4.0 && !isSquareGated) {
    verdict = 'Excellent';
  } else if (avgErrPct <= 12.0) {
    verdict = 'Good';
  } else if (avgErrPct <= 22.0) {
    verdict = 'Noticeable Drift / Gating';
  } else {
    verdict = 'Severe Gating';
  }

  return {
    averageCircularityErrorPct: avgErrPct,
    maxCircularityErrorPct: maxErrPct,
    isSquareGated,
    verdict,
  };
}

export interface CenterJitterResult {
  centerOffsetX: number;
  centerOffsetY: number;
  totalOffsetMagnitude: number;
  jitterVariance: number;
  recommendedInnerDeadzonePct: number;
  needsRma: boolean;
}

export function calculateCenterJitter(restingSamples: Array<{ x: number; y: number }>): CenterJitterResult {
  if (!restingSamples || restingSamples.length === 0) {
    return {
      centerOffsetX: 0,
      centerOffsetY: 0,
      totalOffsetMagnitude: 0,
      jitterVariance: 0,
      recommendedInnerDeadzonePct: 3.0,
      needsRma: false,
    };
  }

  let sumX = 0;
  let sumY = 0;
  for (const s of restingSamples) {
    sumX += s.x;
    sumY += s.y;
  }
  const meanX = sumX / restingSamples.length;
  const meanY = sumY / restingSamples.length;
  const totalOffset = Math.sqrt(meanX * meanX + meanY * meanY);

  // Variance around mean
  let sumVariance = 0;
  for (const s of restingSamples) {
    const dx = s.x - meanX;
    const dy = s.y - meanY;
    sumVariance += dx * dx + dy * dy;
  }
  const variance = sumVariance / restingSamples.length;
  const jitterStdDev = Math.sqrt(variance);

  // Recommended deadzone: offset + 3 * stdDev
  const recommendedDeadzone = Math.min(25.0, Math.max(2.0, Math.round((totalOffset + 3 * jitterStdDev) * 1000) / 10));
  const needsRma = totalOffset > 0.12 || jitterStdDev > 0.05;

  return {
    centerOffsetX: Math.round(meanX * 10000) / 10000,
    centerOffsetY: Math.round(meanY * 10000) / 10000,
    totalOffsetMagnitude: Math.round(totalOffset * 10000) / 10000,
    jitterVariance: Math.round(variance * 1000000) / 1000000,
    recommendedInnerDeadzonePct: recommendedDeadzone,
    needsRma,
  };
}

export interface TriggerEvaluation {
  stepsDetected: number;
  isSmoothAnalog: boolean;
  resolutionRating: string;
}

export function evaluateTriggerResolution(samples: number[]): TriggerEvaluation {
  if (!samples || samples.length === 0) {
    return { stepsDetected: 0, isSmoothAnalog: false, resolutionRating: 'No Data' };
  }

  const uniqueSteps = new Set(samples.map((s) => Math.round(s * 255)));
  const stepsDetected = uniqueSteps.size;

  let isSmoothAnalog = stepsDetected >= 64;
  let resolutionRating = '8-Bit Standard (256 Steps)';
  if (stepsDetected >= 128) {
    resolutionRating = 'High-Precision Analog (128+ Steps)';
  } else if (stepsDetected < 16) {
    resolutionRating = 'Low-Resolution / Stepped';
    isSmoothAnalog = false;
  }

  return {
    stepsDetected,
    isSmoothAnalog,
    resolutionRating,
  };
}

export function generateScorecard(data: {
  controllerName: string;
  pollingHz: number;
  circularityErrorPct: number;
  centerOffsetPct: number;
  jitterVariance: number;
  triggerResolution: string;
}): string {
  const date = new Date().toISOString().split('T')[0];
  return [
    `=== ToolkitGen Gamepad Diagnostic Scorecard ===`,
    `Date: ${date}`,
    `Controller: ${data.controllerName}`,
    `Telemetry Polling: ${data.pollingHz} Hz`,
    `Circularity Error: ${data.circularityErrorPct}%`,
    `Center Resting Offset: ${data.centerOffsetPct}%`,
    `Electrical Jitter Variance: ${data.jitterVariance}`,
    `Trigger Input Resolution: ${data.triggerResolution}`,
    `Status: ${data.centerOffsetPct > 10 ? 'RMA Calibration Recommended (Stick Drift Detected)' : 'Passed Standard Precision Verification'}`,
    `Diagnostic URL: https://toolkitgen.com/tool/webhid_gamepad_diagnostics`,
  ].join('\n');
}
