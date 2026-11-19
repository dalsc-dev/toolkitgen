/**
 * Canonical Corporate Copy & Trust Constants
 * Single source of truth across Toolkit Gen.
 * Adheres strictly to the Corporate Copy Standard:
 * - Professional, precise, calm, benefit-led tone
 * - No absolute claims or hype
 * - Approved privacy, trust, and legal claim patterns
 */

export const BRAND = {
  name: 'Toolkit Gen',
  tagline: 'Free, browser-based tools for developers and professionals.',
  url: 'https://toolkitgen.com',
  author: 'Toolkit Gen Team',
  supportEmail: 'toolkitgen@gmail.com',
} as const;

export const HERO_COPY = {
  h1: 'Professional Online Tools and Calculators',
  sub: 'Fast, free utilities for developers, finance, health and productivity. Calculations run in your browser, and your inputs are not uploaded to our servers.',
  introHeading: 'Free Online Tools Built for Everyday Work',
  introBody: 'Toolkit Gen brings developer utilities, financial calculators, health metrics and productivity tools into one consistent workspace. Each tool runs in your browser, requires no account, and is written to be clear, accurate and fast.',
} as const;

export const HOME_INTRO = {
  heading: HERO_COPY.introHeading,
  body: HERO_COPY.introBody,
} as const;

export const TRUST_COPY = {
  trustLine: 'Runs locally in your browser. Inputs are not uploaded.',
  browserExecution: 'Calculations run in your browser. Your inputs are not uploaded to our servers.',
  localProcessing: 'Tool inputs are processed locally on your device.',
  noAccount: 'No account required.',
  adSupported: 'Free to use, supported by advertising.',
  localStorage: 'Preferences such as favorites and recent tools are stored locally in your browser.',
  adDisclosure: 'We use Google AdSense, Cloudflare Web Analytics and optional push notifications. See our Privacy Policy and cookie settings.',
  disclaimerHealthFinance: 'For informational purposes only. Not medical, legal or financial advice.',
} as const;

export const BANNED_PATTERNS: Array<{ pattern: RegExp; description: string }> = [
  { pattern: /never touch a server/i, description: 'never touch a server' },
  { pattern: /zero[- ]server/i, description: 'zero server / zero-server' },
  { pattern: /100%\s*(strictly\s*)?private/i, description: '100% private / 100% strictly private' },
  { pattern: /nothing is tracked/i, description: 'nothing is tracked' },
  { pattern: /never tracked/i, description: 'never tracked' },
  { pattern: /absolute data privacy/i, description: 'absolute data privacy' },
  { pattern: /zero data retention/i, description: 'zero data retention' },
  { pattern: /military-grade/i, description: 'military-grade' },
  { pattern: /unhackable/i, description: 'unhackable' },
  { pattern: /\bguaranteed\b/i, description: 'guaranteed' },
  { pattern: /cloudflare secured/i, description: 'Cloudflare Secured' },
  { pattern: /verified by analytics/i, description: 'Verified by Analytics' },
  { pattern: /\b(160\+|180\+|190\+)\b/, description: 'hardcoded tool count (e.g. 160+, 180+, 190+)' },
];
