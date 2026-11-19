/**
 * Game Download Time and Data Usage Calculator logic
 */

export interface DownloadCalculationParams {
  fileSizeGb: number;
  speedMbps: number;
  overheadPercent?: number; // e.g. 10 for 10%
  dataCapGb?: number; // optional monthly cap in GB
}

export interface DownloadCalculationResult {
  idealSeconds: number;
  realWorldSeconds: number;
  idealFormatted: string;
  realWorldFormatted: string;
  transferRateMBps: number;
  capPercentUsed: number | null;
  capRemainingGb: number | null;
}

export function formatDuration(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds <= 0) {
    return '0s';
  }

  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / 3600) % 24);
  const days = Math.floor(totalSeconds / 86400);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

export function calculateDownloadTime(params: DownloadCalculationParams): DownloadCalculationResult {
  const { fileSizeGb, speedMbps, overheadPercent = 10, dataCapGb } = params;

  if (fileSizeGb <= 0 || speedMbps <= 0) {
    return {
      idealSeconds: 0,
      realWorldSeconds: 0,
      idealFormatted: '0s',
      realWorldFormatted: '0s',
      transferRateMBps: 0,
      capPercentUsed: null,
      capRemainingGb: null,
    };
  }

  // 1 GB = 1024 MB = 8192 Mb
  const totalMbits = fileSizeGb * 8192;
  const idealSeconds = totalMbits / speedMbps;

  // Real-world effective throughput accounts for TCP/IP, TLS handshake, packet retransmission, SSD write queue
  const efficiency = Math.max(0.01, 1 - overheadPercent / 100);
  const effectiveSpeedMbps = speedMbps * efficiency;
  const realWorldSeconds = totalMbits / effectiveSpeedMbps;

  // Transfer speed in Megabytes per second (MB/s)
  const transferRateMBps = effectiveSpeedMbps / 8;

  let capPercentUsed: number | null = null;
  let capRemainingGb: number | null = null;

  if (typeof dataCapGb === 'number' && dataCapGb > 0) {
    capPercentUsed = (fileSizeGb / dataCapGb) * 100;
    capRemainingGb = Math.max(0, dataCapGb - fileSizeGb);
  }

  return {
    idealSeconds: Math.round(idealSeconds),
    realWorldSeconds: Math.round(realWorldSeconds),
    idealFormatted: formatDuration(idealSeconds),
    realWorldFormatted: formatDuration(realWorldSeconds),
    transferRateMBps: Math.round(transferRateMBps * 100) / 100,
    capPercentUsed: capPercentUsed !== null ? Math.round(capPercentUsed * 10) / 10 : null,
    capRemainingGb: capRemainingGb !== null ? Math.round(capRemainingGb * 10) / 10 : null,
  };
}
