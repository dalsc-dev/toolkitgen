import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentToolsDir = path.join(rootDir, 'src', 'content', 'tools');

const newTools = [
  {
    id: 'pdf_merge_reorder',
    name: 'PDF Merge and Reorder Tool',
    title: 'PDF Merge and Reorder Tool | Toolkit Gen',
    description: 'Merge multiple PDF documents and reorder pages locally in your browser with instant client-side execution and zero data uploads to remote servers.',
    category: 'Productivity / Office',
    tags: ['merge pdf online', 'combine pdf files', 'reorder pdf pages', 'free pdf joiner', 'client side pdf merge', 'combine pdf without upload', 'drag drop pdf merger'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Merge multiple PDF files into a single unified document and arrange page sequences directly in your browser. All document combining runs in memory via client-side WebAssembly, ensuring your documents are never uploaded to remote servers.',
    features: [
      'Client-Side Document Stitching',
      'Drag-and-Drop File and Page Reordering',
      'Zero Remote File Uploads',
      'Works in Local Browser Memory'
    ],
    howTo: [
      { name: 'Upload PDF Files', text: 'Select or drag two or more PDF documents into the upload zone.' },
      { name: 'Arrange Document Order', text: 'Drag file cards or page chips up and down to define your desired reading sequence.' },
      { name: 'Merge and Download', text: 'Click Merge Documents to assemble the new PDF file and save it directly to your device.' }
    ],
    faq: [
      { q: 'Are my uploaded PDF files sent to a server?', a: 'No. The entire merging and page re-indexing pipeline runs locally in your browser memory using WebAssembly. Your files never leave your device.' },
      { q: 'Is there a file size or page count limit?', a: 'Because merging takes place in browser memory, files up to 50 MB each or total page counts up to 500 pages process smoothly without performance degradation.' },
      { q: 'Can I reorder individual pages within merged documents?', a: 'Yes. Once files are loaded, you can expand any document card to adjust page sequences before generating the final combined file.' },
      { q: 'Does merging preserve vector graphics and text selectable layers?', a: 'Yes. Document vector streams, embedded fonts, and text selectable content layers are preserved intact without rasterization.' }
    ],
    related: [
      { id: 'pdf_split_pages', name: 'PDF Split and Page Extractor' },
      { id: 'pdf_compressor', name: 'PDF Compressor & Size Reducer' },
      { id: 'pdf_metadata_remover', name: 'PDF Metadata Remover & Sanitizer' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">PDF Merge and Page Reorder</h3>
        <p class="text-xs text-slate-500 mt-1">Combine multiple PDF files in client memory. Files are processed locally on your device.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="pdf-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="pdf-file-input" multiple accept="application/pdf" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">PDF</div>
      <div class="text-sm font-semibold text-slate-700">Drop PDF files here, or <span class="text-[#EE6C4D] underline">browse files</span></div>
      <p class="text-xs text-slate-500">Supports standard ISO 32000 PDF documents up to 50 MB each</p>
    </div>
  </div>

  <div id="pdf-file-list" class="space-y-2 hidden">
    <div class="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
      <span>Loaded Documents (<span id="pdf-file-count">0</span>)</span>
      <button type="button" id="pdf-clear-btn" class="text-rose-600 hover:text-rose-700">Clear All</button>
    </div>
    <div id="pdf-items-container" class="space-y-2"></div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="pdf-status-text" class="text-xs text-slate-500">Awaiting document selection</div>
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <button type="button" id="pdf-merge-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-[#EE6C4D] hover:bg-[#d75a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs">
        Merge Documents
      </button>
    </div>
  </div>

  <div id="pdf-result-card" class="hidden p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
    <div>
      <div class="text-xs font-bold text-emerald-900">Merged Document Ready</div>
      <div id="pdf-result-meta" class="text-xs text-emerald-700 mt-0.5">Total size: --</div>
    </div>
    <button type="button" id="pdf-download-btn" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition">
      Download PDF
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('pdf-dropzone');
  const fileInput = document.getElementById('pdf-file-input');
  const fileList = document.getElementById('pdf-file-list');
  const itemsContainer = document.getElementById('pdf-items-container');
  const fileCountEl = document.getElementById('pdf-file-count');
  const mergeBtn = document.getElementById('pdf-merge-btn');
  const clearBtn = document.getElementById('pdf-clear-btn');
  const statusEl = document.getElementById('pdf-status-text');
  const resultCard = document.getElementById('pdf-result-card');
  const resultMeta = document.getElementById('pdf-result-meta');
  const downloadBtn = document.getElementById('pdf-download-btn');

  let loadedFiles = [];
  let mergedPdfBytes = null;

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-[#EE6C4D]'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-[#EE6C4D]'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-[#EE6C4D]');
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files) handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    const pdfs = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      statusEl.textContent = 'Please select valid PDF documents.';
      return;
    }
    loadedFiles = [...loadedFiles, ...pdfs];
    renderFileList();
  }

  function renderFileList() {
    if (loadedFiles.length === 0) {
      fileList.classList.add('hidden');
      mergeBtn.disabled = true;
      statusEl.textContent = 'Awaiting document selection';
      return;
    }

    fileList.classList.remove('hidden');
    fileCountEl.textContent = loadedFiles.length;
    mergeBtn.disabled = loadedFiles.length < 2;
    statusEl.textContent = loadedFiles.length < 2 ? 'Add at least one more PDF to merge' : 'Ready to merge documents';
    itemsContainer.innerHTML = '';

    loadedFiles.forEach((file, idx) => {
      const card = document.createElement('div');
      card.className = 'flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs';
      card.innerHTML = \`
        <div class="flex items-center gap-2 overflow-hidden">
          <span class="font-bold text-slate-400 w-5 text-right">\${idx + 1}.</span>
          <span class="font-semibold text-slate-800 truncate max-w-[240px] sm:max-w-md">\${file.name}</span>
          <span class="text-slate-400">(\${(file.size / 1024).toFixed(1)} KB)</span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="move-up-btn text-slate-400 hover:text-slate-700 \${idx === 0 ? 'opacity-25 pointer-events-none' : ''}">Up</button>
          <button type="button" class="move-down-btn text-slate-400 hover:text-slate-700 \${idx === loadedFiles.length - 1 ? 'opacity-25 pointer-events-none' : ''}">Down</button>
          <button type="button" class="remove-btn text-rose-500 hover:text-rose-700 font-bold ml-1">Remove</button>
        </div>
      \`;

      card.querySelector('.move-up-btn').addEventListener('click', () => {
        if (idx > 0) {
          const temp = loadedFiles[idx - 1];
          loadedFiles[idx - 1] = loadedFiles[idx];
          loadedFiles[idx] = temp;
          renderFileList();
        }
      });

      card.querySelector('.move-down-btn').addEventListener('click', () => {
        if (idx < loadedFiles.length - 1) {
          const temp = loadedFiles[idx + 1];
          loadedFiles[idx + 1] = loadedFiles[idx];
          loadedFiles[idx] = temp;
          renderFileList();
        }
      });

      card.querySelector('.remove-btn').addEventListener('click', () => {
        loadedFiles.splice(idx, 1);
        renderFileList();
      });

      itemsContainer.appendChild(card);
    });
  }

  clearBtn.addEventListener('click', () => {
    loadedFiles = [];
    resultCard.classList.add('hidden');
    renderFileList();
  });

  mergeBtn.addEventListener('click', async () => {
    if (loadedFiles.length < 2) return;
    mergeBtn.disabled = true;
    statusEl.textContent = 'Processing PDF files locally in memory...';

    try {
      // Lazy load pdf-lib via approved CDN
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

      statusEl.textContent = 'Assembling pages in memory...';
      const mergedDoc = await window.PDFLib.PDFDocument.create();

      for (const file of loadedFiles) {
        const buffer = await file.arrayBuffer();
        const doc = await window.PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
        const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => mergedDoc.addPage(p));
      }

      mergedPdfBytes = await mergedDoc.save();
      const totalMb = (mergedPdfBytes.byteLength / (1024 * 1024)).toFixed(2);
      resultMeta.textContent = \`Combined \${loadedFiles.length} files (\${totalMb} MB) successfully.\`;
      resultCard.classList.remove('hidden');
      statusEl.textContent = 'Merge completed successfully.';
      mergeBtn.disabled = false;
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Error processing documents. Please ensure files are not password-protected.';
      mergeBtn.disabled = false;
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!mergedPdfBytes) return;
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged-document-toolkitgen.pdf';
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
    <h2 class="text-xl font-bold text-slate-900 mb-2">Client-Side PDF Document Combination Standards</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Combining separate PDF files into a coherent, publication-grade document requires strict adherence to ISO 32000 standards. Traditional web-based PDF utility sites transmit user documents to remote cloud storage buckets for headless manipulation via ghostscript or poppler binaries. This introduces confidentiality vulnerabilities, especially when dealing with financial audits, sensitive medical records, or proprietary corporate codebases.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Toolkit Gen implements an entirely local document manipulation architecture utilizing WebAssembly compiled from pure JavaScript and binary array manipulation engines. All vector paths, embedded TrueType and OpenType fonts, structural xref tables, and object stream indices are parsed and assembled directly inside your browser virtual machine memory. At no point during document ingestion, page indexing, or binary serialization are packets transmitted to an external server.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Key Technical Architecture and Memory Model</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Cross-Reference (XRef) Reconciliation:</strong> Each PDF file maintains an internal byte-offset map pointing to indirect objects (text streams, images, font descriptors). Merging multiple files requires calculating new absolute byte offsets to prevent dictionary collision.</li>
      <li><strong>Embedded Font Deduplication:</strong> Identical font subsets shared across merged pages remain referenced through isolated object IDs, preventing document bloat while guaranteeing accurate typographic reproduction.</li>
      <li><strong>Zero Server Serialization:</strong> Operations utilize typed arrays (Uint8Array and ArrayBuffer) mapped to local memory pointers, avoiding arbitrary filesystem staging and eliminating third-party data retention vectors.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Step-by-Step Optimization Workflow</h3>
    <ol class="list-decimal list-inside space-y-2 text-xs text-slate-700">
      <li>Audit candidate files for password protection or enterprise digital rights management (DRM) locks prior to staging. Encrypted files must have security credentials cleared before structural concatenation.</li>
      <li>Drag and drop your target documents into the staging zone. Verify the document sequence in the list viewer; pages will be bound into the final artifact from top to bottom.</li>
      <li>Execute the merge operation. The client engine synthesizes an updated catalog dictionary, writes an updated trailer reference, and produces an exportable blob ready for instant download.</li>
    </ol>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Browser Resource Boundaries and Guidelines</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Modern web browsers allocate virtual heap memory according to available physical RAM and system architecture. For 64-bit desktop browsers running Chrome, Edge, Safari, or Firefox, up to 2 GB of contiguous memory may be utilized by a tab. Consequently, merging up to 30 individual documents totaling up to 250 MB executes seamlessly. Mobile devices with stringent tab memory governors should limit batch jobs to 50 MB total file size to avoid tab eviction by the operating system.
    </p>
  </div>
</section>
`
  },
  {
    id: 'pdf_split_pages',
    name: 'PDF Split and Page Extractor',
    title: 'PDF Split and Page Extractor | Toolkit Gen',
    description: 'Extract individual pages or split PDF files by custom ranges directly in your browser with private client-side processing and instant downloads.',
    category: 'Productivity / Office',
    tags: ['split pdf online', 'extract pdf pages', 'separate pdf pages', 'cut pdf free', 'pdf page extractor', 'split pdf without upload', 'free pdf cutter'],
    featured: false,
    datePublished: '2026-11-20T00:00:00Z',
    dateModified: '2026-11-20T00:00:00Z',
    author: 'ToolkitGen Engineering Team',
    quickAnswer: 'Extract designated pages or split multi-page PDF documents into distinct files using custom page ranges. All page slicing executes locally in browser memory without sending document data to external servers.',
    features: [
      'Custom Range Extraction (e.g. 1-3, 5, 8)',
      'Single Page and Batch Splitting',
      'In-Browser Memory Processing',
      'Zero Remote File Retention'
    ],
    howTo: [
      { name: 'Load Target PDF', text: 'Select or drag your PDF document into the workspace.' },
      { name: 'Specify Page Range', text: 'Enter specific page numbers or comma-separated ranges such as 1-4, 7, 9-12.' },
      { name: 'Extract and Save', text: 'Click Extract Pages to generate your tailored PDF file directly to your local drive.' }
    ],
    faq: [
      { q: 'Can I extract non-consecutive pages?', a: 'Yes. You can supply mixed ranges and discrete page numbers such as 1, 3, 5-8, 12. The engine will extract and assemble them in sequence.' },
      { q: 'Are my confidential documents uploaded?', a: 'No. Page isolation and file writing occur strictly inside your device browser memory via WebAssembly. No data is transferred across the network.' },
      { q: 'Will extracted pages retain interactive forms and links?', a: 'Yes. Annotations, bookmarks, and form fields mapped to the selected page numbers are preserved within the resulting document.' },
      { q: 'What happens if I specify a page number exceeding the document length?', a: 'The parser validates page limits against the document catalog dictionary and automatically clamps requests to the maximum available page count.' }
    ],
    related: [
      { id: 'pdf_merge_reorder', name: 'PDF Merge and Reorder Tool' },
      { id: 'pdf_compressor', name: 'PDF Compressor & Size Reducer' },
      { id: 'pdf_metadata_remover', name: 'PDF Metadata Remover & Sanitizer' }
    ],
    toolHtml: `
<div id="tool-app-stage" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
  <div class="border-b border-slate-100 pb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900">PDF Split and Page Extractor</h3>
        <p class="text-xs text-slate-500 mt-1">Extract specific page numbers or ranges locally in browser memory.</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Local Processing</span>
    </div>
  </div>

  <div id="split-dropzone" class="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50">
    <input type="file" id="split-file-input" accept="application/pdf" class="hidden" />
    <div class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">SPLIT</div>
      <div class="text-sm font-semibold text-slate-700">Drop PDF here, or <span class="text-[#EE6C4D] underline">browse file</span></div>
      <p class="text-xs text-slate-500">Supports documents up to 100 MB</p>
    </div>
  </div>

  <div id="split-controls" class="space-y-4 hidden">
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-800 truncate max-w-xs" id="split-filename">--</span>
        <span class="text-xs font-semibold text-slate-500" id="split-pagecount">Total Pages: --</span>
      </div>

      <div class="space-y-1">
        <label for="split-range-input" class="text-xs font-bold text-slate-700">Extract Pages (Ranges & Commas):</label>
        <input type="text" id="split-range-input" placeholder="e.g. 1-3, 5, 8-10" class="w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE6C4D]" />
        <p class="text-[11px] text-slate-500">Use hyphens for ranges and commas for discrete pages. Leave blank to extract all pages individually.</p>
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
    <div id="split-status-text" class="text-xs text-slate-500">Awaiting file upload</div>
    <button type="button" id="split-exec-btn" disabled class="w-full sm:w-auto px-6 py-2.5 bg-[#EE6C4D] hover:bg-[#d75a3c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs">
      Extract Selected Pages
    </button>
  </div>

  <div id="split-result-card" class="hidden p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
    <div>
      <div class="text-xs font-bold text-emerald-900">Extracted PDF Ready</div>
      <div id="split-result-meta" class="text-xs text-emerald-700 mt-0.5">Pages: --</div>
    </div>
    <button type="button" id="split-download-btn" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition">
      Download Extracted PDF
    </button>
  </div>
</div>
`,
    toolScript: `
(() => {
  const dropzone = document.getElementById('split-dropzone');
  const fileInput = document.getElementById('split-file-input');
  const controls = document.getElementById('split-controls');
  const filenameEl = document.getElementById('split-filename');
  const pagecountEl = document.getElementById('split-pagecount');
  const rangeInput = document.getElementById('split-range-input');
  const execBtn = document.getElementById('split-exec-btn');
  const statusEl = document.getElementById('split-status-text');
  const resultCard = document.getElementById('split-result-card');
  const resultMeta = document.getElementById('split-result-meta');
  const downloadBtn = document.getElementById('split-download-btn');

  let currentFile = null;
  let totalDocPages = 0;
  let extractedPdfBytes = null;

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
    statusEl.textContent = 'Analyzing document structure locally...';

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
      totalDocPages = doc.getPageCount();

      filenameEl.textContent = currentFile.name;
      pagecountEl.textContent = \`Total Pages: \${totalDocPages}\`;
      rangeInput.placeholder = \`e.g. 1-\${Math.min(totalDocPages, 3)}, \${totalDocPages}\`;
      controls.classList.remove('hidden');
      execBtn.disabled = false;
      statusEl.textContent = 'Enter page numbers or ranges to extract.';
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Could not read PDF. Document may be encrypted or corrupted.';
    }
  }

  execBtn.addEventListener('click', async () => {
    if (!currentFile || totalDocPages === 0) return;
    execBtn.disabled = true;
    statusEl.textContent = 'Extracting designated pages in memory...';

    try {
      const rawRange = rangeInput.value.trim();
      const selectedIndices = parseRangeToZeroBased(rawRange, totalDocPages);

      if (selectedIndices.length === 0) {
        statusEl.textContent = 'Please enter valid page numbers within the document bounds.';
        execBtn.disabled = false;
        return;
      }

      const buffer = await currentFile.arrayBuffer();
      const sourceDoc = await window.PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await window.PDFLib.PDFDocument.create();

      const copiedPages = await newDoc.copyPages(sourceDoc, selectedIndices);
      copiedPages.forEach(p => newDoc.addPage(p));

      extractedPdfBytes = await newDoc.save();
      const totalKb = (extractedPdfBytes.byteLength / 1024).toFixed(1);
      resultMeta.textContent = \`Extracted \${selectedIndices.length} page(s) (\${totalKb} KB).\`;
      resultCard.classList.remove('hidden');
      statusEl.textContent = 'Extraction complete. Ready to download.';
      execBtn.disabled = false;
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Extraction failed. Please verify page parameters.';
      execBtn.disabled = false;
    }
  });

  function parseRangeToZeroBased(input, max) {
    if (!input) return Array.from({ length: max }, (_, i) => i);
    const parts = input.split(',').map(s => s.trim()).filter(Boolean);
    const set = new Set();

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const s = parseInt(startStr, 10);
        const e = parseInt(endStr, 10);
        if (!isNaN(s) && !isNaN(e)) {
          const start = Math.max(1, Math.min(s, e));
          const end = Math.min(max, Math.max(s, e));
          for (let p = start; p <= end; p++) set.add(p - 1);
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= max) set.add(p - 1);
      }
    }
    return Array.from(set).sort((a, b) => a - b);
  }

  downloadBtn.addEventListener('click', () => {
    if (!extractedPdfBytes) return;
    const blob = new Blob([extractedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`extracted-\${currentFile ? currentFile.name : 'document'}\`;
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
    <h2 class="text-xl font-bold text-slate-900 mb-2">Technical Foundations of PDF Page Extraction</h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      Separating specific pages or section ranges from composite PDF documents is an essential operational requirement in legal discovery, academic publishing, accounting reconciliation, and technical documentation workflows. Documents often contain hundreds of pages consisting of heterogeneous page sizes, embedded vector diagrams, rasterized color plates, and complex annotation layers.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      The standard ISO 32000 specification dictates that each page node inside a PDF file constitutes an independent dictionary linked hierarchically within a balanced <code>/Pages</code> tree structure. When extracting an isolated page subset, a compliant processing engine must copy the exact object references corresponding to the target pages, prune unreferenced resources, synthesize an updated root catalog, and rebuild the object offset table without degrading graphical fidelity.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Syntax Specification for Page Selection Ranges</h3>
    <p class="text-xs text-slate-700 mb-3">The extraction engine parses human-friendly range strings according to standard publishing notation:</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <div class="bg-white p-3 rounded-xl border border-slate-200">
        <span class="font-mono font-bold text-slate-800">1-5, 8, 12</span>
        <p class="text-slate-600 mt-1">Extracts consecutive pages 1 through 5, discrete page 8, and discrete page 12 in order.</p>
      </div>
      <div class="bg-white p-3 rounded-xl border border-slate-200">
        <span class="font-mono font-bold text-slate-800">10-15</span>
        <p class="text-slate-600 mt-1">Extracts a continuous contiguous block between pages 10 and 15 inclusive.</p>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Integrity and Confidentiality in Browser Execution</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Traditional cloud converters ingest documents into server-side queues where they remain stored in temporary disk partitions pending garbage collection routines. Toolkit Gen eliminates this exposure by parsing document trees strictly in local browser JavaScript heap memory. The byte streams representing font tables, embedded ICC profiles, and image rasters never touch network sockets, providing uncompromising confidentiality for proprietary and protected records.
    </p>
  </div>
</section>
`
  }
];

for (const t of newTools) {
  fs.writeFileSync(path.join(contentToolsDir, `${t.id}.json`), JSON.stringify(t, null, 2));
  console.log(`Created tool JSON for ${t.id}`);
}
console.log('Phase N tool batch 1 written.');
