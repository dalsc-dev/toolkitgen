/**
 * HDR & OLED Display Calibration Patterns logic
 */

export interface GradientStep {
  step: number;
  normalizedVal: number;
  rgb8Bit: number;
  rgb10Bit: number;
}

export function generateGradientSteps(stepsCount: number = 64): GradientStep[] {
  const steps: GradientStep[] = [];
  const safeCount = Math.max(16, Math.min(256, stepsCount));

  for (let i = 0; i <= safeCount; i++) {
    const norm = i / safeCount;
    steps.push({
      step: i,
      normalizedVal: Math.round(norm * 10000) / 10000,
      rgb8Bit: Math.round(norm * 255),
      rgb10Bit: Math.round(norm * 1023),
    });
  }

  return steps;
}

export interface NearBlackResult {
  grayLevelPct: number;
  luminanceNitsApprox: number;
  isTrueBlack: boolean;
  rgbValue: number;
}

export function calculateOledNearBlack(grayLevelPct: number, peakNits: number = 800): NearBlackResult {
  const safePct = Math.max(0, Math.min(20, grayLevelPct));
  const isTrueBlack = safePct === 0;

  // Approximate gamma 2.2 luminance output: L = Peak * (Pct / 100)^2.2
  const luminanceNitsApprox = isTrueBlack
    ? 0
    : Math.round(peakNits * Math.pow(safePct / 100, 2.2) * 100) / 100;

  const rgbValue = Math.round((safePct / 100) * 255);

  return {
    grayLevelPct: safePct,
    luminanceNitsApprox,
    isTrueBlack,
    rgbValue,
  };
}

export interface ClippingEvaluation {
  nitLevel: number;
  targetDisplayNits: number;
  isClipped: boolean;
  eotfValueNormalized: number;
}

export function evaluateHdrClipping(nitLevel: number, targetDisplayNits: number = 800): ClippingEvaluation {
  const safeNits = Math.max(100, nitLevel);
  const safeTarget = Math.max(100, targetDisplayNits);
  const isClipped = safeNits > safeTarget;

  // SMPTE ST 2084 Perceptual Quantizer (PQ) normalized mapping to 10,000 nits max
  // Approximation of normalized PQ code value
  const eotfValueNormalized = Math.round(Math.pow(safeNits / 10000, 0.25) * 1000) / 1000;

  return {
    nitLevel: safeNits,
    targetDisplayNits: safeTarget,
    isClipped,
    eotfValueNormalized,
  };
}
