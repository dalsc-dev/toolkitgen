/**
 * Pure clinical math for IV drip rate and flow rate calculations.
 */

export interface IvCalculationInput {
  volumeMl: number;
  hours: number;
  minutes: number;
  dropFactorGttPerMl: number; // e.g. 10, 15, 20, 60
  tubingFactor?: number;      // default 1.0
}

export interface IvCalculationResult {
  totalMinutes: number;
  totalHours: number;
  flowRateMlPerHour: number;
  dripRateGttPerMin: number;
  volumeAtIntervals: {
    min30: number;
    min60: number;
    min120: number;
    min240: number;
  };
}

export function calculateIvDripRate(input: IvCalculationInput): IvCalculationResult {
  const { volumeMl, hours, minutes, dropFactorGttPerMl, tubingFactor = 1.0 } = input;
  const totalMinutes = (hours * 60) + minutes;

  if (totalMinutes <= 0 || volumeMl <= 0) {
    return {
      totalMinutes: 0,
      totalHours: 0,
      flowRateMlPerHour: 0,
      dripRateGttPerMin: 0,
      volumeAtIntervals: { min30: 0, min60: 0, min120: 0, min240: 0 },
    };
  }

  const totalHours = totalMinutes / 60;
  const flowRateMlPerHour = Math.round(volumeMl / totalHours);
  const dripRateGttPerMin = Math.round((volumeMl * dropFactorGttPerMl * tubingFactor) / totalMinutes);

  return {
    totalMinutes,
    totalHours,
    flowRateMlPerHour,
    dripRateGttPerMin,
    volumeAtIntervals: {
      min30: Math.round((30 / totalMinutes) * volumeMl),
      min60: Math.round((60 / totalMinutes) * volumeMl),
      min120: Math.round((120 / totalMinutes) * volumeMl),
      min240: Math.round((240 / totalMinutes) * volumeMl),
    },
  };
}
