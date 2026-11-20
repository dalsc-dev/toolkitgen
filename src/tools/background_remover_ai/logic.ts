export function colorDistanceRgb(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function isBackgroundPixel(
  r: number,
  g: number,
  b: number,
  targetR: number,
  targetG: number,
  targetB: number,
  tolerance: number
): boolean {
  return colorDistanceRgb(r, g, b, targetR, targetG, targetB) <= tolerance;
}

export function calculateAlphaBoundingBox(
  alphaChannel: Uint8ClampedArray,
  width: number,
  height: number
): { minX: number; minY: number; maxX: number; maxY: number; hasContent: boolean } {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4 + 3; // alpha index
      if (alphaChannel[idx] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const hasContent = maxX >= minX && maxY >= minY;
  return { minX: hasContent ? minX : 0, minY: hasContent ? minY : 0, maxX: hasContent ? maxX : 0, maxY: hasContent ? maxY : 0, hasContent };
}
