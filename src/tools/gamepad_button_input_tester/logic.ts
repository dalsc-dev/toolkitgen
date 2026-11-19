/**
 * Gamepad Button and Input Tester logic
 */

export interface NormalizedStickPosition {
  x: number;
  y: number;
  magnitude: number;
  angleDegrees: number;
  inDeadzone: boolean;
}

export const STANDARD_BUTTON_LABELS: Record<number, { xbox: string; playstation: string; general: string }> = {
  0: { xbox: 'A', playstation: 'Cross', general: 'Bottom Face Button' },
  1: { xbox: 'B', playstation: 'Circle', general: 'Right Face Button' },
  2: { xbox: 'X', playstation: 'Square', general: 'Left Face Button' },
  3: { xbox: 'Y', playstation: 'Triangle', general: 'Top Face Button' },
  4: { xbox: 'LB', playstation: 'L1', general: 'Left Shoulder Bumper' },
  5: { xbox: 'RB', playstation: 'R1', general: 'Right Shoulder Bumper' },
  6: { xbox: 'LT', playstation: 'L2', general: 'Left Trigger' },
  7: { xbox: 'RT', playstation: 'R2', general: 'Right Trigger' },
  8: { xbox: 'View / Back', playstation: 'Share / Create', general: 'Select / Back' },
  9: { xbox: 'Menu / Start', playstation: 'Options', general: 'Start' },
  10: { xbox: 'LS Click', playstation: 'L3', general: 'Left Stick Click' },
  11: { xbox: 'RS Click', playstation: 'R3', general: 'Right Stick Click' },
  12: { xbox: 'D-Pad Up', playstation: 'D-Pad Up', general: 'Directional Up' },
  13: { xbox: 'D-Pad Down', playstation: 'D-Pad Down', general: 'Directional Down' },
  14: { xbox: 'D-Pad Left', playstation: 'D-Pad Left', general: 'Directional Left' },
  15: { xbox: 'D-Pad Right', playstation: 'D-Pad Right', general: 'Directional Right' },
  16: { xbox: 'Xbox Guide', playstation: 'PS Button', general: 'Home / System' },
};

export function normalizeStickInput(rawX: number, rawY: number, deadzone = 0.08): NormalizedStickPosition {
  // Clamp inputs to [-1, 1]
  const x = Math.max(-1, Math.min(1, rawX));
  const y = Math.max(-1, Math.min(1, rawY));

  const magnitude = Math.min(1, Math.sqrt(x * x + y * y));
  const inDeadzone = magnitude <= deadzone;

  // Calculate angle in degrees (0 = right, 90 = down, 180 = left, 270 = up in screen coordinates)
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  if (angle < 0) angle += 360;

  return {
    x: Math.round(x * 1000) / 1000,
    y: Math.round(y * 1000) / 1000,
    magnitude: Math.round(magnitude * 1000) / 1000,
    angleDegrees: Math.round(angle * 10) / 10,
    inDeadzone,
  };
}

export function calculatePollingRate(timestampDeltasMs: number[]): { pollingRateHz: number; meanDeltaMs: number } {
  const validDeltas = timestampDeltasMs.filter((d) => isFinite(d) && d > 0 && d < 100);
  if (validDeltas.length === 0) {
    return { pollingRateHz: 0, meanDeltaMs: 0 };
  }

  const meanDelta = validDeltas.reduce((a, b) => a + b, 0) / validDeltas.length;
  const pollingRateHz = meanDelta > 0 ? Math.round(1000 / meanDelta) : 0;

  return {
    pollingRateHz,
    meanDeltaMs: Math.round(meanDelta * 100) / 100,
  };
}
