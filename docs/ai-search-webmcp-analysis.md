# AI Search Readiness, Crawler Policy, and WebMCP Technical Analysis

This document evaluates the emerging landscape of AI answer engines (Google AI Overviews, Perplexity, OpenAI SearchGPT, Claude) and formulates crawler policies, context discovery standards (`llms.txt`), and client-side agent protocols (WebMCP) for ToolkitGen.

---

## 1. Google AI Overviews and SGE Guidance

### A. How AI Search Synthesizes Content
Google AI Overviews (formerly Search Generative Experience / SGE) prioritize web pages that exhibit high technical authority, clear factual consensus, and structured semantic hierarchy:
1.  **Direct Answer Passage Density:** AI Overviews extract concise, unambiguous definitions located within the first 150 words of key subheadings.
2.  **Semantic Schema Markup:** Structured JSON-LD entities (`SoftwareApplication`, `WebApplication`, `FAQPage`, `HowTo`) enable search LLMs to identify parameter inputs, units of measurement, and processing boundaries without parsing ambiguous DOM text.
3.  **Entity Association:** Connecting tools to established ontologies (e.g., linking `amsler_grid_macular` to the medical subject heading for age-related macular degeneration) drastically increases citation probability in AI summaries.

### B. ToolkitGen Optimization Protocol
*   Every tool page features an explicit JSON-LD schema defining `operatingSystem: "Any"`, `applicationCategory: "UtilityApplication"`, and client-side data handling.
*   Tool execution summaries provide explicit step-by-step methodologies that LLMs can ingest and cite as verified instructions.

---

## 2. Crawler Ecosystem & `robots.txt` Policy

Modern web traffic encounters two distinct classes of automated crawlers:
1.  **Search & Discovery Crawlers:** Crawl pages to index them for search queries and answer citations (e.g., Googlebot, Bingbot, PerplexityBot).
2.  **Model Training Scrapers:** Mass-download entire site corpora for foundational model pre-training with no search citation return (e.g., Bytespider, CCBot).

### A. Major Crawler User-Agent Registry

| User-Agent | Organization | Purpose | Recommended Policy |
| :--- | :--- | :--- | :--- |
| `Googlebot` | Google | Primary search indexation & AI Overviews | Allow |
| `Google-Extended` | Google | Gemini training & Vertex AI RAG | Allow / Disallow per strategy |
| `Bingbot` | Microsoft | Bing search & Copilot citations | Allow |
| `PerplexityBot` | Perplexity AI | Real-time conversational search citation | Allow |
| `SearchGPT` / `OAI-SearchBot` | OpenAI | SearchGPT live index & attribution | Allow |
| `GPTBot` | OpenAI | Model pre-training scraping | Disallow / Rate Limit |
| `ClaudeBot` | Anthropic | Claude training & Search RAG | Allow |
| `Bytespider` | ByteDance | LLM scraping | Disallow |
| `CCBot` | Common Crawl | Bulk web corpus archive | Disallow |

### B. Recommended `robots.txt` Configuration
```text
User-agent: *
Allow: /

# Dedicated AI Answer Engines (Attribution & Direct Traffic Referral)
User-agent: PerplexityBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

# Exclude Aggressive Bulk Model Training Scrapers
User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: https://toolkitgen.com/sitemap-index.xml
```

---

## 3. The `llms.txt` Standard & Build-Time Generation

### A. What is `llms.txt`?
The `llms.txt` specification (proposed by Jeremy Howard and Answer.ai) provides a standardized, Markdown-formatted directory of a website's contents, documentation, and tools located at the root domain (`/llms.txt`). It allows LLM agents to rapidly ingest the capabilities, schemas, and endpoints of a site without parsing heavy HTML, scripts, or navigation elements.

