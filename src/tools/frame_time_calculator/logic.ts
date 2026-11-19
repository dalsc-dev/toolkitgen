/**
 * Frame Time Calculator logic
 */

export interface FrameTimePercentiles {
  totalFrames: number;
  meanFrameTimeMs: number;
  meanFps: number;
  percentile99FrameTimeMs: number; // Corresponds to 1% low
  onePercentLowFps: number;
  percentile999FrameTimeMs: number; // Corresponds to 0.1% low
  pointOnePercentLowFps: number;
  stdDevMs: number;
  minFrameTimeMs: number;
  maxFrameTimeMs: number;
  stutterCount: number;
}

export function fpsToFrameTimeMs(fps: number): number {
  if (fps <= 0) return 0;
  return Math.round((1000 / fps) * 100) / 100;
}

export function frameTimeToFps(frameTimeMs: number): number {
  if (frameTimeMs <= 0) return 0;
  return Math.round((1000 / frameTimeMs) * 100) / 100;
}

export function parseFrameTimesInput(rawText: string, inputType: 'frame_time_ms' | 'fps' = 'frame_time_ms'): number[] {
  if (!rawText || typeof rawText !== 'string') return [];

  const tokens = rawText.split(/[\s,;\n\r]+/);
  const values: number[] = [];

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    const num = parseFloat(trimmed);
    if (!isFinite(num) || num <= 0) continue;

    if (inputType === 'fps') {
      // Convert FPS to frame time ms
      values.push(1000 / num);
    } else {
      values.push(num);
    }
  }

  return values;
}

export function calculateFrameTimeStats(frameTimesMs: number[]): FrameTimePercentiles {
  const valid = frameTimesMs.filter((t) => isFinite(t) && t > 0 && t < 1000);
  if (valid.length === 0) {
    return {
      totalFrames: 0,
      meanFrameTimeMs: 0,
      meanFps: 0,
      percentile99FrameTimeMs: 0,
      onePercentLowFps: 0,
      percentile999FrameTimeMs: 0,
      pointOnePercentLowFps: 0,
      stdDevMs: 0,
      minFrameTimeMs: 0,
      maxFrameTimeMs: 0,
      stutterCount: 0,
    };
  }

  const sorted = [...valid].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const meanFrameTime = sum / count;
  const meanFps = meanFrameTime > 0 ? 1000 / meanFrameTime : 0;

  // 1% Low is the 99th percentile of frame time (the slowest 1% of frames)
  const idx99 = Math.min(count - 1, Math.floor(count * 0.99));
  const p99 = sorted[idx99];
  const onePercentLowFps = p99 > 0 ? 1000 / p99 : 0;

  // 0.1% Low is the 99.9th percentile of frame time
  const idx999 = Math.min(count - 1, Math.floor(count * 0.999));
  const p999 = sorted[idx999];
  const pointOnePercentLowFps = p999 > 0 ? 1000 / p999 : 0;

  // Standard deviation
  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - meanFrameTime, 2), 0) / count;
  const stdDev = Math.sqrt(variance);

  // Micro-stutters: frame time > 1.5x mean
  const stutterThreshold = meanFrameTime * 1.5;
  const stutterCount = sorted.filter((t) => t >= stutterThreshold).length;

  return {
    totalFrames: count,
    meanFrameTimeMs: Math.round(meanFrameTime * 100) / 100,
    meanFps: Math.round(meanFps * 10) / 10,
    percentile99FrameTimeMs: Math.round(p99 * 100) / 100,
    onePercentLowFps: Math.round(onePercentLowFps * 10) / 10,
    percentile999FrameTimeMs: Math.round(p999 * 100) / 100,
    pointOnePercentLowFps: Math.round(pointOnePercentLowFps * 10) / 10,
    stdDevMs: Math.round(stdDev * 100) / 100,
    minFrameTimeMs: Math.round(sorted[0] * 100) / 100,
    maxFrameTimeMs: Math.round(sorted[count - 1] * 100) / 100,
    stutterCount,
  };
}
