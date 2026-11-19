import { describe, it, expect } from 'vitest';
import { generateSessionSchedule } from './logic';

describe('Long Gaming Session Planner Logic', () => {
  it('generates an accurate breakdown for a 3-hour gaming session', () => {
    // 3 hours = 180 minutes
    // 20-min intervals: 9 checkpoints total (at 20, 40, 60, 80, 100, 120, 140, 160, 180 mins)
    // Physical breaks at 60, 120, 180 (3 breaks)
    // Eye rests at 20, 40, 80, 100, 140, 160 (6 eye rests)
    // Hydration: 3 * 275 = 825 ml (~3 glasses)
    const plan = generateSessionSchedule(3);

    expect(plan.sessionDurationHours).toBe(3);
    expect(plan.totalTwentyTwentyCount).toBe(9);
    expect(plan.totalPhysicalBreaksCount).toBe(3);
    expect(plan.totalHydrationMl).toBe(825);
    expect(plan.waterGlassesCount).toBe(3);
    expect(plan.timelineCheckpoints).toHaveLength(9);

    const physicalBreaks = plan.timelineCheckpoints.filter((c) => c.type === 'physical_break');
    expect(physicalBreaks).toHaveLength(3);
    expect(physicalBreaks[0].minute).toBe(60);
  });

  it('clamps extreme inputs safely', () => {
    const minPlan = generateSessionSchedule(0.1);
    expect(minPlan.sessionDurationHours).toBe(0.5);

    const maxPlan = generateSessionSchedule(24);
    expect(maxPlan.sessionDurationHours).toBe(16);
  });
});
