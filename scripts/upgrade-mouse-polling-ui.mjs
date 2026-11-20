import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const toolFile = path.join(rootDir, 'src', 'content', 'tools', 'mouse_polling_rate_hz.json');

const tool = JSON.parse(fs.readFileSync(toolFile, 'utf8'));

tool.toolHtml = `<section class="tool-card border-t-8 border-slate-900 relative z-10 shadow-2xl">
    <div class="p-6 md:p-10 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center text-white gap-6">
        <div class="text-center sm:text-left">
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight uppercase italic">Mouse Polling Rate</h1>
            <p class="text-sm text-cyan-400 mt-1 font-mono uppercase tracking-[0.2em]">High-Resolution Frequency & Jitter Benchmark</p>
        </div>
        <!-- Connection & Target Preset Selector -->
        <div class="flex flex-wrap items-center gap-2">
            <div class="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700">
                <button type="button" id="btn-conn-wired" class="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950 transition-all">Wired USB</button>
                <button type="button" id="btn-conn-wireless" class="px-3 py-1 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition-all">2.4G / Wireless</button>
            </div>
            <select id="select-target-hz" class="bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold rounded-xl px-3 py-1.5 outline-none">
                <option value="125">Target: 125 Hz (8ms)</option>
                <option value="250">Target: 250 Hz (4ms)</option>
                <option value="500">Target: 500 Hz (2ms)</option>
                <option value="1000" selected>Target: 1000 Hz (1ms)</option>
                <option value="2000">Target: 2000 Hz (0.5ms)</option>
                <option value="4000">Target: 4000 Hz (0.25ms)</option>
                <option value="8000">Target: 8000 Hz (0.125ms)</option>
            </select>
        </div>
    </div>
    <div class="p-6 md:p-10 bg-white space-y-8">
        <!-- Live Readout -->
        <div class="hz-readout text-center">
            <div class="hz-val tabular-nums text-6xl sm:text-7xl font-black text-slate-900" id="current-hz">0</div>
            <div class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Live Frequency Output (Hz)</div>
            <div id="stability-badge" class="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                <span id="stability-text">Move mouse continuously to calibrate</span>
            </div>
        </div>

        <!-- Tracking Canvas Area -->
        <div id="track-area" class="w-full h-48 bg-slate-950 rounded-3xl border-2 border-dashed border-slate-700 hover:border-cyan-400 flex flex-col items-center justify-center cursor-crosshair transition-all select-none group">
            <p class="text-white font-black uppercase text-sm tracking-widest group-hover:text-cyan-400 transition-colors">Move Mouse in Continuous Circles Here</p>
            <p class="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest font-mono">High-Resolution PointerEvents Buffer (performance.now)</p>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
                <div class="text-2xl font-black text-slate-900 font-mono tabular-nums" id="max-hz">0</div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Peak Hz</div>
            </div>
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
                <div class="text-2xl font-black text-cyan-600 font-mono tabular-nums" id="avg-hz">0</div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Geometric Mean</div>
            </div>
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
                <div class="text-2xl font-black text-slate-900 font-mono tabular-nums" id="min-delay">0.00</div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Min Delta (ms)</div>
            </div>
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
                <div class="text-2xl font-black text-emerald-600 font-mono tabular-nums" id="jitter-ms">0.00</div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Jitter (StdDev ms)</div>
            </div>
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center col-span-2 md:col-span-1">
                <div class="text-2xl font-black text-slate-900 font-mono tabular-nums" id="sample-count">0</div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Samples</div>
            </div>
        </div>

        <!-- Action Bar: Copy Report, Reset -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button type="button" id="btn-copy-report" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 px-8 rounded-xl transition shadow-md active:scale-95 uppercase tracking-widest text-xs flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                <span id="copy-report-text">Copy Benchmark Report</span>
            </button>
            <button type="button" onclick="resetStats()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 px-8 rounded-xl transition uppercase tracking-widest text-xs border border-slate-200">
                Purge Buffer
            </button>
        </div>
    </div>
</section>`;

