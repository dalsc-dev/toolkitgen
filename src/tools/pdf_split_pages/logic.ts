export function parsePageRanges(input: string, maxPages: number): number[] {
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
