import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const tools = await getCollection('tools');
  const hubs = await getCollection('hubs');

  const site = 'https://toolkitgen.com';

  // Core pages
  const coreUrls = [
    { loc: `${site}/`, lastmod: '2026-11-19', priority: '1.0', changefreq: 'daily' },
    { loc: `${site}/tool`, lastmod: '2026-11-19', priority: '0.9', changefreq: 'daily' },
    { loc: `${site}/about`, lastmod: '2026-11-19', priority: '0.6', changefreq: 'monthly' },
    { loc: `${site}/contact`, lastmod: '2026-11-19', priority: '0.6', changefreq: 'monthly' },
    { loc: `${site}/privacy`, lastmod: '2026-11-19', priority: '0.5', changefreq: 'monthly' },
    { loc: `${site}/terms`, lastmod: '2026-11-19', priority: '0.5', changefreq: 'monthly' },
    { loc: `${site}/disclaimer`, lastmod: '2026-11-19', priority: '0.5', changefreq: 'monthly' },
    { loc: `${site}/sitemap`, lastmod: '2026-11-19', priority: '0.7', changefreq: 'weekly' },
  ];

  // Hubs
  const hubUrls = hubs.map((hub) => ({
    loc: `${site}/hubs/${hub.data.id}`,
    lastmod: '2026-11-19',
    priority: '0.8',
    changefreq: 'weekly',
  }));

  // Categories
  const categories = Array.from(new Set(tools.map((t) => t.data.category)));
  const categoryUrls = categories.map((cat) => ({
    loc: `${site}/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    lastmod: '2026-11-19',
    priority: '0.7',
    changefreq: 'weekly',
  }));

  // Tools
  const toolUrls = tools.map((tool) => {
    const mod = tool.data.dateModified
      ? tool.data.dateModified.split('T')[0]
      : '2026-11-06';
    return {
      loc: `${site}/tool/${tool.data.id}`,
      lastmod: mod,
      priority: tool.data.featured ? '0.9' : '0.8',
      changefreq: 'weekly',
    };
  });

  const allEntries = [...coreUrls, ...hubUrls, ...categoryUrls, ...toolUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
