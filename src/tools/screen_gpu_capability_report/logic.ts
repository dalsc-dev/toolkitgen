export function calculateAspectRatioGcd(width: number, height: number): string {
  if (width <= 0 || height <= 0) return 'Unknown';
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }
  const divisor = gcd(width, height);
  const rW = width / divisor;
  const rH = height / divisor;

  // Recognize common display ratios
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.03) return '16:9 (Widescreen)';
  if (Math.abs(ratio - 16 / 10) < 0.03) return '16:10 (Productivity)';
  if (Math.abs(ratio - 21 / 9) < 0.1 || Math.abs(ratio - 43 / 18) < 0.02) return '21:9 (Ultrawide)';
  if (Math.abs(ratio - 32 / 9) < 0.1) return '32:9 (Super Ultrawide)';
  if (Math.abs(ratio - 4 / 3) < 0.03) return '4:3 (Legacy)';
  return `${rW}:${rH}`;
}

export function classifyDpr(dpr: number): string {
  if (dpr <= 1.0) return 'Standard Density (1x)';
  if (dpr <= 1.5) return 'Medium High DPI (1.25x - 1.5x)';
  if (dpr <= 2.0) return 'Retina / HiDPI (2x)';
  return `Ultra-Density (${dpr}x)`;
}

export function classifyColorGamut(p3Supported: boolean, rec2020Supported: boolean): string {
  if (rec2020Supported) return 'Rec. 2020 (Ultra-Wide Gamut HDR)';
  if (p3Supported) return 'DCI-P3 (Wide Color Gamut)';
  return 'sRGB (Standard Dynamic Gamut)';
}
