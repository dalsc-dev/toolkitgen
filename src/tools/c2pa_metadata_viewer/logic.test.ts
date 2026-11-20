import { describe, it, expect } from 'vitest';
import { detectMediaFormat, parseC2paBuffer } from './logic';

describe('C2PA Content Credentials Inspector Logic', () => {
  it('detects JPEG, PNG, and WebP binary headers', () => {
    // JPEG header: 0xFF, 0xD8, 0xFF
    const jpegBuf = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]).buffer;
    expect(detectMediaFormat(jpegBuf)).toBe('JPEG');

    // PNG header
    const pngBuf = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]).buffer;
    expect(detectMediaFormat(pngBuf)).toBe('PNG');

    // WebP header: 'RIFF' .... 'WEBP'
    const webpBuf = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00,
      0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20
    ]).buffer;
    expect(detectMediaFormat(webpBuf)).toBe('WebP');
  });

  it('detects missing C2PA manifest on plain media files', () => {
    const plainJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]).buffer;
    const res = parseC2paBuffer(plainJpeg);

    expect(res.hasC2paManifest).toBe(false);
    expect(res.format).toBe('JPEG');
    expect(res.claimGenerator).toBe('None Detected');
  });

  it('detects C2PA JUMBF boxes and AI generated digitalSourceType', () => {
    // Create synthetic buffer containing C2PA FourCC and AI marker
    const manifestStr = 'c2pa...jumb...Adobe Photoshop 2024...trainedAlgorithmicMedia...c2pa.created...c2pa.edited';
    const buf = new Uint8Array(manifestStr.length + 10);
    // Add JPEG magic
    buf[0] = 0xff;
    buf[1] = 0xd8;
    buf[2] = 0xff;

    for (let i = 0; i < manifestStr.length; i++) {
      buf[i + 10] = manifestStr.charCodeAt(i);
    }

    const res = parseC2paBuffer(buf.buffer);

    expect(res.hasC2paManifest).toBe(true);
    expect(res.format).toBe('JPEG');
    expect(res.isAiGenerated).toBe(true);
    expect(res.digitalSourceType).toBe('trainedAlgorithmicMedia');
    expect(res.claimGenerator).toContain('Adobe Photoshop');
    expect(res.actions).toContain('Asset Created');
    expect(res.actions).toContain('Editorial Adjustments');
  });
});
