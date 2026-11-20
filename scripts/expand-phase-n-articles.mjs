import fs from 'node:fs';
import path from 'node:path';

const toolsDir = 'src/content/tools';

const expansions = {
  pdf_split_pages: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Structural Dictionary Reconciliation During Splitting</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      A PDF document is not a sequential stream of independent pages; it is an interconnected graph of indirect objects defined by the ISO 32000 standard. The root node points to a <code>/Pages</code> collection that branches into intermediate nodes before terminating at individual page dictionaries. Each page dictionary references content streams, resources (fonts, color spaces, XObjects), and annotations (hyperlinks, form fields, highlight markups).
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      When extracting an arbitrary subset of pages—such as pages 3, 5, and 8—the extraction engine performs a deep traversal of the object graph. All dependencies necessary to render the selected pages are identified and cloned into a fresh document structure. Meanwhile, unreferenced font subsets, media clips, and orphaned page content streams belonging to discarded pages are excluded. This selective pruning guarantees that the resulting split document is lightweight, fully compliant with international PDF standards, and completely standalone without broken internal references.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Enterprise Use Cases & Compliance Workflows</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Legal Discovery & Redaction Bundles:</strong> Legal teams routinely isolate relevant trial exhibits and evidentiary filings from voluminous 500-page court dockets without risking external document exposure.</li>
      <li><strong>Financial Auditing & Invoicing:</strong> Accountants extract quarterly ledger summaries or specific vendor billing batches from massive enterprise resource planning (ERP) exports for client distribution.</li>
      <li><strong>Academic & Research Submissions:</strong> Researchers separate individual journal chapters, methodology appendices, and citation indexes for targeted peer-review distribution.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Memory Optimization and Large File Safeguards</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Processing large PDF archives inside a browser tab requires careful resource budgeting. Browser JavaScript virtual machines manage heap memory through automatic garbage collection. To prevent memory spikes when parsing 100 MB+ files, Toolkit Gen utilizes streaming typed array slices (ArrayBuffer pointers) that read binary records on demand rather than buffering multi-megabyte decompression buffers concurrently. This architectural pattern prevents memory leaks and ensures dependable performance across mobile browsers, tablets, and low-spec workstations.
    </p>
  </div>`,

  pdf_compressor: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Deflate Stream Compression and Object Stream Packing</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      In standard PDF architecture, every text snippet, graphic state operator, font dictionary, and content stream is stored as an indirect object preceded by an integer object number and generation identifier (e.g. <code>12 0 obj ... endobj</code>). In documents with hundreds of pages, this individual object wrapping generates significant structural overhead.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Modern PDF 1.5+ specifications introduce Object Streams (<code>/ObjStm</code>), allowing dozens or hundreds of indirect objects to be consolidated into a single contiguous binary stream compressed with FlateDecode. Toolkit Gen re-indexes your document hierarchy, combines fragmented structural objects into compressed streams, and rebuilds the cross-reference stream (<code>/XRef</code>). This structural optimization frequently strips 15% to 35% of file size from documents containing extensive text formatting or complex vector forms without altering visual content.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Raster Image Downsampling Calculations</h3>
    <p class="text-xs text-slate-700 mb-2">When PDFs contain high-resolution scans or photos, image streams represent up to 90% of total document byte size. The relationship between resolution and file size follows a quadratic scale:</p>
    <div class="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
      Pixel Volume = Width (inches) x Height (inches) x (DPI)^2
    </div>
    <p class="text-xs text-slate-600 mt-2">
      Downsampling a 300 DPI full-page letter scan (8.5 x 11 inches = ~8.4 million pixels) to 150 DPI reduces the total pixel count to ~2.1 million pixels—an immediate 75% raw pixel reduction before lossy DCT re-encoding. This quadratic scaling is why selecting the Balanced (150 DPI) preset achieves dramatic size reductions while preserving crisp legibility for office printing and screen review.
    </p>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Enterprise Privacy and Data Compliance</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Many commercial online compression websites retain user-uploaded documents on third-party cloud servers for advertising analysis, optical model training, or marketing profiling. Toolkit Gen executes all PDF stream parsing, image downsampling, and object serialization directly within your local browser JavaScript engine. Your tax returns, intellectual property filings, medical evaluations, and commercial contracts remain strictly on your physical machine.
    </p>
  </div>`,

  pdf_metadata_remover: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Forensic Metadata in Document Exchange</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Digital forensics teams frequently exploit unscrubbed PDF metadata to reconstruct the authoring timeline and provenance of electronic documents. When an application exports a PDF, it typically writes two parallel metadata repositories: the classical <code>/Info</code> dictionary and the Extensible Metadata Platform (XMP) package formatted as RDF/XML.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      While consumer users observe only the visible text on the page, the underlying XMP stream can record user login accounts, local computer network hostnames, MAC address hashes, printer serial identifiers, and even historical revision IDs (DocumentID and InstanceID). In whistleblowing, confidential negotiations, press releases, and legal litigation, releasing an unscrubbed PDF poses severe informational compromise risks.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Systematic Sanitization Matrix</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-slate-200 text-slate-800">
            <th class="py-2 font-bold">Metadata Key</th>
            <th class="py-2 font-bold">Risk Exposure</th>
            <th class="py-2 font-bold">Sanitization Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-600">
          <tr>
            <td class="py-2 font-mono text-slate-900">/Author</td>
            <td class="py-2">Exposes real operator name or OS username</td>
            <td class="py-2 text-emerald-700 font-bold">Purged</td>
          </tr>
          <tr>
            <td class="py-2 font-mono text-slate-900">/Producer</td>
            <td class="py-2">Reveals exact operating system & software build</td>
            <td class="py-2 text-emerald-700 font-bold">Purged</td>
          </tr>
          <tr>
            <td class="py-2 font-mono text-slate-900">/CreationDate</td>
            <td class="py-2">Exposes temporal authoring timeline and timezone</td>
            <td class="py-2 text-emerald-700 font-bold">Purged</td>
          </tr>
          <tr>
            <td class="py-2 font-mono text-slate-900">/Metadata (XMP)</td>
            <td class="py-2">Contains XML revision history, camera EXIF, GPS</td>
            <td class="py-2 text-emerald-700 font-bold">Completely Stripped</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Verification and Quality Assurance</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Following the sanitization pass, you can verify document integrity using any standard PDF inspector or hex viewer. The document catalog will point to an empty information dictionary, and all XMP XML stream blocks will be eliminated from the binary trailer. Text searchability, vector typography, and visual artwork remain completely unharmed.
    </p>
  </div>`,

  image_compressor_converter: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Mathematical Quantization and Lossy vs Lossless Encoding</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Image compression operates by balancing statistical redundancy elimination with perceptual visual tolerance. In lossless formats such as PNG and WebP Lossless, spatial prediction filters (Sub, Up, Average, Paeth) analyze adjacent pixel relationships to compute difference deltas, which are subsequently compressed using Deflate or LZ77 entropy coding. This guarantees 100% mathematical reversibility with zero artifacting.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      In lossy formats like WebP, AVIF, and JPEG, spatial pixel data is transformed into frequency space using Discrete Cosine Transform (DCT) or directional block prediction. High-frequency variations—subtle color fluctuations that the human eye is physiologically less capable of distinguishing—are quantized (divided by quantization matrices and rounded to integer values). By tuning the quality slider, you directly modulate the coarseness of this quantization grid.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Technical Dimension Constraint Calculations</h3>
    <p class="text-xs text-slate-700 mb-2">When uploading visual assets for responsive web delivery, constraining maximum pixel dimensions yields major bandwidth improvements while preventing Cumulative Layout Shift (CLS):</p>
    <div class="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
      Ratio = min(TargetMaxWidth / Width, TargetMaxHeight / Height)<br>
      NewWidth = round(Width x Ratio)<br>
      NewHeight = round(Height x Ratio)
    </div>
    <p class="text-xs text-slate-600 mt-2">
      Downscaling an uncompressed 24-megapixel camera photograph (6000 x 4000 pixels = ~72 MB uncompressed raw raster) to 1920 x 1280 pixels reduces the raw memory buffer to ~9.8 MB—an 86% memory reduction prior to lossy WebP encoding.
    </p>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Browser OffscreenCanvas Hardware Acceleration</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Toolkit Gen leverages modern browser hardware acceleration through HTML5 Canvas and OffscreenCanvas APIs. Pixel transformations execute on your device's dedicated GPU shaders where available, delivering near-instantaneous resizing and multi-megabyte encoding without exhausting main thread CPU cycles or creating user interface latency.
    </p>
  </div>`,

  ocr_image_to_text: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Line Segmentation and Neural Classification Pipeline</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Modern optical character recognition represents a multi-stage computer vision pipeline. When an image is loaded, the engine executes preprocessing algorithms to correct uneven illumination and lens distortion. Otsu thresholding dynamically computes an optimal grayscale threshold to separate foreground ink from background paper fibers, converting the continuous image into a high-contrast binary bitmap.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Following binarization, connected component analysis detects bounding boxes around contiguous pixel clusters. Text baseline detection algorithms identify word trajectories and calculate font x-heights, accommodating slightly tilted document angles without requiring manual rotation. Finally, a Long Short-Term Memory (LSTM) recurrent neural network evaluates character sequence probabilities, mapping optical features against vocabulary dictionaries to synthesize coherent Unicode text.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Practical Preprocessing Guidelines for Superior Accuracy</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Resolution and DPI:</strong> Aim for a minimum text height of 20 to 30 pixels per lowercase character. For scanned paper, 300 DPI produces near-flawless recognition, whereas 72 DPI web screenshots may require slight sharpening.</li>
      <li><strong>Contrast and Illumination:</strong> Ensure uniform lighting across the document surface. Ambient shadows cast by smartphones during photography degrade edge detection algorithms and lower recognition confidence.</li>
      <li><strong>Orientation Alignment:</strong> Ensure text is oriented right-side up prior to processing. While the engine tolerates minor deskew angles (up to 10 degrees), 90-degree rotated scans will fail baseline recognition.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Strict In-Browser Sandboxing & Compliance</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Medical intake forms, proprietary code screenshots, corporate financial statements, and government identification records demand uncompromising confidentiality. By running Tesseract WebAssembly inside an isolated client Web Worker thread, Toolkit Gen ensures that your sensitive images never leave your local device. The optical models are downloaded once via CDN, cached in your browser storage, and executed completely offline.
    </p>
  </div>`,

  background_remover_ai: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Color Space Geometry and Chroma Key Segmentation</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Background extraction in digital imaging relies on separating target foreground subjects from surrounding backdrop pixels. In automated studio workflows, background removal frequently operates on chroma key principles, evaluating chromatic differences between user-defined edge anchor points and interior image textures.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      The human eye perceives brightness variations more acutely than chrominance variations. By computing Euclidean color distances across the three-dimensional sRGB color space cube, the segmentation engine establishes a spatial threshold gradient. Edge feathering algorithms then calculate a smooth alpha transition across border pixels, avoiding the harsh pixelated "staircase" artifacts characteristic of rudimentary threshold tools.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Studio Photography and Composition Best Practices</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Subject-to-Backdrop Lighting Separation:</strong> Maintain dedicated lighting on the background to eliminate ambient subject shadows. Shadows that fall onto the backdrop shift RGB values, requiring higher tolerance thresholds that risk eroding subject edges.</li>
      <li><strong>Contrasting Color Selection:</strong> Position subjects against backdrops that share minimal chromatic overlap with clothing, skin, or hair colors. E-commerce product photography benefits significantly from neutral white or seamless grey sweeps.</li>
      <li><strong>Feathering and Anti-Aliasing:</strong> Apply 1px to 3px of edge feathering when compositing cutouts onto dark or textured marketing backgrounds to ensure natural optical blending.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">High-Resolution Canvas Memory Architecture</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Manipulating full-resolution photographs requires substantial graphics memory. Toolkit Gen operates on typed array pixel buffers (Uint8ClampedArray) representing red, green, blue, and alpha channels. All operations execute strictly within client browser memory without server hops, enabling e-commerce merchandisers and designers to create transparent PNG cutouts with full data privacy.
    </p>
  </div>`,

  whisper_audio_transcriber: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Acoustic Modeling and Speech Recognition Mechanics</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Automated speech recognition (ASR) involves transforming continuous acoustic pressure waves into discrete linguistic tokens. Sound signals captured by microphones or decoded from media files are digitized at standard sampling rates (typically 16 kHz or 44.1 kHz). The audio signal is windowed into short overlapping temporal frames (typically 25 milliseconds) and transformed using Fast Fourier Transforms (FFT) into Mel-frequency cepstral coefficients (MFCCs).
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      These frequency representations simulate the non-linear human auditory cochlear response. Acoustic models classify phoneme probabilities across consecutive frames, while lexical language models evaluate n-gram probabilities to disambiguate homophones (e.g. "their" vs. "there"). Modern browser-native speech recognition APIs execute these neural acoustic evaluations using hardware-accelerated machine learning primitives built directly into the operating system.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Caption Formatting and Timecode Synchronization</h3>
    <p class="text-xs text-slate-700 mb-2">Synchronizing transcript text with visual media requires standard timecode math adhering to SMPTE principles:</p>
    <div class="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
      Hours = floor(TotalSeconds / 3600)<br>
      Minutes = floor((TotalSeconds % 3600) / 60)<br>
      Seconds = floor(TotalSeconds % 60)<br>
      Milliseconds = floor((TotalSeconds % 1) x 1000)
    </div>
    <p class="text-xs text-slate-600 mt-2">
      Exported SubRip (.srt) tracks format milliseconds with a comma delimiter (<code>00:01:23,456</code>), while WebVTT (.vtt) files utilize decimal periods (<code>00:01:23.456</code>). Both formats are generated with precision to guarantee lip-sync alignment across video editing software.
    </p>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Speech Privacy and Data Confidentiality</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Executive interviews, patient clinical dictation, legal consultations, and internal engineering standups involve highly confidential verbal exchanges. Unlike cloud transcription SaaS products that retain customer voice recordings for proprietary AI training, Toolkit Gen executes all transcription and subtitle formatting locally within your browser session. Your audio never touches an external server.
    </p>
  </div>`,

  frametime_csv_analyzer: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Statistical Foundations of Frame Pacing Analysis</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Evaluating graphics engine performance requires rigorous statistical analysis of frame presentation intervals. While casual performance benchmarking relies on arithmetic mean FPS (Frames Per Second), arithmetic means fail to capture transient stutter events. For example, a benchmark run averaging 120 FPS can deliver 119 frames in 500 ms followed by a single catastrophic 500 ms frame freeze; the arithmetic mean registers a deceptively smooth score, while the human visual cortex perceives an intolerable jarring hitch.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      PresentMon and CapFrameX capture raw frame intervals (<code>msBetweenPresents</code>). By sorting these intervals in ascending order, we compute non-parametric percentile ranks. The 99th percentile frame delivery duration represents the 1% Low frame time, while the 99.9th percentile duration represents the 0.1% Low frame time. Converting these durations back into instantaneous FPS provides an accurate representation of minimum perceived smoothness.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Diagnostic Performance Ratio Benchmarks</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-slate-200 text-slate-800">
            <th class="py-2 font-bold">Pacing Stability Metric</th>
            <th class="py-2 font-bold">Formula / Ratio</th>
            <th class="py-2 font-bold">Diagnostic Evaluation</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-600">
          <tr>
            <td class="py-2 font-semibold text-slate-900">Excellent Pacing</td>
            <td class="py-2">1% Low &gt;= 80% of Avg FPS</td>
            <td class="py-2 text-emerald-700 font-bold">Near-perfect frame delivery; optimal GPU utilization</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-slate-900">Moderate Stutter</td>
            <td class="py-2">1% Low between 50% - 79%</td>
            <td class="py-2 text-amber-700 font-bold">Occasional asset streaming or shader compilation stalls</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold text-slate-900">Severe Hitching</td>
            <td class="py-2">1% Low &lt; 50% of Avg FPS</td>
            <td class="py-2 text-rose-700 font-bold">CPU thread bottlenecks, thermal throttling, or RAM paging</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Hardware Reviewer Privacy Standards</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Hardware journalists and benchmarking laboratories frequently evaluate confidential pre-release GPU architectures and unreleased game titles under strict non-disclosure agreements (NDAs). Toolkit Gen calculates all percentile distributions, frame variance metrics, and SVG interactive graphs strictly in browser memory without sending telemetry to remote analytical databases.
    </p>
  </div>`,

  screen_gpu_capability_report: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Display Pipeline and Colorimetry Standards</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Computer display hardware has evolved rapidly from legacy standard dynamic range (sRGB) panels into sophisticated wide color gamut (WCG) and High Dynamic Range (HDR) display pipelines. In standard sRGB colorimetry, color values are mapped across standard 8-bit channels representing a narrow triangle of the CIE 1931 chromaticity diagram.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Contemporary cinematic displays comply with DCI-P3 specifications, which cover ~25% more visible color volume than sRGB. Professional HDR mastering panels target ITU-R Recommendation BT.2020 (Rec. 2020), encompassing ~75% of all colors perceptible to human trichromatic vision. By querying CSS media features including <code>dynamic-range: high</code> and <code>color-gamut: p3</code>, web applications verify whether the host operating system has enabled 10-bit color pipelines and wide gamut color management.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Graphics API Architecture: WebGL vs WebGPU</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>WebGL 2.0 (OpenGL ES 3.0):</strong> The established web 3D standard based on state-machine architecture. While universally compatible across devices, its single-threaded dispatch model creates significant CPU driver overhead for complex draw calls.</li>
      <li><strong>WebGPU (Next-Gen Graphics & Compute):</strong> The contemporary low-level graphics standard designed around modern hardware architectures (Direct3D 12, Vulkan, and Metal). Provides direct GPU compute shader dispatch, lower CPU driver overhead, and native multi-threading capabilities for complex simulation and machine learning workloads.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Hardware Media Decoding and Codec Support</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Smooth video streaming at 4K and 8K resolutions depends on dedicated fixed-function silicon decoders on the GPU. When hardware decoding is unavailable, video playback falls back to software CPU decoding, causing rapid battery drain and thermal throttling. This report inspects native hardware decode support for royalty-free AV1, VP9, legacy H.264, and HEVC, ensuring your playback pipeline is properly accelerated.
    </p>
  </div>`,

  mouse_touch_tester: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Micro-Switch Contact Degradation and Debounce Algorithms</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Mechanical peripheral switches rely on delicate physical interactions between spring-tensioned copper alloy leaf springs and gold-plated contact points. When a mouse switch is pressed, the contact leaf snaps downward into electrical contact. However, due to mechanical elasticity, the contacts do not meet instantaneously; they rebound microscopic fractions of a millimeter several times over a few milliseconds before resting in solid electrical continuity.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      To prevent this physical phenomenon from registering as multiple rapid clicks, mouse microcontroller firmware implements debounce algorithms that ignore subsequent contact state changes for a defined window (typically 4 ms to 12 ms). As switches age, physical contact corrosion, surface pitting from electrical arcing, and spring metal fatigue widen this bounce window. When contact chatter exceeds the firmware debounce delay, unintended double-clicks occur.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Rotary Encoder and Touch Digitizer Diagnostics</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Rotary Encoder Inversion:</strong> Mechanical scroll wheel encoders utilize radial conductive tracks that sweep past stationary brush contacts. Dust or lint accumulation inside the encoder housing disrupts electrical contact timing, causing the wheel to intermittently register upward ticks while scrolling downwards.</li>
      <li><strong>Multi-Touch Coordinate Tracking:</strong> Capacitive touch screens detect changes in electrostatic capacitance across an x/y electrode grid. Tracking concurrent touch coordinates, contact radius, and pressure gradients allows users to diagnose dead zones or digitizer ghosting defects.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Preventative Hardware Maintenance</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      If switch chatter is detected early, temporarily increasing software debounce thresholds in peripheral driver software can prolong switch utility. However, for permanent reliability, replacing degraded mechanical switches with modern optical micro-switches (which utilize infrared light beam interruption rather than physical metal contacts) completely eliminates contact oxidation and mechanical chatter.
    </p>
  </div>`,

  har_sanitizer_viewer: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Anatomy of an HTTP Archive and Sensitive Data Vectors</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      The HTTP Archive (HAR) specification, maintained by the W3C Web Performance Working Group, defines a comprehensive JSON schema for recording web browser network interactions. Whenever a developer opens Developer Tools and exports a HAR file, the browser serializes the complete state of every HTTP transaction initiated by the current session.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      While invaluable for diagnosing latency bottlenecks, caching misconfigurations, and REST API failures, raw HAR files represent severe credential compromise hazards. Modern Single Page Applications (SPAs) and cloud architectures transmit sensitive bearer tokens and session identifiers across virtually every API request. If an engineer shares an unredacted HAR file in a public GitHub issue or third-party vendor support ticket, active user sessions can be hijacked instantly.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Redaction Categories and Security Scope</h3>
    <ul class="space-y-2 text-xs text-slate-700">
      <li><strong>Authentication Headers:</strong> Scans and replaces values for <code>Authorization</code>, <code>Proxy-Authorization</code>, <code>X-Auth-Token</code>, <code>X-Api-Key</code>, and <code>Bearer</code> tokens with sanitized placeholder masks.</li>
      <li><strong>Cookie Reservoirs:</strong> Strips all entries from both <code>request.cookies</code> and <code>response.cookies</code> arrays, as well as redacting raw <code>Cookie</code> and <code>Set-Cookie</code> header strings.</li>
      <li><strong>Query String Token Redaction:</strong> Inspects URL query strings and scrubs parameter values containing sensitive substrings such as <code>token</code>, <code>api_key</code>, <code>secret</code>, or <code>password</code>.</li>
      <li><strong>Diagnostic Preservation:</strong> Preserves request methods, URLs, status codes, response headers, and exact timing breakdown metrics (DNS, Connect, SSL, Send, Wait, Receive) so support teams can resolve technical issues.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Guaranteed Client-Side Sanitization Pipeline</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      Uploading an unredacted HAR file to a remote cloud conversion service directly violates data governance protocols (including SOC 2, HIPAA, and GDPR). Toolkit Gen parses, filters, and re-serializes your HAR JSON files entirely in your browser's local JavaScript memory. Your session cookies, passwords, and private API credentials never leave your personal computer.
    </p>
  </div>`,

  zfs_raid_calculator: `
  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">Copy-on-Write Storage Architecture & VDEV Allocation</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      OpenZFS represents a fundamental departure from legacy filesystem and volume manager architectures. Traditional systems separate the volume manager (such as mdadm or hardware RAID) from the filesystem layer (such as ext4 or NTFS). In contrast, ZFS unifies volume management and storage pooling into a cohesive architecture.
    </p>
    <p class="text-sm text-slate-700 leading-relaxed mt-3">
      Storage capacity is pooled across virtual devices (vdevs). In RAID-Z configurations, parity is computed dynamically on a per-block basis rather than using fixed stripe widths. This dynamic allocation eliminates the infamous "RAID 5 write hole" vulnerability without requiring battery-backed hardware RAID controllers. However, because ZFS writes new data to unallocated blocks before updating metadata pointers, maintaining adequate free storage space is critical for system stability.
    </p>
  </div>

  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
    <h3 class="text-base font-bold text-slate-900 mb-3">Decimal TB vs Binary TiB Storage Mathematics</h3>
    <p class="text-xs text-slate-700 mb-2">The disparity between marketed drive size and true binary capacity grows exponentially with drive scale:</p>
    <div class="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
      Decimal Terabyte (TB) = 10^12 bytes = 1,000,000,000,000 bytes<br>
      Binary Tebibyte (TiB) = 2^40 bytes = 1,099,511,627,776 bytes<br>
      Conversion Factor = (10^12) / (2^40) = ~0.9094947
    </div>
    <p class="text-xs text-slate-600 mt-2">
      A 20 TB commercial hard drive yields approximately 18.19 TiB of raw binary space. In a 6-drive RAIDZ2 pool (4 data drives + 2 parity drives), the raw binary capacity is 72.76 TiB. After OpenZFS reserves ~3% slop space for transactional metadata and copy-on-write allocation buffers, the true usable capacity is approximately 70.6 TiB.
    </p>
  </div>

  <div>
    <h3 class="text-base font-bold text-slate-900 mb-3">SLOG (ZIL) and L2ARC Cache Sizing Rules</h3>
    <p class="text-sm text-slate-700 leading-relaxed">
      For write-intensive workloads utilizing synchronous writes (such as NFS datastores for VMware or database transactions), deploying a dedicated Separate ZFS Intent Log (SLOG) device using enterprise NVMe drives with Power Loss Protection (PLP) drastically lowers latency. SLOG devices only need to buffer ~5 seconds of maximum network throughput (typically 16 GB to 32 GB). Meanwhile, L2ARC (Level 2 Adaptive Replacement Cache) using fast read SSDs extends RAM caching for high-concurrency read environments.
    </p>
  </div>`
};

for (const [slug, extraHtml] of Object.entries(expansions)) {
  const filePath = path.join(toolsDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.articleHtml = (data.articleHtml || '').trim() + '\n' + extraHtml.trim();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Expanded article for ${slug}`);
}

console.log('All targeted Phase N articles expanded successfully.');
