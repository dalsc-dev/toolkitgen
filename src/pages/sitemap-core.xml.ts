import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const tools = await getCollection('tools');
  const site = 'https://toolkitgen.com';
  const lastmod = '2026-11-19';

  const coreUrls = [
    { loc: `${site}/`, lastmod, priority: '1.0', changefreq: 'daily' },
    { loc: `${site}/tool`, lastmod, priority: '0.9', changefreq: 'daily' },
    { loc: `${site}/about`, lastmod, priority: '0.6', changefreq: 'monthly' },
    { loc: `${site}/contact`, lastmod, priority: '0.6', changefreq: 'monthly' },
    { loc: `${site}/privacy`, lastmod, priority: '0.5', changefreq: 'monthly' },
    { loc: `${site}/terms`, lastmod, priority: '0.5', changefreq: 'monthly' },
    { loc: `${site}/disclaimer`, lastmod, priority: '0.5', changefreq: 'monthly' },
    { loc: `${site}/support`, lastmod, priority: '0.6', changefreq: 'monthly' },
    { loc: `${site}/sitemap`, lastmod, priority: '0.7', changefreq: 'weekly' },
  ];

  // Categories
  const categories = Array.from(new Set(tools.map((t) => t.data.category)));
  const categoryUrls = categories.map((cat) => ({
    loc: `${site}/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    lastmod,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const allEntries = [...coreUrls, ...categoryUrls];

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
