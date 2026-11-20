# ToolkitGen Standing Rules

## 1. Scope and Hosting Boundaries
- **Free Tier Constraint:** The application must strictly operate within Cloudflare Workers and Pages Free Tier limits:
  - Maximum output file size: 25 MiB per file.
  - Maximum deployment file count: 20,000 files.
  - Total deployment size: under free bandwidth and storage thresholds.
- **Framework Constraint:** Stay strictly on Astro (static output mode). Zero React migration. Preact islands may be used for targeted client-side interactive stages where necessary.

## 2. Privacy and Corporate Copy Compliance
- **Local Browser Execution:** All calculations, file parsing, and transformations must run client-side in browser memory.
- **Copy Restrictions:** Adhere strictly to [src/lib/copy.ts](file:///Users/dalsc2/Downloads/Project/toolkitgen/src/lib/copy.ts).
- **Prohibited Phrases:** Zero tolerance for absolute privacy or security claims (e.g. `zero server`, `100% private`, `never touch a server`, `guaranteed`, `localhost`, `unhackable`). All references to loopback addresses must use `127.0.0.1 loopback`.
- **Approved Trust Wording:** "Calculations run in your browser. Inputs are not uploaded to our servers." / "Tool inputs are processed locally on your device."

## 3. Visual and Ad Layout Standards
- **Zero-Emoji Policy:** Zero unicode emoji glyphs in code, content files, metadata, JSON, markdown, or chat responses.
- **Zero-Left-Border Policy:** No `border-l-*` or left-only border accents on cards, callouts, or content blocks.
- **Ad Compliance:** Google AdSense Auto ads plus plain, unstyled `Advertisement` label rules remain enforced. No artificial styled framing, borders, or high-contrast boxes around ad units.

## 4. Performance, Hang Budgets, and Execution Rules
- **Non-Blocking Architecture:** Zero heavy work, network requests, workers, or media streams on initial page load.
- **Hang Guard:** Every tool page must pass 6x CPU throttling with max main-thread loop gap <= 1000ms.
- **Performance Budget:** Total Blocking Time (TBT) < 200ms; zero pre-click workers, audio contexts, webgl, or camera streams.
- **AI and Heavy Tools:** Require explicit user interaction (click) to initialize. Display model download sizes upfront. Cache models locally via the browser Cache API.

## 5. Editorial Integrity and Factual Standards
- **Zero Fake Data:** Never invent search volumes, keyword statistics, competitor metrics, or benchmarks.
- **Fact Labeling:** Label every time-sensitive fact as either `[Confirmed]` or `[Reported]` with a specific, cited source and date.
- **Console & Gaming Accuracy:** Any GTA 6 references must be factual, descriptive, strictly console-focused (PS5, Xbox Series X/S), and accompanied by the disclaimer: *"not affiliated with Rockstar Games, Take-Two, Sony or Microsoft"*. No PC claims (no PC version announced).
- **Google Search:** No programmatic scraping of Google SERP pages.

## 6. Deployment and Gate Discipline
- **Gate Enforcement:** Every phase must pass all CI gates before completion:
  1. `pnpm test` (Vitest unit tests)
  2. `pnpm run check` (Astro check with 0 errors, 0 warnings, 0 hints)
  3. `pnpm run build` (Copy standard, HTML tags, limits, parity, emoji, raw LaTeX, titles, borders, perf budgets)
  4. `pnpm run check:hang` (6x CPU throttle verification across all tools)
- **Branch Strategy:** Work is synchronized locally across `main` and `migration/astro`.
- **No Premature Remote Push:** No push to remote `origin/main` until all verification gates pass and explicit confirmation is granted.
- **Phase Confirmation:** Stop after each phase for user review and explicit confirmation before advancing.

## 7. Working Methodology
- **Planning Mode:** For each phase, produce a dedicated Implementation Plan artifact and a Task List artifact.
- **Visual Verification:** Utilize browser agent inspection for UI verification and embed screenshots in artifacts.
