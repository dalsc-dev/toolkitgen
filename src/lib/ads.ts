/**
 * Google AdSense Configuration & Validation
 * Enforces strict numeric slot ID validation to prevent AdSense HTTP 400 Bad Request errors.
 * Note: If manual ad unit slot IDs have not been created in your AdSense dashboard,
 * keep slots empty so Google Auto Ads handles placements without triggering HTTP 400.
 */

export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-4675079345370949',
  slots: {
    homeMidBanner: '',
    toolMidBanner: '',
    toolBottomBanner: '',
    sidebarBanner: '',
  },
  autoAdsEnabled: true,
};

export function resolveSlotId(slot?: string): string | undefined {
  if (!slot) return undefined;
  const trimmed = slot.trim();

  // Check alias mappings (camelCase or kebab-case)
  const normalizedKey = trimmed.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (normalizedKey in ADSENSE_CONFIG.slots) {
    const val = ADSENSE_CONFIG.slots[normalizedKey as keyof typeof ADSENSE_CONFIG.slots];
    return val && val.length > 0 ? val : undefined;
  }
  if (trimmed in ADSENSE_CONFIG.slots) {
    const val = ADSENSE_CONFIG.slots[trimmed as keyof typeof ADSENSE_CONFIG.slots];
    return val && val.length > 0 ? val : undefined;
  }

  // If already a valid 8-12 digit numeric string, use directly
  if (/^\d{8,12}$/.test(trimmed)) {
    return trimmed;
  }

  return undefined;
}
