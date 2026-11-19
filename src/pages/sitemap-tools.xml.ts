import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const tools = await getCollection('tools');
  const site = 'https://toolkitgen.com';

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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${toolUrls
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
