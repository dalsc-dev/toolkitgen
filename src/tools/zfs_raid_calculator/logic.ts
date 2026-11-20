export type ZfsLayout = 'stripe' | 'mirror' | 'raidz1' | 'raidz2' | 'raidz3';

export interface ZfsCapacityResult {
  rawCapacityTb: number;
  rawCapacityTib: number;
  usableCapacityTb: number;
  usableCapacityTib: number;
  parityOverheadTib: number;
  safePoolLimitTib: number; // 80% rule
  faultToleranceDrives: number;
}

export function calculateZfsCapacity(
  diskCount: number,
  diskSizeTb: number,
  layout: ZfsLayout
): ZfsCapacityResult {
  if (diskCount <= 0 || diskSizeTb <= 0) {
    return {
      rawCapacityTb: 0,
      rawCapacityTib: 0,
      usableCapacityTb: 0,
      usableCapacityTib: 0,
      parityOverheadTib: 0,
      safePoolLimitTib: 0,
      faultToleranceDrives: 0
    };
  }

  // 1 TB = 10^12 bytes; 1 TiB = 2^40 bytes. Ratio is ~0.9094947
  const TB_TO_TIB = Math.pow(10, 12) / Math.pow(2, 40);

  const rawCapacityTb = diskCount * diskSizeTb;
  const rawCapacityTib = rawCapacityTb * TB_TO_TIB;

  let usableDisks = diskCount;
  let faultToleranceDrives = 0;

  switch (layout) {
    case 'stripe':
      usableDisks = diskCount;
      faultToleranceDrives = 0;
      break;
    case 'mirror':
      // 2-way mirror assumed
      usableDisks = diskCount / 2;
      faultToleranceDrives = 1;
      break;
    case 'raidz1':
      usableDisks = Math.max(1, diskCount - 1);
      faultToleranceDrives = 1;
      break;
    case 'raidz2':
      usableDisks = Math.max(1, diskCount - 2);
      faultToleranceDrives = 2;
      break;
    case 'raidz3':
      usableDisks = Math.max(1, diskCount - 3);
      faultToleranceDrives = 3;
      break;
  }

  // OpenZFS slop space reservation is approximately 3%
  const SLOP_FACTOR = 0.97;

  const usableCapacityTb = Number((usableDisks * diskSizeTb * SLOP_FACTOR).toFixed(2));
  const usableCapacityTib = Number((usableCapacityTb * TB_TO_TIB).toFixed(2));
  const parityOverheadTib = Number((rawCapacityTib - usableCapacityTib).toFixed(2));
  const safePoolLimitTib = Number((usableCapacityTib * 0.8).toFixed(2));

  return {
    rawCapacityTb,
    rawCapacityTib: Number(rawCapacityTib.toFixed(2)),
    usableCapacityTb,
    usableCapacityTib,
    parityOverheadTib,
    safePoolLimitTib,
    faultToleranceDrives
  };
}

export function calculateSlogL2arcRecommendation(poolTib: number): { slogGb: number; l2arcGb: number } {
  // Slog recommendation: 5 seconds of maximum network throughput or ~16-32GB
  const slogGb = poolTib > 50 ? 64 : poolTib > 10 ? 32 : 16;
  // L2ARC recommendation: ~5x - 10x RAM size or 10-20% of active dataset
  const l2arcGb = Math.round(poolTib * 1024 * 0.05); // 5% of pool
  return { slogGb, l2arcGb };
}
