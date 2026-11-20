import { describe, it, expect } from 'vitest';
import { detectSwitchChatter, calculateCpsRate, classifyScrollDelta } from './logic';

describe('Mouse & Touchscreen Tester Logic', () => {
  it('detects mechanical switch double-click chatter', () => {
    // 35ms between release and next press indicates switch debounce defect
    expect(detectSwitchChatter(1000, 1035, 75)).toBe(true);
    // 150ms is intentional human double click
    expect(detectSwitchChatter(1000, 1150, 75)).toBe(false);
  });

  it('calculates clicks per second (CPS) window rate', () => {
    const clicks = [1000, 1200, 1400, 1600, 1800, 2000];
    const cps = calculateCpsRate(clicks, 5000);
    expect(cps).toBeGreaterThanOrEqual(5.0);
  });

  it('classifies mouse wheel directions and tick counts', () => {
    expect(classifyScrollDelta(-100).direction).toBe('UP');
    expect(classifyScrollDelta(300).direction).toBe('DOWN');
    expect(classifyScrollDelta(300).ticks).toBe(3);
  });
});
