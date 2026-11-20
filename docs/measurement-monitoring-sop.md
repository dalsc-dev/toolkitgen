# Search & AI Engine Measurement and Monitoring SOP

## 1. Overview & Purpose
This document establishes the weekly and monthly Standard Operating Procedures (SOP) for tracking search engine indexing, Core Web Vitals, Answer Engine Optimization (AEO), and LLM citation presence for Toolkit Gen (https://toolkitgen.com).

Realistic Objective: Secure Top 3 positions on high-intent winnable queries and consistent zero-click AI citation references. We do not make unrealistic guarantees of rank 1 across saturated head terms.

---

## 2. Weekly Search Console & Webmaster Tools SOP

### 2.1 Platforms Monitored
1. Google Search Console (GSC)
2. Bing Webmaster Tools (BWT)
3. Ahrefs Webmaster Tools (AWT)

### 2.2 Weekly Cadence & Checklist (Every Monday)
1. **Indexation & Crawl Health:**
   - Verify zero 5XX server errors and zero unexpected 404/410 spikes.
   - Confirm submitted XML sitemaps (`sitemap-index.xml`, `sitemap-tools.xml`, `sitemap-guides.xml`) show 100% valid URL counts.
   - Verify `/thanks` remains unindexed and `/support` remains indexed.
2. **Performance Metrics Tracking:**
   - Record 7-day clicks, impressions, average CTR, and average position for top 25 search queries.
   - Filter by country (US, UK, CA, AU, IN, DE).
3. **Core Web Vitals (CWV) Field Data:**
   - Largest Contentful Paint (LCP): Target &le; 2.5s (Mobile & Desktop).
   - Interaction to Next Paint (INP): Target &le; 200ms.
   - Cumulative Layout Shift (CLS): Target &le; 0.1.
4. **IndexNow Submission Status:**
   - Check Bing Webmaster Tools IndexNow logs to confirm newly published guides and modified tools are processed within 24 hours.

### 2.3 Weekly Reporting Template

```markdown
### Weekly Search Performance Report: [YYYY-MM-DD]

#### 1. Core Platform Metrics
- Google Organic Clicks: [Count] ([+%/- %] WoW)
- Google Total Impressions: [Count]
- Average CTR: [X.X%]
- Average Position: [X.X]
- Bing / Yahoo Organic Clicks: [Count]
- Total Indexed URLs: [Count / 211]

#### 2. Core Web Vitals Field Compliance
- Mobile Good URLs: [100%]
- LCP p75: [X.Xs]
- INP p75: [Xms]
- CLS p75: [0.0X]

#### 3. Top 5 Rising Queries
1. [Query 1] - Position: [X] | Clicks: [N] | CTR: [X%]
2. [Query 2] - Position: [X] | Clicks: [N] | CTR: [X%]
3. [Query 3] - Position: [X] | Clicks: [N] | CTR: [X%]
4. [Query 4] - Position: [X] | Clicks: [N] | CTR: [X%]
5. [Query 5] - Position: [X] | Clicks: [N] | CTR: [X%]

#### 4. Action Items & Anomaly Flags
- [ ] [Action or URL fix required]
```

---

## 3. Monthly AI Answer & Citation Monitoring SOP (20 Target Queries)

To track discovery across Answer Engines (ChatGPT Search, Google Gemini Search, Perplexity AI, Claude Search, and Bing Copilot), execute a manual, non-automated test across the 20 prioritized queries identified in `search-demand-map.csv`.

### 3.1 The 20 Target AI Discovery Queries

| # | Target Query | Primary Destination URL | Primary Intent |
| :--- | :--- | :--- | :--- |
| 1 | why does 30 fps look juddery on 120hz oled | https://toolkitgen.com/guide/30fps-vs-40fps-oled-judder-guide | Informational / Display Physics |
| 2 | 40 fps mode on 120hz display math | https://toolkitgen.com/tool/framerate_judder_pacing_test | Diagnostic Tool / Math |
| 3 | ps5 usable storage m2 nvme requirement | https://toolkitgen.com/guide/console-storage-planning-preload-guide | Informational / Hardware Guide |
| 4 | console storage download time calculator | https://toolkitgen.com/tool/console_storage_planner | Calculator / Planning |
| 5 | dualsense stick drift threshold percentage | https://toolkitgen.com/guide/dualsense-drift-battery-latency-guide | Diagnostic / Benchmark |
| 6 | webhid gamepad test report rate jitter | https://toolkitgen.com/tool/webhid_gamepad_diagnostics | Diagnostic Hardware Tool |
| 7 | tv calibration hgig vs dynamic tone mapping ps5 | https://toolkitgen.com/guide/ps5-xbox-tv-calibration-hgig-guide | Technical Guide |
| 8 | slow motion video input lag testing method | https://toolkitgen.com/guide/slowmo-video-input-lag-testing-guide | Methodology Guide |
| 9 | test input latency slowmo video browser | https://toolkitgen.com/tool/slowmo_latency_meter | Diagnostic Tool |
| 10 | iphone promotion 120hz safari web browser cap | https://toolkitgen.com/guide/iphone-promotion-120hz-safari-web-guide | Technical / Browser Limitation |
| 11 | iphone screen test promotion 120hz raf | https://toolkitgen.com/tool/iphone_mobile_capability_report | Diagnostic Tool |
| 12 | iphone ghost touch vs dead zone screen repair | https://toolkitgen.com/guide/iphone-ghost-touch-dead-zones-screen-repair-guide | Hardware Repair Guide |
| 13 | foldable phone crease touch continuity test | https://toolkitgen.com/tool/foldable_display_posture_tester | Diagnostic / Foldable Test |
| 14 | device posture api viewport segments css web | https://toolkitgen.com/guide/foldable-phone-crease-hinge-posture-developer-guide | Developer Architecture Guide |
| 15 | safari ios vs chrome android web api differences | https://toolkitgen.com/guide/safari-ios-vs-chrome-android-web-api-gap-guide | Developer Technical Guide |
| 16 | browser sqlite wasm query offline database | https://toolkitgen.com/tool/sqlite_wasm_explorer | Developer Utility |
| 17 | duckdb wasm parquet browser analytics | https://toolkitgen.com/tool/duckdb_wasm_analytics | Developer Utility |
| 18 | test c2pa provenance metadata in browser | https://toolkitgen.com/tool/c2pa_metadata_viewer | Security / Verification Tool |
| 19 | monitor 144hz showing 60hz windows settings fix | https://toolkitgen.com/guide/144hz-monitor-showing-60hz-fix | Diagnostic Guide |
| 20 | bluetooth headphone audio video latency test | https://toolkitgen.com/guide/bluetooth-headphone-audio-latency | Audio Diagnostic Guide |

### 3.2 Evaluation Scoring Matrix
For each query on the first calendar day of the month, input the query into ChatGPT Search and Perplexity:
- Score 3: Directly cited as a primary source with a clickable markdown link.
- Score 2: Content quoted or paraphrased in the synthesis, linked in reference drawer.
- Score 1: Brand "Toolkit Gen" mentioned by name without an outbound link.
- Score 0: Neither cited nor mentioned.

Target: Achieve &ge; 10 queries scoring 2 or 3 within 90 days post-crawl.
