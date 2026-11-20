import { describe, it, expect } from 'vitest';
import { cleanOcrText, calculateOcrWordMetrics, classifyOcrConfidence } from './logic';

describe('OCR Image to Text Logic', () => {
  it('cleans redundant whitespace and line feeds', () => {
    const messy = 'Hello   world!\r\n\n\n\nNext   line.';
    expect(cleanOcrText(messy)).toBe('Hello world!\n\nNext line.');
  });

  it('calculates word, line, and character counts correctly', () => {
    const text = 'First line text.\nSecond line with five words.';
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
