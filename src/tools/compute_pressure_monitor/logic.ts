/**
 * Compute Pressure CPU Monitor Logic
 * Implements state mapping, compatibility detection, and load heuristics.
 */

export type PressureState = 'nominal' | 'fair' | 'serious' | 'critical';

export interface PressureReading {
  state: PressureState;
  score: number;
  label: string;
  description: string;
  recommendation: string;
}

export const PRESSURE_STATES: Record<PressureState, PressureReading> = {
  nominal: {
    state: 'nominal',
    score: 100,
    label: 'Nominal Load',
    description: 'System is operating within optimal thermal and power boundaries. Maximum Turbo Boost frequencies available.',
    recommendation: 'Safe to execute high-intensity rendering, compilation, or AI inference workloads without throttling risk.',
  },
  fair: {
    state: 'fair',
    score: 75,
    label: 'Moderate Pressure',
    description: 'System is handling sustained computation. Fans may be spinning up, but frequency throttling is not active.',
    recommendation: 'Normal operating envelope. Workloads proceed at target framerates without degradation.',
  },
  serious: {
    state: 'serious',
    score: 40,
    label: 'Elevated Pressure',
    description: 'Thermal junction or power delivery limits are approaching. CPU scheduler may throttle background worker threads.',
    recommendation: 'Consider lowering render resolution, pausing unneeded background tasks, or checking laptop ventilation.',
  },
  critical: {
    state: 'critical',
    score: 10,
    label: 'Critical Throttling',
    description: 'Hardware protection thresholds triggered. Significant CPU down-clocking active to prevent thermal runaway.',
    recommendation: 'Immediately reduce compute intensity, verify fan operation, and allow hardware to cool down.',
  },
};

export function isComputePressureSupported(): boolean {
  return typeof window !== 'undefined' && 'PressureObserver' in window;
}

export function evaluatePressureRecord(state: string): PressureReading {
  const normalized = (state || 'nominal').toLowerCase() as PressureState;
  return PRESSURE_STATES[normalized] || PRESSURE_STATES.nominal;
}

export function formatPressureTimestamp(date: Date = new Date()): string {
  return date.toTimeString().split(' ')[0];
}

export function calculatePressureAverage(states: PressureState[]): { averageScore: number; dominantState: PressureState } {
  if (!states || states.length === 0) {
    return { averageScore: 100, dominantState: 'nominal' };
  }

  let totalScore = 0;
  const counts: Record<PressureState, number> = {
    nominal: 0,
    fair: 0,
    serious: 0,
    critical: 0,
  };

  for (const s of states) {
    const reading = PRESSURE_STATES[s] || PRESSURE_STATES.nominal;
    totalScore += reading.score;
    counts[s] = (counts[s] || 0) + 1;
  }

  const averageScore = Math.round(totalScore / states.length);

  let dominantState: PressureState = 'nominal';
  let maxCount = -1;
  for (const [key, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantState = key as PressureState;
    }
  }

  return { averageScore, dominantState };
}
