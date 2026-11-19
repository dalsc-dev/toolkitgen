/**
 * Contrast Sensitivity Function Analyzer logic
 */

export interface CSFTrial {
  phase: number; // 1 to 4
  spatialFrequencyLabel: string; // e.g. "1.5 cpd", "3.0 cpd", "6.0 cpd", "12.0 cpd"
  frequencyVal: number; // cycles per pixel (e.g. 0.02 to 0.14)
  contrast: number; // 0.005 to 0.50 (0.5% to 50%)
  orientation: 'horizontal' | 'vertical';
}

export interface CSFTestResult {
  totalTrials: number;
  correctTrials: number;
  accuracyPercent: number;
  peakSensitivity: number;
  curveData: Array<{
    spatialFrequencyLabel: string;
    cpd: number;
    thresholdContrastPercent: number;
    sensitivity: number;
    logSensitivity: number;
  }>;
  clinicalRating: string;
}

export const STANDARD_CSF_PHASES = [
  { phase: 1, label: '1.5 cpd (Low Frequency)', cpd: 1.5, freq: 0.025, contrasts: [0.15, 0.04] },
  { phase: 2, label: '3.0 cpd (Medium-Low)', cpd: 3.0, freq: 0.05, contrasts: [0.10, 0.02] },
  { phase: 3, label: '6.0 cpd (Medium-High)', cpd: 6.0, freq: 0.09, contrasts: [0.12, 0.03] },
  { phase: 4, label: '12.0 cpd (High Frequency)', cpd: 12.0, freq: 0.15, contrasts: [0.25, 0.08] },
];

export function generateTestTrials(): CSFTrial[] {
  const trials: CSFTrial[] = [];

  for (const p of STANDARD_CSF_PHASES) {
    for (const c of p.contrasts) {
      // Alternate orientations deterministically for consistency in testing
      const orientation: 'horizontal' | 'vertical' = (trials.length % 2 === 0) ? 'horizontal' : 'vertical';
      trials.push({
        phase: p.phase,
        spatialFrequencyLabel: p.label,
        frequencyVal: p.freq,
        contrast: c,
        orientation,
      });
    }
  }

  return trials;
}

export function evaluateCSFPerformance(trials: CSFTrial[], responses: Array<'horizontal' | 'vertical'>): CSFTestResult {
  const totalTrials = trials.length;
  if (totalTrials === 0 || responses.length === 0) {
    return {
      totalTrials: 0,
      correctTrials: 0,
      accuracyPercent: 0,
      peakSensitivity: 0,
      curveData: [],
      clinicalRating: 'Incomplete Assessment',
    };
  }

  let correctCount = 0;
  const phaseThresholds: Record<number, number> = {};

  trials.forEach((trial, idx) => {
    const isCorrect = responses[idx] === trial.orientation;
    if (isCorrect) {
      correctCount++;
      const currentMin = phaseThresholds[trial.phase];
      if (currentMin === undefined || trial.contrast < currentMin) {
        phaseThresholds[trial.phase] = trial.contrast;
      }
    }
  });

  const accuracyPercent = Math.round((correctCount / totalTrials) * 100);

  const curveData = STANDARD_CSF_PHASES.map((p) => {
    // If user got correct, use their threshold contrast; otherwise fallback to max contrast
    const thresholdContrast = phaseThresholds[p.phase] !== undefined ? phaseThresholds[p.phase] : 0.50;
    const sensitivity = thresholdContrast > 0 ? Math.round((1 / thresholdContrast) * 10) / 10 : 2;
    const logSensitivity = Math.round(Math.log10(Math.max(1, sensitivity)) * 100) / 100;

    return {
      spatialFrequencyLabel: p.label,
      cpd: p.cpd,
      thresholdContrastPercent: Math.round(thresholdContrast * 1000) / 10,
      sensitivity,
      logSensitivity,
    };
  });

  const peakSensitivity = Math.max(...curveData.map((d) => d.sensitivity));

  let clinicalRating = 'Normal Contrast Perception';
  if (accuracyPercent >= 85) {
    clinicalRating = 'High Contrast Sensitivity (Optimal Acuity Range)';
  } else if (accuracyPercent >= 60) {
    clinicalRating = 'Standard Contrast Sensitivity (Within Normal Limits)';
  } else {
    clinicalRating = 'Reduced Contrast Sensitivity (Consult an Eyecare Professional)';
  }

  return {
    totalTrials,
    correctTrials: correctCount,
    accuracyPercent,
    peakSensitivity,
    curveData,
    clinicalRating,
  };
}

export function computeGaborPixel(
  x: number,
  y: number,
  cx: number,
  cy: number,
  sigma: number,
  freq: number,
  orientation: 'horizontal' | 'vertical',
  contrast: number
): number {
  const dx = x - cx;
  const dy = y - cy;

  // Coordinate rotation
  const u = orientation === 'horizontal' ? dy : dx;
  const v = orientation === 'horizontal' ? dx : dy;

  // Gaussian envelope
  const envelope = Math.exp(-(u * u + v * v) / (2 * sigma * sigma));

  // Sinusoidal carrier wave
  const carrier = Math.cos(2 * Math.PI * freq * u);

  // Return 8-bit grayscale intensity centered at 128
  const intensity = 128 * (1 + contrast * carrier * envelope);
  return Math.max(0, Math.min(255, Math.round(intensity)));
}
