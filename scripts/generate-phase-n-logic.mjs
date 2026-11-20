import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const tools = [
  {
    slug: 'pdf_merge_reorder',
    logic: `export function validatePdfBytes(bytes: Uint8Array): boolean {
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
  if (bytes < 1024) return { bytes, formatted: \`\${bytes} B\` };
  if (bytes < 1024 * 1024) return { bytes, formatted: \`\${(bytes / 1024).toFixed(1)} KB\` };
  return { bytes, formatted: \`\${(bytes / (1024 * 1024)).toFixed(2)} MB\` };
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { validatePdfBytes, reorderPageIndices, calculateTotalSize } from './logic';

describe('PDF Merge & Reorder Logic', () => {
  it('validates PDF magic header', () => {
    const valid = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x37]);
    const invalid = new Uint8Array([0x89, 0x50, 0x4E, 0x47]);
    expect(validatePdfBytes(valid)).toBe(true);
    expect(validatePdfBytes(invalid)).toBe(false);
  });

  it('reorders page indices and appends missing indices', () => {
    expect(reorderPageIndices(4, [2, 0])).toEqual([2, 0, 1, 3]);
    expect(reorderPageIndices(3, [1, 2, 0])).toEqual([1, 2, 0]);
    expect(reorderPageIndices(0, [1])).toEqual([]);
  });

  it('formats combined file sizes correctly', () => {
    expect(calculateTotalSize([500, 200]).formatted).toBe('700 B');
    expect(calculateTotalSize([1024 * 500]).formatted).toBe('500.0 KB');
    expect(calculateTotalSize([1024 * 1024 * 4.5]).formatted).toBe('4.50 MB');
  });
});
`
  },
  {
    slug: 'pdf_split_pages',
    logic: `export function parsePageRanges(input: string, maxPages: number): number[] {
  if (!input.trim() || maxPages <= 0) return [];
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  const result = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const s = Math.max(1, Math.min(start, end));
        const e = Math.min(maxPages, Math.max(start, end));
        for (let i = s; i <= e; i++) result.add(i);
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        result.add(page);
      }
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

export function generateSplitChunks(totalPages: number, chunkSize: number): Array<{ start: number; end: number }> {
  if (totalPages <= 0 || chunkSize <= 0) return [];
  const chunks: Array<{ start: number; end: number }> = [];
  let current = 1;
  while (current <= totalPages) {
    const end = Math.min(totalPages, current + chunkSize - 1);
    chunks.push({ start: current, end });
    current = end + 1;
  }
  return chunks;
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { parsePageRanges, generateSplitChunks } from './logic';

describe('PDF Split Logic', () => {
  it('parses individual pages and ranges correctly', () => {
    expect(parsePageRanges('1-3, 5, 8-10', 10)).toEqual([1, 2, 3, 5, 8, 9, 10]);
    expect(parsePageRanges('4, 2, 4', 5)).toEqual([2, 4]);
  });

  it('clamps out of bounds pages to maxPages', () => {
    expect(parsePageRanges('1-100', 5)).toEqual([1, 2, 3, 4, 5]);
    expect(parsePageRanges('0, -1, 10', 5)).toEqual([]);
  });

  it('generates uniform page chunk intervals', () => {
    expect(generateSplitChunks(10, 3)).toEqual([
      { start: 1, end: 3 },
      { start: 4, end: 6 },
      { start: 7, end: 9 },
      { start: 10, end: 10 }
    ]);
  });
});
`
  },
  {
    slug: 'pdf_compressor',
    logic: `export interface CompressionSettings {
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
`,
    test: `import { describe, it, expect } from 'vitest';
import { calculateCompressionSettings, calculateSavings } from './logic';

describe('PDF Compressor Logic', () => {
  it('assigns correct compression profiles', () => {
    expect(calculateCompressionSettings('high_compression').dpi).toBe(72);
    expect(calculateCompressionSettings('balanced').quality).toBe(0.75);
    expect(calculateCompressionSettings('high_quality').scale).toBe(1.0);
  });

  it('calculates byte savings and compression percentages accurately', () => {
    const res = calculateSavings(1000, 400);
    expect(res.savedBytes).toBe(600);
    expect(res.percent).toBe(60);

    const noSavings = calculateSavings(500, 600);
    expect(noSavings.savedBytes).toBe(0);
    expect(noSavings.percent).toBe(0);
  });
});
`
  },
  {
    slug: 'pdf_metadata_remover',
    logic: `export const SENSITIVE_PDF_FIELDS = [
  'Title',
  'Author',
  'Subject',
  'Keywords',
  'Creator',
  'Producer',
  'CreationDate',
  'ModDate'
];

export function sanitizeInfoDictionary(info: Record<string, string>): { sanitized: Record<string, string>; strippedCount: number } {
  const sanitized: Record<string, string> = {};
  let strippedCount = 0;
  for (const [key, val] of Object.entries(info)) {
    if (SENSITIVE_PDF_FIELDS.includes(key)) {
      strippedCount++;
    } else {
      sanitized[key] = val;
    }
  }
  return { sanitized, strippedCount };
}

export function redactStringMetadata(rawText: string): string {
  let cleaned = rawText;
  cleaned = cleaned.replace(/\\/(Author|Creator|Producer|Keywords|Subject)\\s*\\([^)]*\\)/gi, '');
  cleaned = cleaned.replace(/\\/(CreationDate|ModDate)\\s*\\(D:[^)]*\\)/gi, '');
  return cleaned;
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { sanitizeInfoDictionary, redactStringMetadata, SENSITIVE_PDF_FIELDS } from './logic';

describe('PDF Metadata Scrubber Logic', () => {
  it('strips all sensitive metadata fields from dictionary', () => {
    const info = {
      Title: 'Quarterly Report',
      Author: 'Executive Jane Doe',
      Producer: 'Adobe Acrobat Pro 2024',
      NonSensitiveField: 'CustomValue'
    };
    const { sanitized, strippedCount } = sanitizeInfoDictionary(info);
    expect(strippedCount).toBe(3);
    expect(sanitized.Author).toBeUndefined();
    expect(sanitized.NonSensitiveField).toBe('CustomValue');
  });

  it('redacts PDF metadata tags in string buffers', () => {
    const raw = '/Author (Jane Doe) /Producer (Acrobat) /Other (Clean)';
    const result = redactStringMetadata(raw);
    expect(result).not.toContain('Jane Doe');
    expect(result).not.toContain('Acrobat');
    expect(result).toContain('/Other (Clean)');
  });
});
`
  },
  {
    slug: 'image_compressor_converter',
    logic: `export function calculateScaledDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number; scaled: boolean } {
  if (width <= 0 || height <= 0) return { width: 0, height: 0, scaled: false };
  if (maxWidth <= 0 && maxHeight <= 0) return { width, height, scaled: false };

  const targetMaxW = maxWidth > 0 ? maxWidth : width;
  const targetMaxH = maxHeight > 0 ? maxHeight : height;

  if (width <= targetMaxW && height <= targetMaxH) {
    return { width, height, scaled: false };
  }

  const ratioW = targetMaxW / width;
  const ratioH = targetMaxH / height;
  const ratio = Math.min(ratioW, ratioH);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
    scaled: true
  };
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(1)} KB\`;
  return \`\${(bytes / (1024 * 1024)).toFixed(2)} MB\`;
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { calculateScaledDimensions, formatByteSize } from './logic';

describe('Image Compressor & Converter Logic', () => {
  it('scales dimensions while preserving aspect ratio', () => {
    const scaled = calculateScaledDimensions(3840, 2160, 1920, 1080);
    expect(scaled.width).toBe(1920);
    expect(scaled.height).toBe(1080);
    expect(scaled.scaled).toBe(true);

    const noScale = calculateScaledDimensions(800, 600, 1920, 1080);
    expect(noScale.width).toBe(800);
    expect(noScale.height).toBe(600);
    expect(noScale.scaled).toBe(false);
  });

  it('formats byte sizes cleanly', () => {
    expect(formatByteSize(450)).toBe('450 B');
    expect(formatByteSize(1024 * 120)).toBe('120.0 KB');
    expect(formatByteSize(1024 * 1024 * 2.25)).toBe('2.25 MB');
  });
});
`
  },
  {
    slug: 'ocr_image_to_text',
    logic: `export function cleanOcrText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/\\r\\n/g, '\\n')
    .replace(/[ \\t]+/g, ' ')
    .replace(/\\n{3,}/g, '\\n\\n')
    .trim();
}

export function calculateOcrWordMetrics(text: string): { words: number; characters: number; lines: number } {
  if (!text.trim()) return { words: 0, characters: 0, lines: 0 };
  const words = text.trim().split(/\\s+/).filter(Boolean).length;
  const characters = text.length;
  const lines = text.split('\\n').filter(l => l.trim().length > 0).length;
  return { words, characters, lines };
}

export function classifyOcrConfidence(confidencePercent: number): 'High' | 'Moderate' | 'Low' {
  if (confidencePercent >= 85) return 'High';
  if (confidencePercent >= 65) return 'Moderate';
  return 'Low';
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { cleanOcrText, calculateOcrWordMetrics, classifyOcrConfidence } from './logic';

describe('OCR Image to Text Logic', () => {
  it('cleans redundant whitespace and line feeds', () => {
    const messy = 'Hello   world!\\r\\n\\n\\n\\nNext   line.';
    expect(cleanOcrText(messy)).toBe('Hello world!\\n\\nNext line.');
  });

  it('calculates word, line, and character counts correctly', () => {
    const text = 'First line text.\\nSecond line with five words.';
    const metrics = calculateOcrWordMetrics(text);
    expect(metrics.lines).toBe(2);
    expect(metrics.words).toBe(8);
  });

  it('classifies OCR confidence levels correctly', () => {
    expect(classifyOcrConfidence(92)).toBe('High');
    expect(classifyOcrConfidence(75)).toBe('Moderate');
    expect(classifyOcrConfidence(50)).toBe('Low');
  });
});
`
  },
  {
    slug: 'background_remover_ai',
    logic: `export function colorDistanceRgb(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
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
`,
    test: `import { describe, it, expect } from 'vitest';
import { colorDistanceRgb, isBackgroundPixel, calculateAlphaBoundingBox } from './logic';

describe('Background Remover Logic', () => {
  it('computes Euclidean RGB distance correctly', () => {
    expect(colorDistanceRgb(255, 255, 255, 255, 255, 255)).toBe(0);
    expect(colorDistanceRgb(0, 0, 0, 3, 4, 0)).toBe(5);
  });

  it('identifies background pixels within tolerance', () => {
    expect(isBackgroundPixel(250, 250, 250, 255, 255, 255, 15)).toBe(true);
    expect(isBackgroundPixel(200, 50, 50, 255, 255, 255, 20)).toBe(false);
  });

  it('determines alpha bounding box boundaries', () => {
    const width = 10;
    const height = 10;
    const data = new Uint8ClampedArray(width * height * 4);
    // Mark pixel at x=3, y=4
    data[(4 * 10 + 3) * 4 + 3] = 255;
    // Mark pixel at x=7, y=8
    data[(8 * 10 + 7) * 4 + 3] = 255;

    const box = calculateAlphaBoundingBox(data, width, height);
    expect(box.hasContent).toBe(true);
    expect(box.minX).toBe(3);
    expect(box.maxX).toBe(7);
    expect(box.minY).toBe(4);
    expect(box.maxY).toBe(8);
  });
});
`
  },
  {
    slug: 'whisper_audio_transcriber',
    logic: `export function formatSrtTimestamp(seconds: number): string {
  const safe = Math.max(0, seconds);
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = Math.floor(safe % 60);
  const ms = Math.floor((safe % 1) * 1000);

  const pad = (n: number, w: number = 2) => String(n).padStart(w, '0');
  return \`\${pad(hrs)}:\${pad(mins)}:\${pad(secs)},\${pad(ms, 3)}\`;
}

export function formatVttTimestamp(seconds: number): string {
  return formatSrtTimestamp(seconds).replace(',', '.');
}

export function calculateSpeakingRate(wordCount: number, durationSeconds: number): { wpm: number; rating: 'Slow' | 'Conversational' | 'Rapid' } {
  if (durationSeconds <= 0 || wordCount <= 0) return { wpm: 0, rating: 'Slow' };
  const minutes = durationSeconds / 60;
  const wpm = Math.round(wordCount / minutes);
  if (wpm < 110) return { wpm, rating: 'Slow' };
  if (wpm <= 165) return { wpm, rating: 'Conversational' };
  return { wpm, rating: 'Rapid' };
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { formatSrtTimestamp, formatVttTimestamp, calculateSpeakingRate } from './logic';

describe('Whisper Audio Transcriber Logic', () => {
  it('formats SRT and VTT timestamps with millisecond accuracy', () => {
    expect(formatSrtTimestamp(65.123)).toBe('00:01:05,123');
    expect(formatVttTimestamp(65.123)).toBe('00:01:05.123');
  });

  it('calculates speaking rate words per minute accurately', () => {
    const normal = calculateSpeakingRate(140, 60);
    expect(normal.wpm).toBe(140);
    expect(normal.rating).toBe('Conversational');

    const rapid = calculateSpeakingRate(200, 60);
    expect(rapid.wpm).toBe(200);
    expect(rapid.rating).toBe('Rapid');
  });
});
`
  },
  {
    slug: 'frametime_csv_analyzer',
    logic: `export function parseFrameTimeCsv(csvText: string): number[] {
  if (!csvText.trim()) return [];
  const lines = csvText.trim().split(/\\r?\\n/);
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
`,
    test: `import { describe, it, expect } from 'vitest';
import { parseFrameTimeCsv, calculateBenchmarkSummary, calculatePercentile } from './logic';

describe('Frame-Time CSV Benchmark Analyzer Logic', () => {
  it('parses PresentMon style CSV columns', () => {
    const csv = \`Application,msBetweenPresents,DateTime
game.exe,16.66,12:00:00
game.exe,16.70,12:00:01
game.exe,33.33,12:00:02\`;
    const times = parseFrameTimeCsv(csv);
    expect(times).toHaveLength(3);
    expect(times[0]).toBeCloseTo(16.66);
  });

  it('calculates average FPS, 1% lows, and stutter counts accurately', () => {
    // 100 frames at 16.66ms (~60 FPS) + 1 stutter at 50ms
    const times = Array(99).fill(16.66);
    times.push(50.0);

    const summary = calculateBenchmarkSummary(times);
    expect(summary.avgFps).toBeGreaterThanOrEqual(58);
    expect(summary.stutterCount).toBe(1);
    expect(summary.p1LowFps).toBeLessThan(summary.avgFps);
  });
});
`
  },
  {
    slug: 'screen_gpu_capability_report',
    logic: `export function calculateAspectRatioGcd(width: number, height: number): string {
  if (width <= 0 || height <= 0) return 'Unknown';
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }
  const divisor = gcd(width, height);
  const rW = width / divisor;
  const rH = height / divisor;

  // Recognize common display ratios
  if (Math.abs(width / height - 16 / 9) < 0.02) return '16:9 (Widescreen)';
  if (Math.abs(width / height - 16 / 10) < 0.02) return '16:10 (Productivity)';
  if (Math.abs(width / height - 21 / 9) < 0.04) return '21:9 (Ultrawide)';
  if (Math.abs(width / height - 4 / 3) < 0.02) return '4:3 (Legacy)';
  return \`\${rW}:\${rH}\`;
}

export function classifyDpr(dpr: number): string {
  if (dpr <= 1.0) return 'Standard Density (1x)';
  if (dpr <= 1.5) return 'Medium High DPI (1.25x - 1.5x)';
  if (dpr <= 2.0) return 'Retina / HiDPI (2x)';
  return \`Ultra-Density (\${dpr}x)\`;
}

export function classifyColorGamut(p3Supported: boolean, rec2020Supported: boolean): string {
  if (rec2020Supported) return 'Rec. 2020 (Ultra-Wide Gamut HDR)';
  if (p3Supported) return 'DCI-P3 (Wide Color Gamut)';
  return 'sRGB (Standard Dynamic Gamut)';
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { calculateAspectRatioGcd, classifyDpr, classifyColorGamut } from './logic';

describe('Screen & GPU Capability Logic', () => {
  it('identifies display aspect ratios accurately', () => {
    expect(calculateAspectRatioGcd(1920, 1080)).toBe('16:9 (Widescreen)');
    expect(calculateAspectRatioGcd(2560, 1600)).toBe('16:10 (Productivity)');
    expect(calculateAspectRatioGcd(3440, 1440)).toBe('21:9 (Ultrawide)');
  });

  it('classifies device pixel ratio categories', () => {
    expect(classifyDpr(1.0)).toBe('Standard Density (1x)');
    expect(classifyDpr(2.0)).toBe('Retina / HiDPI (2x)');
  });

  it('determines supported display color gamuts', () => {
    expect(classifyColorGamut(true, false)).toBe('DCI-P3 (Wide Color Gamut)');
    expect(classifyColorGamut(false, false)).toBe('sRGB (Standard Dynamic Gamut)');
  });
});
`
  },
  {
    slug: 'mouse_touch_tester',
    logic: `export function detectSwitchChatter(
  previousReleaseMs: number,
  currentPressMs: number,
  chatterThresholdMs: number = 75
): boolean {
  if (previousReleaseMs <= 0 || currentPressMs <= 0) return false;
  const delta = currentPressMs - previousReleaseMs;
  return delta > 0 && delta <= chatterThresholdMs;
}

export function calculateCpsRate(clickTimestamps: number[], windowMs: number = 5000): number {
  if (clickTimestamps.length < 2) return clickTimestamps.length;
  const now = clickTimestamps[clickTimestamps.length - 1];
  const windowStart = now - windowMs;
  const clicksInWindow = clickTimestamps.filter(t => t >= windowStart).length;
  const elapsedSec = Math.max(0.5, Math.min(windowMs / 1000, (now - clickTimestamps[0]) / 1000));
  return Number((clicksInWindow / elapsedSec).toFixed(1));
}

export function classifyScrollDelta(deltaY: number): { direction: 'UP' | 'DOWN' | 'NEUTRAL'; ticks: number } {
  if (deltaY === 0) return { direction: 'NEUTRAL', ticks: 0 };
  const direction = deltaY < 0 ? 'UP' : 'DOWN';
  const ticks = Math.max(1, Math.round(Math.abs(deltaY) / 100));
  return { direction, ticks };
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { detectSwitchChatter, calculateCpsRate, classifyScrollDelta } from './logic';

describe('Mouse & Touchscreen Tester Logic', () => {
  it('detects mechanical switch double-click chatter', () => {
    // 35ms between release and next press indicates switch debounce defect
    expect(detectSwitchChatter(1000, 1035, 75)).toBe(true);
    // 150ms is intentional human double click
    expect(detectSwitchChatter(1000, 1150, 75)).toBe(false);
  });

  it('calculates clicks per second (CPS) window rate', () => {
    const clicks = [1000, 1200, 1400, 1600, 1800, 2000];
    const cps = calculateCpsRate(clicks, 5000);
    expect(cps).toBeGreaterThanOrEqual(5.0);
  });

  it('classifies mouse wheel directions and tick counts', () => {
    expect(classifyScrollDelta(-100).direction).toBe('UP');
    expect(classifyScrollDelta(300).direction).toBe('DOWN');
    expect(classifyScrollDelta(300).ticks).toBe(3);
  });
});
`
  },
  {
    slug: 'har_sanitizer_viewer',
    logic: `export const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'proxy-authorization',
  'x-auth-token',
  'x-api-key',
  'apikey'
]);

export function sanitizeHarEntry(entry: any): { strippedHeaders: number; strippedCookies: number } {
  let strippedHeaders = 0;
  let strippedCookies = 0;

  if (entry.request) {
    if (Array.isArray(entry.request.headers)) {
      entry.request.headers = entry.request.headers.map((h: any) => {
        if (SENSITIVE_HEADERS.has(h.name.toLowerCase())) {
          strippedHeaders++;
          return { name: h.name, value: '[REDACTED_BY_TOOLKITGEN]' };
        }
        return h;
      });
    }
    if (Array.isArray(entry.request.cookies)) {
      strippedCookies += entry.request.cookies.length;
      entry.request.cookies = [];
    }
  }

  if (entry.response) {
    if (Array.isArray(entry.response.headers)) {
      entry.response.headers = entry.response.headers.map((h: any) => {
        if (SENSITIVE_HEADERS.has(h.name.toLowerCase())) {
          strippedHeaders++;
          return { name: h.name, value: '[REDACTED_BY_TOOLKITGEN]' };
        }
        return h;
      });
    }
    if (Array.isArray(entry.response.cookies)) {
      strippedCookies += entry.response.cookies.length;
      entry.response.cookies = [];
    }
  }

  return { strippedHeaders, strippedCookies };
}

export function sanitizeEntireHar(harJson: any): { sanitized: any; totalStrippedHeaders: number; totalStrippedCookies: number } {
  if (!harJson || !harJson.log || !Array.isArray(harJson.log.entries)) {
    return { sanitized: harJson, totalStrippedHeaders: 0, totalStrippedCookies: 0 };
  }

  let totalStrippedHeaders = 0;
  let totalStrippedCookies = 0;

  for (const entry of harJson.log.entries) {
    const { strippedHeaders, strippedCookies } = sanitizeHarEntry(entry);
    totalStrippedHeaders += strippedHeaders;
    totalStrippedCookies += strippedCookies;
  }

  return { sanitized: harJson, totalStrippedHeaders, totalStrippedCookies };
}
`,
    test: `import { describe, it, expect } from 'vitest';
import { sanitizeHarEntry, sanitizeEntireHar, SENSITIVE_HEADERS } from './logic';

describe('HAR Sanitizer & Viewer Logic', () => {
  it('strips authorization and cookie headers from request and response', () => {
    const entry = {
      request: {
        headers: [
          { name: 'Authorization', value: 'Bearer secret_token_xyz' },
          { name: 'Accept', value: 'application/json' }
        ],
        cookies: [{ name: 'session_id', value: '12345' }]
      },
      response: {
        headers: [
          { name: 'Set-Cookie', value: 'jwt=secret_jwt; Secure' }
        ],
        cookies: [{ name: 'jwt', value: 'secret' }]
      }
    };

    const res = sanitizeHarEntry(entry);
    expect(res.strippedHeaders).toBe(2);
    expect(res.strippedCookies).toBe(2);
    expect(entry.request.headers[0].value).toBe('[REDACTED_BY_TOOLKITGEN]');
    expect(entry.request.cookies).toHaveLength(0);
  });

  it('sanitizes full HAR log structures', () => {
    const har = {
      log: {
        entries: [
          {
            request: { headers: [{ name: 'Authorization', value: 'Bearer abc' }] },
            response: { headers: [] }
          }
        ]
      }
    };
    const { totalStrippedHeaders } = sanitizeEntireHar(har);
    expect(totalStrippedHeaders).toBe(1);
  });
});
`
  },
  {
    slug: 'zfs_raid_calculator',
    logic: `export type ZfsLayout = 'stripe' | 'mirror' | 'raidz1' | 'raidz2' | 'raidz3';

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
`,
    test: `import { describe, it, expect } from 'vitest';
import { calculateZfsCapacity, calculateSlogL2arcRecommendation } from './logic';

describe('ZFS RAID Storage Calculator Logic', () => {
  it('calculates RAIDZ2 capacity and 80% pool fill threshold', () => {
    // 6x 10TB drives in RAIDZ2
    const res = calculateZfsCapacity(6, 10, 'raidz2');
    expect(res.rawCapacityTb).toBe(60);
    expect(res.faultToleranceDrives).toBe(2);
    expect(res.usableCapacityTb).toBeLessThan(40); // 4 data disks minus 3% slop space
    expect(res.safePoolLimitTib).toBeCloseTo(res.usableCapacityTib * 0.8, 1);
  });

  it('calculates 2-way mirror capacity correctly', () => {
    const res = calculateZfsCapacity(4, 8, 'mirror');
    expect(res.rawCapacityTb).toBe(32);
    expect(res.faultToleranceDrives).toBe(1);
    expect(res.usableCapacityTb).toBeCloseTo(16 * 0.97, 1);
  });

  it('provides sensible SLOG and L2ARC sizing guidance', () => {
    const rec = calculateSlogL2arcRecommendation(20);
    expect(rec.slogGb).toBe(32);
    expect(rec.l2arcGb).toBeGreaterThan(500);
  });
});
`
  }
];

for (const t of tools) {
  const dir = path.join(rootDir, 'src', 'tools', t.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'logic.ts'), t.logic);
  fs.writeFileSync(path.join(dir, 'logic.test.ts'), t.test);
  console.log(`Generated logic and tests for ${t.slug}`);
}

console.log('All 13 tool logic and test files created successfully.');
