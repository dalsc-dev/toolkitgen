import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  setGridMode,
  toggleAmdSimulation,
  getStatusMessage,
} from './logic';

describe('Amsler Grid Logic', () => {
  it('initializes in standard mode without distortion simulation', () => {
    const state = createInitialState();
    expect(state.mode).toBe('standard');
    expect(state.isSimulating).toBe(false);
    expect(getStatusMessage(state).text).toContain('Standard Diagnostic Grid');
  });

  it('switches between standard and inverted contrast modes', () => {
    let state = createInitialState();
    state = setGridMode(state, 'inverted');
    expect(state.mode).toBe('inverted');
    expect(getStatusMessage(state).text).toContain('High-Contrast');

    state = setGridMode(state, 'standard');
    expect(state.mode).toBe('standard');
  });

  it('toggles distortion simulation and updates status alert', () => {
    let state = createInitialState();
    state = toggleAmdSimulation(state);
    expect(state.isSimulating).toBe(true);
    expect(getStatusMessage(state).text).toContain('Simulating AMD');

    state = toggleAmdSimulation(state);
    expect(state.isSimulating).toBe(false);
  });
});
