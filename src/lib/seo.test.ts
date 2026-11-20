import { describe, it, expect } from 'vitest';
import { formatTitle, formatDescription } from './seo';

describe('SEO Formatting Utilities', () => {
  it('formats title with brand suffix within 70 characters', () => {
    const title = 'Frame Rate Judder & Pacing Test';
    const formatted = formatTitle(title);
    expect(formatted).toBe('Frame Rate Judder & Pacing Test | Toolkit Gen');
    expect(formatted.length).toBeLessThanOrEqual(70);
    expect(formatted).toContain('Toolkit Gen');
  });

  it('truncates overly long titles while strictly preserving the brand suffix', () => {
    const longTitle = '144Hz Monitor Showing 60Hz: Causes, Windows Settings, and Cable Fixes for High Refresh Rate Displays';
    const formatted = formatTitle(longTitle);
    expect(formatted).toContain('| Toolkit Gen');
    expect(formatted.length).toBeLessThanOrEqual(70);
    expect(formatted.endsWith(' | Toolkit Gen')).toBe(true);
  });

  it('safely handles titles that already contain the brand name', () => {
    const titleWithBrand = 'About Toolkit Gen | Free Browser-Based Tools & Diagnostics';
    const formatted = formatTitle(titleWithBrand);
    expect(formatted).toContain('Toolkit Gen');
    expect(formatted.length).toBeLessThanOrEqual(70);
  });

  it('formats meta description within 110-160 character boundary', () => {
    const shortDesc = 'Test input latency.';
    const formattedShort = formatDescription(shortDesc);
    expect(formattedShort.length).toBeGreaterThanOrEqual(70);
    expect(formattedShort).toContain('Calculations run locally in your browser with no server uploads.');

    const normalDesc = 'Diagnose controller stick drift, circularity error, and polling rate in real-time. Calculations run in your browser, and inputs are not uploaded to our servers.';
    const formattedNormal = formatDescription(normalDesc);
    expect(formattedNormal.length).toBeLessThanOrEqual(160);
    expect(formattedNormal.length).toBeGreaterThanOrEqual(110);
  });
});
