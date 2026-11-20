export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
}

export function formatTitle(title: string): string {
  const brand = 'Toolkit Gen';
  if (!title) return `Toolkit Gen | Free Online Tools and Calculators`;

  const trimmed = title.trim();

  // If already ends with brand suffix and length <= 70, return as-is
  if ((trimmed.endsWith(`| ${brand}`) || trimmed.endsWith(`- ${brand}`)) && trimmed.length <= 70) {
    return trimmed;
  }

  // Remove existing trailing brand suffix if present
  let clean = trimmed.replace(/\s*[|\-]\s*Toolkit Gen.*$/i, '').trim();
  if (!clean || clean === brand) {
    return `Toolkit Gen | Free Online Tools and Calculators`;
  }

  // Target length <= 70 chars including " | Toolkit Gen" (14 chars)
  const maxPrefixLen = 70 - (` | ${brand}`).length; // 56 chars
  const truncatedPrefix = clean.length > maxPrefixLen
    ? clean.slice(0, maxPrefixLen - 1).trim() + '…'
    : clean;

  return `${truncatedPrefix} | ${brand}`;
}

export function formatDescription(desc: string): string {
  if (!desc) return 'Free browser-based tools, calculators, and utilities. Calculations run in your browser, and inputs are not uploaded to our servers.';
  const clean = desc.replace(/\s+/g, ' ').trim();
  if (clean.length > 160) return clean.slice(0, 157).trim() + '...';
  if (clean.length < 110) return `${clean} Calculations run locally in your browser with no server uploads.`;
  return clean;
}
