export function validatePdfBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 5) return false;
  // %PDF-
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;
}

export function reorderPageIndices(originalCount: number, newOrder: number[]): number[] {
  if (originalCount <= 0) return [];
  const valid = newOrder.filter(idx => idx >= 0 && idx < originalCount);
  const seen = new Set(valid);
  for (let i = 0; i < originalCount; i++) {
    if (!seen.has(i)) valid.push(i);
  }
  return valid;
}

export function calculateTotalSize(sizes: number[]): { bytes: number; formatted: string } {
  const bytes = sizes.reduce((acc, s) => acc + (s > 0 ? s : 0), 0);
  if (bytes < 1024) return { bytes, formatted: `${bytes} B` };
  if (bytes < 1024 * 1024) return { bytes, formatted: `${(bytes / 1024).toFixed(1)} KB` };
  return { bytes, formatted: `${(bytes / (1024 * 1024)).toFixed(2)} MB` };
}
