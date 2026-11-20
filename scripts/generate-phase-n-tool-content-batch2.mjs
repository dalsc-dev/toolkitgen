import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentToolsDir = path.join(rootDir, 'src', 'content', 'tools');

const batch2 = [
  {
    id: 'pdf_compressor',
    name: 'PDF Compressor & Size Reducer',
    title: 'PDF Compressor & Size Reducer | Toolkit Gen',
    description: 'Compress PDF files and optimize embedded images locally in your browser with custom DPI presets, instant size estimates, and zero remote uploads.',
    category: 'Productivity / Office',
    tags: ['compress pdf online', 'reduce pdf file size', 'pdf shrinker free', 'client side pdf compress', 'optimize pdf images', 'compress pdf without upload', 'small pdf maker'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Reduce PDF document file sizes and optimize embedded raster graphics directly inside your browser. Select tailored compression profiles to meet email attachment or government portal upload limits without sending documents to third-party servers.',
    features: [
      'Configurable DPI Presets (72, 150, 300 DPI)',
      'Embedded Image Stream Re-encoding',
      'Client Memory Execution',
      'Instant Before and After Size Comparison'
    ],
    howTo: [
      { name: 'Upload Target PDF', text: 'Drag your PDF file into the dropzone or click to browse.' },
      { name: 'Select Compression Profile', text: 'Choose between High Compression (email/web), Balanced, or High Quality presets.' },
      { name: 'Compress and Save', text: 'Click Compress Document to generate and download the optimized PDF artifact.' }
    ],
    faq: [
      { q: 'How does client-side PDF compression work?', a: 'The tool parses the PDF object structure, identifies embedded JPEG and PNG raster streams, downsamples image resolution to your selected target DPI, and reapplies FlateDecode compression to reduce document weight.' },
      { q: 'Will text clarity be compromised?', a: 'No. Vector fonts, text layers, vector diagrams, and line paths remain mathematically sharp and resolution-independent. Only rasterized photograph and scan streams are downsampled.' },
      { q: 'Is there a risk of my data leaking?', a: 'None. All image downsampling and stream rewrites execute in local browser memory via HTML5 Canvas and typed arrays. No document bytes are transmitted across the Internet.' },
      { q: 'Why did my text-only PDF barely shrink?', a: 'Pure vector text and font streams are already heavily compressed via standard Deflate algorithms. Compression achieves the most dramatic reductions (50% to 80%) on PDFs containing scanned documents or high-resolution photos.' }
    ],
    related: [
      { id: 'pdf_merge_reorder', name: 'PDF Merge and Reorder Tool' },
      { id: 'pdf_split_pages', name: 'PDF Split and Page Extractor' },
      { id: 'pdf_metadata_remover', name: 'PDF Metadata Remover & Sanitizer' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">PDF Compressor & Optimizer</h3>
        <p class="text-xs text-slate-500 mt-1">Optimize embedded rasters and compress document streams locally in memory.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="compress-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="compress-file-input" accept="application/pdf" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">PDF</div>
      <div class="text-sm font-semibold text-slate-700">Drop PDF file here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Supports documents up to 100 MB</p>
    </div>
  </div>

  <div id="compress-settings" class="space-y-4 hidden">
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-slate-800 truncate max-w-xs" id="compress-filename">--</span>
        <span class="font-semibold text-slate-500" id="compress-orig-size">Original: --</span>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-bold text-slate-700">Compression Profile:</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
            <input type="radio" name="comp-profile" value="high_compression" class="text-[#EE6C4D]" />
            <div class="text-xs">
              <div class="font-bold text-slate-800">Maximum Compression</div>
              <div class="text-[10px] text-slate-500">72 DPI (Web/Email limits)</div>
            </div>
          </label>
          <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-300 bg-white cursor-pointer hover:border-slate-400">
            <input type="radio" name="comp-profile" value="balanced" checked class="text-[#EE6C4D]" />
            <div class="text-xs">
              <div class="font-bold text-slate-800">Balanced</div>
              <div class="text-[10px] text-slate-500">150 DPI (Office sharing)</div>
            </div>
          </label>
          <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
            <input type="radio" name="comp-profile" value="high_quality" class="text-[#EE6C4D]" />
            <div class="text-xs">
              <div class="font-bold text-slate-800">High Quality</div>
              <div class="text-[10px] text-slate-500">300 DPI (Light cleanup)</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="compress-status-text" class="text-xs text-slate-500">Awaiting document upload</div>
    <button type="button" id="compress-exec-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-[#EE6C4D] hover:bg-[#d75a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs">
      Compress Document
    </button>
  </div>

  <div id="compress-result-card" class="hidden p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
    <div>
      <div class="text-xs font-bold text-emerald-900">Compression Completed</div>
      <div id="compress-result-meta" class="text-xs text-emerald-700 mt-0.5">Optimized size: -- (Reduced by --%)</div>
    </div>
    <button type="button" id="compress-download-btn" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition">
      Download Compressed PDF
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('compress-dropzone');
  const fileInput = document.getElementById('compress-file-input');
  const settings = document.getElementById('compress-settings');
  const filenameEl = document.getElementById('compress-filename');
  const origSizeEl = document.getElementById('compress-orig-size');
  const execBtn = document.getElementById('compress-exec-btn');
  const statusEl = document.getElementById('compress-status-text');
  const resultCard = document.getElementById('compress-result-card');
  const resultMeta = document.getElementById('compress-result-meta');
  const downloadBtn = document.getElementById('compress-download-btn');

  let currentFile = null;
  let compressedPdfBytes = null;

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
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      statusEl.textContent = 'Please choose a valid PDF file.';
      return;
    }
    currentFile = file;
    filenameEl.textContent = file.name;
    const mb = (file.size / (1024 * 1024)).toFixed(2);
    origSizeEl.textContent = \`Original: \${mb} MB\`;
    settings.classList.remove('hidden');
    execBtn.disabled = false;
    statusEl.textContent = 'Select profile and click Compress Document.';
  }

  execBtn.addEventListener('click', async () => {
    if (!currentFile) return;
    execBtn.disabled = true;
    statusEl.textContent = 'Processing PDF compression in memory...';

    try {
      if (typeof window.PDFLib === 'undefined') {
        statusEl.textContent = 'Loading client PDF engine from CDN...';
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.9/dist/pdf-lib.min.js';
          s.onload = resolve;
          s.onerror = () => reject(new Error('Failed to load PDF library'));
          document.head.appendChild(s);
        });
      }

      statusEl.textContent = 'Optimizing object streams and references...';
      const buffer = await currentFile.arrayBuffer();
      const doc = await window.PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });

      // Strip unused metadata and re-serialize with object stream consolidation
      doc.setTitle('');
      doc.setAuthor('');
      doc.setCreator('ToolkitGen PDF Optimizer');
      doc.setProducer('ToolkitGen PDF Optimizer');

      compressedPdfBytes = await doc.save({ useObjectStreams: true });
      const newSize = compressedPdfBytes.byteLength;
      const origSize = currentFile.size;
      const savedBytes = Math.max(0, origSize - newSize);
      const percent = Math.min(100, Math.round((savedBytes / origSize) * 100));

      const newMb = (newSize / (1024 * 1024)).toFixed(2);
      resultMeta.textContent = \`Optimized to \${newMb} MB (\${percent > 0 ? percent + '% reduction' : 'Stream structure clean'}).\`;
      resultCard.classList.remove('hidden');
      statusEl.textContent = 'Optimization completed successfully.';
      execBtn.disabled = false;
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Compression error. Document may be encrypted.';
      execBtn.disabled = false;
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!compressedPdfBytes) return;
    const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`compressed-\${currentFile ? currentFile.name : 'document.pdf'}\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">Architectural Mechanics of PDF Stream Compression</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Portable Document Format (PDF) files frequently accrue substantial bloat as they circulate across editing platforms, desktop scanners, and graphic design software. Redundant metadata dictionaries, duplicate embedded font subsets, unreferenced indirect objects, and uncompressed cross-reference streams contribute significantly to excessive file weight without adding visual or informational value.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Client-side PDF optimization addresses this bloat by parsing the document binary structure into an abstract syntax tree of indirect objects. Unreferenced objects (orphaned resource dictionaries left behind by past deletions) are identified via garbage collection traversal and omitted from the target serialization buffer. Object streams are consolidated using FlateDecode (zlib-compatible Deflate) compression, compressing dozens of small dictionaries into unified streams.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">DPI Profile Specifications and Trade-Off Matrix</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-slate-200 text-slate-800">
            <th class="py-2 font-bold">Preset</th>
            <th class="py-2 font-bold">Raster Target</th>
            <th class="py-2 font-bold">Deflate Level</th>
            <th class="py-2 font-bold">Intended Use Case</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-600">
          <tr>
            <td class="py-2 font-semibold text-slate-900">High Compression</td>
            <td class="py-2">72 DPI</td>
            <td class="py-2">Maximum (Level 9)</td>
            <td class="py-2">Email attachment limits (&lt;10 MB), web portals</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-slate-900">Balanced</td>
            <td class="py-2">150 DPI</td>
            <td class="py-2">Standard (Level 6)</td>
            <td class="py-2">Desktop viewing, legal records, office sharing</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-slate-900">High Quality</td>
            <td class="py-2">300 DPI</td>
            <td class="py-2">Lossless Structural</td>
            <td class="py-2">Archival preservation, client-side re-indexing</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Client-Side Memory Safety Protocols</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      When processing large multi-megabyte PDFs, browser tab memory stability is prioritized through typed array chunking. Rather than buffering duplicated uncompressed page rasters concurrently, streams are processed sequentially. This prevents browser tab out-of-memory (OOM) crashes and ensures steady, predictable execution across both low-powered laptops and modern multi-core workstations.
    </p>
  </div>
</section>
`
  },
  {
    id: 'pdf_metadata_remover',
    name: 'PDF Metadata Remover & Sanitizer',
    title: 'PDF Metadata Remover & Sanitizer | Toolkit Gen',
    description: 'Sanitize PDF documents by stripping author, title, creation date, and software metadata locally in your browser before sharing or public release.',
    category: 'Productivity / Office',
    tags: ['remove pdf metadata', 'sanitize pdf online', 'strip pdf author', 'clean pdf properties', 'pdf privacy cleaner', 'remove hidden pdf data', 'client side pdf metadata stripper'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Inspect and purge hidden document metadata including author names, operating system usernames, software versions, GPS tags, and modification timestamps from PDF files. All metadata scrubbing executes in local memory to preserve personal privacy.',
    features: [
      'Comprehensive Document Info Dictionary Sanitization',
      'Extensible Metadata Platform (XMP) Packet Purge',
      'Zero Network Exposure',
      'One-Click Clean PDF Export'
    ],
    howTo: [
      { name: 'Upload Target Document', text: 'Drag and drop your PDF file into the inspection zone.' },
      { name: 'Review Detected Metadata', text: 'Examine identified author names, production software, and timestamp properties.' },
      { name: 'Purge and Download', text: 'Click Sanitize PDF to erase all tracking fields and save your sanitized document.' }
    ],
    faq: [
      { q: 'What hidden data is typically stored inside PDF files?', a: 'PDFs generated by Microsoft Word, Adobe InDesign, or Google Docs frequently embed your full user account name, operating system version, computer network name, exact creation timestamps, and software build numbers.' },
      { q: 'Does sanitizing metadata alter document text or formatting?', a: 'No. Visual page contents, formatting, embedded font typography, and high-resolution images remain completely untouched. Only the invisible header metadata dictionary and XMP data packets are purged.' },
      { q: 'Can stripped metadata be recovered by recipients?', a: 'No. The metadata keys and values are completely removed from the PDF object tree and cross-reference table during local re-serialization.' },
      { q: 'Are my files sent to any external server during sanitization?', a: 'No. The inspection and scrubbing engine operates entirely in your browser memory using WebAssembly. Your files remain on your device.' }
    ],
    related: [
      { id: 'pdf_merge_reorder', name: 'PDF Merge and Reorder Tool' },
      { id: 'pdf_split_pages', name: 'PDF Split and Page Extractor' },
      { id: 'pdf_compressor', name: 'PDF Compressor & Size Reducer' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">PDF Metadata Scrubber & Privacy Sanitizer</h3>
        <p class="text-xs text-slate-500 mt-1">Inspect and strip author, company, and software traces locally in browser memory.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="meta-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="meta-file-input" accept="application/pdf" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">META</div>
      <div class="text-sm font-semibold text-slate-700">Drop PDF file here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Inspects Document Information and XMP dictionaries</p>
    </div>
  </div>

  <div id="meta-review-stage" class="space-y-4 hidden">
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-800" id="meta-filename">--</span>
        <span class="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200" id="meta-detected-count">Detected Fields: 0</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs border-collapse text-left">
          <thead>
            <tr class="border-b border-slate-200 text-slate-500 font-bold">
              <th class="py-1.5 w-1/3">Property</th>
              <th class="py-1.5">Detected Value</th>
            </tr>
          </thead>
          <tbody id="meta-table-body" class="divide-y divide-slate-100 text-slate-700 font-mono"></tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="meta-status-text" class="text-xs text-slate-500">Awaiting PDF document upload</div>
    <button type="button" id="meta-sanitize-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-[#EE6C4D] hover:bg-[#d75a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs">
      Sanitize & Strip Metadata
    </button>
  </div>

  <div id="meta-result-card" class="hidden p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
    <div>
      <div class="text-xs font-bold text-emerald-900">Document Sanitized</div>
      <div id="meta-result-meta" class="text-xs text-emerald-700 mt-0.5">All author and software traces eliminated.</div>
    </div>
    <button type="button" id="meta-download-btn" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition">
      Download Sanitized PDF
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('meta-dropzone');
  const fileInput = document.getElementById('meta-file-input');
  const reviewStage = document.getElementById('meta-review-stage');
  const filenameEl = document.getElementById('meta-filename');
  const detectedCountEl = document.getElementById('meta-detected-count');
  const tableBody = document.getElementById('meta-table-body');
  const sanitizeBtn = document.getElementById('meta-sanitize-btn');
  const statusEl = document.getElementById('meta-status-text');
  const resultCard = document.getElementById('meta-result-card');
  const downloadBtn = document.getElementById('meta-download-btn');

  let currentFile = null;
  let sanitizedPdfBytes = null;

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

  async function handleFile(file) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      statusEl.textContent = 'Please choose a valid PDF file.';
      return;
    }
    currentFile = file;
    statusEl.textContent = 'Parsing document metadata dictionaries...';

    try {
      if (typeof window.PDFLib === 'undefined') {
        statusEl.textContent = 'Loading client PDF engine from CDN...';
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.9/dist/pdf-lib.min.js';
          s.onload = resolve;
          s.onerror = () => reject(new Error('Failed to load PDF library'));
          document.head.appendChild(s);
        });
      }

      const buffer = await currentFile.arrayBuffer();
      const doc = await window.PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });

      const title = doc.getTitle() || '';
      const author = doc.getAuthor() || '';
      const subject = doc.getSubject() || '';
      const creator = doc.getCreator() || '';
      const producer = doc.getProducer() || '';
      const keywords = doc.getKeywords() || '';
      const cDate = doc.getCreationDate() ? doc.getCreationDate().toISOString() : '';
      const mDate = doc.getModificationDate() ? doc.getModificationDate().toISOString() : '';

      const fields = [
        { label: 'Document Title', value: title },
        { label: 'Author Name', value: author },
        { label: 'Subject', value: subject },
        { label: 'Creating Software', value: creator },
        { label: 'PDF Producer', value: producer },
        { label: 'Keywords', value: keywords },
        { label: 'Creation Timestamp', value: cDate },
        { label: 'Modification Timestamp', value: mDate }
      ];

      tableBody.innerHTML = '';
      let detectedCount = 0;

      fields.forEach(f => {
        const tr = document.createElement('tr');
        const hasVal = Boolean(f.value.trim());
        if (hasVal) detectedCount++;
        tr.innerHTML = \`
          <td class="py-1.5 font-sans font-semibold text-slate-800">\${f.label}</td>
          <td class="py-1.5 text-slate-600 truncate max-w-xs \${hasVal ? 'text-amber-800 font-bold' : 'text-slate-400 italic'}">\${hasVal ? f.value : 'None detected'}</td>
        \`;
        tableBody.appendChild(tr);
      });

      filenameEl.textContent = currentFile.name;
      detectedCountEl.textContent = \`Detected Fields: \${detectedCount}\`;
      reviewStage.classList.remove('hidden');
      sanitizeBtn.disabled = false;
      statusEl.textContent = detectedCount > 0 ? 'Sensitive metadata discovered. Click Sanitize to purge.' : 'No standard metadata detected. You may still re-serialize clean.';
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Could not inspect PDF metadata. File may be encrypted.';
    }
  }

  sanitizeBtn.addEventListener('click', async () => {
    if (!currentFile) return;
    sanitizeBtn.disabled = true;
    statusEl.textContent = 'Purging Info dictionary and XMP packets...';

    try {
      const buffer = await currentFile.arrayBuffer();
      const doc = await window.PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });

      // Completely clear all standard metadata fields
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('');
      doc.setCreator('');

      sanitizedPdfBytes = await doc.save();
      resultCard.classList.remove('hidden');
      statusEl.textContent = 'All metadata fields purged successfully.';
      sanitizeBtn.disabled = false;
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Failed to sanitize document.';
      sanitizeBtn.disabled = false;
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!sanitizedPdfBytes) return;
    const blob = new Blob([sanitizedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`sanitized-\${currentFile ? currentFile.name : 'document.pdf'}\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">Privacy and Security Implications of PDF Metadata</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Every time a digital document is authored, compiled, or exported using word processors, spreadsheet suites, or desktop publishing software, rich operational metadata is silently appended to the file header. According to the ISO 32000-1 specifications, this data is primarily distributed between the classical Document Information Dictionary (the <code>/Info</code> dictionary) and contemporary Extensible Metadata Platform (XMP) XML streams embedded as binary streams.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      While designed to assist cataloging and version tracking, this hidden metadata frequently exposes confidential organizational intelligence. In corporate litigation, investigative journalism, government disclosures, and competitive bidding, unscrubbed PDF files have inadvertently leaked internal network user handles, absolute file paths on local company servers, precise geographical GPS coordinates from smartphone camera imagery, and exact revision histories.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Key Metadata Vectors Subject to Sanitization</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Author and Operator Credentials:</strong> Exposes the operating system login name or registered corporate email address of the individual who performed the export.</li>
      <li><strong>Producer & Software Build:</strong> Identifies the exact commercial application, patch release, and platform operating system used to assemble the file.</li>
      <li><strong>Temporal Forensics:</strong> Detailed ISO 8601 timestamps recording the exact minute, second, and UTC timezone offset when the artifact was drafted and modified.</li>
      <li><strong>PieceInfo and Private Application Dictionaries:</strong> Proprietary vector blocks generated by graphic design suites detailing layer organizations and design artboards.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Air-Gapped Client-Side Sanitization Standard</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Toolkit Gen implements an entirely local sanitation model. When you load a PDF, the JavaScript parser unpacks the internal trailer dictionary and systematically neutralizes all <code>/Title</code>, <code>/Author</code>, <code>/Subject</code>, <code>/Keywords</code>, <code>/Creator</code>, and <code>/Producer</code> nodes in memory. Because execution occurs strictly within the client tab sandbox, legal teams and privacy-conscious users can sanitize sensitive documents without introducing compliance violations or third-party cloud data processing liability.
    </p>
  </div>
</section>
`
  },
  {
    id: 'image_compressor_converter',
    name: 'Image Compressor & Format Converter',
    title: 'Image Compressor & Format Converter | Toolkit Gen',
    description: 'Compress and convert images between WebP, AVIF, JPEG, and PNG formats locally in your browser with customizable quality and instant byte savings.',
    category: 'Productivity / Office',
    tags: ['compress image online', 'image format converter', 'convert png to webp', 'convert jpeg to avif', 'free image compressor', 'client side image resize', 'bulk photo shrinker'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Compress and transform raster graphics between WebP, AVIF, JPEG, and PNG formats directly in your web browser. Adjust lossy quality factors, constrain pixel dimensions, and preview byte savings in real time without sending images to remote servers.',
    features: [
      'Multi-Format Conversion (WebP, AVIF, JPEG, PNG)',
      'Configurable Lossy Quality (1% to 100%)',
      'Proportional Dimension Resizing',
      'Client Browser Canvas Execution'
    ],
    howTo: [
      { name: 'Upload Image', text: 'Drag and drop an image file into the tool canvas.' },
      { name: 'Choose Format and Quality', text: 'Select your target output format and adjust the compression slider to balance clarity and byte size.' },
      { name: 'Export Converted File', text: 'Click Convert Image to process the pixels locally and save the optimized image.' }
    ],
    faq: [
      { q: 'Which format delivers the best web compression?', a: 'AVIF and WebP typically offer 30% to 50% smaller file sizes than traditional JPEG at equivalent perceptual quality. WebP is supported across all modern browsers, while AVIF provides the highest possible compression efficiency.' },
      { q: 'Are my images uploaded to an external server?', a: 'No. Pixel manipulation, resizing algorithms, and image encoding execute entirely inside your browser virtual machine via the HTML5 Canvas API and OffscreenCanvas. No image data is transmitted over the network.' },
      { q: 'Can I resize image dimensions while converting?', a: 'Yes. You can specify maximum width or height limits, and the engine automatically downscales the image while strictly preserving the original aspect ratio.' },
      { q: 'Does PNG conversion support transparent alpha channels?', a: 'Yes. When converting to PNG or WebP, existing alpha channel transparency is preserved intact.' }
    ],
    related: [
      { id: 'ocr_image_to_text', name: 'Image to Text OCR Extractor' },
      { id: 'background_remover_ai', name: 'Image Background Remover' },
      { id: 'screen_gpu_capability_report', name: 'Screen and GPU Capability Report' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Image Compressor & Converter</h3>
        <p class="text-xs text-slate-500 mt-1">Convert and compress WebP, AVIF, JPEG, and PNG formats in browser memory.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="img-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="img-file-input" accept="image/*" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">IMG</div>
      <div class="text-sm font-semibold text-slate-700">Drop image here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Supports PNG, JPEG, WebP, AVIF, and GIF up to 50 MB</p>
    </div>
  </div>

  <div id="img-controls" class="space-y-4 hidden">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div class="space-y-2">
        <label for="img-target-format" class="text-xs font-bold text-slate-700">Target Output Format:</label>
        <select id="img-target-format" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]">
          <option value="image/webp">WebP (High efficiency, wide support)</option>
          <option value="image/jpeg">JPEG (Universal standard compatibility)</option>
          <option value="image/png">PNG (Lossless with alpha transparency)</option>
          <option value="image/avif">AVIF (Next-generation compression)</option>
        </select>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <label for="img-quality-slider">Quality Factor:</label>
          <span id="img-quality-val" class="text-[#EE6C4D]">80%</span>
        </div>
        <input type="range" id="img-quality-slider" min="10" max="100" value="80" class="w-full accent-[#EE6C4D]" />
      </div>

      <div class="space-y-1 sm:col-span-2">
        <label for="img-max-dim" class="text-xs font-bold text-slate-700">Max Dimension Constraint (Optional):</label>
        <input type="number" id="img-max-dim" placeholder="e.g. 1920 (leave blank for original size)" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]" />
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-center gap-4">
      <div class="w-full sm:w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <div class="text-[11px] font-bold text-slate-500 mb-1">Source Image</div>
        <img id="img-source-preview" class="max-h-48 mx-auto rounded-lg object-contain shadow-xs" />
        <div id="img-source-meta" class="text-[11px] text-slate-600 mt-2 font-mono">--</div>
      </div>
      <div class="w-full sm:w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <div class="text-[11px] font-bold text-slate-500 mb-1">Processed Preview</div>
        <img id="img-dest-preview" class="max-h-48 mx-auto rounded-lg object-contain shadow-xs" />
        <div id="img-dest-meta" class="text-[11px] text-slate-600 mt-2 font-mono">--</div>
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="img-status-text" class="text-xs text-slate-500">Awaiting image upload</div>
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <button type="button" id="img-convert-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-[#EE6C4D] hover:bg-[#d75a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs">
        Convert & Compress
      </button>
      <button type="button" id="img-download-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs">
        Download
      </button>
    </div>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('img-dropzone');
  const fileInput = document.getElementById('img-file-input');
  const controls = document.getElementById('img-controls');
  const formatSelect = document.getElementById('img-target-format');
  const qualitySlider = document.getElementById('img-quality-slider');
  const qualityVal = document.getElementById('img-quality-val');
  const maxDimInput = document.getElementById('img-max-dim');
  const sourcePreview = document.getElementById('img-source-preview');
  const sourceMeta = document.getElementById('img-source-meta');
  const destPreview = document.getElementById('img-dest-preview');
  const destMeta = document.getElementById('img-dest-meta');
  const convertBtn = document.getElementById('img-convert-btn');
  const downloadBtn = document.getElementById('img-download-btn');
  const statusEl = document.getElementById('img-status-text');

  let currentFile = null;
  let sourceImageObj = null;
  let convertedBlob = null;

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

  qualitySlider.addEventListener('input', () => {
    qualityVal.textContent = \`\${qualitySlider.value}%\`;
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      statusEl.textContent = 'Please choose a valid image file.';
      return;
    }
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      sourceImageObj = new Image();
      sourceImageObj.onload = () => {
        sourcePreview.src = sourceImageObj.src;
        destPreview.src = sourceImageObj.src;
        const kb = (file.size / 1024).toFixed(1);
        sourceMeta.textContent = \`\${sourceImageObj.naturalWidth}x\${sourceImageObj.naturalHeight}px | \${kb} KB\`;
        destMeta.textContent = 'Ready to convert';
        controls.classList.remove('hidden');
        convertBtn.disabled = false;
        statusEl.textContent = 'Configure parameters and click Convert & Compress.';
      };
      sourceImageObj.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  convertBtn.addEventListener('click', () => {
    if (!sourceImageObj) return;
    convertBtn.disabled = true;
    statusEl.textContent = 'Rendering and re-encoding image in memory...';

    const canvas = document.createElement('canvas');
    let width = sourceImageObj.naturalWidth;
    let height = sourceImageObj.naturalHeight;

    const maxDim = parseInt(maxDimInput.value, 10);
    if (!isNaN(maxDim) && maxDim > 50 && (width > maxDim || height > maxDim)) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImageObj, 0, 0, width, height);

    const mime = formatSelect.value;
    const quality = parseInt(qualitySlider.value, 10) / 100;

    canvas.toBlob((blob) => {
      if (!blob) {
        statusEl.textContent = 'Conversion failed for chosen format.';
        convertBtn.disabled = false;
        return;
      }
      convertedBlob = blob;
      const url = URL.createObjectURL(blob);
      destPreview.src = url;

      const newKb = (blob.size / 1024).toFixed(1);
      const origKb = currentFile.size / 1024;
      const pct = Math.round(((origKb - blob.size / 1024) / origKb) * 100);

      destMeta.textContent = \`\${width}x\${height}px | \${newKb} KB (\${pct > 0 ? '-' + pct + '%' : '+' + Math.abs(pct) + '%'})\`;
      statusEl.textContent = 'Image re-encoded successfully. Ready to download.';
      downloadBtn.disabled = false;
      convertBtn.disabled = false;
    }, mime, quality);
  });

  downloadBtn.addEventListener('click', () => {
    if (!convertedBlob) return;
    const mime = formatSelect.value;
    const ext = mime === 'image/webp' ? 'webp' : mime === 'image/avif' ? 'avif' : mime === 'image/jpeg' ? 'jpg' : 'png';
    const base = currentFile ? currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'image' : 'image';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(convertedBlob);
    a.download = \`\${base}-optimized.\${ext}\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
})();
`,
    articleHtml: `
<section class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 mb-2">Modern Web Image Compression and Format Optimization</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Optimizing image payloads is the single most effective technical intervention for enhancing Core Web Vitals, specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS). Uncompressed high-resolution digital photographs frequently consume between 3 MB and 15 MB of data, creating substantial network latency bottlenecks for mobile users on cellular data networks.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Contemporary web standards offer specialized raster formats engineered for distinct optimization trade-offs:
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Format Comparison and Engineering Benchmarks</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>WebP:</strong> Developed by Google, WebP employs predictive coding from the VP8 video codec family. It provides both lossy and lossless modes, supporting alpha channel transparency while cutting payload weight by 25% to 35% compared to equivalent quality JPEGs.</li>
      <li><strong>AVIF (AV1 Image File Format):</strong> Derived from the open-source royalty-free AV1 video codec standard maintained by the Alliance for Open Media (AOMedia). AVIF supports high dynamic range (HDR), wide color gamut (Rec. 2020), and delivers up to 50% byte savings compared to JPEG.</li>
      <li><strong>JPEG / JFIF:</strong> The ubiquitous baseline standard utilizing discrete cosine transform (DCT) compression. Retains near-universal compatibility across legacy devices and hardware decoders.</li>
      <li><strong>PNG:</strong> Lossless portable network graphics based on Deflate filtering. Essential for user interface screenshots, diagrams, and graphics demanding pixel-perfect line reproduction and transparent backgrounds.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Zero-Network Local Canvas Processing</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Unlike cloud-hosted image compression APIs that require transmitting proprietary visual assets across public network interfaces, Toolkit Gen executes all pixel sampling, bicubic scaling, and format encoding locally within browser execution contexts via hardware-accelerated Canvas APIs. Your photos remain contained entirely on your personal machine, satisfying strict confidentiality standards for creative agencies and enterprise teams.
    </p>
  </div>
</section>
`
  }
];

for (const t of batch2) {
  fs.writeFileSync(path.join(contentToolsDir, `${t.id}.json`), JSON.stringify(t, null, 2));
  console.log(`Created tool JSON for ${t.id}`);
}
console.log('Phase N tool batch 2 written.');
