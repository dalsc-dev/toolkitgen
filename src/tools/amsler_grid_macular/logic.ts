export type GridMode = 'standard' | 'inverted';
export type TestedEye = 'left' | 'right' | 'both';

export interface GridMarking {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  type: 'distortion' | 'scotoma';
}

export interface AmslerGridState {
  mode: GridMode;
  isSimulating: boolean;
  eye: TestedEye;
  markings: GridMarking[];
  markingType: 'distortion' | 'scotoma';
}

export function createInitialState(): AmslerGridState {
  return {
    mode: 'standard',
    isSimulating: false,
    eye: 'right',
    markings: [],
    markingType: 'distortion',
  };
}

export function setGridMode(state: AmslerGridState, mode: GridMode): AmslerGridState {
  return {
    ...state,
    mode,
    isSimulating: false,
  };
}

export function setTestedEye(state: AmslerGridState, eye: TestedEye): AmslerGridState {
  return {
    ...state,
    eye,
  };
}

export function toggleAmdSimulation(state: AmslerGridState): AmslerGridState {
  return {
    ...state,
    isSimulating: !state.isSimulating,
  };
}

export function addMarking(
  state: AmslerGridState,
  x: number,
  y: number
): AmslerGridState {
  return {
    ...state,
    markings: [
      ...state.markings,
      { x: Math.round(x), y: Math.round(y), type: state.markingType },
    ],
  };
}

export function clearMarkings(state: AmslerGridState): AmslerGridState {
  return {
    ...state,
    markings: [],
  };
}

export function getStatusMessage(state: AmslerGridState): { text: string; color: string } {
  if (state.isSimulating) {
    return { text: 'Simulating AMD Metamorphopsia (Distortion)', color: 'text-rose-600' };
  }
  if (state.markings.length > 0) {
    return {
      text: `${state.markings.length} Anomaly Marker(s) Recorded (${state.eye.toUpperCase()} Eye)`,
      color: 'text-amber-600',
    };
  }
  if (state.mode === 'inverted') {
    return { text: 'High-Contrast Clinical Mode Active', color: 'text-blue-600' };
  }
  return { text: 'Standard Diagnostic Grid (Ready)', color: 'text-emerald-600' };
}

export function generateAmslerClinicalReport(state: AmslerGridState): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const observations =
    state.markings.length === 0
      ? 'No visual distortion or scotoma marked (Normal subjective appearance).'
      : `${state.markings.length} area(s) marked where lines appeared wavy, bent, or missing.`;

  return [
    `=== Amsler Grid Visual Self-Evaluation Summary ===`,
    `Date of Test: ${dateStr}`,
    `Eye Monitored: ${state.eye.toUpperCase()} Eye`,
    `Grid Contrast: ${state.mode === 'inverted' ? 'White on Black (High Contrast)' : 'Black on White (Standard)'}`,
    `Subjective Observations: ${observations}`,
    `Marked Coordinate Zones: ${state.markings.length > 0 ? state.markings.map(m => `(${m.x}%, ${m.y}%)`).join(', ') : 'None'}`,
    ``,
    `IMPORTANT CLINICAL DISCLAIMER:`,
    `This test is an informational self-screening tool and is NOT a medical diagnosis.`,
    `Consult an optometrist or ophthalmologist immediately if you notice new wavy lines, dark spots, or sudden vision changes.`,
    `Generated via ToolkitGen: https://toolkitgen.com/tool/amsler_grid_macular`,
    `==================================================`,
  ].join('\n');
}
