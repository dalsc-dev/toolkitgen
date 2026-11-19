/**
 * Google AdSense Configuration & Validation
 * Enforces strict numeric slot ID validation with real publisher ad unit slots.
 */

export interface SlotDefinition {
  slotId: string;
  format: 'auto' | 'autorelaxed' | 'rectangle' | 'horizontal';
  fullWidthResponsive?: boolean;
}

export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-4675079345370949',
  slots: {
    // 1. toolkitgen_display_AdSense1_1x1_as (Display ad: auto, full-width)
    homeMidBanner: {
      slotId: '4383065349',
      format: 'auto',
      fullWidthResponsive: true,
    },
    // 2. toolkitgen_display_AdSense1_1x1_as (In-content display ad between app and docs)
    toolMidBanner: {
      slotId: '4383065349',
      format: 'auto',
      fullWidthResponsive: true,
    },
    // 3. autorelaxed Multiplex unit (High-converting matched content at bottom of tool)
    toolBottomBanner: {
      slotId: '4516155615',
      format: 'autorelaxed',
      fullWidthResponsive: false,
    },
    // 4. toolkitgen_sidebar_AdSense1_1x1_as
    sidebarBanner: {
      slotId: '5828686602',
      format: 'auto',
      fullWidthResponsive: true,
    },
    // 5. toolkitgen_sidebar_AdSense2_1x1_as
    sidebarAd2: {
      slotId: '3429859173',
      format: 'auto',
      fullWidthResponsive: true,
    },
    // 6. toolkitgen_sidebar_vertical
    sidebarVertical: {
      slotId: '7550869994',
      format: 'auto',
      fullWidthResponsive: true,
    },
    // 7. autorelaxed Multiplex unit 2
    bottomMultiplex: {
      slotId: '3200561447',
      format: 'autorelaxed',
      fullWidthResponsive: false,
    },
  } as Record<string, SlotDefinition>,
  autoAdsEnabled: true,
};

export function resolveSlot(slotKeyOrId?: string): SlotDefinition | undefined {
  if (!slotKeyOrId) return undefined;
  const trimmed = slotKeyOrId.trim();

  // 1. Direct match in slots object
  if (trimmed in ADSENSE_CONFIG.slots) {
    return ADSENSE_CONFIG.slots[trimmed];
  }

  // 2. Kebab-case to camelCase conversion (e.g. tool-mid-banner -> toolMidBanner)
  const camelKey = trimmed.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (camelKey in ADSENSE_CONFIG.slots) {
    return ADSENSE_CONFIG.slots[camelKey];
  }

  // 3. If passed a direct 8-12 digit slot ID
  if (/^\d{8,12}$/.test(trimmed)) {
    if (trimmed === '4516155615' || trimmed === '3200561447') {
      return { slotId: trimmed, format: 'autorelaxed', fullWidthResponsive: false };
    }
    return { slotId: trimmed, format: 'auto', fullWidthResponsive: true };
  }

  return undefined;
}

export function resolveSlotId(slotKeyOrId?: string): string | undefined {
  const slotDef = resolveSlot(slotKeyOrId);
  return slotDef?.slotId;
}
