import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const tools = await getCollection('tools');
  return tools.map((tool) => ({
    params: { slug: tool.data.id },
    props: { script: tool.data.toolScript || '' },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const rawScript = (props as any).script || '';
  
  // Wrap with safeProxy runtime for tool execution
  const runtimeCode = `/* ToolkitGen Core Runtime - (c) ToolkitGen */
(() => {
  if (typeof window.Chart === 'undefined') {
    window.Chart = class Chart { constructor() {} destroy() {} update() {} };
  }
  const origGet = document.getElementById.bind(document);
  const safeProxy = new Proxy(document.createElement('div'), {
    get(t, p) {
      if (p === 'getContext') return () => null;
      if (p === 'addEventListener') return () => {};
      if (p === 'removeEventListener') return () => {};
      if (p === 'style') return {};
      if (p === 'classList') return { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false };
      if (p === 'querySelector') return () => null;
      if (p === 'querySelectorAll') return () => [];
      return t[p] ?? '';
    },
    set(t, p, v) { t[p] = v; return true; }
  });
  document.getElementById = (id) => origGet(id) || safeProxy;
})();
${rawScript}
`;

  return new Response(runtimeCode, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