### B. Proposed `llms.txt` Structure for ToolkitGen
```markdown
# ToolkitGen

> A curated suite of fast, client-side web utilities and hardware diagnostics running locally in browser memory.

## Console & Gaming Utilities
- [Console Storage & SSD Expansion Planner](https://toolkitgen.com/tool/console_storage_calculator): Calculates exact usable internal storage for PS5, PS5 Slim, PS5 Pro, and Xbox Series X|S with M.2 SSD expansion advice and realistic download times.
- [TV & Gaming Display Capability Checker](https://toolkitgen.com/tool/tv_gaming_capability_checker): Verifies 120Hz refresh rate, HDR color gamut, and VRR gaming capabilities.
- [Gamepad Drift & Diagnostic Suite](https://toolkitgen.com/tool/webhid_gamepad_diagnostics): Live analog stick circularity error, centering jitter, and trigger diagnostics via Gamepad and WebHID APIs.
- [Slow-Motion Video Input Lag Meter](https://toolkitgen.com/tool/slowmo_latency_meter): Measures button-to-pixel display latency from 120/240fps slow-motion phone recordings.

## Hardware & Input Diagnostics
- [Mouse Polling Rate Tester](https://toolkitgen.com/tool/mouse_polling_rate_hz): High-frequency mouse report rate counter supporting up to 8000Hz with sub-millisecond delta histograms.
- [Keyboard Input Latency Test](https://toolkitgen.com/tool/keyboard_latency_test): Keyboard switch scan latency, debounce timing, and chatter detection.
- [Battery Drain Test](https://toolkitgen.com/tool/battery_discharge_monitor): Live battery discharge rate and estimated runtime via Battery Status API.

## Developer & Security Tools
- [Online SQLite Viewer](https://toolkitgen.com/tool/sqlite_wasm_explorer): Zero-upload client-side SQLite database explorer running on WebAssembly.
- [Docker Compose Linter](https://toolkitgen.com/tool/docker_compose_linter): Production YAML syntax validation and security auditing for container definitions.
- [Offline JWT Debugger](https://toolkitgen.com/tool/jwt_debugger_offline): Client-side JSON Web Token inspection and HMAC signature verification.
```

### C. Build-Time Automation Plan
ToolkitGen can generate `/llms.txt` automatically during the static Astro build:
1.  Read all tool JSON entries from `src/content/tools/`.
2.  Extract `title`, `description`, `category`, and URL.
3.  Format into Markdown groupings.
4.  Emit static file to `dist/llms.txt` during `pnpm run build`.

---

## 4. WebMCP: Status Assessment & Integration Strategy

### A. What is WebMCP?
The Model Context Protocol (MCP), pioneered by Anthropic, is an open protocol that enables AI models and autonomous agents to discover and invoke external tools and structured data sources. "WebMCP" refers to the emerging extension of this protocol to web browsers, enabling client-side agents to execute web-based utilities as tools.

### B. Current Technical State of WebMCP
*   **Protocol Transport:** Standard MCP relies on JSON-RPC over `stdio` (for local desktop processes) or Server-Sent Events (SSE) / WebSockets (for remote servers).
*   **Browser Sandbox Constraints:** Web browsers running in user sessions cannot expose `stdio`. Web browser agent integration currently operates through two primary architectures:
    1.  *Browser Extensions:* Extensions with elevated permissions running a background WebSocket bridge to an agent runtime.
    2.  *HTTP Tool Descriptor Endpoints:* Static or dynamic JSON API endpoints adhering to the MCP tool definition schema.

### C. Actionable WebMCP Roadmap for ToolkitGen
1.  **Immediate Step (Phase 2): Publish Structured Tool Manifest (`/tools.json`):**
    Provide a machine-readable JSON schema defining every ToolkitGen utility, its mathematical model, accepted parameters, and output types. This allows LLM agents (such as Antigravity, Claude Desktop with Puppeteer, or OpenAI custom GPTs) to utilize our tools programmatically.
2.  **Intermediate Step (Phase 4): Client-Side Tool RPC:**
    Expose a unified `window.ToolkitAPI` object on tool pages, enabling headless browser agents to pass input parameters and read calculation results synchronously via `page.evaluate()`.
3.  **Long-Term Monitoring:**
    Track the W3C and Anthropic working groups on native browser agent protocols to implement native WebMCP endpoints once browser specifications stabilize.
