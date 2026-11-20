export function parseFrameTimeCsv(csvText: string): number[] {
  if (!csvText.trim()) return [];
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(',').map(s => s.trim().replace(/^"|"$/g, ''));
  // Find column for frame time: msbetweenpresents, frametime, frametime_ms, or ms
  let colIdx = header.findIndex(h =>
    h === 'msbetweenpresents' || h === 'frametime' || h === 'frametime_ms' || h === 'ms' || h === 'frametimems'
  );

  const frameTimes: number[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    if (colIdx >= 0 && row[colIdx]) {
      const val = parseFloat(row[colIdx]);
      if (!isNaN(val) && val > 0 && val < 500) frameTimes.push(val);
    } else {
      // Fallback: look for first parseable float > 0
      for (const cell of row) {
        const val = parseFloat(cell);
        if (!isNaN(val) && val > 1 && val < 200) {
          frameTimes.push(val);
          break;
        }
      }
    }
  }

  return frameTimes;
}

export function calculatePercentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0;
  const idx = Math.min(sortedAsc.length - 1, Math.max(0, Math.floor((p / 100) * sortedAsc.length)));
  return sortedAsc[idx];
}

export function calculateBenchmarkSummary(frameTimesMs: number[]): {
  avgFps: number;
  p1LowFps: number;
  p01LowFps: number;
  stutterCount: number;
  stutterPercent: number;
  avgFrameTimeMs: number;
} {
  if (frameTimesMs.length === 0) {
    return { avgFps: 0, p1LowFps: 0, p01LowFps: 0, stutterCount: 0, stutterPercent: 0, avgFrameTimeMs: 0 };
  }

  const sum = frameTimesMs.reduce((a, b) => a + b, 0);
  const avgFrameTimeMs = sum / frameTimesMs.length;
  const avgFps = Math.round(1000 / avgFrameTimeMs);

  // Sort ascending by frame time (larger ms = worse FPS)
  const sorted = [...frameTimesMs].sort((a, b) => a - b);
  // 1% Low is the 99th percentile frame time
  const ms99 = calculatePercentile(sorted, 99);
  const p1LowFps = ms99 > 0 ? Math.round(1000 / ms99) : 0;

  // 0.1% Low is the 99.9th percentile frame time
  const ms999 = calculatePercentile(sorted, 99.9);
  const p01LowFps = ms999 > 0 ? Math.round(1000 / ms999) : 0;

  // Stutter = frame time > 2.5x mean
  const stutterThreshold = avgFrameTimeMs * 2.5;
  const stutterCount = frameTimesMs.filter(t => t > stutterThreshold).length;
  const stutterPercent = Number(((stutterCount / frameTimesMs.length) * 100).toFixed(2));

  return { avgFps, p1LowFps, p01LowFps, stutterCount, stutterPercent, avgFrameTimeMs: Number(avgFrameTimeMs.toFixed(2)) };
}
