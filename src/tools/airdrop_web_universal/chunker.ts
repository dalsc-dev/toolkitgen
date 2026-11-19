export const DEFAULT_CHUNK_SIZE = 64 * 1024; // 64 KB optimal for WebRTC DataChannels

export interface TransferStats {
  bytesTransferred: number;
  totalBytes: number;
  progressPercent: number;
  speedMbps: number;
  etaSeconds: number;
}

export function calculateTotalChunks(fileSize: number, chunkSize: number = DEFAULT_CHUNK_SIZE): number {
  if (fileSize <= 0) return 0;
  return Math.ceil(fileSize / chunkSize);
}

export function calculateProgress(bytesTransferred: number, totalBytes: number): number {
  if (totalBytes <= 0) return 100;
  const pct = (bytesTransferred / totalBytes) * 100;
  return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
}

export function calculateTransferStats(
  bytesTransferred: number,
  totalBytes: number,
  elapsedSeconds: number
): TransferStats {
  const progressPercent = calculateProgress(bytesTransferred, totalBytes);
  const speedBytesPerSec = elapsedSeconds > 0 ? bytesTransferred / elapsedSeconds : 0;
  const speedMbps = Math.round((speedBytesPerSec / (1024 * 1024)) * 10) / 10;
  const remainingBytes = Math.max(0, totalBytes - bytesTransferred);
  const etaSeconds = speedBytesPerSec > 0 ? Math.ceil(remainingBytes / speedBytesPerSec) : 0;

  return {
    bytesTransferred,
    totalBytes,
    progressPercent,
    speedMbps,
    etaSeconds,
  };
}

export function generateRoomPin(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return String(digits);
}
