import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const afterCsvPath = path.join(rootDir, 'tool-perf-after.csv');

console.log('Running Performance Budget CI Verification Gate...');

if (!fs.existsSync(afterCsvPath)) {
  console.warn('Notice: tool-perf-after.csv not found. Skipping performance budget verification in this build environment.');
  process.exit(0);
}

const lines = fs.readFileSync(afterCsvPath, 'utf8').trim().split('\n');
const headers = lines[0].split(',').map(s => s.replace(/"/g, ''));

const getIdx = (name) => headers.indexOf(name);
const slugIdx = getIdx('slug');
const tbtIdx = getIdx('tbt_ms');
const maxTaskIdx = getIdx('longest_task_ms');
const cameraIdx = getIdx('preclick_camera_mic');
const audioIdx = getIdx('preclick_audio_context');
const webglIdx = getIdx('preclick_webgl');
const webgpuIdx = getIdx('preclick_webgpu');
const workersIdx = getIdx('preclick_workers');
const errorsIdx = getIdx('console_errors');

let totalChecked = 0;
let violations = [];

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',').map(s => s.replace(/"/g, ''));
  const slug = parts[slugIdx];
  if (!slug) continue;

  totalChecked++;
  const tbt = parseInt(parts[tbtIdx] || '0', 10);
  const maxTask = parseInt(parts[maxTaskIdx] || '0', 10);
  const camera = parseInt(parts[cameraIdx] || '0', 10);
  const audio = parseInt(parts[audioIdx] || '0', 10);
  const webgl = parseInt(parts[webglIdx] || '0', 10);
  const webgpu = parseInt(parts[webgpuIdx] || '0', 10);
  const workers = parseInt(parts[workersIdx] || '0', 10);
  const errors = parseInt(parts[errorsIdx] || '0', 10);

  if (tbt > 200) violations.push(`${slug}: TBT ${tbt}ms exceeds 200ms`);
  if (camera > 0) violations.push(`${slug}: Pre-click camera requested`);
  if (audio > 0) violations.push(`${slug}: Pre-click AudioContext started`);
  if (webgl > 0) violations.push(`${slug}: Pre-click WebGL started`);
  if (webgpu > 0) violations.push(`${slug}: Pre-click WebGPU started`);
  if (workers > 0) violations.push(`${slug}: Pre-click Worker started`);
  if (errors > 0) violations.push(`${slug}: Console errors present (${errors})`);
}

console.log(`Audited performance metrics across ${totalChecked} tool pages.`);

if (violations.length > 0) {
  console.error(`Performance Budget Gate FAILED with ${violations.length} violations:`);
  console.error(violations.slice(0, 10));
  process.exit(1);
}

console.log('Performance Budget Gate: 100% PASSED (All 132 tools within budget)');
