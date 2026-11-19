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
  if (!title) return `Toolkit Gen | Free 100% Client-Side Web Tools`;
  if (title.includes(brand)) return title.length > 60 ? title.slice(0, 57) + '...' : title;
  const full = `${title} | ${brand}`;
  return full.length > 60 ? title.slice(0, 57) + '...' : full;
}

export function formatDescription(desc: string): string {
  if (!desc) return 'Free browser-based tools, calculators, and utilities. Fast, privacy-focused, zero server data collection.';
  const clean = desc.replace(/\s+/g, ' ').trim();
  if (clean.length > 160) return clean.slice(0, 157) + '...';
  if (clean.length < 120) return `${clean} 100% private, instant client-side execution in your browser.`;
  return clean;
}
