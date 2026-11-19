import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { HUB_TOOLS_CATALOG } from '@lib/hubToolsCatalog';

export const GET: APIRoute = async () => {
  const tools = await getCollection('tools');

  const standaloneItems = tools.map((tool) => {
    const data = tool.data;
    const title = (data.name || data.title || data.id).replace(/\s*\|\s*Toolkit Gen.*$/i, '').trim();
    const tags = data.tags || [];
    const category = data.category || 'Productivity / Utility';

    const aliases = new Set<string>();
    aliases.add(data.id.replace(/_/g, ' '));
    aliases.add(category.toLowerCase());
    for (const tag of tags) {
      aliases.add(tag.toLowerCase());
    }

    if (/calc/i.test(title)) aliases.add('calculator');
    if (/test|check/i.test(title)) {
      aliases.add('tester');
      aliases.add('diagnostic');
    }
    if (/convert/i.test(title)) aliases.add('converter');
    if (/format/i.test(title)) aliases.add('formatter');
    if (/generat/i.test(title)) aliases.add('generator');
    if (/monitor/i.test(title)) aliases.add('analyzer');

    return {
      slug: data.id,
      title,
      description: data.description || '',
      category,
      hub: null,
      tags,
      aliases: Array.from(aliases),
      url: `/tool/${data.id}`,
    };
  });

  const hubItems = HUB_TOOLS_CATALOG.map((ht) => ({
    slug: ht.slug,
    title: ht.name,
    description: ht.description,
    category: ht.category,
    hub: ht.hub,
    tags: ht.tags,
    aliases: [ht.slug.replace(/tool-/, '').replace(/-/g, ' '), ht.category.toLowerCase()],
    url: ht.url,
  }));

  const allSearchItems = [...standaloneItems, ...hubItems];

  return new Response(JSON.stringify(allSearchItems), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
