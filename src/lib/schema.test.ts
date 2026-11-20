import { describe, it, expect } from 'vitest';
import { generateJsonLd } from './schema';

describe('Schema.org Structured Data Generator', () => {
  it('generates valid Organization and WebSite schema for website type', () => {
    const jsonLd = generateJsonLd({
      type: 'website',
      title: 'Toolkit Gen',
      description: 'Free developer tools and diagnostics',
      url: 'https://toolkitgen.com',
    });

    expect(jsonLd['@context']).toBe('https://schema.org');
    const org = jsonLd['@graph'].find((item: any) => item['@type'] === 'Organization');
    expect(org).toBeDefined();
    expect(org.name).toBe('Toolkit Gen');
    expect(org.sameAs).not.toContain('https://github.com/dalsc-dev/toolkitgen');

    const website = jsonLd['@graph'].find((item: any) => item['@type'] === 'WebSite');
    expect(website).toBeDefined();
    expect(website.potentialAction['@type']).toBe('SearchAction');
  });

  it('generates SoftwareApplication schema for tools with zero fake aggregateRating', () => {
    const jsonLd = generateJsonLd({
      type: 'tool',
      title: 'Frame Rate Judder & Pacing Test',
      description: 'Diagnose micro-stutter and frame pacing judder across 30, 40, 60, and 120 fps.',
      url: 'https://toolkitgen.com/tool/framerate_judder_pacing_test',
      category: 'DiagnosticApplication',
      howTo: [
        { name: 'Launch Calibration', text: 'Click Launch raster animation' },
        { name: 'Inspect Pacing', text: 'Observe raster motion across refresh rates' },
      ],
      faq: [
        { q: 'Why does 30 fps look juddery on 120Hz?', a: '30 fps requires quad frame repeats.' },
      ],
    });

    const webapp = jsonLd['@graph'].find((item: any) =>
      Array.isArray(item['@type']) ? item['@type'].includes('SoftwareApplication') : item['@type'] === 'SoftwareApplication'
    );
    expect(webapp).toBeDefined();
    expect(webapp.isAccessibleForFree).toBe(true);
    expect(webapp.offers.price).toBe('0');
    expect(webapp.offers.priceCurrency).toBe('USD');

    // Anti-fabrication check: Zero fake aggregateRating
    expect(webapp.aggregateRating).toBeUndefined();

    // HowTo verification
    const howTo = jsonLd['@graph'].find((item: any) => item['@type'] === 'HowTo');
    expect(howTo).toBeDefined();
    expect(howTo.step.length).toBe(2);
    expect(howTo.step[0].name).toBe('Launch Calibration');

    // FAQPage verification
    const faq = jsonLd['@graph'].find((item: any) => item['@type'] === 'FAQPage');
    expect(faq).toBeDefined();
    expect(faq.mainEntity.length).toBe(1);
    expect(faq.mainEntity[0].name).toBe('Why does 30 fps look juddery on 120Hz?');
  });

  it('generates TechArticle and FAQPage schema for technical diagnostic guides', () => {
    const jsonLd = generateJsonLd({
      type: 'article',
      title: 'iPhone ProMotion 120Hz Safari Web Troubleshooting Guide',
      description: 'Why Safari caps web animations at 60Hz and how to benchmark true 120Hz rAF timing.',
      url: 'https://toolkitgen.com/guide/iphone-promotion-120hz-safari-web-guide',
      category: 'Mobile Hardware Diagnostics',
      datePublished: '2026-11-20T00:00:00Z',
      dateModified: '2026-11-20T00:00:00Z',
      faq: [
        { q: 'Why does Safari cap at 60Hz?', a: 'Battery conservation heuristics limit rAF timing.' },
      ],
    });

    const article = jsonLd['@graph'].find((item: any) => item['@type'] === 'TechArticle');
    expect(article).toBeDefined();
    expect(article.headline).toBe('iPhone ProMotion 120Hz Safari Web Troubleshooting Guide');
    expect(article.mainEntityOfPage['@type']).toBe('WebPage');

    const faq = jsonLd['@graph'].find((item: any) => item['@type'] === 'FAQPage');
    expect(faq).toBeDefined();
    expect(faq.mainEntity[0].name).toBe('Why does Safari cap at 60Hz?');
  });

  it('generates CollectionPage schema for hubs', () => {
    const jsonLd = generateJsonLd({
      type: 'hub',
      title: 'Gaming & Display Diagnostics Hub',
      description: 'Free client-side diagnostics for display latency, gamepad jitter, and frame pacing.',
      url: 'https://toolkitgen.com/hubs/gaming',
    });

    const collection = jsonLd['@graph'].find((item: any) => item['@type'] === 'CollectionPage');
    expect(collection).toBeDefined();
    expect(collection.name).toBe('Gaming & Display Diagnostics Hub');
  });
});
