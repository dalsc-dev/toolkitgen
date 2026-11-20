export interface PollingStats {
  hz: number;
  jitterMs: number;
  sampleCount: number;
  targetHz?: number;
  stabilityScore?: number;
  verdict?: 'PASS' | 'STABLE' | 'JITTERY';
}

export function calculatePollingRate(
  timestamps: number[],
  targetHz?: number
): PollingStats {
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

  const result: PollingStats = {
    hz,
    jitterMs,
    sampleCount: intervals.length,
  };

  if (targetHz && targetHz > 0) {
    const expectedIntervalMs = 1000 / targetHz;
    // Jitter as a percentage of expected interval
    const jitterPercent = Math.round((jitterMs / expectedIntervalMs) * 100);
    result.targetHz = targetHz;
    result.stabilityScore = Math.max(0, 100 - jitterPercent);

    // USB-IF HID specifications allow ±5% variation for standard HID endpoints.
    // In high-refresh environments, jitter < 15% is stable; > 25% is jittery.
    if (jitterPercent <= 10) {
      result.verdict = 'PASS';
    } else if (jitterPercent <= 25) {
      result.verdict = 'STABLE';
    } else {
      result.verdict = 'JITTERY';
    }
  }

  return result;
}

export function generatePollingReport(stats: {
  currentHz: number;
  peakHz: number;
  avgHz: number;
  minDeltaMs: number;
  jitterMs: number;
  sampleCount: number;
  targetHz?: number;
  connectionType?: 'wired' | 'wireless';
}): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const targetLine = stats.targetHz ? `Target Rate: ${stats.targetHz} Hz\n` : '';
  const connLine = stats.connectionType ? `Connection: ${stats.connectionType.toUpperCase()}\n` : '';
  
  return [
    `=== ToolkitGen Mouse Polling Rate Benchmark ===`,
    `Date: ${dateStr}`,
    connLine,
    targetLine,
    `Current Hz: ${stats.currentHz} Hz`,
    `Peak Hz: ${stats.peakHz} Hz`,
    `Average Hz: ${stats.avgHz} Hz`,
    `Min Delta: ${stats.minDeltaMs.toFixed(2)} ms`,
    `Jitter (StdDev): ${stats.jitterMs.toFixed(2)} ms`,
    `Total Samples: ${stats.sampleCount}`,
    `Standard: Aligned with USB-IF HID & W3C Performance Timeline`,
    `Audited via: https://toolkitgen.com/tool/mouse_polling_rate_hz`,
    `===============================================`,
  ].filter(Boolean).join('\n');
}
