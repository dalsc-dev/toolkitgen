import { describe, it, expect } from 'vitest';
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
