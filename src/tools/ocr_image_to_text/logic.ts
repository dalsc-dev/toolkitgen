export function cleanOcrText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function calculateOcrWordMetrics(text: string): { words: number; characters: number; lines: number } {
  if (!text.trim()) return { words: 0, characters: 0, lines: 0 };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const characters = text.length;
  const lines = text.split('\n').filter(l => l.trim().length > 0).length;
  return { words, characters, lines };
}

export function classifyOcrConfidence(confidencePercent: number): 'High' | 'Moderate' | 'Low' {
  if (confidencePercent >= 85) return 'High';
  if (confidencePercent >= 65) return 'Moderate';
  return 'Low';
}
