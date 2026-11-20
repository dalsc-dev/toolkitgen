/**
 * Voluntary Support Configuration
 * Stores outbound PayPal payment link and voluntary non-charity disclosures.
 * Zero external scripts or tracking SDKs are loaded.
 */

export const PAYPAL_SUPPORT_URL = 'https://www.paypal.com/paypalme/toolkitgen';

export const SUPPORT_CONFIG = {
  paypalUrl: PAYPAL_SUPPORT_URL,
  buttonText: 'Support via PayPal',
  heading: 'Support Toolkit Gen',
  subheading: 'Voluntary contributions to keep client-side web tools and diagnostics fast, free, and accessible for everyone.',
  tiers: [
    {
      amount: '$3',
      name: 'Coffee Contribution',
      description: 'Covers edge worker invocations and static asset delivery for hundreds of visitors.',
    },
    {
      amount: '$10',
      name: 'Serverless Hosting Tier',
      description: 'Helps cover annual domain registrations, SSL renewals, and edge routing.',
    },
    {
      amount: '$25',
      name: 'Testing & Calibration',
      description: 'Supports testing hardware (gamepads, displays, sensors) for accurate browser calibrations.',
    },
  ],
  disclaimers: [
    'Voluntary Support: Contributions are purely voluntary support for development and hosting.',
    'Not a Charity: Toolkit Gen is an independent technology project and not a registered 501(c)(3) or charitable organization.',
    'Not Tax-Deductible: Contributions are not tax-deductible as charitable donations under any tax jurisdiction.',
    'No Perks or Paywalls: No premium features, accounts, badges, or paywalls are unlocked. All tools remain completely free for all users.',
    'Payment Processing: All payments are handled securely on PayPal\'s hosted site. Toolkit Gen never collects, receives, or stores credit card or bank details.',
  ],
  // Designated emergency, CPR, and health screening tools that must NEVER show the support prompt
  excludedToolIds: [
    'cpr_metronome_bpm',
    'iv_drip_rate_tapper',
    'seizure_flash_check',
    'amsler_grid_macular',
    'visual_acuity_snellen',
    'contrast_sensitivity_function',
    'color_blindness_sim',
    'hearing_frequency_range',
    'tinnitus_frequency_matcher',
    'webcam_heart_rate_ppg',
    'pupillary_distance_cam',
    'pupillary_light_reflex',
    'blood_pressure_tracker',
    'sleep_apnea_breathing_analyzer',
  ],
};

export function isSupportCalloutAllowed(toolId: string): boolean {
  if (!toolId) return false;
  return !SUPPORT_CONFIG.excludedToolIds.includes(toolId);
}
