import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.resolve(__dirname, '..', 'src', 'content', 'tools');

function patchTool(filename, transformFn) {
  const filePath = path.join(toolsDir, filename);
  if (!fs.existsSync(filePath)) return;
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  transformFn(content);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`Patched ${filename}`);
}

// 1. Patch posture_guard_ai
patchTool('posture_guard_ai.json', (data) => {
  let script = data.toolScript || '';
  script = script.replace('createPoseLandmarker();\n        window.startWebcam', 'window.startWebcam');
  script = script.replace(
    'window.startWebcam = async function () {',
    'window.startWebcam = async function () {\n            if (!poseLandmarker) {\n                log("Loading AI pose models on demand...", "default");\n                await createPoseLandmarker();\n            }'
  );
  data.toolScript = script;
});

// 2. Patch ai_face_age_scanner
patchTool('ai_face_age_scanner.json', (data) => {
  let script = data.toolScript || '';
  script = script.replace('createFaceLandmarker();\n        // --- 2. INITIALIZE FACE-API', '// --- 2. INITIALIZE FACE-API');
  script = script.replace('loadFaceApiModels();\n        // --- WEBCAM HANDLING', '// --- WEBCAM HANDLING');
  script = script.replace(
    'window.startWebcam = async function () {',
    'window.startWebcam = async function () {\n            if (!faceLandmarker) {\n                log("Loading Face Landmark AI Model...", "default");\n                await createFaceLandmarker();\n            }'
  );
  script = script.replace(
    'function handleFileUpload(event) {',
    'async function handleFileUpload(event) {\n            if (!faceLandmarker) {\n                log("Loading Face Landmark AI Model...", "default");\n                await createFaceLandmarker();\n            }'
  );
  data.toolScript = script;
});

// 3. Patch eye_contact_tracker
patchTool('eye_contact_tracker.json', (data) => {
  let script = data.toolScript || '';
  if (script.includes('createFaceLandmarker();')) {
    script = script.replace('createFaceLandmarker();', '');
    script = script.replace(
      'async function startWebcam()',
      'async function startWebcam() {\n            if (!faceLandmarker) await createFaceLandmarker();'
    );
    data.toolScript = script;
  }
});

// 4. Patch emotion_sentiment_cam
patchTool('emotion_sentiment_cam.json', (data) => {
  let script = data.toolScript || '';
  if (script.includes('createFaceLandmarker();')) {
    script = script.replace('createFaceLandmarker();', '');
    script = script.replace(
      'async function startWebcam()',
      'async function startWebcam() {\n            if (!faceLandmarker) await createFaceLandmarker();'
    );
    data.toolScript = script;
  }
});

console.log('Heavy tools lazy-loading patch completed.');
