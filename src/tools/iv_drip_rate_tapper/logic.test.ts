import { describe, it, expect } from 'vitest';
import { calculateIvDripRate } from './logic';

describe('IV Drip Rate Clinical Math', () => {
  it('correctly calculates 1000 mL over 8 hours with 15 gtt/mL macro set', () => {
    const result = calculateIvDripRate({
      volumeMl: 1000,
      hours: 8,
      minutes: 0,
      dropFactorGttPerMl: 15,
      tubingFactor: 1.0,
    });

    expect(result.totalMinutes).toBe(480);
    expect(result.totalHours).toBe(8);
    expect(result.flowRateMlPerHour).toBe(125); // 1000 / 8 = 125
    expect(result.dripRateGttPerMin).toBe(31);  // (1000 * 15) / 480 = 31.25 -> 31
    expect(result.volumeAtIntervals.min60).toBe(125);
    expect(result.volumeAtIntervals.min120).toBe(250);
  });

  it('correctly calculates pediatric microdrip 500 mL over 5 hours with 60 gtt/mL', () => {
    const result = calculateIvDripRate({
      volumeMl: 500,
      hours: 5,
      minutes: 0,
      dropFactorGttPerMl: 60,
    });

    expect(result.flowRateMlPerHour).toBe(100);
    // With 60 gtt/mL, gtt/min equals mL/hr
    expect(result.dripRateGttPerMin).toBe(100);
  });

  it('handles rapid blood bolus 250 mL over 30 minutes with 10 gtt/mL', () => {
    const result = calculateIvDripRate({
      volumeMl: 250,
      hours: 0,
      minutes: 30,
      dropFactorGttPerMl: 10,
    });

    expect(result.totalMinutes).toBe(30);
    expect(result.flowRateMlPerHour).toBe(500); // 250 / 0.5 = 500
    expect(result.dripRateGttPerMin).toBe(83);  // (250 * 10) / 30 = 83.33 -> 83
  });

  it('safely handles zero volume or zero duration without division by zero', () => {
    const zeroDuration = calculateIvDripRate({
      volumeMl: 1000,
      hours: 0,
      minutes: 0,
      dropFactorGttPerMl: 15,
    });
    expect(zeroDuration.flowRateMlPerHour).toBe(0);
    expect(zeroDuration.dripRateGttPerMin).toBe(0);

    const zeroVolume = calculateIvDripRate({
      volumeMl: 0,
      hours: 4,
      minutes: 0,
      dropFactorGttPerMl: 20,
    });
    expect(zeroVolume.flowRateMlPerHour).toBe(0);
  });
});
