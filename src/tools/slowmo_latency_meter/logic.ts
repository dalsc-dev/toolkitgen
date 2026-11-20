/**
 * Slow-Motion Video Input Lag Meter logic
 */

export interface LatencyMeasurement {
  deltaFrames: number;
  latencyMs: number;
  frameIntervalMs: number;
  jitterToleranceMs: number;
  confidenceRating: 'High' | 'Medium' | 'Low';
  tier: 'Esports Tier (< 15ms)' | 'Fast Gaming (< 35ms)' | 'Standard (< 65ms)' | 'Noticeable Input Lag (> 65ms)';
}

export function calculateInputLag(
  pressFrame: number,
  reactionFrame: number,
  cameraFps: number
): LatencyMeasurement {
  const safeFps = Math.max(24, cameraFps);
  const deltaFrames = Math.max(0, reactionFrame - pressFrame);
  const frameIntervalMs = 1000 / safeFps;
  const rawLatencyMs = (deltaFrames / safeFps) * 1000;
  const latencyMs = Math.round(rawLatencyMs * 10) / 10;
  const jitterToleranceMs = Math.round((frameIntervalMs / 2) * 10) / 10;

  let confidenceRating: 'High' | 'Medium' | 'Low' = 'High';
  if (safeFps >= 240) {
    confidenceRating = 'High';
  } else if (safeFps >= 120) {
    confidenceRating = 'Medium';
  } else {
    confidenceRating = 'Low';
  }

  let tier: 'Esports Tier (< 15ms)' | 'Fast Gaming (< 35ms)' | 'Standard (< 65ms)' | 'Noticeable Input Lag (> 65ms)' =
    'Standard (< 65ms)';
  if (latencyMs < 15.0) {
    tier = 'Esports Tier (< 15ms)';
  } else if (latencyMs < 35.0) {
    tier = 'Fast Gaming (< 35ms)';
  } else if (latencyMs < 65.0) {
    tier = 'Standard (< 65ms)';
  } else {
    tier = 'Noticeable Input Lag (> 65ms)';
  }

  return {
    deltaFrames,
    latencyMs,
    frameIntervalMs: Math.round(frameIntervalMs * 100) / 100,
    jitterToleranceMs,
    confidenceRating,
    tier,
  };
}

export function formatMeasurementReport(data: {
  pressFrame: number;
  reactionFrame: number;
  cameraFps: number;
  measurement: LatencyMeasurement;
}): string {
  const date = new Date().toISOString().split('T')[0];
  return [
    `=== ToolkitGen Optical Input Lag Report ===`,
    `Date: ${date}`,
    `Camera Recording Rate: ${data.cameraFps} FPS (Frame Interval: ${data.measurement.frameIntervalMs} ms)`,
    `Initial Button Actuation: Frame ${data.pressFrame}`,
    `First Pixel Reaction: Frame ${data.reactionFrame}`,
    `Elapsed Difference: ${data.measurement.deltaFrames} frames`,
    `End-to-End Latency: ${data.measurement.latencyMs} ms (±${data.measurement.jitterToleranceMs} ms)`,
    `Responsiveness Tier: ${data.measurement.tier}`,
    `Confidence Score: ${data.measurement.confidenceRating}`,
    `Diagnostic URL: https://toolkitgen.com/tool/slowmo_latency_meter`,
  ].join('\n');
}
