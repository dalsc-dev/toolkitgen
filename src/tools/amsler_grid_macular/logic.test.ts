import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  setTestedEye,
  addMarking,
  clearMarkings,
  generateAmslerClinicalReport,
} from './logic';

describe('Amsler Grid Logic', () => {
  it('creates initial state correctly', () => {
    const state = createInitialState();
    expect(state.mode).toBe('standard');
    expect(state.isSimulating).toBe(false);
    expect(state.eye).toBe('right');
    expect(state.markings.length).toBe(0);
  });

  it('handles eye switching and anomaly marking', () => {
    let state = createInitialState();
    state = setTestedEye(state, 'left');
    expect(state.eye).toBe('left');

    state = addMarking(state, 45, 60);
    expect(state.markings.length).toBe(1);
    expect(state.markings[0].x).toBe(45);
    expect(state.markings[0].y).toBe(60);

    state = clearMarkings(state);
    expect(state.markings.length).toBe(0);
  });

  it('generates a clinical summary report with clinical disclaimer', () => {
    let state = createInitialState();
    state = setTestedEye(state, 'left');
    state = addMarking(state, 30, 40);

    const report = generateAmslerClinicalReport(state);
    expect(report).toContain('Amsler Grid Visual Self-Evaluation Summary');
    expect(report).toContain('Eye Monitored: LEFT Eye');
    expect(report).toContain('IMPORTANT CLINICAL DISCLAIMER');
    expect(report).toContain('https://toolkitgen.com/tool/amsler_grid_macular');
  });
});
