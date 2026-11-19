import { describe, it, expect } from 'vitest';
import { normalizeStickInput, calculatePollingRate, STANDARD_BUTTON_LABELS } from './logic';

describe('Gamepad Button and Input Tester Logic', () => {
  it('identifies standard button mappings correctly', () => {
    expect(STANDARD_BUTTON_LABELS[0].xbox).toBe('A');
    expect(STANDARD_BUTTON_LABELS[0].playstation).toBe('Cross');
    expect(STANDARD_BUTTON_LABELS[7].xbox).toBe('RT');
    expect(STANDARD_BUTTON_LABELS[7].playstation).toBe('R2');
  });

  it('normalizes analog stick coordinates and identifies deadzone threshold', () => {
    // Stick resting at center
    const center = normalizeStickInput(0.02, -0.01, 0.08);
    expect(center.inDeadzone).toBe(true);

    // Stick pushed completely right (X=1, Y=0)
    const right = normalizeStickInput(1.0, 0.0, 0.08);
    expect(right.inDeadzone).toBe(false);
    expect(right.magnitude).toBe(1.0);
    expect(right.angleDegrees).toBe(0);

    // Stick pushed completely down (X=0, Y=1)
    const down = normalizeStickInput(0.0, 1.0, 0.08);
    expect(down.magnitude).toBe(1.0);
    expect(down.angleDegrees).toBe(90);
  });

  it('calculates controller polling rate from frame deltas', () => {
    // 250 Hz polling rate = 4 ms interval
    const deltas = [4.0, 3.9, 4.1, 4.0, 4.0];
    const { pollingRateHz, meanDeltaMs } = calculatePollingRate(deltas);

    expect(pollingRateHz).toBe(250);
    expect(meanDeltaMs).toBe(4.0);
  });
});
