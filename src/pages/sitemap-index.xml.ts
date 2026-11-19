import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const site = 'https://toolkitgen.com';
  const lastmod = '2026-11-19';

  const sitemaps = [
    `${site}/sitemap-core.xml`,
    `${site}/sitemap-hubs.xml`,
    `${site}/sitemap-tools.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
