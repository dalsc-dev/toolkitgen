/**
 * TV Game Mode and Input Lag Tester logic
 */

export interface LatencyTestSample {
  stimulusTimeMs: number;
  responseTimestampMs: number;
  durationMs: number;
}

export interface LatencyStats {
  samplesCount: number;
  meanMs: number;
  minMs: number;
  maxMs: number;
  stdDevMs: number;
  ratingTier: 'competitive' | 'optimal' | 'moderate' | 'excessive_processing';
  ratingLabel: string;
}

export function evaluateLatencyTier(meanMs: number): { tier: LatencyStats['ratingTier']; label: string } {
  // Reaction time includes human visual cortex processing (~180-220ms) plus input device + display latency
  if (meanMs < 210) {
    return {
      tier: 'competitive',
      label: 'Ultra-Responsive (Gaming Mode Confirmed)',
    };
  }
  if (meanMs < 260) {
    return {
      tier: 'optimal',
      label: 'Optimal (Low Processing Latency)',
    };
  }
  if (meanMs < 330) {
    return {
      tier: 'moderate',
      label: 'Moderate (Standard Picture Processing Likely Active)',
    };
  }
  return {
    tier: 'excessive_processing',
    label: 'High Latency (Game Mode / ALLM Strongly Recommended)',
  };
}

export function calculateLatencyStats(durationsMs: number[]): LatencyStats {
  const valid = durationsMs.filter((d) => isFinite(d) && d > 50 && d < 2000);
  if (valid.length === 0) {
    return {
      samplesCount: 0,
      meanMs: 0,
      minMs: 0,
      maxMs: 0,
      stdDevMs: 0,
      ratingTier: 'moderate',
      ratingLabel: 'No valid samples recorded',
    };
  }

  const sum = valid.reduce((a, b) => a + b, 0);
  const mean = sum / valid.length;
  const min = Math.min(...valid);
  const max = Math.max(...valid);

  const variance = valid.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / valid.length;
  const stdDev = Math.sqrt(variance);

  const { tier, label } = evaluateLatencyTier(mean);

  return {
    samplesCount: valid.length,
    meanMs: Math.round(mean * 10) / 10,
    minMs: Math.round(min * 10) / 10,
    maxMs: Math.round(max * 10) / 10,
    stdDevMs: Math.round(stdDev * 10) / 10,
    ratingTier: tier,
    ratingLabel: label,
  };
}

export function calculateFrameBudget(refreshRateHz: number): number {
  if (refreshRateHz <= 0) return 16.67;
  return Math.round((1000 / refreshRateHz) * 100) / 100;
}
