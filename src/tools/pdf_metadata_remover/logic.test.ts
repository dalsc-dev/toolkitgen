import { describe, it, expect } from 'vitest';
import { sanitizeInfoDictionary, redactStringMetadata } from './logic';

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