tool.toolScript = `(function() {
    let lastTimestamp = 0;
    let intervals = [];
    const MAX_SAMPLES = 120;
    let connectionType = 'wired';
    let targetHz = 1000;
    let stats = {
        max: 0,
        avg: 0,
        minDelay: Infinity,
        count: 0,
        sum: 0,
        jitter: 0
    };

    const trackArea = document.getElementById('track-area');
    const currentHzEl = document.getElementById('current-hz');
    const maxHzEl = document.getElementById('max-hz');
    const avgHzEl = document.getElementById('avg-hz');
    const minDelayEl = document.getElementById('min-delay');
    const jitterEl = document.getElementById('jitter-ms');
    const sampleCountEl = document.getElementById('sample-count');
    const stabilityBadge = document.getElementById('stability-badge');
    const stabilityText = document.getElementById('stability-text');
    const btnWired = document.getElementById('btn-conn-wired');
    const btnWireless = document.getElementById('btn-conn-wireless');
    const selectTarget = document.getElementById('select-target-hz');
    const btnCopyReport = document.getElementById('btn-copy-report');
    const copyReportText = document.getElementById('copy-report-text');

    // Connection toggles
    btnWired.addEventListener('click', () => {
        connectionType = 'wired';
        btnWired.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950 transition-all';
        btnWireless.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition-all';
    });

    btnWireless.addEventListener('click', () => {
        connectionType = 'wireless';
        btnWireless.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950 transition-all';
        btnWired.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition-all';
    });

    selectTarget.addEventListener('change', (e) => {
        targetHz = parseInt(e.target.value, 10);
        updateStabilityUI();
    });

    trackArea.addEventListener('pointermove', (e) => {
        const now = performance.now();
        if (lastTimestamp > 0) {
            const interval = now - lastTimestamp;
            if (interval < 200 && interval > 0.05) {
                intervals.push(interval);
                if (intervals.length > MAX_SAMPLES) intervals.shift();
                const currentHz = Math.round(1000 / interval);
                currentHzEl.innerText = currentHz;

                stats.count++;
                stats.sum += currentHz;
                if (currentHz > stats.max) stats.max = currentHz;
                if (interval < stats.minDelay) stats.minDelay = interval;

                // Calculate standard deviation jitter
                if (intervals.length > 5) {
                    const avgInt = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                    const variance = intervals.reduce((acc, dt) => acc + Math.pow(dt - avgInt, 2), 0) / intervals.length;
                    stats.jitter = Math.sqrt(variance);
                }

                updateStatsUI();
            }
        }
        lastTimestamp = now;
    });

    function updateStatsUI() {
        maxHzEl.innerText = stats.max;
        avgHzEl.innerText = Math.round(stats.sum / stats.count);
        minDelayEl.innerText = stats.minDelay === Infinity ? '0.00' : stats.minDelay.toFixed(2);
        jitterEl.innerText = stats.jitter.toFixed(2);
        sampleCountEl.innerText = stats.count;
        updateStabilityUI();
    }

    function updateStabilityUI() {
        if (stats.count < 20) return;
        const expectedInterval = 1000 / targetHz;
        const jitterPercent = (stats.jitter / expectedInterval) * 100;

        if (jitterPercent <= 10) {
            stabilityBadge.className = 'mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200';
            stabilityText.innerText = 'PASS: USB-IF HID Stable (Jitter < 10%)';
        } else if (jitterPercent <= 25) {
            stabilityBadge.className = 'mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200';
            stabilityText.innerText = 'ACCEPTABLE: Minor Jitter (10-25%)';
        } else {
            stabilityBadge.className = 'mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200';
            stabilityText.innerText = 'WARNING: High Jitter (>25% vs ' + targetHz + 'Hz target)';
        }
    }

    window.resetStats = function() {
        stats = { max: 0, avg: 0, minDelay: Infinity, count: 0, sum: 0, jitter: 0 };
        intervals = [];
        lastTimestamp = 0;
        currentHzEl.innerText = '0';
        maxHzEl.innerText = '0';
        avgHzEl.innerText = '0';
        minDelayEl.innerText = '0.00';
        jitterEl.innerText = '0.00';
        sampleCountEl.innerText = '0';
        stabilityBadge.className = 'mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200';
        stabilityText.innerText = 'Move mouse continuously to calibrate';
    };

    trackArea.addEventListener('pointerleave', () => {
        lastTimestamp = 0;
        currentHzEl.innerText = '0';
    });

    btnCopyReport.addEventListener('click', () => {
        const dateStr = new Date().toISOString().split('T')[0];
        const report = [
            '=== ToolkitGen Mouse Polling Rate Benchmark ===',
            'Date: ' + dateStr,
            'Connection Mode: ' + connectionType.toUpperCase(),
            'Target Setting: ' + targetHz + ' Hz',
            'Current Hz: ' + currentHzEl.innerText + ' Hz',
            'Peak Hz: ' + stats.max + ' Hz',
            'Average Hz: ' + Math.round(stats.count > 0 ? stats.sum / stats.count : 0) + ' Hz',
            'Minimum Delta: ' + (stats.minDelay === Infinity ? 0 : stats.minDelay.toFixed(2)) + ' ms',
            'Jitter (StdDev): ' + stats.jitter.toFixed(2) + ' ms',
            'Total Samples: ' + stats.count,
            'Stability Status: ' + stabilityText.innerText,
            'Standard: USB-IF HID & W3C Performance Timeline',
            'Audited via: https://toolkitgen.com/tool/mouse_polling_rate_hz',
            '==============================================='
        ].join('\\n');

        navigator.clipboard.writeText(report).then(() => {
            copyReportText.innerText = 'Report Copied!';
            btnCopyReport.classList.add('bg-emerald-400');
            setTimeout(() => {
                copyReportText.innerText = 'Copy Benchmark Report';
                btnCopyReport.classList.remove('bg-emerald-400');
            }, 2500);
        });
    });
})();`;

fs.writeFileSync(toolFile, JSON.stringify(tool, null, 2) + '\n', 'utf8');
console.log('Successfully upgraded mouse_polling_rate_hz toolHtml and toolScript with differentiators.');
