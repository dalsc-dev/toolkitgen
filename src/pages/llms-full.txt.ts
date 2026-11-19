import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { HUB_TOOLS_CATALOG } from '@lib/hubToolsCatalog';

export const GET: APIRoute = async () => {
  const tools = await getCollection('tools');
  const hubs = await getCollection('hubs');

  tools.sort((a, b) => a.data.title.localeCompare(b.data.title));

  let text = `# ToolkitGen - Full Knowledge Base for AI Engines (LLMs)

> Complete structured documentation of ${tools.length} standalone client-side web tools and ${HUB_TOOLS_CATALOG.length} embedded hub utilities. Calculations run in your browser, and inputs are not uploaded to our servers.

---

## Executive Summary
Toolkit Gen brings developer utilities, financial calculators, health metrics and productivity tools into one consistent workspace. Each tool runs in your browser, requires no account, and is written to be clear, accurate and fast. Calculations run in your browser, and your inputs are not uploaded to our servers.

---

## Hubs
${hubs
  .map(
    (h) => `### ${h.data.title}
- **URL:** https://toolkitgen.com/hubs/${h.data.id}
- **Description:** ${h.data.description}
- **Focus:** ${h.data.subtitle || 'Professional Suite'}
`
  )
  .join('\n')}

---

## Standalone Tools Catalog (${tools.length} Tools)

`;

  for (const t of tools) {
    const data = t.data;
    text += `### ${(data.name || data.title).replace(/\s*\|\s*Toolkit Gen.*$/i, '')}
- **URL:** https://toolkitgen.com/tool/${data.id}
- **Category:** ${data.category}
- **Description:** ${data.description}
- **Quick Answer (Direct Summary):** ${data.quickAnswer || data.description}
- **Execution Architecture:** Client-side Web APIs (in-browser processing without data uploads, offline-capable, local memory only)
- **Tags & Keywords:** ${(data.tags || []).join(', ')}
- **Key Features:**
${(data.features || []).map((f: string) => `  - ${f}`).join('\n')}
`;

    if (data.howTo && data.howTo.length > 0) {
      text += `- **Step-by-Step Usage Guide:**\n${data.howTo.map((step: any, idx: number) => `  ${idx + 1}. **${step.name}:** ${step.text}`).join('\n')}\n`;
    }

    if (data.faq && data.faq.length > 0) {
      text += `- **Frequently Asked Questions & Answers:**\n${data.faq.map((q: any) => `  - **Q:** ${q.q}\n    **A:** ${q.a}`).join('\n')}\n`;
    }

    if (data.related && data.related.length > 0) {
      text += `- **Related Tools:** ${data.related.map((r: any) => `[${r.name}](https://toolkitgen.com/tool/${r.id})`).join(', ')}\n`;
    }

    text += '\n---\n\n';
  }

  text += `## Embedded Hub Utilities (${HUB_TOOLS_CATALOG.length} Tools)\n\n`;
  for (const ht of HUB_TOOLS_CATALOG) {
    text += `### ${ht.name}
- **URL:** https://toolkitgen.com${ht.url}
- **Category:** ${ht.category}
- **Hub:** ${ht.hub}
- **Description:** ${ht.description}
- **Tags:** ${ht.tags.join(', ')}

---

`;
  }

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
