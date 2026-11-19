/**
 * Long Gaming Session Planner logic
 */

export interface SessionPlanSchedule {
  sessionDurationHours: number;
  totalTwentyTwentyCount: number; // 20-20-20 eye rests
  totalPhysicalBreaksCount: number; // 5-minute movement breaks (every 60 mins)
  totalHydrationMl: number; // Baseline water intake
  waterGlassesCount: number; // Approx 250ml glasses
  timelineCheckpoints: Array<{
    minute: number;
    type: 'eye_rest' | 'physical_break' | 'hydration';
    action: string;
  }>;
}

export function generateSessionSchedule(durationHours: number): SessionPlanSchedule {
  const safeHours = Math.max(0.5, Math.min(16, durationHours));
  const totalMinutes = Math.round(safeHours * 60);

  // 20-20-20 rule: every 20 minutes (excluding minute 0 and ending minute)
  const totalTwentyTwentyCount = Math.floor(totalMinutes / 20);

  // Physical movement break every 60 minutes
  const totalPhysicalBreaksCount = Math.floor(totalMinutes / 60);

  // Baseline sedentary hydration: 275 ml per hour
  const totalHydrationMl = Math.round(safeHours * 275);
  const waterGlassesCount = Math.max(1, Math.round(totalHydrationMl / 250));

  const timelineCheckpoints: SessionPlanSchedule['timelineCheckpoints'] = [];

  for (let m = 20; m <= totalMinutes; m += 20) {
    if (m % 60 === 0) {
      timelineCheckpoints.push({
        minute: m,
        type: 'physical_break',
        action: `5-minute physical movement break, stand up, stretch wrists, and drink 250ml water (Hour ${m / 60}).`,
      });
    } else {
      timelineCheckpoints.push({
        minute: m,
        type: 'eye_rest',
        action: `20-20-20 rest: Look at an object at least 20 feet away for 20 seconds.`,
      });
    }
  }

  return {
    sessionDurationHours: safeHours,
    totalTwentyTwentyCount,
    totalPhysicalBreaksCount,
    totalHydrationMl,
    waterGlassesCount,
    timelineCheckpoints,
  };
}
