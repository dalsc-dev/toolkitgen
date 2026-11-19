# ToolkitGen Production Cutover & Rollback Guide

This document defines the production cutover procedure from legacy Firebase Hosting to Cloudflare Workers Static Assets (Free Tier), along with verification steps and the 14-day zero-cost rollback protocol.

---

## 1. Architecture Overview

- **Hosting Engine:** Cloudflare Workers Static Assets (Free Plan).
- **Static Artifacts Directory:** `dist/` (185 HTML pages + assets + endpoints).
- **Direct Asset Serving:** Handled at Cloudflare edge cache via `public/_headers` and `public/_redirects`. Page views for static assets do NOT consume the 100,000/day Worker script invocation quota.
- **Rollback Target:** Firebase Hosting on the Spark plan ($0/month, preserved untouched in `legacy/`).

---

## 2. Pre-Cutover Verification Checklist

Run these automated verification commands locally or verify them in the CI pipeline:

```bash
# 1. Verify Corporate Copy Standards (Zero banned phrases)
pnpm run check:copy

# 2. Strict TypeScript Compilation Check
pnpm exec tsc --noEmit

# 3. Unit Test Suite (Vitest)
pnpm test

# 4. Production Static Build & Free-Tier Quotas Check
pnpm run build
```

### Pre-Cutover Gates:
- [x] All 126 tools migrated into content collections.
- [x] 100% legacy URL resolution (133/133 sitemap URLs return 200 OK in `dist/`).
- [x] All 45 Firebase legacy redirects mapped in `public/_redirects`.
- [x] Zero external CDNs required for runtime execution.
- [x] Cloudflare asset limits verified: 228 files (<20,000 limit), 17.3 MB total deployment size (<25 MB per asset limit).
- [x] AdSense Publisher ID verified in `public/ads.txt` and base layout: `pub-4675079345370949`.
- [x] Google Consent Mode v2 active with default `denied` state.

---

## 3. Cutover Procedure (Deploy to Cloudflare)

### Option A: Cloudflare Workers Builds (Recommended)
1. In Cloudflare Dashboard, navigate to **Compute (Workers & Pages)** > **Create Application**.
2. Select **Connect to Git** and choose the repository `toolkitgen`.
3. Configure build settings:
   - **Framework Preset:** Astro
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist`
   - **Node.js Version:** `20`
4. Add Environment Variable:
   - `ASTRO_TELEMETRY_DISABLED`: `1`
5. Click **Save and Deploy**.

### Option B: Direct Deploy via Wrangler CLI
```bash
# Authenticate with Cloudflare
pnpm exec wrangler login

# Deploy static assets using wrangler.jsonc
pnpm exec wrangler deploy
```

### DNS Switchover:
1. In Cloudflare DNS for `toolkitgen.com`:
   - Route apex `toolkitgen.com` and `www.toolkitgen.com` to the Cloudflare Worker deployment.
   - Ensure Cloudflare Proxy (`orange cloud`) is enabled for automatic SSL/TLS termination.

---

## 4. Post-Cutover Verification Protocol

Perform live HTTP verification against production:

### 1. Canonical URLs & Core Pages (Must return HTTP 200):
```bash
curl -I https://toolkitgen.com/
curl -I https://toolkitgen.com/tool
curl -I https://toolkitgen.com/about
curl -I https://toolkitgen.com/contact
curl -I https://toolkitgen.com/privacy
curl -I https://toolkitgen.com/terms
curl -I https://toolkitgen.com/disclaimer
curl -I https://toolkitgen.com/sitemap.html
curl -I https://toolkitgen.com/sitemap.xml
curl -I https://toolkitgen.com/llms.txt
curl -I https://toolkitgen.com/llms-full.txt
```

### 2. Sample Tool URLs (Must return HTTP 200):
```bash
curl -I https://toolkitgen.com/tool/amsler_grid_macular
curl -I https://toolkitgen.com/tool/docker_compose_linter
curl -I https://toolkitgen.com/tool/airdrop_web_universal
curl -I https://toolkitgen.com/tool/iv_drip_rate_tapper
curl -I https://toolkitgen.com/tool/password_strength_visual_analyzer
curl -I https://toolkitgen.com/tool/black_scholes_heatmap
```

### 3. Legacy Redirect Parity (Must return HTTP 301):
```bash
# Test legacy Firebase redirected URLs
curl -I https://toolkitgen.com/tool/macular_degeneration_test
# Expected: 301 -> /tool/amsler_grid_macular

curl -I https://toolkitgen.com/tool/web_bluetooth_battery_monitor
# Expected: 301 -> /tool/ble_rssi_meter
```

### 4. Security Headers & Ads.txt:
```bash
# Inspect headers
curl -I https://toolkitgen.com/ | grep -Ei "(strict-transport|content-security|x-content-type|referrer-policy)"

# Verify ads.txt
curl -s https://toolkitgen.com/ads.txt | grep "pub-4675079345370949"
```

---

## 5. 14-Day Firebase Spark Rollback Protocol

If an unexpected critical regression occurs post-cutover, rollback can be executed within 3 minutes at zero financial cost:

### Rollback Steps:
1. **Redeploy Legacy Static Files to Firebase:**
   ```bash
   cd legacy
   # Deploy using Firebase CLI (Spark Free Tier)
   firebase use toolkitgen-default
   firebase deploy --only hosting
   ```
2. **Revert DNS (if DNS was pointed directly away from Firebase):**
   - In Cloudflare DNS, re-point `A` records to Firebase Hosting IPs:
     - `199.36.158.100`
3. **Verify Legacy Live:**
   ```bash
   curl -I https://toolkitgen.com/
   ```
4. **Post-Rollback Retention:**
   - Keep `legacy/` directory untouched until the 14-day stability window concludes.

---

## 6. Free-Tier Quota Health Monitoring

Monitor usage regularly in the Cloudflare Dashboard:
- **Workers Invocations:** Ensure static asset hits are bypassing script invocations via direct asset serving (`_headers` / `_redirects`).
- **Web Analytics:** Free, cookieless Cloudflare Web Analytics enabled under **Analytics & Logs** > **Web Analytics**.
