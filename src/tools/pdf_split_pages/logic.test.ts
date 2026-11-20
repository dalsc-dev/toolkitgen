import { describe, it, expect } from 'vitest';
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
