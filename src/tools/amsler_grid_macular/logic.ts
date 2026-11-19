export type GridMode = 'standard' | 'inverted';

export interface AmslerGridState {
  mode: GridMode;
  isSimulating: boolean;
}

export function createInitialState(): AmslerGridState {
  return {
    mode: 'standard',
    isSimulating: false,
  };
}

export function setGridMode(state: AmslerGridState, mode: GridMode): AmslerGridState {
  return {
    ...state,
    mode,
    isSimulating: false,
  };
}

export function toggleAmdSimulation(state: AmslerGridState): AmslerGridState {
  return {
    ...state,
    isSimulating: !state.isSimulating,
  };
}

export function getStatusMessage(state: AmslerGridState): { text: string; color: string } {
  if (state.isSimulating) {
    return { text: 'Simulating AMD Metamorphopsia (Distortion)', color: 'text-rose-600' };
  }
  if (state.mode === 'inverted') {
    return { text: 'High-Contrast Clinical Mode Active', color: 'text-blue-600' };
  }
  return { text: 'Standard Diagnostic Grid (Ready)', color: 'text-emerald-600' };
}
