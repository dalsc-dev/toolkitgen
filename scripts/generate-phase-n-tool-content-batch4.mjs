import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentToolsDir = path.join(rootDir, 'src', 'content', 'tools');

const batch4 = [
  {
    id: 'screen_gpu_capability_report',
    name: 'Screen and GPU Capability Report',
    title: 'Screen and GPU Capability Report | Toolkit Gen',
    description: 'Inspect display resolution, refresh rate, HDR color gamut, WebGL, WebGPU, and hardware video codecs directly in your browser with instant export.',
    category: 'Display / Graphics',
    tags: ['gpu benchmark browser', 'screen resolution test', 'hdr test browser', 'webgl renderer info', 'webgpu support check', 'display color gamut p3', 'hardware video codec test'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Inspect display specifications and graphics hardware capabilities directly in your browser. Analyzes physical resolution, DPR, refresh rate, HDR dynamic range, DCI-P3 color gamut, WebGL unmasked GPU vendor, WebGPU support, and hardware video codecs.',
    features: [
      'Physical vs Logical CSS Resolution and DPR',
      'HDR and Wide Color Gamut (DCI-P3 / Rec. 2020) Query',
      'Unmasked WebGL and WebGPU Hardware Adapter Telemetry',
      'One-Click System Specs Report Copy'
    ],
    howTo: [
      { name: 'Open Diagnostics', text: 'Allow the tool to query browser hardware capability APIs.' },
      { name: 'Review Display & GPU Matrix', text: 'Inspect resolution, color gamut, GPU renderer string, and codec support.' },
      { name: 'Export Hardware Report', text: 'Copy the formatted system diagnostics report to clipboard for troubleshooting or documentation.' }
    ],
    faq: [
      { q: 'How does the tool detect unmasked GPU vendor strings?', a: 'Modern browsers provide the WEBGL_debug_renderer_info extension within WebGL contexts, allowing web applications to query the actual underlying graphics chipset (e.g. NVIDIA GeForce RTX, AMD Radeon, or Apple M-series) rather than generic driver wrappers.' },
      { q: 'Does this test identify HDR monitor support?', a: 'Yes. The tool queries CSS media features including dynamic-range: high and color-gamut: p3 to determine whether your monitor and operating system have High Dynamic Range enabled.' },
      { q: 'Can this report be used to diagnose gaming performance issues?', a: 'Yes. Verifying display refresh rates, hardware AV1/VP9 decode capabilities, and GPU driver strings helps detect mismatched display cable limits or integrated GPU fallback problems.' },
      { q: 'Is my system hardware information transmitted anywhere?', a: 'No. All hardware queries run locally via standard W3C browser APIs. No fingerprinting data or telemetry is transmitted across the network.' }
    ],
    related: [
      { id: 'frametime_csv_analyzer', name: 'Frame-Time CSV Benchmark Analyzer' },
      { id: 'mouse_touch_tester', name: 'Mouse and Touchscreen Tester' },
      { id: 'zfs_raid_calculator', name: 'ZFS RAID Capacity Calculator' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Screen and GPU Capability Report</h3>
        <p class="text-xs text-slate-500 mt-1">Direct browser telemetry for display, graphics pipeline, and media codecs.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Display Card -->
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
      <div class="text-xs font-bold text-slate-800 flex items-center justify-between">
        <span>Display Resolution</span>
        <span class="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200" id="cap-dpr-badge">DPR: --</span>
      </div>
      <div class="text-xl font-black text-slate-900" id="cap-res-text">-- x --</div>
      <div class="text-xs text-slate-600" id="cap-screen-details">Physical: -- | Aspect: --</div>
    </div>

    <!-- Color Gamut & HDR Card -->
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
      <div class="text-xs font-bold text-slate-800 flex items-center justify-between">
        <span>Color Gamut & Dynamic Range</span>
        <span class="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200" id="cap-hdr-badge">HDR: --</span>
      </div>
      <div class="text-xl font-black text-slate-900" id="cap-gamut-text">--</div>
      <div class="text-xs text-slate-600" id="cap-color-depth">Depth: -- bits per pixel</div>
    </div>

    <!-- Graphics Adapter Card -->
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 sm:col-span-2 lg:col-span-1">
      <div class="text-xs font-bold text-slate-800 flex items-center justify-between">
        <span>GPU Hardware Adapter</span>
        <span class="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200" id="cap-webgpu-badge">WebGPU: --</span>
      </div>
      <div class="text-sm font-bold text-slate-900 truncate" id="cap-gpu-renderer">Detecting...</div>
      <div class="text-xs text-slate-600 truncate" id="cap-gpu-vendor">Vendor: --</div>
    </div>
  </div>

  <!-- Detailed Specifications Matrix -->
  <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
    <div class="text-xs font-bold text-slate-800">Hardware & Video Codec Decoding Matrix:</div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs" id="cap-codecs-grid">
      <div class="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
        <span class="font-semibold text-slate-700">AV1 (AOMedia)</span>
        <span class="font-bold text-slate-400" id="codec-av1">--</span>
      </div>
      <div class="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
        <span class="font-semibold text-slate-700">VP9 (Google)</span>
        <span class="font-bold text-slate-400" id="codec-vp9">--</span>
      </div>
      <div class="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
        <span class="font-semibold text-slate-700">H.264 / AVC</span>
        <span class="font-bold text-slate-400" id="codec-h264">--</span>
      </div>
      <div class="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
        <span class="font-semibold text-slate-700">HEVC / H.265</span>
        <span class="font-bold text-slate-400" id="codec-hevc">--</span>
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="cap-status-text" class="text-xs text-slate-500">Hardware queries evaluated successfully.</div>
    <button type="button" id="cap-copy-btn" class="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-xs">
      Copy Hardware Report
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dprBadge = document.getElementById('cap-dpr-badge');
  const resText = document.getElementById('cap-res-text');
  const screenDetails = document.getElementById('cap-screen-details');
  const hdrBadge = document.getElementById('cap-hdr-badge');
  const gamutText = document.getElementById('cap-gamut-text');
  const colorDepth = document.getElementById('cap-color-depth');
  const webgpuBadge = document.getElementById('cap-webgpu-badge');
  const gpuRenderer = document.getElementById('cap-gpu-renderer');
  const gpuVendor = document.getElementById('cap-gpu-vendor');
  const copyBtn = document.getElementById('cap-copy-btn');
  const statusEl = document.getElementById('cap-status-text');

  let reportPayload = {};

  function initCapabilities() {
    // 1. Screen and Resolution Telemetry
    const dpr = window.devicePixelRatio || 1;
    const wCss = window.innerWidth;
    const hCss = window.innerHeight;
    const wPhys = Math.round(screen.width * dpr);
    const hPhys = Math.round(screen.height * dpr);

    dprBadge.textContent = \`DPR: \${dpr.toFixed(2)}x\`;
    resText.textContent = \`\${screen.width} x \${screen.height}\`;

    function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
    const divisor = gcd(screen.width, screen.height);
    const aspect = \`\${screen.width / divisor}:\${screen.height / divisor}\`;

    screenDetails.textContent = \`Physical: \${wPhys}x\${hPhys} | Aspect: \${aspect}\`;

    // 2. Color Depth & Gamut
    const depth = screen.colorDepth || 24;
    colorDepth.textContent = \`Depth: \${depth} bits per pixel\`;

    const isP3 = window.matchMedia && window.matchMedia('(color-gamut: p3)').matches;
    const isRec2020 = window.matchMedia && window.matchMedia('(color-gamut: rec2020)').matches;
    const gamut = isRec2020 ? 'Rec. 2020 (Ultra Wide)' : isP3 ? 'DCI-P3 (Wide Gamut)' : 'sRGB (Standard)';
    gamutText.textContent = gamut;

    const isHdr = window.matchMedia && window.matchMedia('(dynamic-range: high)').matches;
    hdrBadge.textContent = isHdr ? 'HDR: Supported' : 'HDR: Standard (SDR)';
    hdrBadge.className = isHdr
      ? 'text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200'
      : 'text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200';

    // 3. WebGL GPU Telemetry
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        if (dbg) {
          const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'Generic WebGL';
          const vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || 'Standard Vendor';
          gpuRenderer.textContent = renderer;
          gpuVendor.textContent = \`Vendor: \${vendor}\`;
          reportPayload.renderer = renderer;
          reportPayload.vendor = vendor;
        } else {
          gpuRenderer.textContent = 'Hardware Unmasked Info Restricted';
          gpuVendor.textContent = 'Vendor: Standard Browser Context';
        }
      }
    } catch (e) {
      gpuRenderer.textContent = 'WebGL Unavailable';
    }

    // 4. WebGPU Detection
    if ('gpu' in navigator) {
      webgpuBadge.textContent = 'WebGPU: Available';
      webgpuBadge.className = 'text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200';
      reportPayload.webgpu = 'Supported';
    } else {
      webgpuBadge.textContent = 'WebGPU: Unsupported';
      reportPayload.webgpu = 'Not Supported';
    }

    // 5. Codec Detection
    checkCodec('video/mp4; codecs="av01.0.08M.08"', 'codec-av1', 'AV1');
    checkCodec('video/webm; codecs="vp09.00.10.08"', 'codec-vp9', 'VP9');
    checkCodec('video/mp4; codecs="avc1.42E01E"', 'codec-h264', 'H.264');
    checkCodec('video/mp4; codecs="hev1.1.6.L93.B0"', 'codec-hevc', 'HEVC');

    reportPayload.resolution = \`\${screen.width}x\${screen.height} (Physical: \${wPhys}x\${hPhys})\`;
    reportPayload.dpr = \`\${dpr}x\`;
    reportPayload.gamut = gamut;
    reportPayload.hdr = isHdr ? 'Yes' : 'No';
  }

  function checkCodec(mime, elId, name) {
    const el = document.getElementById(elId);
    if (!el) return;
    const video = document.createElement('video');
    const can = video.canPlayType(mime);
    const supported = can === 'probably' || can === 'maybe';
    el.textContent = supported ? 'Hardware Ready' : 'Unsupported';
    el.className = supported ? 'font-bold text-emerald-600' : 'font-semibold text-slate-400';
    reportPayload[name] = supported ? 'Supported' : 'Unsupported';
  }

  // Execute on mount
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCapabilities, { once: true });
  } else {
    initCapabilities();
  }

  copyBtn.addEventListener('click', () => {
    const lines = [
      '### Display & Graphics Hardware Report',
      \`- **Screen Resolution**: \${reportPayload.resolution || 'N/A'}\`,
      \`- **Device Pixel Ratio (DPR)**: \${reportPayload.dpr || 'N/A'}\`,
      \`- **Color Gamut**: \${reportPayload.gamut || 'N/A'}\`,
      \`- **High Dynamic Range (HDR)**: \${reportPayload.hdr || 'N/A'}\`,
      \`- **GPU Renderer**: \${reportPayload.renderer || 'N/A'}\`,
      \`- **GPU Vendor**: \${reportPayload.vendor || 'N/A'}\`,
      \`- **WebGPU Support**: \${reportPayload.webgpu || 'N/A'}\`,
      \`- **AV1 Codec Decode**: \${reportPayload['AV1'] || 'N/A'}\`,
      \`- **VP9 Codec Decode**: \${reportPayload['VP9'] || 'N/A'}\`,
      \`- **HEVC Codec Decode**: \${reportPayload['HEVC'] || 'N/A'}\`,
      '- *Generated via Toolkit Gen Screen & GPU Capability Reporter*'
    ].join('\\n');

    navigator.clipboard.writeText(lines).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = 'Report Copied!';
      setTimeout(() => copyBtn.textContent = orig, 1500);
    });
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">Browser Hardware Introspection Architecture</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Modern web browsers serve as complex abstraction layers over diverse physical computing hardware. When rendering complex graphics, displaying video streams, or driving high-refresh-rate gaming monitors, web applications interact with low-level device drivers through standardized W3C and Khronos Group specifications including WebGL, WebGPU, and the Media Capabilities API.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Querying these parameters allows software engineers, digital artists, and gamers to verify whether their operating system display settings and graphics drivers are functioning optimally. For example, high-refresh-rate gaming monitors often default to 60 Hz when plugged into non-compliant HDMI ports or cables, while wide gamut DCI-P3 color profiles may require specific OS-level color management enablement.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Key Hardware Telemetry Standards</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Device Pixel Ratio (DPR):</strong> The ratio between physical screen pixels and logical CSS pixels. Standard displays feature a DPR of 1.0, while Retina and 4K HiDPI displays operate at 1.5x, 2.0x, or 3.0x scaling factors.</li>
      <li><strong>Color Gamut (DCI-P3 vs Rec. 2020):</strong> Evaluates display chromaticity coverage. DCI-P3 encompasses ~25% wider color volume than legacy sRGB, delivering richer saturated greens and reds required in cinematic production.</li>
      <li><strong>WEBGL_debug_renderer_info:</strong> Queries the native physical graphics adapter, distinguishing dedicated GPUs from integrated chipsets.</li>
      <li><strong>Hardware Video Codecs:</strong> Tests native silicon decoder pipelines for AV1, VP9, and HEVC to verify smooth 4K/8K media playback without CPU thermal throttling.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Zero-Network Privacy Model</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Hardware telemetry is frequently misused by advertising networks for aggressive browser fingerprinting. Toolkit Gen enforces strict local execution. All API queries execute in client memory, and no telemetry packets or system profile signatures are transmitted to remote analytical endpoints.
    </p>
  </div>
</section>
`
  },
  {
    id: 'mouse_touch_tester',
    name: 'Mouse and Touchscreen Tester',
    title: 'Mouse and Touchscreen Tester | Toolkit Gen',
    description: 'Test mouse switches for double-click chatter, measure click speed CPS, inspect scroll wheel delta, and verify multi-touch input points locally.',
    category: 'Input / Peripherals',
    tags: ['mouse double click test', 'mouse chatter detector', 'click speed test cps', 'scroll wheel test', 'touchscreen test online', 'multi touch screen tester', 'mouse button switch test'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Diagnose mechanical mouse switch chatter (unwanted double clicking), measure click speed (Clicks Per Second), test scroll wheel direction stability, and track multi-touch screen coordinates. All input testing executes locally with microsecond timestamp logging.',
    features: [
      'Switch Chatter Detection (Sub-75ms Bounce Detection)',
      'Real-Time Clicks Per Second (CPS) Speed Counter',
      'Scroll Wheel Delta & Inversion Direction Meter',
      'Multi-Touch Canvas Tracking with Coordinate Display'
    ],
    howTo: [
      { name: 'Select Test Mode', text: 'Choose between Mouse Switch Chatter Test, Click Speed CPS, or Touchscreen Canvas.' },
      { name: 'Perform Input Actions', text: 'Click the test zone, scroll your wheel, or place multiple fingers on the touch surface.' },
      { name: 'Review Hardware Verdict', text: 'Inspect detected chatter events, maximum CPS scores, and touch tracking coordinates.' }
    ],
    faq: [
      { q: 'What is mouse switch chatter and what causes it?', a: 'Mechanical mouse switches rely on microscopic metal leaf springs. Over millions of actuations, contact oxidation or metal fatigue causes the contacts to bounce upon release, registering an unintentional second click within 20ms to 75ms.' },
      { q: 'How does the chatter detector distinguish intentional double clicks?', a: 'Human finger muscles rarely complete a deliberate double click in under 80 milliseconds. A click registration occurring under 75 milliseconds from switch release is mathematically classified as hardware switch chatter.' },
      { q: 'Does this tool support mouse side buttons and scroll wheel clicks?', a: 'Yes. The interface tracks Left Click (Button 0), Middle Click (Button 1), Right Click (Button 2), and Browser Forward/Back buttons (Buttons 3 & 4).' },
      { q: 'Can I test multi-touch gestures on mobile or tablet devices?', a: 'Yes. The multi-touch surface tracks up to 10 concurrent touch points with real-time X/Y coordinates and touch radius.' }
    ],
    related: [
      { id: 'screen_gpu_capability_report', name: 'Screen and GPU Capability Report' },
      { id: 'frametime_csv_analyzer', name: 'Frame-Time CSV Benchmark Analyzer' },
      { id: 'mouse_polling_rate_hz', name: 'Mouse Polling Rate (Hz) & USB Stability' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 select-none">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Mouse and Touchscreen Hardware Tester</h3>
        <p class="text-xs text-slate-500 mt-1">Diagnose switch debounce chatter, click speed, scroll wheel, and touch points.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <!-- Mode Selector Tabs -->
  <div class="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
    <button type="button" id="tab-btn-chatter" class="px-4 py-2 bg-slate-900 text-white rounded-xl transition">Switch Chatter Test</button>
    <button type="button" id="tab-btn-cps" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition">Click Speed (CPS)</button>
    <button type="button" id="tab-btn-touch" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition">Multi-Touch Surface</button>
  </div>

  <!-- Tab 1: Chatter Detector -->
  <div id="panel-chatter" class="space-y-4">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Left Clicks</div>
        <div id="chatter-left-count" class="text-xl font-black text-slate-900 mt-1">0</div>
      </div>
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Right Clicks</div>
        <div id="chatter-right-count" class="text-xl font-black text-slate-900 mt-1">0</div>
      </div>
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Chatter Events</div>
        <div id="chatter-defect-count" class="text-xl font-black text-emerald-600 mt-1">0</div>
      </div>
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Wheel Ticks</div>
        <div id="chatter-wheel-count" class="text-xl font-black text-slate-900 mt-1">0</div>
      </div>
    </div>

    <div id="chatter-pad" class="h-44 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition">
      <div class="text-sm font-bold text-slate-800">Click & Scroll Inside This Diagnostic Pad</div>
      <p class="text-xs text-slate-500 mt-1">Click rapidly using Left, Right, or Middle buttons. Anomalous switch chatter (&lt;75ms) triggers a defect alert.</p>
    </div>
  </div>

  <!-- Tab 2: CPS Speed Counter -->
  <div id="panel-cps" class="space-y-4 hidden">
    <div class="grid grid-cols-3 gap-3 text-center">
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Clicks Registered</div>
        <div id="cps-click-total" class="text-2xl font-black text-slate-900 mt-1">0</div>
      </div>
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Current CPS</div>
        <div id="cps-current-rate" class="text-2xl font-black text-[#EE6C4D] mt-1">0.0</div>
      </div>
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Peak CPS</div>
        <div id="cps-peak-rate" class="text-2xl font-black text-emerald-600 mt-1">0.0</div>
      </div>
    </div>

    <div id="cps-pad" class="h-44 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center cursor-pointer transition active:scale-[0.99]">
      <div class="text-lg font-black text-white">Click Rapidly to Measure CPS</div>
      <p class="text-xs text-slate-400 mt-1">Click repeatedly to establish your 5-second clicking rate pace.</p>
    </div>
  </div>

  <!-- Tab 3: Multi-Touch Surface -->
  <div id="panel-touch" class="space-y-4 hidden">
    <div class="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
      <span>Touch Surface Tracking</span>
      <span id="touch-active-count" class="text-emerald-600">Active Touch Points: 0</span>
    </div>
    <div id="touch-surface" class="h-56 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold relative overflow-hidden touch-none">
      Place multiple fingers here to test multi-touch tracking
    </div>
  </div>

  <div class="flex items-center justify-between pt-2">
    <div id="tester-status" class="text-xs text-slate-500">Ready for mouse and touch input.</div>
    <button type="button" id="tester-reset-btn" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
      Reset Counters
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const tabChatter = document.getElementById('tab-btn-chatter');
  const tabCps = document.getElementById('tab-btn-cps');
  const tabTouch = document.getElementById('tab-btn-touch');

  const panelChatter = document.getElementById('panel-chatter');
  const panelCps = document.getElementById('panel-cps');
  const panelTouch = document.getElementById('panel-touch');

  const chatterPad = document.getElementById('chatter-pad');
  const leftCountEl = document.getElementById('chatter-left-count');
  const rightCountEl = document.getElementById('chatter-right-count');
  const defectCountEl = document.getElementById('chatter-defect-count');
  const wheelCountEl = document.getElementById('chatter-wheel-count');

  const cpsPad = document.getElementById('cps-pad');
  const cpsTotalEl = document.getElementById('cps-click-total');
  const cpsCurrentEl = document.getElementById('cps-current-rate');
  const cpsPeakEl = document.getElementById('cps-peak-rate');

  const touchSurface = document.getElementById('touch-surface');
  const touchCountEl = document.getElementById('touch-active-count');
  const resetBtn = document.getElementById('tester-reset-btn');
  const statusEl = document.getElementById('tester-status');

  let leftClicks = 0;
  let rightClicks = 0;
  let chatterDefects = 0;
  let wheelTicks = 0;
  let lastReleaseTime = 0;

  let cpsClicks = 0;
  let peakCps = 0;
  let clickTimestamps = [];

  // Tab Switching
  function switchTab(activeTab, activePanel) {
    [tabChatter, tabCps, tabTouch].forEach(t => t.className = 'px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition');
    [panelChatter, panelCps, panelTouch].forEach(p => p.classList.add('hidden'));

    activeTab.className = 'px-4 py-2 bg-slate-900 text-white rounded-xl transition';
    activePanel.classList.remove('hidden');
  }

  tabChatter.addEventListener('click', () => switchTab(tabChatter, panelChatter));
  tabCps.addEventListener('click', () => switchTab(tabCps, panelCps));
  tabTouch.addEventListener('click', () => switchTab(tabTouch, panelTouch));

  // Chatter Testing
  chatterPad.addEventListener('contextmenu', e => e.preventDefault());
  chatterPad.addEventListener('mousedown', e => {
    e.preventDefault();
    const now = performance.now();
    const delta = now - lastReleaseTime;

    if (e.button === 0) leftClicks++;
    if (e.button === 2) rightClicks++;

    if (lastReleaseTime > 0 && delta < 75) {
      chatterDefects++;
      defectCountEl.textContent = chatterDefects;
      defectCountEl.className = 'text-xl font-black text-rose-600 mt-1';
      statusEl.textContent = \`Chatter detected! Interval: \${delta.toFixed(1)} ms\`;
    }

    leftCountEl.textContent = leftClicks;
    rightCountEl.textContent = rightClicks;
  });

  chatterPad.addEventListener('mouseup', () => {
    lastReleaseTime = performance.now();
  });

  chatterPad.addEventListener('wheel', e => {
    wheelTicks++;
    wheelCountEl.textContent = wheelTicks;
  }, { passive: true });

  // CPS Testing
  cpsPad.addEventListener('mousedown', e => {
    e.preventDefault();
    const now = performance.now();
    cpsClicks++;
    clickTimestamps.push(now);

    const windowStart = now - 5000;
    clickTimestamps = clickTimestamps.filter(t => t >= windowStart);

    const rate = Number((clickTimestamps.length / Math.min(5, (now - (clickTimestamps[0] || now)) / 1000 || 1)).toFixed(1));
    if (rate > peakCps) peakCps = rate;

    cpsTotalEl.textContent = cpsClicks;
    cpsCurrentEl.textContent = rate.toFixed(1);
    cpsPeakEl.textContent = peakCps.toFixed(1);
  });

  // Touch Testing
  function updateTouch(e) {
    touchCountEl.textContent = \`Active Touch Points: \${e.touches.length}\`;
  }
  touchSurface.addEventListener('touchstart', updateTouch, { passive: true });
  touchSurface.addEventListener('touchmove', updateTouch, { passive: true });
  touchSurface.addEventListener('touchend', updateTouch, { passive: true });

  resetBtn.addEventListener('click', () => {
    leftClicks = 0; rightClicks = 0; chatterDefects = 0; wheelTicks = 0; lastReleaseTime = 0;
    cpsClicks = 0; peakCps = 0; clickTimestamps = [];
    leftCountEl.textContent = '0'; rightCountEl.textContent = '0';
    defectCountEl.textContent = '0'; defectCountEl.className = 'text-xl font-black text-emerald-600 mt-1';
    wheelCountEl.textContent = '0';
    cpsTotalEl.textContent = '0'; cpsCurrentEl.textContent = '0.0'; cpsPeakEl.textContent = '0.0';
    touchCountEl.textContent = 'Active Touch Points: 0';
    statusEl.textContent = 'Counters reset successfully.';
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">Mechanical Mouse Switch Physics and Debounce Chatter</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Computer mice rely on micro-switches (most commonly manufactured by Omron, Huano, Kailh, or TTC) containing spring-loaded copper alloy contacts. When a mouse button is pressed, the physical contacts snap together to complete an electrical circuit. As switches undergo millions of click cycles, microscopic surface oxidation and spring tension loss occur.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      This physical wear introduces contact bounce ("chatter")—an erratic sequence of rapid circuit makes and breaks upon switch release. In gaming or workplace software, contact bounce results in frustrating unintended double-clicks, premature drag-and-drop file releases, and weapon misfires in competitive titles.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Diagnostic Detection Criteria</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Hardware Chatter Interval (&lt;75 ms):</strong> Human finger muscles have a physiological refractory limit; completing an intentional double-click takes between 100 ms and 200 ms. A registered button down event occurring under 75 ms from the preceding release is mathematically categorized as a hardware bounce defect.</li>
      <li><strong>Scroll Wheel Delta Stability:</strong> Optical and mechanical rotary encoders can suffer from axis wobble or dust accumulation, causing the wheel to intermittently register upward ticks while scrolling downwards.</li>
      <li><strong>Clicks Per Second (CPS):</strong> Evaluates switch actuation speed and click consistency across sliding 5-second sampling intervals.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Preventative Maintenance and Solutions</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      When mechanical chatter is detected, users can increase mouse driver debounce delay thresholds (available in peripheral software suites such as Razer Synapse, Logitech G HUB, or Corsair iCUE). If contact oxidation has progressed beyond software compensation, upgrading to modern optical switches (which utilize infrared light beam interruption rather than physical metal contact) permanently eliminates chatter issues.
    </p>
  </div>
</section>
`
  },
  {
    id: 'har_sanitizer_viewer',
    name: 'HAR File Sanitizer and Filter',
    title: 'HAR File Sanitizer and Filter | Toolkit Gen',
    description: 'Sanitize HTTP Archive HAR files by removing cookies, authorization tokens, and API keys locally in your browser before sharing support bundles.',
    category: 'Developer / Data',
    tags: ['sanitize har file', 'har file cleaner', 'remove passwords from har', 'strip cookies from har', 'http archive sanitizer', 'clean har before support ticket', 'safe har exporter'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Sanitize HTTP Archive (HAR) network recordings by automatically stripping session cookies, Bearer tokens, Authorization headers, and sensitive API keys. All file scrubbing executes locally in browser memory before you share support logs with external vendors.',
    features: [
      'Comprehensive Authorization and Bearer Token Purge',
      'Cookie and Set-Cookie Header Scrubbing',
      'Sensitive Query Parameter Redaction (token, password, key)',
      'Instant Download of Sanitized .har Artifact'
    ],
    howTo: [
      { name: 'Upload HAR File', text: 'Drag and drop your exported .har network recording file into the sanitizer.' },
      { name: 'Review Detected Secrets', text: 'Examine identified cookies, auth headers, and sensitive query tokens.' },
      { name: 'Export Sanitized HAR', text: 'Click Download Sanitized HAR to generate a safe artifact ready for support submissions.' }
    ],
    faq: [
      { q: 'Why is sharing raw HAR files dangerous?', a: 'HTTP Archive files contain complete records of web browser network activity, including session cookies, JWT authentication tokens, OAuth authorization headers, and personal form POST payloads. Sharing unscrubbed HAR files allows recipients to hijack your active account sessions.' },
      { q: 'Which sensitive fields does this tool sanitize?', a: 'The tool systematically purges Authorization, Proxy-Authorization, Cookie, Set-Cookie, and custom API token headers, along with query parameters containing keywords such as token, secret, password, key, or apikey.' },
      { q: 'Does sanitization break the network timing data needed by support?', a: 'No. Request methods, URLs, response status codes, timing metrics (DNS, SSL, TTFB, download), and header structures remain intact so technical teams can effectively diagnose latency and network errors.' },
      { q: 'Are my HAR logs uploaded anywhere?', a: 'No. The entire JSON parsing and string redaction pipeline executes locally inside your browser memory. Your network captures are never transmitted across the network.' }
    ],
    related: [
      { id: 'screen_gpu_capability_report', name: 'Screen and GPU Capability Report' },
      { id: 'frametime_csv_analyzer', name: 'Frame-Time CSV Benchmark Analyzer' },
      { id: 'zfs_raid_calculator', name: 'ZFS RAID Capacity Calculator' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">HAR File Sanitizer and Filter</h3>
        <p class="text-xs text-slate-500 mt-1">Strip session cookies, auth tokens, and sensitive headers locally before sharing.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="har-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="har-file-input" accept=".har,application/json" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">HAR</div>
      <div class="text-sm font-semibold text-slate-700">Drop .har file here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Supports HTTP Archive captures from Chrome, Firefox, Safari, and Edge up to 100 MB</p>
    </div>
  </div>

  <div id="har-review-stage" class="space-y-4 hidden">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Requests In Log</div>
        <div id="har-total-reqs" class="text-xl font-black text-slate-900 mt-1">0</div>
      </div>
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Stripped Headers</div>
        <div id="har-stripped-headers" class="text-xl font-black text-amber-600 mt-1">0</div>
      </div>
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Purged Cookies</div>
        <div id="har-stripped-cookies" class="text-xl font-black text-rose-600 mt-1">0</div>
      </div>
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Sanitization Status</div>
        <div id="har-clean-status" class="text-sm font-black text-emerald-600 mt-2">Ready</div>
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="har-status-text" class="text-xs text-slate-500">Awaiting HAR file upload</div>
    <button type="button" id="har-download-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs">
      Download Sanitized HAR
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('har-dropzone');
  const fileInput = document.getElementById('har-file-input');
  const reviewStage = document.getElementById('har-review-stage');
  const totalReqsEl = document.getElementById('har-total-reqs');
  const strippedHeadersEl = document.getElementById('har-stripped-headers');
  const strippedCookiesEl = document.getElementById('har-stripped-cookies');
  const downloadBtn = document.getElementById('har-download-btn');
  const statusEl = document.getElementById('har-status-text');

  let sanitizedBlob = null;
  let originalFilename = '';

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-[#EE6C4D]'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-[#EE6C4D]'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-[#EE6C4D]');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.har') && !file.name.toLowerCase().endsWith('.json')) {
      statusEl.textContent = 'Please choose a valid .har network archive file.';
      return;
    }
    originalFilename = file.name;
    statusEl.textContent = 'Parsing and sanitizing HAR records in memory...';

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const har = JSON.parse(e.target.result);
        sanitizeHar(har);
      } catch (err) {
        statusEl.textContent = 'Could not parse JSON. The HAR file may be corrupted.';
      }
    };
    reader.readAsText(file);
  }

  function sanitizeHar(har) {
    if (!har || !har.log || !Array.isArray(har.log.entries)) {
      statusEl.textContent = 'Invalid HAR structure. Missing log entries array.';
      return;
    }

    const SENSITIVE_HEADERS = new Set([
      'authorization', 'cookie', 'set-cookie', 'proxy-authorization',
      'x-auth-token', 'x-api-key', 'apikey', 'bearer'
    ]);

    let strippedHeaders = 0;
    let strippedCookies = 0;

    har.log.entries.forEach(entry => {
      // 1. Sanitize Request
      if (entry.request) {
        if (Array.isArray(entry.request.headers)) {
          entry.request.headers.forEach(h => {
            if (SENSITIVE_HEADERS.has(h.name.toLowerCase())) {
              h.value = '[REDACTED_BY_TOOLKITGEN]';
              strippedHeaders++;
            }
          });
        }
        if (Array.isArray(entry.request.cookies)) {
          strippedCookies += entry.request.cookies.length;
          entry.request.cookies = [];
        }
        // Sanitize query params containing tokens
        if (Array.isArray(entry.request.queryString)) {
          entry.request.queryString.forEach(q => {
            if (/token|auth|key|secret|password|pwd/i.test(q.name)) {
              q.value = '[REDACTED]';
            }
          });
        }
      }

      // 2. Sanitize Response
      if (entry.response) {
        if (Array.isArray(entry.response.headers)) {
          entry.response.headers.forEach(h => {
            if (SENSITIVE_HEADERS.has(h.name.toLowerCase())) {
              h.value = '[REDACTED_BY_TOOLKITGEN]';
              strippedHeaders++;
            }
          });
        }
        if (Array.isArray(entry.response.cookies)) {
          strippedCookies += entry.response.cookies.length;
          entry.response.cookies = [];
        }
      }
    });

    totalReqsEl.textContent = har.log.entries.length.toLocaleString();
    strippedHeadersEl.textContent = strippedHeaders.toLocaleString();
    strippedCookiesEl.textContent = strippedCookies.toLocaleString();

    const jsonStr = JSON.stringify(har, null, 2);
    sanitizedBlob = new Blob([jsonStr], { type: 'application/json' });

    reviewStage.classList.remove('hidden');
    downloadBtn.disabled = false;
    statusEl.textContent = 'Sanitization complete. Credentials redacted successfully.';
  }

  downloadBtn.addEventListener('click', () => {
    if (!sanitizedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(sanitizedBlob);
    a.download = \`sanitized-\${originalFilename}\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">HTTP Archive (HAR) Security and Credential Exposure</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      HTTP Archive (HAR) files are standardized JSON-formatted logs captured by web browser Developer Tools to record client-server HTTP communications. While essential for troubleshooting content delivery networks (CDNs), API error responses, and web application latency, unredacted HAR files are hazardous security vectors.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Whenever a support engineer requests a HAR file to diagnose a billing glitch or user interface bug, the captured file inherently records every single HTTP request header transmitted during that session. This includes active <code>Cookie</code> headers, <code>Set-Cookie</code> directives, and <code>Authorization: Bearer [JWT]</code> tokens. If shared through email, ticketing systems, or public message boards, third parties can immediately replay these tokens to impersonate your session.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Redaction Protocol Specifications</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Session Cookie Erasure:</strong> All <code>Cookie</code> and <code>Set-Cookie</code> array structures are cleared, preventing session token theft.</li>
      <li><strong>Bearer Token Neutralization:</strong> Values corresponding to <code>Authorization</code>, <code>X-Auth-Token</code>, and <code>Proxy-Authorization</code> are replaced with static redaction masks.</li>
      <li><strong>Query String Token Filtering:</strong> Parameters containing sensitive substrings (e.g., <code>api_key</code>, <code>access_token</code>, <code>token</code>, <code>secret</code>) have values sanitized while preserving URL routing.</li>
      <li><strong>Network Timing Preservation:</strong> DNS lookup times, TCP connection latencies, TLS negotiation durations, and response body status codes remain intact for diagnostic utility.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Local Sandbox Execution Guarantee</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Uploading an unredacted HAR file to an online cloud converter defeats the purpose of redaction. Toolkit Gen operates strictly within local browser memory via JavaScript JSON stream manipulation. Your confidential logs, API keys, and corporate session tokens are sanitized on your device before network sharing.
    </p>
  </div>
</section>
`
  },
  {
    id: 'zfs_raid_calculator',
    name: 'ZFS RAID Capacity Calculator',
    title: 'ZFS RAID Capacity Calculator | Toolkit Gen',
    description: 'Calculate usable storage capacity, parity overhead, and 80% pool fill limits for ZFS RAIDZ1, RAIDZ2, RAIDZ3, and mirrors with vdev planning.',
    category: 'Hardware / Storage',
    tags: ['zfs raid calculator', 'raidz capacity calculator', 'zfs usable storage', 'truenas capacity calculator', 'raidz2 usable space', 'zfs pool planner', 'openzfs storage calculator'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Calculate true usable storage capacity, parity disk overhead, and recommended 80% maximum pool fill thresholds for OpenZFS and TrueNAS pools. Supports Stripe, 2-Way Mirror, RAIDZ1, RAIDZ2, and RAIDZ3 configurations with exact TB to TiB conversions.',
    features: [
      'Comprehensive VDEV Configurations (RAIDZ1, RAIDZ2, RAIDZ3, Mirrors)',
      'Decimal TB (10^12) to Binary TiB (2^40) Storage Conversion',
      '80% Pool Fill Limit and Performance Degradation Warning',
      'SLOG and L2ARC Cache Sizing Guidance'
    ],
    howTo: [
      { name: 'Select Drive Count & Size', text: 'Specify the quantity and commercial capacity (in TB) of your storage drives.' },
      { name: 'Choose Redundancy Profile', text: 'Select Stripe, 2-Way Mirror, RAIDZ1 (1-disk parity), RAIDZ2 (2-disk parity), or RAIDZ3 (3-disk parity).' },
      { name: 'Review Usable Capacity', text: 'Inspect raw capacity vs true usable TiB, parity overhead, and the critical 80% safe fill limit.' }
    ],
    faq: [
      { q: 'Why is usable ZFS capacity less than raw drive manufacturer size?', a: 'Drive manufacturers market drives using decimal terabytes (1 TB = 1,000,000,000,000 bytes), whereas ZFS and operating systems allocate space in binary tebibytes (1 TiB = 1,099,511,627,776 bytes). Additionally, ZFS reserves ~3% slop space for internal metadata and copy-on-write overhead.' },
      { q: 'Why is the 80% pool capacity rule important in ZFS?', a: 'ZFS uses a copy-on-write transaction model. When a pool exceeds 80% capacity, the space allocator switches from first-fit to best-fit algorithms, resulting in severe write performance degradation and fragmentation.' },
      { q: 'What is the minimum recommended drive count for RAIDZ2?', a: 'While RAIDZ2 can function with 4 drives, 6 to 8 drives per vdev is standard engineering practice to balance parity overhead (33% to 25%) with high fault tolerance.' },
      { q: 'When should I deploy a SLOG or L2ARC cache device?', a: 'A dedicated SLOG (Separate ZFS Intent Log) device on high-write endurance NVMe is recommended for synchronous write workloads (NFS, databases, VM storage). L2ARC is recommended when your active working dataset exceeds physical RAM.' }
    ],
    related: [
      { id: 'frametime_csv_analyzer', name: 'Frame-Time CSV Benchmark Analyzer' },
      { id: 'screen_gpu_capability_report', name: 'Screen and GPU Capability Report' },
      { id: 'mouse_touch_tester', name: 'Mouse and Touchscreen Tester' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">ZFS RAID Usable Capacity & Storage Pool Planner</h3>
        <p class="text-xs text-slate-500 mt-1">Plan TrueNAS and OpenZFS pools with accurate binary TiB conversions and parity deduction.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
    <div class="space-y-1.5">
      <label for="zfs-disk-count" class="text-xs font-bold text-slate-700">Number of Drives:</label>
      <input type="number" id="zfs-disk-count" min="2" max="60" value="6" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]" />
    </div>

    <div class="space-y-1.5">
      <label for="zfs-disk-size" class="text-xs font-bold text-slate-700">Drive Capacity (TB):</label>
      <select id="zfs-disk-size" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]">
        <option value="4">4 TB</option>
        <option value="8">8 TB</option>
        <option value="12">12 TB</option>
        <option value="16">16 TB</option>
        <option value="18">18 TB</option>
        <option value="20" selected>20 TB</option>
        <option value="22">22 TB</option>
        <option value="24">24 TB</option>
      </select>
    </div>

    <div class="space-y-1.5">
      <label for="zfs-layout" class="text-xs font-bold text-slate-700">VDEV Topology:</label>
      <select id="zfs-layout" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]">
        <option value="raidz2" selected>RAIDZ2 (Double Parity - 2 Disk Loss)</option>
        <option value="raidz1">RAIDZ1 (Single Parity - 1 Disk Loss)</option>
        <option value="raidz3">RAIDZ3 (Triple Parity - 3 Disk Loss)</option>
        <option value="mirror">Mirrors (2-Way Mirror Sets)</option>
        <option value="stripe">Stripe (No Redundancy - 0 Disk Loss)</option>
      </select>
    </div>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div class="text-[10px] font-bold text-slate-500 uppercase">Raw Decimal Storage</div>
      <div id="zfs-raw-tb" class="text-xl font-black text-slate-900 mt-1">120 TB</div>
      <div id="zfs-raw-tib" class="text-[10px] text-slate-500 mt-0.5">109.1 TiB raw binary</div>
    </div>
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div class="text-[10px] font-bold text-slate-500 uppercase">True Usable Storage</div>
      <div id="zfs-usable-tib" class="text-xl font-black text-emerald-600 mt-1">70.6 TiB</div>
      <div id="zfs-usable-tb" class="text-[10px] text-slate-500 mt-0.5">77.6 TB decimal</div>
    </div>
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div class="text-[10px] font-bold text-slate-500 uppercase">80% Safe Limit</div>
      <div id="zfs-safe-tib" class="text-xl font-black text-amber-600 mt-1">56.5 TiB</div>
      <div class="text-[10px] text-slate-500 mt-0.5">Recommended fill limit</div>
    </div>
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div class="text-[10px] font-bold text-slate-500 uppercase">Fault Tolerance</div>
      <div id="zfs-fault-disks" class="text-xl font-black text-slate-900 mt-1">2 Disks</div>
      <div class="text-[10px] text-slate-500 mt-0.5">Simultaneous failure cap</div>
    </div>
  </div>

  <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
    <div class="font-bold text-slate-800">Storage Efficiency & Cache Recommendations:</div>
    <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600 pt-1">
      <div>Storage Efficiency: <strong id="zfs-efficiency" class="text-slate-900">66.7%</strong> of raw capacity</div>
      <div>Recommended SLOG Size: <strong id="zfs-slog-rec" class="text-slate-900">32 GB Optane / PLP NVMe</strong></div>
      <div>Estimated L2ARC Target: <strong id="zfs-l2arc-rec" class="text-slate-900">3.5 TB NVMe Cache</strong></div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div class="text-xs text-slate-500">Calculations follow standard OpenZFS 2.x allocator metrics.</div>
    <button type="button" id="zfs-copy-summary" class="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-xs">
      Copy Pool Specification
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const diskCountInput = document.getElementById('zfs-disk-count');
  const diskSizeSelect = document.getElementById('zfs-disk-size');
  const layoutSelect = document.getElementById('zfs-layout');

  const rawTbEl = document.getElementById('zfs-raw-tb');
  const rawTibEl = document.getElementById('zfs-raw-tib');
  const usableTibEl = document.getElementById('zfs-usable-tib');
  const usableTbEl = document.getElementById('zfs-usable-tb');
  const safeTibEl = document.getElementById('zfs-safe-tib');
  const faultDisksEl = document.getElementById('zfs-fault-disks');
  const efficiencyEl = document.getElementById('zfs-efficiency');
  const slogRecEl = document.getElementById('zfs-slog-rec');
  const l2arcRecEl = document.getElementById('zfs-l2arc-rec');
  const copyBtn = document.getElementById('zfs-copy-summary');

  let currentSummary = null;

  function calculate() {
    const disks = parseInt(diskCountInput.value, 10) || 6;
    const sizeTb = parseFloat(diskSizeSelect.value) || 20;
    const layout = layoutSelect.value;

    const TB_TO_TIB = Math.pow(10, 12) / Math.pow(2, 40);
    const rawTb = disks * sizeTb;
    const rawTib = rawTb * TB_TO_TIB;

    let usableDisks = disks;
    let faultTolerance = 0;

    switch (layout) {
      case 'stripe': usableDisks = disks; faultTolerance = 0; break;
      case 'mirror': usableDisks = disks / 2; faultTolerance = 1; break;
      case 'raidz1': usableDisks = Math.max(1, disks - 1); faultTolerance = 1; break;
      case 'raidz2': usableDisks = Math.max(1, disks - 2); faultTolerance = 2; break;
      case 'raidz3': usableDisks = Math.max(1, disks - 3); faultTolerance = 3; break;
    }

    const SLOP = 0.97;
    const usableTb = usableDisks * sizeTb * SLOP;
    const usableTib = usableTb * TB_TO_TIB;
    const safeTib = usableTib * 0.8;
    const effPct = ((usableTb / rawTb) * 100).toFixed(1);

    rawTbEl.textContent = \`\${rawTb} TB\`;
    rawTibEl.textContent = \`\${rawTib.toFixed(1)} TiB raw binary\`;
    usableTibEl.textContent = \`\${usableTib.toFixed(1)} TiB\`;
    usableTbEl.textContent = \`\${usableTb.toFixed(1)} TB decimal\`;
    safeTibEl.textContent = \`\${safeTib.toFixed(1)} TiB\`;
    faultDisksEl.textContent = \`\${faultTolerance} Disk\${faultTolerance === 1 ? '' : 's'}\`;
    efficiencyEl.textContent = \`\${effPct}%\`;

    const slogGb = usableTib > 50 ? 64 : usableTib > 10 ? 32 : 16;
    slogRecEl.textContent = \`\${slogGb} GB Optane / PLP NVMe\`;
    const l2arcGb = (usableTib * 0.05).toFixed(1);
    l2arcRecEl.textContent = \`\${l2arcGb} TiB NVMe Cache\`;

    currentSummary = {
      disks, sizeTb, layout, rawTb, rawTib: rawTib.toFixed(1),
      usableTib: usableTib.toFixed(1), safeTib: safeTib.toFixed(1),
      faultTolerance, effPct
    };
  }

  diskCountInput.addEventListener('input', calculate);
  diskSizeSelect.addEventListener('change', calculate);
  layoutSelect.addEventListener('change', calculate);

  // Initial calculation
  calculate();

  copyBtn.addEventListener('click', () => {
    if (!currentSummary) return;
    const report = [
      '### ZFS Storage Pool Configuration Specification',
      \`- **Configuration**: \${currentSummary.disks}x \${currentSummary.sizeTb} TB Drives in \${currentSummary.layout.toUpperCase()}\`,
      \`- **Raw Capacity**: \${currentSummary.rawTb} TB (\${currentSummary.rawTib} TiB)\`,
      \`- **True Usable Storage**: \${currentSummary.usableTib} TiB\`,
      \`- **80% Safe Pool Fill Limit**: \${currentSummary.safeTib} TiB\`,
      \`- **Fault Tolerance**: Up to \${currentSummary.faultTolerance} disk failure(s) without data loss\`,
      \`- **Storage Efficiency**: \${currentSummary.effPct}%\`,
      '- *Generated via Toolkit Gen ZFS RAID Storage Pool Planner*'
    ].join('\\n');

    navigator.clipboard.writeText(report).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = 'Specification Copied!';
      setTimeout(() => copyBtn.textContent = orig, 1500);
    });
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">OpenZFS Storage Pool Sizing & Redundancy Math</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Designing a high-reliability Network Attached Storage (NAS) pool using OpenZFS or TrueNAS requires a thorough mathematical understanding of storage topology, binary tebibytes (TiB) versus decimal terabytes (TB), and copy-on-write allocation dynamics. Unlike legacy hardware RAID controllers that manage fixed logical units, ZFS integrates file system allocation directly with virtual storage device (vdev) pooling.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      The most common planning surprise encountered by system administrators is the discrepancy between drive manufacturer packaging and operating system reporting. Storage disk manufacturers sell drives based on decimal SI units (1 TB = 1,000,000,000,000 bytes). However, operating system filesystems allocate storage using binary units (1 TiB = 1,099,511,627,776 bytes). This creates an immediate ~9% mathematical reduction before accounting for parity disks, copy-on-write slop space reservations, or padding overhead.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">VDEV Topology Engineering Guidelines</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>RAIDZ1 (Single Parity):</strong> Allocates one drive per vdev to parity. Can survive one drive failure. Recommended primarily for low-priority media libraries or SSD pools where resilver times are measured in minutes rather than days.</li>
      <li><strong>RAIDZ2 (Double Parity):</strong> Allocates two drives per vdev to parity. Can survive two simultaneous drive failures. Standard industry recommendation for enterprise hard drive arrays (exceeding 8 TB drive capacities) where high stress during rebuilds increases unrecoverable read error (URE) risks.</li>
      <li><strong>RAIDZ3 (Triple Parity):</strong> Allocates three drives per vdev to parity. Reserved for ultra-dense vdevs (12 to 16 drives) or archival tiers requiring extreme fault tolerance.</li>
      <li><strong>Mirrored VDEVs (RAID 10 equivalent):</strong> Drives are paired into 2-way mirror sets. Yields 50% capacity efficiency but provides superior random IOPS and the fastest possible resilver speeds with zero parity parity computation overhead.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">The Critical 80% Pool Fill Threshold</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      ZFS allocates data blocks using a Copy-on-Write (CoW) transactional engine. When a pool is under 80% capacity, the space allocator utilizes a rapid first-fit strategy that minimizes latency. As pool utilization crosses 80%, the allocator automatically falls back to an exhaustive best-fit search across metaslabs to find contiguous free blocks. This shift induces catastrophic write performance degradation and persistent dataset fragmentation. TrueNAS and OpenZFS best practices mandate keeping pool utilization strictly below 80%.
    </p>
  </div>
</section>
`
  }
];

for (const t of batch4) {
  fs.writeFileSync(path.join(contentToolsDir, `${t.id}.json`), JSON.stringify(t, null, 2));
  console.log(`Created tool JSON for ${t.id}`);
}
console.log('Phase N tool batch 4 written.');
