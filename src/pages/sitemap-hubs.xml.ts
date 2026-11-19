import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const hubs = await getCollection('hubs');
  const site = 'https://toolkitgen.com';
  const lastmod = '2026-11-19';

  const hubUrls = hubs.map((hub) => ({
    loc: `${site}/hubs/${hub.data.id}`,
    lastmod: hub.data.dateModified ? hub.data.dateModified.split('T')[0] : lastmod,
    priority: '0.9',
    changefreq: 'weekly',
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubUrls
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
