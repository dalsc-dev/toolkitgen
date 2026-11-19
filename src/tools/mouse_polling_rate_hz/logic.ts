export function calculatePollingRate(timestamps: number[]): {
  hz: number;
  jitterMs: number;
  sampleCount: number;
} {
  if (timestamps.length < 2) {
    return { hz: 0, jitterMs: 0, sampleCount: timestamps.length };
  }

  const intervals: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    const dt = timestamps[i] - timestamps[i - 1];
    if (dt > 0) {
      intervals.push(dt);
    }
  }

  if (intervals.length === 0) {
    return { hz: 0, jitterMs: 0, sampleCount: timestamps.length };
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const hz = avgInterval > 0 ? Math.round(1000 / avgInterval) : 0;

  // Jitter (standard deviation)
  const variance =
    intervals.reduce((acc, dt) => acc + Math.pow(dt - avgInterval, 2), 0) /
    intervals.length;
  const jitterMs = Math.round(Math.sqrt(variance) * 100) / 100;

  return {
    hz,
    jitterMs,
    sampleCount: intervals.length,
  };
}
