import json
import re
import sys
import os

def migrate_tool(slug, tools_dict):
    tinfo = tools_dict.get(slug, {})
    html_path = f'legacy/public/tool/{slug}.html'
    if not os.path.exists(html_path):
        print(f"Error: {html_path} does not exist!")
        return None

    html = open(html_path, 'r', encoding='utf-8', errors='ignore').read()

    # Title
    title_match = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    title = (
        title_match.group(1)
        .replace('&amp;', '&')
        .replace(' | Toolkit Gen', '')
        .replace(' - Toolkit Gen', '')
        .strip()
        if title_match
        else tinfo.get('name', slug)
    )

    # Description
    desc_match = re.search(r'<meta\s+name=[\"\']description[\"\']\s+content=[\"\'](.*?)[\"\']', html, re.DOTALL)
    desc = desc_match.group(1).replace('&amp;', '&').strip() if desc_match else tinfo.get('description', '')

    # Category
    category = tinfo.get('category', 'Utilities')

    # Tags
    tags = tinfo.get('tags') or []
    if not tags:
        kw_match = re.search(r'<meta\s+name=[\"\']keywords[\"\']\s+content=[\"\'](.*?)[\"\']', html, re.DOTALL)
        if kw_match:
            tags = [k.strip() for k in kw_match.group(1).split(',')[:8] if k.strip()]

    # FAQs
    faqs = []
    faq_match = re.search(r'\"@type\":\s*\"FAQPage\".*?\"mainEntity\":\s*(\[.*?\])\s*\}', html, re.DOTALL)
    if faq_match:
        try:
            faq_data = json.loads(faq_match.group(1))
            for item in faq_data:
                q = item.get('name', '').strip()
                a = item.get('acceptedAnswer', {}).get('text', '').strip()
                if q and a:
                    faqs.append({'q': q, 'a': a})
        except Exception:
            pass

    # HowTos
    howtos = []
    howto_match = re.search(r'\"@type\":\s*\"HowTo\".*?\"step\":\s*(\[.*?\])\s*\}', html, re.DOTALL)
    if howto_match:
        try:
            howto_data = json.loads(howto_match.group(1))
            for s in howto_data:
                name = s.get('name', '').strip()
                text = s.get('text', '').strip()
                if name and text:
                    howtos.append({'name': name, 'text': text})
        except Exception:
            pass

    # Article HTML
    art_match = re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL)
    art_html = art_match.group(1).strip() if art_match else ''
    
    # Word count check
    clean_art_text = re.sub(r'<[^>]+>', ' ', art_html)
    word_count = len(clean_art_text.split())
    is_thin = word_count < 400

    # Answer-first summary (40-60 words)
    quick_answer = desc
    if len(quick_answer.split()) < 35:
        quick_answer = f"{title} is a free, privacy-first web utility operating 100% locally in your browser. {desc} All calculations and processing occur on-device with zero server uploads."

    # External CDN Scripts
    ext_srcs = re.findall(r'<script[^>]+src=[\"\']([^\"\']+)[\"\']', html)
    cdns = [
        s for s in ext_srcs
        if not s.startswith('/')
        and 'pagead' not in s
        and 'googletag' not in s
        and 'email-decode' not in s
        and 'polyfill' not in s
    ]

    # Tool Stage Extraction
    tool_stage = ''
    card = re.search(r'(<section\s+class=[\"\']tool-card.*?)(?=<div[^>]*class=[\"\'][^\"\']*ad-container|<article|<footer|<div id=[\"\']smart-rec|<div id=[\"\']ad-)', html, re.DOTALL)
    if card:
        tool_stage = card.group(1).strip()
    else:
        center = re.search(r'<div class=[\"\'][^\"\']*(?:lg:col-span-6|lg:col-span-7|lg:col-span-8|col-span-8)[^\"\']*[\"\'][^>]*>(.*?)<article', html, re.DOTALL)
        if center:
            tool_stage = center.group(1).strip()
        else:
            main_match = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
            if main_match:
                before_art = main_match.group(1).split('<article')[0]
                clean = re.sub(r'<nav[^>]*>.*?</nav>', '', before_art, flags=re.DOTALL)
                clean = re.sub(r'<aside[^>]*>.*?</aside>', '', clean, flags=re.DOTALL)
                clean = re.sub(r'<div[^>]*class=[\"\'][^\"\']*ad-container[^\"\']*[\"\'][^>]*>.*?</div>', '', clean, flags=re.DOTALL)
                tool_stage = clean.strip()

    # Tool Scripts (clean up page-ready and adsense)
    inline_blocks = re.findall(r'<script(?![^>]*src=)(?![^>]*application/ld\+json)[^>]*>(.*?)</script>', html, re.DOTALL)
    filtered_scripts = []
    for b in inline_blocks:
        b_clean = b.strip()
        if 'page-ready' in b_clean and len(b_clean) < 200:
            continue
        if len(b_clean) > 0:
            filtered_scripts.append(b_clean)
    tool_script = '\n\n'.join(filtered_scripts)

    # Related tools from category peers
    peers = [
        {'id': t['id'], 'name': t['name']}
        for t in tools_dict.values()
        if t['category'] == category and t['id'] != slug
    ][:5]

    data = {
        'id': slug,
        'name': tinfo.get('name', slug),
        'title': title,
        'description': desc,
        'category': category,
        'tags': tags,
        'featured': tinfo.get('featured', False),
        'datePublished': '2025-01-15T00:00:00Z',
        'dateModified': '2026-11-06T08:27:44Z',
        'author': 'ToolkitGen Engineering Team',
        'quickAnswer': quick_answer,
        'features': [
            '100% Client-Side Processing',
            'Instant Zero-Latency Execution',
            'Zero Server Uploads & Zero Logging',
            'Works Offline in Browser Memory'
        ],
        'howTo': howtos,
        'faq': faqs,
        'related': peers,
        'adSlots': {'top': True, 'sidebar': True, 'bottom': True},
        'externalScripts': cdns,
        'articleHtml': art_html,
        'toolHtml': tool_stage,
        'toolScript': tool_script,
    }

    out_path = f'src/content/tools/{slug}.json'
    with open(out_path, 'w', encoding='utf-8') as out_f:
        json.dump(data, out_f, indent=2, ensure_ascii=False)

    return {
        'slug': slug,
        'words': word_count,
        'is_thin': is_thin,
        'cdns': cdns,
        'script_chars': len(tool_script),
    }

if __name__ == '__main__':
    tools_list = json.load(open('legacy/public/tools.json'))
    tools_dict = {t['id']: t for t in tools_list}
    
    batch_slugs = sys.argv[1:]
    results = []
    for s in batch_slugs:
        r = migrate_tool(s, tools_dict)
        if r:
            results.append(r)
            print(f"Migrated {s}: {r['words']} words, {len(r['cdns'])} CDNs, {r['script_chars']} script chars{' [THIN]' if r['is_thin'] else ''}")
