import { describe, it, expect } from 'vitest';
import { PAYPAL_SUPPORT_URL, SUPPORT_CONFIG, isSupportCalloutAllowed, getPayPalSupportUrl } from './support';

describe('Voluntary Support Configuration', () => {
  it('defines a valid outbound PayPal URL without raw email exposure', () => {
    expect(PAYPAL_SUPPORT_URL).toBeDefined();
    expect(PAYPAL_SUPPORT_URL).toBe('https://paypal.me/dalscx');
    expect(PAYPAL_SUPPORT_URL).toMatch(/^https:\/\/(www\.)?paypal\.(com|me)\//);
    // Ensure no raw email address is accidentally hardcoded as the URL
    expect(PAYPAL_SUPPORT_URL).not.toContain('@');
  });

  it('generates direct amount links with custom currencies', () => {
    expect(getPayPalSupportUrl()).toBe('https://paypal.me/dalscx');
    expect(getPayPalSupportUrl(25, 'USD')).toBe('https://www.paypal.com/paypalme/dalscx/25USD');
    expect(getPayPalSupportUrl(25, 'INR')).toBe('https://www.paypal.com/paypalme/dalscx/25INR');
    expect(getPayPalSupportUrl(250, 'inr')).toBe('https://www.paypal.com/paypalme/dalscx/250INR');
    expect(getPayPalSupportUrl('10.50', 'USD')).toBe('https://www.paypal.com/paypalme/dalscx/10.50USD');
  });

  it('defines structured voluntary tiers with explicit pricing and links', () => {
    expect(SUPPORT_CONFIG.tiers.length).toBeGreaterThanOrEqual(3);
    SUPPORT_CONFIG.tiers.forEach((tier) => {
      expect(tier.amount).toBeTruthy();
      expect(tier.url).toMatch(/^https:\/\/www\.paypal\.com\/paypalme\/dalscx\//);
      expect(tier.name).toBeTruthy();
      expect(tier.description).toBeTruthy();
    });
  });

  it('prohibits support callouts on all designated medical and emergency tools', () => {
    const medicalTools = [
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
    ];

    medicalTools.forEach((slug) => {
      expect(isSupportCalloutAllowed(slug)).toBe(false);
    });
  });

  it('permits support callouts on standard non-emergency utilities', () => {
    const standardTools = [
      'console_storage_planner',
      'mouse_dpi_deviation_analyzer',
      'webhid_gamepad_diagnostics',
      'sqlite_wasm_explorer',
      'json_formatter_validator',
      'camera_mic_tester',
    ];

    standardTools.forEach((slug) => {
      expect(isSupportCalloutAllowed(slug)).toBe(true);
    });
  });

  it('safely handles empty or missing tool identifiers', () => {
    expect(isSupportCalloutAllowed('')).toBe(false);
  });
});
