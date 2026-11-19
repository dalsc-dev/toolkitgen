import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const tools = await getCollection('tools');
  const site = 'https://toolkitgen.com';

  tools.sort((a, b) => new Date(b.data.dateModified || 0).getTime() - new Date(a.data.dateModified || 0).getTime());

  const items = tools.map((t) => {
    const cleanTitle = (t.data.name || t.data.title || t.data.id)
      .replace(/\s*\|\s*Toolkit Gen.*$/i, '')
      .trim();
    const pubDate = new Date(t.data.dateModified || t.data.datePublished || '2026-11-19').toUTCString();
    return `    <item>
      <title><![CDATA[${cleanTitle}]]></title>
      <link>${site}/tool/${t.data.id}</link>
      <guid isPermaLink="true">${site}/tool/${t.data.id}</guid>
      <description><![CDATA[${t.data.description}]]></description>
      <category><![CDATA[${t.data.category}]]></category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Toolkit Gen - Professional Web Tools &amp; Utilities</title>
    <link>${site}</link>
    <description>Curated catalog of privacy-first, client-side web tools and calculators executing locally in your browser.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
