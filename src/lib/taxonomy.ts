export interface CategoryDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const CANONICAL_13_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'audio-sound',
    slug: 'audio-sound',
    name: 'Audio / Sound',
    description: 'Acoustic and sound utilities for latency loopback, stereo phase alignment, loudness metering, and hearing analysis.'
  },
  {
    id: 'display-screen',
    slug: 'display-screen',
    name: 'Display / Screen',
    description: 'Screen diagnostics for dead pixels, OLED burn-in mitigation, refresh rates, gamma calibration, and color gamut visualizers.'
  },
  {
    id: 'hardware-diagnostics',
    slug: 'hardware-diagnostics',
    name: 'Hardware / Diagnostics',
    description: 'Hardware inspection tools for GPU compute benchmarks, battery drain analysis, device sensors, and WebGPU performance.'
  },
  {
    id: 'vision-optometry',
    slug: 'vision-optometry',
    name: 'Vision / Optometry',
    description: 'Visual health screening tools for Amsler grid macular checks, astigmatism fan charts, Snellen visual acuity, and color blindness.'
  },
  {
    id: 'wellness-biofeedback',
    slug: 'wellness-biofeedback',
    name: 'Wellness / Biofeedback',
    description: 'Physiological tracking tools for breathing coherence, heart rate variability, posture alarms, and health metrics.'
  },
  {
    id: 'gaming-input',
    slug: 'gaming-input',
    name: 'Gaming / Input',
    description: 'Input latency and controller diagnostics for gamepad stick drift, snapback, mouse polling rates, and keyboard rollover.'
  },
  {
    id: 'developer-data',
    slug: 'developer-data',
    name: 'Developer / Data',
    description: 'Developer utilities for SQLite database inspection, regex flowchart generation, cron visualization, and data modeling.'
  },
  {
    id: 'crypto-security',
    slug: 'crypto-security',
    name: 'Crypto / Security',
    description: 'Cryptographic security tools for AES-GCM local vaults, password strength evaluation, EXIF metadata scrubbing, and QR airgap transfer.'
  },
  {
    id: 'productivity-utility',
    slug: 'productivity-utility',
    name: 'Productivity / Utility',
    description: 'Productivity and financial calculators for compound interest, options strategies, startup runways, and document utilities.'
  },
  {
    id: 'camera-sensor',
    slug: 'camera-sensor',
    name: 'Camera / Sensor',
    description: 'Browser sensor utilities for webcam frame rate calibration, photoplethysmography, magnetometer detection, and optical analysis.'
  },
  {
    id: 'brain-cognition',
    slug: 'brain-cognition',
    name: 'Brain / Cognition',
    description: 'Cognitive performance tools for bionic reading acceleration, flow state monitoring, and digital debt assessment.'
  },
  {
    id: 'system-network',
    slug: 'system-network',
    name: 'System / Network',
    description: 'Network and system diagnostics for Wi-Fi dead zone measurement, network latency ping stability, and browser environment auditing.'
  },
  {
    id: 'everyday-fun',
    slug: 'everyday-fun',
    name: 'Everyday / Fun',
    description: 'Everyday utilities for fair giveaways, interactive speed challenges, ring size calibration, and random name picking.'
  }
];

export const CANONICAL_CATEGORIES = CANONICAL_13_CATEGORIES;

export function getCanonicalCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CANONICAL_13_CATEGORIES.find(c => c.slug === slug);
}

export function getCanonicalCategoryByName(name: string): CategoryDefinition | undefined {
  return CANONICAL_13_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getCanonicalCategory(rawCategory: string): CategoryDefinition {
  const normalized = (rawCategory || '').trim().toLowerCase();
  const found = CANONICAL_13_CATEGORIES.find(c => c.name.toLowerCase() === normalized || c.slug === normalized || c.id === normalized);
  if (found) return found;
  return CANONICAL_13_CATEGORIES[8]; // Productivity / Utility
}
