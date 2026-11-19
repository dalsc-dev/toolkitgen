import katex from 'katex';

export interface ProcessedMathResult {
  html: string;
  hasMath: boolean;
}

export function decodeHtml(str: string): string {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
}

export function processMath(rawHtml: string): ProcessedMathResult {
  if (!rawHtml) return { html: '', hasMath: false };
  let hasMath = false;

  // 1. Remove stray labels such as "(LaTeX)" or "(Latex)" from headings and text
  let html = rawHtml.replace(/\s*\((?:LaTeX|Latex)\)/gi, '');

  // 2. Protect code blocks (<pre>, <code>, <textarea>, <script>) with placeholders
  const codeBlocks: string[] = [];
  html = html.replace(/(<(?:pre|code|textarea|script)[^>]*>[\s\S]*?<\/(?:pre|code|textarea|script)>)/gi, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  // 3. Display math: $$...$$ or \[...\]
  html = html.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (match) => {
    hasMath = true;
    const tex = decodeHtml(match.slice(2, -2).trim());
    try {
      const rendered = katex.renderToString(tex, { displayMode: true, throwOnError: true });
      const cleanLabel = tex.replace(/[\\]/g, ' ').replace(/\s+/g, ' ').trim();
      return `<figure class="formula-figure my-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center overflow-x-auto" role="figure" aria-label="Formula: ${cleanLabel}"><div class="inline-block py-2">${rendered}</div></figure>`;
    } catch (e: any) {
      console.warn('KaTeX display error on formula:', tex, e.message);
      return match;
    }
  });

  // 4. Inline math: \(...\)
  html = html.replace(/\\\(([\s\S]+?)\\\)/g, (match, rawTex) => {
    hasMath = true;
    const tex = decodeHtml(rawTex.trim());
    try {
      return katex.renderToString(tex, { displayMode: false, throwOnError: true });
    } catch (e: any) {
      console.warn('KaTeX inline error on formula:', tex, e.message);
      return match;
    }
  });

  // 5. Single dollar inline math: $...$ (ignoring currency numbers like $100)
  html = html.replace(/(^|[^\\])\$([^\$\s\n\r<>](?:[^\$\n\r<>]*?[^\$\s\n\r<>])?)\$/g, (match, prefix, rawTex) => {
    const trimmed = rawTex.trim();
    if (/^\d+(?:\.\d+)?$/.test(trimmed) || /^(?:\d+[\d,]*)(?:\.\d+)?$/.test(trimmed)) {
      return match;
    }
    const tex = decodeHtml(trimmed);
    try {
      const rendered = katex.renderToString(tex, { displayMode: false, throwOnError: true });
      hasMath = true;
      return prefix + rendered;
    } catch (e: any) {
      return match;
    }
  });

  // 6. Restore code blocks
  html = html.replace(/___CODE_BLOCK_(\d+)___/g, (_, index) => {
    return codeBlocks[parseInt(index, 10)];
  });

  return { html, hasMath };
}
