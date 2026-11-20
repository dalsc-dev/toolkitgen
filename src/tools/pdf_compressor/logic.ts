export interface CompressionSettings {
  dpi: number;
  quality: number;
  scale: number;
}

export function calculateCompressionSettings(preset: 'high_compression' | 'balanced' | 'high_quality'): CompressionSettings {
  switch (preset) {
    case 'high_compression':
      return { dpi: 72, quality: 0.5, scale: 0.6 };
    case 'balanced':
      return { dpi: 150, quality: 0.75, scale: 0.85 };
    case 'high_quality':
    default:
      return { dpi: 300, quality: 0.9, scale: 1.0 };
  }
}

export function calculateSavings(originalBytes: number, compressedBytes: number): { savedBytes: number; percent: number } {
  if (originalBytes <= 0 || compressedBytes < 0) return { savedBytes: 0, percent: 0 };
  const savedBytes = Math.max(0, originalBytes - compressedBytes);
  const percent = Math.min(100, Math.round((savedBytes / originalBytes) * 100));
  return { savedBytes, percent };
}
