import { defineCollection, z } from 'astro:content';

const toolsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    hub: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    datePublished: z.string().default('2025-01-15T00:00:00Z'),
    dateModified: z.string().default('2026-11-06T00:00:00Z'),
    author: z.string().default('ToolkitGen Engineering Team'),
    quickAnswer: z.string(),
    features: z.array(z.string()).default([]),
    howTo: z.array(z.object({
      name: z.string(),
      text: z.string(),
    })).default([]),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).default([]),
    related: z.array(z.object({
      id: z.string(),
      name: z.string(),
    })).default([]),
    adSlots: z.object({
      top: z.boolean().default(true),
      sidebar: z.boolean().default(true),
      bottom: z.boolean().default(true),
    }).default({ top: true, sidebar: true, bottom: true }),
    externalScripts: z.array(z.string()).default([]),
    articleHtml: z.string().default(''),
    toolHtml: z.string().default(''),
    toolScript: z.string().default(''),
  }),
});

const hubsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    subtitle: z.string().optional(),
    toolsIncluded: z.array(z.string()).default([]),
    dateModified: z.string().default('2026-11-06T00:00:00Z'),
    hubHtml: z.string().default(''),
    hubScript: z.string().default(''),
  }),
});

const guidesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    hubSlug: z.string(),
    author: z.string().default('ToolkitGen Engineering Team'),
    datePublished: z.string().default('2025-02-01T00:00:00Z'),
    dateModified: z.string().default('2026-11-20T00:00:00Z'),
    relatedTools: z.array(z.string()).default([]),
    quickAnswer: z.string(),
    articleHtml: z.string(),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).default([]),
  }),
});

export const collections = {
  tools: toolsCollection,
  hubs: hubsCollection,
  guides: guidesCollection,
};
