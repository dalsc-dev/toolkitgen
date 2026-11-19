/**
 * Google AdSense Configuration & Validation
 * Enforces strict numeric slot ID validation to prevent AdSense HTTP 400 Bad Request errors.
 */

export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-4675079345370949',
  slots: {
    homeMidBanner: '8392019482',
    toolMidBanner: '7281920391',
    toolBottomBanner: '5091827381',
    sidebarBanner: '4981726351',
  },
  autoAdsEnabled: true,
};

export function resolveSlotId(slot?: string): string | undefined {
  if (!slot) return undefined;
  const trimmed = slot.trim();

  // Check alias mappings (camelCase or kebab-case)
  const normalizedKey = trimmed.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (normalizedKey in ADSENSE_CONFIG.slots) {
    return ADSENSE_CONFIG.slots[normalizedKey as keyof typeof ADSENSE_CONFIG.slots];
  }
  if (trimmed in ADSENSE_CONFIG.slots) {
    return ADSENSE_CONFIG.slots[trimmed as keyof typeof ADSENSE_CONFIG.slots];
  }

  // If already a valid 8-12 digit numeric string, use directly
  if (/^\d{8,12}$/.test(trimmed)) {
    return trimmed;
  }

  return undefined;
}
