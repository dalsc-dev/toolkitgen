export function detectSwitchChatter(
  previousReleaseMs: number,
  currentPressMs: number,
  chatterThresholdMs: number = 75
): boolean {
  if (previousReleaseMs <= 0 || currentPressMs <= 0) return false;
  const delta = currentPressMs - previousReleaseMs;
  return delta > 0 && delta <= chatterThresholdMs;
}

export function calculateCpsRate(clickTimestamps: number[], windowMs: number = 5000): number {
  if (clickTimestamps.length < 2) return clickTimestamps.length;
  const now = clickTimestamps[clickTimestamps.length - 1];
  const windowStart = now - windowMs;
  const clicksInWindow = clickTimestamps.filter(t => t >= windowStart).length;
  const elapsedSec = Math.max(0.5, Math.min(windowMs / 1000, (now - clickTimestamps[0]) / 1000));
  return Number((clicksInWindow / elapsedSec).toFixed(1));
}

export function classifyScrollDelta(deltaY: number): { direction: 'UP' | 'DOWN' | 'NEUTRAL'; ticks: number } {
  if (deltaY === 0) return { direction: 'NEUTRAL', ticks: 0 };
  const direction = deltaY < 0 ? 'UP' : 'DOWN';
  const ticks = Math.max(1, Math.round(Math.abs(deltaY) / 100));
  return { direction, ticks };
}
