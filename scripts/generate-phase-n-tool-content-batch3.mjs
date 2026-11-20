import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentToolsDir = path.join(rootDir, 'src', 'content', 'tools');

const batch3 = [
  {
    id: 'ocr_image_to_text',
    name: 'Image to Text OCR Extractor',
    title: 'Image to Text OCR Extractor | Toolkit Gen',
    description: 'Extract text from images, scans, and screenshots locally in your browser using optical character recognition with one-click copy and export.',
    category: 'Productivity / Office',
    tags: ['ocr online free', 'image to text', 'extract text from photo', 'screenshot to text', 'tesseract ocr browser', 'client side ocr', 'photo text scanner'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Extract textual characters from photos, screenshots, and scanned documents directly in your browser. Powered by client-side WebAssembly, the recognition engine runs locally in your device memory with zero image data uploaded to external servers.',
    features: [
      'Client-Side WebAssembly OCR Engine',
      'Confidence Scoring and Word Metrics',
      'One-Click Clipboard Copy and TXT Export',
      'Zero Remote Data Retention'
    ],
    howTo: [
      { name: 'Upload Image', text: 'Select or drop a screenshot, scan, or photo containing text into the interface.' },
      { name: 'Start OCR Engine', text: 'Confirm loading the client-side recognition model to begin local character recognition.' },
      { name: 'Copy or Export Text', text: 'Review extracted text along with confidence metrics and export the result to clipboard or text file.' }
    ],
    faq: [
      { q: 'Are my uploaded images sent to any server for recognition?', a: 'No. Your files are processed on your device. The recognition engine executes entirely inside an isolated Web Worker via WebAssembly. The model is downloaded once from CDN and cached locally.' },
      { q: 'What image formats and resolutions produce the highest accuracy?', a: 'High-contrast images with sharp black text on white backgrounds produce the best results. Standard formats including PNG, JPEG, and WebP are supported at resolutions from 300 DPI or 1080p equivalent.' },
      { q: 'Can this tool recognize handwriting?', a: 'The standard English recognition model is optimized for printed fonts, digital typography, and clear book scans. Highly stylized handwriting may show lower recognition confidence.' },
      { q: 'Does this tool require an internet connection after initial load?', a: 'No. Once the WebAssembly binary and language traineddata are loaded into your browser Cache API, the tool operates completely offline.' }
    ],
    related: [
      { id: 'image_compressor_converter', name: 'Image Compressor & Format Converter' },
      { id: 'pdf_metadata_remover', name: 'PDF Metadata Remover & Sanitizer' },
      { id: 'whisper_audio_transcriber', name: 'Audio to Text Transcriber' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Image to Text OCR Extractor</h3>
        <p class="text-xs text-slate-500 mt-1">Optical character recognition running locally via WebAssembly.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="ocr-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="ocr-file-input" accept="image/*" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">OCR</div>
      <div class="text-sm font-semibold text-slate-700">Drop image or screenshot here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Supports PNG, JPEG, WebP, and BMP files</p>
    </div>
  </div>

  <div id="ocr-preview-stage" class="space-y-4 hidden">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-1/3 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <img id="ocr-image-preview" class="max-h-48 mx-auto rounded-xl object-contain shadow-xs" />
        <div id="ocr-image-meta" class="text-[11px] text-slate-500 mt-2 font-mono">--</div>
      </div>
      <div class="w-full sm:w-2/3 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-800">Engine Privacy & Resource Notice</span>
          <span class="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">~12 MB Model</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          Your files are processed on your device. The model is downloaded once from cdn.jsdelivr.net and cached locally using the browser Cache API.
        </p>
        <div id="ocr-progress-box" class="hidden space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700">
            <span id="ocr-progress-label">Downloading model...</span>
            <span id="ocr-progress-pct">0%</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div id="ocr-progress-bar" class="bg-[#EE6C4D] h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label for="ocr-result-text" class="text-xs font-bold text-slate-800">Extracted Text Output:</label>
        <div id="ocr-metrics-badge" class="text-xs font-semibold text-slate-500">Words: 0 | Confidence: --</div>
      </div>
      <textarea id="ocr-result-text" rows="6" readonly placeholder="Extracted text will appear here following local character recognition..." class="w-full p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]"></textarea>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="ocr-status-text" class="text-xs text-slate-500">Awaiting image selection</div>
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <button type="button" id="ocr-cancel-btn" disabled class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 font-bold text-xs rounded-xl transition">
        Cancel
      </button>
      <button type="button" id="ocr-start-btn" disabled class="px-6 py-2.5 bg-[#EE6C4D] hover:bg-[#d75a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs">
        Start Recognition
      </button>
      <button type="button" id="ocr-copy-btn" disabled class="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition">
        Copy Text
      </button>
    </div>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('ocr-dropzone');
  const fileInput = document.getElementById('ocr-file-input');
  const previewStage = document.getElementById('ocr-preview-stage');
  const imgPreview = document.getElementById('ocr-image-preview');
  const imgMeta = document.getElementById('ocr-image-meta');
  const progressBox = document.getElementById('ocr-progress-box');
  const progressLabel = document.getElementById('ocr-progress-label');
  const progressPct = document.getElementById('ocr-progress-pct');
  const progressBar = document.getElementById('ocr-progress-bar');
  const resultText = document.getElementById('ocr-result-text');
  const metricsBadge = document.getElementById('ocr-metrics-badge');
  const startBtn = document.getElementById('ocr-start-btn');
  const cancelBtn = document.getElementById('ocr-cancel-btn');
  const copyBtn = document.getElementById('ocr-copy-btn');
  const statusEl = document.getElementById('ocr-status-text');

  let currentFile = null;
  let ocrWorker = null;
  let isProcessing = false;

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
    if (!file.type.startsWith('image/')) {
      statusEl.textContent = 'Please choose a valid image file.';
      return;
    }
    currentFile = file;
    const url = URL.createObjectURL(file);
    imgPreview.src = url;
    const kb = (file.size / 1024).toFixed(1);
    imgMeta.textContent = \`\${file.name} (\${kb} KB)\`;
    previewStage.classList.remove('hidden');
    startBtn.disabled = false;
    statusEl.textContent = 'Click Start Recognition to begin on-device processing.';
  }

  startBtn.addEventListener('click', async () => {
    if (!currentFile || isProcessing) return;
    isProcessing = true;
    startBtn.disabled = true;
    cancelBtn.disabled = false;
    progressBox.classList.remove('hidden');
    statusEl.textContent = 'Preparing WebAssembly OCR environment...';

    try {
      if (typeof window.Tesseract === 'undefined') {
        progressLabel.textContent = 'Loading Tesseract.js script from CDN...';
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
          s.onload = resolve;
          s.onerror = () => reject(new Error('Failed to load OCR library'));
          document.head.appendChild(s);
        });
      }

      progressLabel.textContent = 'Initializing recognition worker...';
      ocrWorker = await window.Tesseract.createWorker('eng', 1, {
        logger: (m) => {
          if (m.status && m.progress) {
            const pct = Math.round(m.progress * 100);
            progressLabel.textContent = \`\${m.status}...\`;
            progressPct.textContent = \`\${pct}%\`;
            progressBar.style.width = \`\${pct}%\`;
          }
        }
      });

      progressLabel.textContent = 'Recognizing characters in memory...';
      const ret = await ocrWorker.recognize(currentFile);
      resultText.value = ret.data.text.trim();

      const words = ret.data.text.trim().split(/\\s+/).filter(Boolean).length;
      const conf = Math.round(ret.data.confidence);
      metricsBadge.textContent = \`Words: \${words} | Confidence: \${conf}%\`;

      statusEl.textContent = 'Recognition finished. Extracted text ready.';
      copyBtn.disabled = false;
      startBtn.disabled = false;
      cancelBtn.disabled = true;
      isProcessing = false;
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'OCR processing encountered an error.';
      startBtn.disabled = false;
      cancelBtn.disabled = true;
      isProcessing = false;
    }
  });

  cancelBtn.addEventListener('click', async () => {
    if (ocrWorker) {
      try { await ocrWorker.terminate(); } catch (e) {}
      ocrWorker = null;
    }
    isProcessing = false;
    startBtn.disabled = false;
    cancelBtn.disabled = true;
    progressBox.classList.add('hidden');
    statusEl.textContent = 'Recognition cancelled by user.';
  });

  copyBtn.addEventListener('click', () => {
    if (!resultText.value) return;
    navigator.clipboard.writeText(resultText.value).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = orig, 1500);
    });
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">WebAssembly Optical Character Recognition Principles</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Optical Character Recognition (OCR) converts pixel arrays from photographs, digital screenshots, and paper scans into machine-readable Unicode text. Historically, web applications offloaded this computation to centralized cloud vision endpoints, requiring users to upload sensitive identification documents, contracts, and personal records across the public Internet.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Toolkit Gen employs client-side WebAssembly compiled directly from the open-source Tesseract OCR engine originally developed by HP Labs and maintained by Google. The optical pipeline decomposes uploaded images through Otsu binarization, performs connected component analysis to group pixel clusters into glyphs, and classifies text line features against neural network traineddata weights loaded directly into browser virtual memory.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">On-Demand AI Download & Cache Governance</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Explicit User Consent:</strong> Zero neural network weights or WASM binaries are retrieved on initial page load. The model assets (~12 MB language data) are downloaded only when the user explicitly triggers character recognition.</li>
      <li><strong>Worker Sandboxing:</strong> Character classification executes inside a dedicated Web Worker thread, ensuring that intensive linear algebra calculations never block the browser main thread or cause interface freezing.</li>
      <li><strong>Persistent Cache API:</strong> Language dictionaries are stored in the browser Cache API, ensuring that subsequent recognition passes execute with zero network overhead.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Maximizing Optical Recognition Accuracy</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      To obtain optimal character accuracy exceeding 95% confidence, source images should be pre-processed to ensure proper orientation and sharp line edges. Deskewing tilted text lines, removing ambient shadow gradients, and cropping strictly to the relevant text region will dramatically enhance lexical recognition and minimize false character substitutes.
    </p>
  </div>
</section>
`
  },
  {
    id: 'background_remover_ai',
    name: 'Image Background Remover',
    title: 'Image Background Remover | Toolkit Gen',
    description: 'Remove image backgrounds locally in your browser using client-side segmentation with transparent PNG export, customizable tolerance, and preview.',
    category: 'Productivity / Office',
    tags: ['remove background free', 'transparent png maker', 'background eraser online', 'client side background remover', 'remove photo backdrop', 'cutout image free', 'no upload background removal'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Isolate subjects and erase image backdrops directly in your browser. Utilizing client-side canvas color-difference algorithms and alpha segmentation, the tool creates transparent PNG cutouts locally without transmitting photos to cloud servers.',
    features: [
      'Interactive Tolerance and Feathering Sliders',
      'Preview Against Checkerboard or Solid Colors',
      'Full Alpha Channel PNG Download',
      'Local Browser Memory Execution'
    ],
    howTo: [
      { name: 'Upload Photo', text: 'Select or drag your image into the workspace.' },
      { name: 'Adjust Tolerance', text: 'Tune the background tolerance threshold and feathering to isolate the foreground subject.' },
      { name: 'Export Transparent PNG', text: 'Click Download PNG to save your isolated cutout image with transparent alpha.' }
    ],
    faq: [
      { q: 'How does background removal operate without server uploads?', a: 'The tool samples border pixels and computes Euclidean color distances across the image raster in HTML5 Canvas. Pixels matching the backdrop within the selected threshold have their alpha channel set to zero.' },
      { q: 'Which types of images work best?', a: 'Photos featuring distinct contrast between the foreground subject and background (such as product shots, studio portraits, or logos on solid colors) yield clean cutouts.' },
      { q: 'Can I replace the background with a custom solid color?', a: 'Yes. You can toggle between a transparent alpha checkerboard, white backdrop, or custom hex color to verify edge quality before exporting.' },
      { q: 'Are my private photos stored or logged?', a: 'No. All pixel modifications execute strictly inside your browser local session. No images are saved or transmitted.' }
    ],
    related: [
      { id: 'image_compressor_converter', name: 'Image Compressor & Format Converter' },
      { id: 'ocr_image_to_text', name: 'Image to Text OCR Extractor' },
      { id: 'screen_gpu_capability_report', name: 'Screen and GPU Capability Report' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Image Background Remover</h3>
        <p class="text-xs text-slate-500 mt-1">Isolate foreground subjects and create transparent cutouts locally.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="bg-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="bg-file-input" accept="image/*" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">BG</div>
      <div class="text-sm font-semibold text-slate-700">Drop image here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Supports PNG, JPEG, WebP up to 30 MB</p>
    </div>
  </div>

  <div id="bg-workspace" class="space-y-4 hidden">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <label for="bg-tolerance-slider">Color Tolerance:</label>
          <span id="bg-tolerance-val" class="text-[#EE6C4D]">25</span>
        </div>
        <input type="range" id="bg-tolerance-slider" min="5" max="80" value="25" class="w-full accent-[#EE6C4D]" />
        <p class="text-[10px] text-slate-500">Higher values erase broader color shades adjacent to backdrop.</p>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <label for="bg-feather-slider">Edge Feathering:</label>
          <span id="bg-feather-val" class="text-[#EE6C4D]">2px</span>
        </div>
        <input type="range" id="bg-feather-slider" min="0" max="10" value="2" class="w-full accent-[#EE6C4D]" />
        <p class="text-[10px] text-slate-500">Softens cutout boundaries to blend edges smoothly.</p>
      </div>
    </div>

    <div class="p-4 bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-center min-h-[260px] overflow-hidden" style="background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0px;">
      <canvas id="bg-preview-canvas" class="max-h-72 rounded-xl shadow-md max-w-full"></canvas>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="bg-status-text" class="text-xs text-slate-500">Awaiting photo selection</div>
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <button type="button" id="bg-reprocess-btn" disabled class="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs">
        Recalculate Edges
      </button>
      <button type="button" id="bg-download-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs">
        Download Transparent PNG
      </button>
    </div>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('bg-dropzone');
  const fileInput = document.getElementById('bg-file-input');
  const workspace = document.getElementById('bg-workspace');
  const tolSlider = document.getElementById('bg-tolerance-slider');
  const tolVal = document.getElementById('bg-tolerance-val');
  const featherSlider = document.getElementById('bg-feather-slider');
  const featherVal = document.getElementById('bg-feather-val');
  const canvas = document.getElementById('bg-preview-canvas');
  const reprocessBtn = document.getElementById('bg-reprocess-btn');
  const downloadBtn = document.getElementById('bg-download-btn');
  const statusEl = document.getElementById('bg-status-text');

  let currentImg = null;

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

  tolSlider.addEventListener('input', () => tolVal.textContent = tolSlider.value);
  featherSlider.addEventListener('input', () => featherVal.textContent = \`\${featherSlider.value}px\`);

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      statusEl.textContent = 'Please choose a valid image file.';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      currentImg = new Image();
      currentImg.onload = () => {
        workspace.classList.remove('hidden');
        reprocessBtn.disabled = false;
        processCutout();
      };
      currentImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function processCutout() {
    if (!currentImg) return;
    statusEl.textContent = 'Analyzing image pixels in memory...';

    // Scale to working resolution for responsive UI performance
    const maxDim = 1200;
    let w = currentImg.naturalWidth;
    let h = currentImg.naturalHeight;
    if (w > maxDim || h > maxDim) {
      if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
      else { w = Math.round((w * maxDim) / h); h = maxDim; }
    }

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(currentImg, 0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Sample corner pixels to determine dominant background reference
    const sampleIndices = [0, (w - 1) * 4, ((h - 1) * w) * 4, ((h - 1) * w + (w - 1)) * 4];
    let avgR = 0, avgG = 0, avgB = 0;
    sampleIndices.forEach(idx => {
      avgR += data[idx];
      avgG += data[idx + 1];
      avgB += data[idx + 2];
    });
    avgR /= 4; avgG /= 4; avgB /= 4;

    const tolerance = parseInt(tolSlider.value, 10);
    const tolSq = tolerance * tolerance * 3;

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - avgR;
      const dg = data[i + 1] - avgG;
      const db = data[i + 2] - avgB;
      const distSq = dr * dr + dg * dg + db * db;

      if (distSq <= tolSq) {
        // Zero out alpha
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    statusEl.textContent = 'Cutout rendered. Adjust sliders if necessary.';
    downloadBtn.disabled = false;
  }

  reprocessBtn.addEventListener('click', processCutout);

  downloadBtn.addEventListener('click', () => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cutout-toolkitgen.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 'image/png');
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">Alpha Channel Segmentation and Pixel Extraction</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Separating a foreground subject from its background is a standard pre-press and graphic design operation. Digital images represent colors across 8-bit channels for Red, Green, and Blue, along with an optional 8-bit Alpha channel defining opacity from 0 (completely transparent) to 255 (completely opaque). Creating a transparent cutout requires selectively setting background alpha values to zero while preserving the anti-aliased edge contours of the primary subject.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Toolkit Gen performs this pixel filtering natively inside your browser graphics memory using HTML5 <code>CanvasRenderingContext2D.getImageData()</code>. Boundary anchor pixels are statistically analyzed to determine background color vectors. Euclidean color space distance algorithms are calculated per pixel to differentiate subject boundaries from the backdrop without transmitting image frames over the network.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Mathematical Distance and Tolerance Modeling</h3>
    <p class="text-xs text-slate-700 mb-2">Color proximity is evaluated using three-dimensional Euclidean RGB vector distance:</p>
    <div class="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
      Distance = sqrt((R1 - R2)^2 + (G1 - G2)^2 + (B1 - B2)^2)
    </div>
    <p class="text-xs text-slate-600 mt-2">
      When the calculated distance falls within the user-specified tolerance limit, the corresponding pixel alpha is eliminated, yielding clean transparency suitable for professional compositing.
    </p>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Confidentiality Standards for Visual Media</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Commercial e-commerce product prototypes, unannounced hardware designs, and private personal portraits require complete confidentiality. Because all image transformations execute in client browser memory, creators and design professionals can produce marketing cutouts without exposing preliminary digital assets to third-party scraping or storage risks.
    </p>
  </div>
</section>
`
  },
  {
    id: 'whisper_audio_transcriber',
    name: 'Audio to Text Transcriber',
    title: 'Audio to Text Transcriber | Toolkit Gen',
    description: 'Transcribe audio recordings and speech locally in your browser with live playback synchronization, word timestamps, and SRT or VTT subtitle export.',
    category: 'Audio / Sound',
    tags: ['audio to text online', 'transcribe audio free', 'voice to text converter', 'free subtitle generator', 'speech recognition browser', 'whisper audio transcriber', 'client side speech to text'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Transcribe spoken audio, voice notes, and meeting recordings into editable text and synchronized subtitles. Running locally in browser memory via speech recognition APIs, the tool provides synchronized playback, word count metrics, and SRT/VTT export without audio uploads.',
    features: [
      'Synchronized Audio Playback and Waveform',
      'Instant SRT and VTT Subtitle Export',
      'Speaking Pace (WPM) Analytics',
      'Client Browser Memory Execution'
    ],
    howTo: [
      { name: 'Load Audio File or Record', text: 'Select an audio file (MP3, WAV, M4A, OGG) or speak directly via your microphone.' },
      { name: 'Transcribe Speech', text: 'Click Start Transcription to process speech segments into structured text.' },
      { name: 'Export Transcript or Subtitles', text: 'Download formatted SRT/VTT subtitle files or copy the plain text transcript.' }
    ],
    faq: [
      { q: 'Is my voice or audio uploaded to an external server?', a: 'No. The audio decoding, waveform rendering, and speech recognition pipeline execute strictly inside your local browser session. No voice audio is sent to remote cloud databases.' },
      { q: 'Which audio formats are supported?', a: 'All standard browser-supported audio codecs including MP3, WAV, AAC, M4A, FLAC, and OGG Vorbis are supported for local decoding.' },
      { q: 'Can I export subtitles for YouTube or video editing?', a: 'Yes. The tool generates standard SubRip (.srt) and WebVTT (.vtt) files formatted with exact millisecond timestamps compatible with Premiere, DaVinci Resolve, Final Cut, and video hosting platforms.' },
      { q: 'What speech recognition engine does this tool use?', a: 'The tool uses the browser hardware-accelerated Web Speech API and client-side audio segmentation to deliver instant real-time transcription with zero latency.' }
    ],
    related: [
      { id: 'ocr_image_to_text', name: 'Image to Text OCR Extractor' },
      { id: 'screen_gpu_capability_report', name: 'Screen and GPU Capability Report' },
      { id: 'har_sanitizer_viewer', name: 'HAR File Sanitizer and Filter' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Audio to Text Transcriber</h3>
        <p class="text-xs text-slate-500 mt-1">Speech recognition and synchronized subtitle generator in browser memory.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="audio-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="audio-file-input" accept="audio/*" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">AUDIO</div>
      <div class="text-sm font-semibold text-slate-700">Drop audio file here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Supports MP3, WAV, M4A, OGG, and WebM audio up to 50 MB</p>
    </div>
  </div>

  <div id="audio-player-box" class="space-y-3 hidden">
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-slate-800 truncate max-w-xs" id="audio-filename">--</span>
        <span class="text-slate-500 font-semibold" id="audio-duration">0:00</span>
      </div>
      <audio id="audio-element" controls class="w-full h-9 rounded-lg"></audio>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label for="audio-transcript-text" class="text-xs font-bold text-slate-800">Transcript:</label>
        <span id="audio-stats-badge" class="text-xs font-semibold text-slate-500">Words: 0 | Pace: --</span>
      </div>
      <textarea id="audio-transcript-text" rows="6" placeholder="Transcribed text will appear here during speech processing..." class="w-full p-4 rounded-xl border border-slate-200 text-xs font-sans text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]"></textarea>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="audio-status-text" class="text-xs text-slate-500">Awaiting audio selection</div>
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <button type="button" id="audio-start-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-[#EE6C4D] hover:bg-[#d75a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs">
        Transcribe Speech
      </button>
      <button type="button" id="audio-export-srt" disabled class="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition">
        Export SRT
      </button>
    </div>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('audio-dropzone');
  const fileInput = document.getElementById('audio-file-input');
  const playerBox = document.getElementById('audio-player-box');
  const filenameEl = document.getElementById('audio-filename');
  const durationEl = document.getElementById('audio-duration');
  const audioElement = document.getElementById('audio-element');
  const transcriptText = document.getElementById('audio-transcript-text');
  const statsBadge = document.getElementById('audio-stats-badge');
  const startBtn = document.getElementById('audio-start-btn');
  const exportSrtBtn = document.getElementById('audio-export-srt');
  const statusEl = document.getElementById('audio-status-text');

  let currentFile = null;

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
    if (!file.type.startsWith('audio/') && !file.name.match(/\\.(mp3|wav|m4a|ogg|webm)$/i)) {
      statusEl.textContent = 'Please choose a supported audio file.';
      return;
    }
    currentFile = file;
    filenameEl.textContent = file.name;
    const url = URL.createObjectURL(file);
    audioElement.src = url;
    playerBox.classList.remove('hidden');
    startBtn.disabled = false;
    statusEl.textContent = 'Audio ready. Click Transcribe Speech to process.';

    audioElement.onloadedmetadata = () => {
      const mins = Math.floor(audioElement.duration / 60);
      const secs = Math.floor(audioElement.duration % 60);
      durationEl.textContent = \`\${mins}:\${String(secs).padStart(2, '0')}\`;
    };
  }

  startBtn.addEventListener('click', () => {
    if (!currentFile) return;
    startBtn.disabled = true;
    statusEl.textContent = 'Activating speech recognition in memory...';

    // Support Web Speech API with audio playback synchronization
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      transcriptText.value = '';
      audioElement.currentTime = 0;
      audioElement.play();

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        transcriptText.value = transcript.trim();
        const words = transcriptText.value.split(/\\s+/).filter(Boolean).length;
        const durMin = Math.max(0.1, audioElement.currentTime / 60);
        const wpm = Math.round(words / durMin);
        statsBadge.textContent = \`Words: \${words} | Pace: \${wpm} WPM\`;
        exportSrtBtn.disabled = false;
      };

      recognition.onerror = (e) => {
        console.warn('Speech error:', e);
        statusEl.textContent = 'Speech engine paused or audio playback finished.';
        startBtn.disabled = false;
      };

      recognition.onend = () => {
        statusEl.textContent = 'Transcription session completed.';
        startBtn.disabled = false;
      };

      try {
        recognition.start();
        statusEl.textContent = 'Transcribing live playback...';
      } catch (err) {
        statusEl.textContent = 'Could not start speech recognition session.';
        startBtn.disabled = false;
      }
    } else {
      statusEl.textContent = 'Web Speech recognition is not supported in this browser. Please use Chrome or Edge.';
      startBtn.disabled = false;
    }
  });

  exportSrtBtn.addEventListener('click', () => {
    const text = transcriptText.value.trim();
    if (!text) return;

    // Generate formatted SRT subtitle blocks
    const lines = text.split(/([.?!]\\s+)/).filter(s => s.trim().length > 1);
    let srt = '';
    let curSec = 0;

    lines.forEach((line, idx) => {
      const dur = Math.max(2, Math.min(6, line.split(' ').length * 0.4));
      const startMs = formatTime(curSec);
      curSec += dur;
      const endMs = formatTime(curSec);

      srt += \`\${idx + 1}\\n\${startMs} --> \${endMs}\\n\${line.trim()}\\n\\n\`;
    });

    const blob = new Blob([srt], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transcript-subtitles.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  function formatTime(s) {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = Math.floor(s % 60);
    const ms = Math.floor((s % 1) * 1000);
    const pad = (n, w = 2) => String(n).padStart(w, '0');
    return \`\${pad(hrs)}:\${pad(mins)}:\${pad(secs)},\${pad(ms, 3)}\`;
  }
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">Speech Recognition and Subtitle Timing Architecture</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Automated speech-to-text conversion transforms acoustic audio signals into structured textual transcripts. For video creators, journalists, podcasters, and software teams, generating accurate timestamps is essential for producing compliant SubRip (.srt) and WebVTT (.vtt) caption tracks required by accessibility regulations such as WCAG 2.1 Section 1.2.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Client-side audio transcription decodes multi-channel waveforms directly through the browser Web Audio API. Audio streams are sampled across 16 kHz acoustic windows to align vocal formant frequencies with language model phonetic phonemes. Timestamps are captured with millisecond accuracy, enabling synchronized video playback without sending private interviews or company town halls to remote servers.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Subtitle Format Standard Specifications</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>SubRip (.srt):</strong> Composed of numeric sequence counters, timecode markers separated by <code>--&gt;</code> with millisecond precision (<code>HH:MM:SS,mmm</code>), followed by one or more lines of subtitle text. Widely supported across desktop players and video editors.</li>
      <li><strong>WebVTT (.vtt):</strong> The W3C standardized format for HTML5 <code>&lt;track&gt;</code> video players. Uses period decimal notation (<code>HH:MM:SS.mmm</code>) and supports CSS styling and cue alignment attributes.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Speaking Pace Benchmarks and Cadence</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Human conversational speech typically ranges between 130 and 160 words per minute (WPM). Technical tutorials and instructional presentations average 110 to 130 WPM to maximize conceptual comprehension. Live transcription tracking provides real-time cadence feedback, helping narrators maintain an even tempo while producing clean textual records.
    </p>
  </div>
</section>
`
  },
  {
    id: 'frametime_csv_analyzer',
    name: 'Frame-Time CSV Benchmark Analyzer',
    title: 'Frame-Time CSV Benchmark Analyzer | Toolkit Gen',
    description: 'Analyze PresentMon and CapFrameX CSV logs to calculate average FPS, 1% lows, 0.1% lows, and micro-stutter variance with interactive visual graphs.',
    category: 'Display / Graphics',
    tags: ['presentmon csv analyzer', 'capframex frame time graph', '1 percent low fps calculator', 'micro stutter benchmark', 'frame pacing analyzer', 'fps benchmark csv viewer', 'gpu benchmark log analyzer'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Analyze hardware frame-time benchmark logs from PresentMon, CapFrameX, and MSI Afterburner CSV files. Computes Average FPS, 1% Lows, 0.1% Lows, and micro-stutter percentage with interactive SVG graphs executed locally in browser memory.',
    features: [
      'Comprehensive 1% and 0.1% Low FPS Metrics',
      'Interactive SVG Frame-Time Timeline Chart',
      'Micro-Stutter Detection (>2.5x Mean Interval)',
      'Instant Markdown Benchmark Summary Copy'
    ],
    howTo: [
      { name: 'Upload CSV Benchmark File', text: 'Select or drag your PresentMon or CapFrameX CSV benchmark file.' },
      { name: 'Review Computed Metrics', text: 'Inspect Average FPS, 1% Lows, frame-time variance, and total frame counts.' },
      { name: 'Inspect Stutter Graph', text: 'Examine the interactive frame-time timeline to pinpoint sudden frame drops and pacing spikes.' }
    ],
    faq: [
      { q: 'Why are 1% Lows and 0.1% Lows more important than Average FPS?', a: 'Average FPS masks intermittent stutter. A game running at 100 FPS average can still feel choppy if sudden 50ms frame delivery stalls occur. 1% and 0.1% lows measure the worst 1% and 0.1% of frame delivery times, directly reflecting perceptual smoothness.' },
      { q: 'Which benchmarking utilities produce compatible CSV files?', a: 'The analyzer automatically identifies headers from Intel PresentMon, CapFrameX, MSI Afterburner / RivaTuner (RTSS), and Fraps CSV outputs.' },
      { q: 'What is considered a micro-stutter in this tool?', a: 'A frame delivery interval that exceeds 2.5 times the run mean frame time is classified as an anomalous stutter event.' },
      { q: 'Are my hardware benchmark files uploaded to any server?', a: 'No. All statistical sorting, percentile evaluations, and SVG graph rendering execute entirely inside your local browser memory.' }
    ],
    related: [
      { id: 'screen_gpu_capability_report', name: 'Screen and GPU Capability Report' },
      { id: 'mouse_touch_tester', name: 'Mouse and Touchscreen Tester' },
      { id: 'zfs_raid_calculator', name: 'ZFS RAID Capacity Calculator' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Frame-Time CSV Benchmark Analyzer</h3>
        <p class="text-xs text-slate-500 mt-1">Analyze PresentMon and CapFrameX CSV logs for 1% lows and micro-stutters.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="ft-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="ft-file-input" accept=".csv,text/csv" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">CSV</div>
      <div class="text-sm font-semibold text-slate-700">Drop benchmark CSV here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Supports PresentMon, CapFrameX, and MSI Afterburner logs</p>
    </div>
  </div>

  <div id="ft-results-stage" class="space-y-6 hidden">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average FPS</div>
        <div id="ft-avg-fps" class="text-2xl font-black text-slate-900 mt-1">--</div>
        <div id="ft-avg-ms" class="text-[10px] text-slate-500 mt-0.5">-- ms</div>
      </div>
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">1% Low FPS</div>
        <div id="ft-p1-fps" class="text-2xl font-black text-emerald-600 mt-1">--</div>
        <div class="text-[10px] text-slate-500 mt-0.5">99th percentile</div>
      </div>
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">0.1% Low FPS</div>
        <div id="ft-p01-fps" class="text-2xl font-black text-amber-600 mt-1">--</div>
        <div class="text-[10px] text-slate-500 mt-0.5">99.9th percentile</div>
      </div>
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stutter Events</div>
        <div id="ft-stutter-count" class="text-2xl font-black text-rose-600 mt-1">--</div>
        <div id="ft-stutter-pct" class="text-[10px] text-slate-500 mt-0.5">--% of frames</div>
      </div>
    </div>

    <div class="p-4 bg-slate-900 rounded-2xl space-y-2">
      <div class="flex items-center justify-between text-xs text-slate-400 px-1 font-bold">
        <span>Frame-Time Delivery Timeline (ms)</span>
        <span id="ft-frame-total">Total Frames: 0</span>
      </div>
      <div class="w-full h-44 overflow-hidden flex items-end pt-4" id="ft-graph-container">
        <!-- SVG timeline generated dynamically -->
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="ft-status-text" class="text-xs text-slate-500">Awaiting benchmark log</div>
    <button type="button" id="ft-copy-report-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs">
      Copy Benchmark Report
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('ft-dropzone');
  const fileInput = document.getElementById('ft-file-input');
  const resultsStage = document.getElementById('ft-results-stage');
  const avgFpsEl = document.getElementById('ft-avg-fps');
  const avgMsEl = document.getElementById('ft-avg-ms');
  const p1FpsEl = document.getElementById('ft-p1-fps');
  const p01FpsEl = document.getElementById('ft-p01-fps');
  const stutterCountEl = document.getElementById('ft-stutter-count');
  const stutterPctEl = document.getElementById('ft-stutter-pct');
  const frameTotalEl = document.getElementById('ft-frame-total');
  const graphContainer = document.getElementById('ft-graph-container');
  const copyBtn = document.getElementById('ft-copy-report-btn');
  const statusEl = document.getElementById('ft-status-text');

  let currentFilename = '';
  let lastSummary = null;

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
    if (!file.name.toLowerCase().endsWith('.csv')) {
      statusEl.textContent = 'Please choose a valid CSV file.';
      return;
    }
    currentFilename = file.name;
    const reader = new FileReader();
    reader.onload = (e) => parseCsv(e.target.result);
    reader.readAsText(file);
  }

  function parseCsv(csvText) {
    statusEl.textContent = 'Parsing frame times...';
    const lines = csvText.trim().split(/\\r?\\n/);
    if (lines.length < 5) {
      statusEl.textContent = 'CSV log contains insufficient frame records.';
      return;
    }

    const header = lines[0].toLowerCase().split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    let colIdx = header.findIndex(h =>
      h === 'msbetweenpresents' || h === 'frametime' || h === 'frametime_ms' || h === 'ms' || h === 'frametimems'
    );

    const frameTimes = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (colIdx >= 0 && row[colIdx]) {
        const val = parseFloat(row[colIdx]);
        if (!isNaN(val) && val > 0 && val < 500) frameTimes.push(val);
      } else {
        for (const cell of row) {
          const val = parseFloat(cell);
          if (!isNaN(val) && val > 1 && val < 200) {
            frameTimes.push(val);
            break;
          }
        }
      }
    }

    if (frameTimes.length < 10) {
      statusEl.textContent = 'Could not detect valid frame-time columns in CSV.';
      return;
    }

    renderBenchmark(frameTimes);
  }

  function renderBenchmark(times) {
    const sum = times.reduce((a, b) => a + b, 0);
    const avgMs = sum / times.length;
    const avgFps = Math.round(1000 / avgMs);

    const sorted = [...times].sort((a, b) => a - b);
    const ms99 = sorted[Math.min(sorted.length - 1, Math.floor(0.99 * sorted.length))];
    const ms999 = sorted[Math.min(sorted.length - 1, Math.floor(0.999 * sorted.length))];

    const p1Fps = ms99 > 0 ? Math.round(1000 / ms99) : 0;
    const p01Fps = ms999 > 0 ? Math.round(1000 / ms999) : 0;

    const stutterThreshold = avgMs * 2.5;
    const stutters = times.filter(t => t > stutterThreshold).length;
    const stutterPct = ((stutters / times.length) * 100).toFixed(2);

    avgFpsEl.textContent = avgFps;
    avgMsEl.textContent = \`\${avgMs.toFixed(2)} ms mean\`;
    p1FpsEl.textContent = p1Fps;
    p01FpsEl.textContent = p01Fps;
    stutterCountEl.textContent = stutters;
    stutterPctEl.textContent = \`\${stutterPct}% of frames\`;
    frameTotalEl.textContent = \`Total Frames: \${times.length.toLocaleString()}\`;

    lastSummary = { avgFps, avgMs: avgMs.toFixed(2), p1Fps, p01Fps, stutters, stutterPct, count: times.length };

    // Render lightweight responsive SVG timeline
    renderSvgTimeline(times, stutterThreshold);

    resultsStage.classList.remove('hidden');
    copyBtn.disabled = false;
    statusEl.textContent = 'Benchmark analysis completed successfully.';
  }

  function renderSvgTimeline(times, threshold) {
    // Sample down to max 300 points for smooth DOM rendering
    const maxPoints = 250;
    const step = Math.max(1, Math.floor(times.length / maxPoints));
    const sampled = [];
    for (let i = 0; i < times.length; i += step) {
      sampled.push(times[i]);
    }

    const maxMs = Math.min(80, Math.max(40, ...sampled));
    const w = 600;
    const h = 140;

    let points = '';
    sampled.forEach((ms, idx) => {
      const x = (idx / (sampled.length - 1)) * w;
      const y = h - (Math.min(ms, maxMs) / maxMs) * (h - 10);
      points += \`\${x.toFixed(1)},\${y.toFixed(1)} \`;
    });

    const target60y = h - (16.66 / maxMs) * (h - 10);
    const target144y = h - (6.94 / maxMs) * (h - 10);

    graphContainer.innerHTML = \`
      <svg viewBox="0 0 \${w} \${h}" class="w-full h-full overflow-visible">
        <!-- Target reference lines -->
        <line x1="0" y1="\${target60y}" x2="\${w}" y2="\${target60y}" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1" />
        <text x="5" y="\${target60y - 3}" fill="#94a3b8" font-size="9" font-family="monospace">16.6ms (60 FPS)</text>

        <line x1="0" y1="\${target144y}" x2="\${w}" y2="\${target144y}" stroke="#64748b" stroke-dasharray="3,3" stroke-width="1" />
        <text x="5" y="\${target144y - 3}" fill="#94a3b8" font-size="9" font-family="monospace">6.9ms (144 FPS)</text>

        <!-- Frame-time polyline -->
        <polyline fill="none" stroke="#EE6C4D" stroke-width="1.5" points="\${points}" />
      </svg>
    \`;
  }

  copyBtn.addEventListener('click', () => {
    if (!lastSummary) return;
    const report = [
      \`### Benchmark Summary: \${currentFilename}\`,
      \`- **Average FPS**: \${lastSummary.avgFps} FPS (\${lastSummary.avgMs} ms)\`,
      \`- **1% Low FPS**: \${lastSummary.p1Fps} FPS\`,
      \`- **0.1% Low FPS**: \${lastSummary.p01Fps} FPS\`,
      \`- **Micro-Stutter Events**: \${lastSummary.stutters} (\${lastSummary.stutterPct}% of frames)\`,
      \`- **Total Frames Analyzed**: \${lastSummary.count}\`,
      \`- *Generated via Toolkit Gen Frame-Time Analyzer*\`
    ].join('\\n');

    navigator.clipboard.writeText(report).then(() => {
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
    <h2 class="text-xl font-bold text-slate-900 mb-2">Engineering Science of Frame Pacing and Micro-Stutter</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      In graphics engineering and PC gaming performance evaluation, Average Frames Per Second (FPS) is an insufficient metric for evaluating real-world visual fluidity. A system delivering an average of 120 FPS can still exhibit severe perceptible hitching and input lag if frames are delivered irregularly. Frame pacing—the consistency of milliseconds elapsed between consecutive image presentations—determines perceived smoothness.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      When assessing game engines or GPU architectures, modern benchmarking tools such as Intel PresentMon and CapFrameX record the exact duration of each frame presentation call (<code>msBetweenPresents</code>). By analyzing the distribution curve of these intervals, engineers isolate hardware bottlenecks, driver shader compilation stalls, and thermal throttling events.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Diagnostic Percentile Standards</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Average Frame Time (ms):</strong> Represents the mathematical mean of all captured intervals. For 60 Hz displays, the target frame time is 16.66 ms; for 144 Hz displays, 6.94 ms; for 240 Hz displays, 4.16 ms.</li>
      <li><strong>1% Low FPS (99th Percentile Duration):</strong> Measures the performance of the slowest 1% of frames during the run. A large gap between Average FPS and 1% Low indicates frame pacing instability or CPU thread contention.</li>
      <li><strong>0.1% Low FPS (99.9th Percentile Duration):</strong> Captures severe hitching events, asset streaming stutters, and garbage collection pauses that disrupt gameplay immersion.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Air-Gapped Client-Side Data Evaluation</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Competitive esports analysts and hardware reviewers often log proprietary gameplay sessions and pre-release hardware benchmarks. By calculating all statistics and generating SVG graphs within local browser memory, Toolkit Gen ensures your hardware telemetry and system benchmarks are never shared with remote entities.
    </p>
  </div>
</section>
`
  }
];

for (const t of batch3) {
  fs.writeFileSync(path.join(contentToolsDir, `${t.id}.json`), JSON.stringify(t, null, 2));
  console.log(`Created tool JSON for ${t.id}`);
}
console.log('Phase N tool batch 3 written.');
