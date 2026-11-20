// Cloudflare Worker for Security Headers, 301 Redirects, and Static Asset Routing

export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

const REDIRECTS: Record<string, string> = {
  '/tool/compound_interest_sim': '/hubs/freelancer',
  '/tool/emergency_fund_calc': '/hubs/freelancer',
  '/tool/cagr_inflation_adjusted': '/hubs/freelancer',
  '/tool/dcf_valuation_model': '/hubs/freelancer',
  '/tool/net_worth_tracker_local': '/hubs/freelancer',
  '/tool/emi_true_cost_analyzer': '/tool/finance_suite_local',
  '/tool/sleep_debt_calculator': '/tool/health_metrics_dashboard',
  '/tool/blood_pressure_tracker': '/tool/health_metrics_dashboard',
  '/tool/body_fat_navy_method': '/tool/health_metrics_dashboard',
  '/tool/edpi_sensitivity_calc': '/tool/mouse_dpi_deviation_analyzer',
  '/tool/master_health_audit': '/',
  '/tool/master_hardware_diagnostic': '/',
  '/tool/circadian_rhythm_optimizer': '/hubs/wellness',
  '/tool/box_breathing_haptic': '/hubs/wellness',
  '/tool/capillary_refill_test': '/hubs/wellness',
  '/tool/cognitive_load_manager': '/tool/flow_state_dashboard',
  '/tool/color_harmony_cvd_designer': '/tool/color_blindness_sim',
  '/tool/deep_work_session_planner': '/tool/flow_state_dashboard',
  '/tool/dopamine_detox_scheduler': '/tool/flow_state_dashboard',
  '/tool/focus_score_benchmark': '/tool/flow_state_dashboard',
  '/tool/gratitude_practice_tracker': '/hubs/wellness',
  '/tool/hydration_calculator_plus': '/hubs/wellness',
  '/tool/indoor_air_quality_estimator': '/hubs/startup',
  '/tool/cable_management_planner': '/hubs/startup',
  '/tool/inflation_purchasing_power_calc': '/hubs/freelancer',
  '/tool/meeting_fatigue_calculator': '/hubs/freelancer',
  '/tool/neural_fatigue_tracker': '/hubs/wellness',
  '/tool/ninja_cam_freeze': '/tool/motion_detector_cam',
  '/tool/optical_lens_law_depth_meter': '/tool/focal_length_sim',
  '/tool/oxygen_tank_duration': '/hubs/wellness',
  '/tool/pcb_trace_width_calc': '/tool/resistor_camera_id',
  '/tool/pdf_local_signer': '/hubs/freelancer',
  '/tool/pdf_redactor_canvas': '/hubs/freelancer',
  '/tool/postural_sway_analyzer': '/hubs/wellness',
  '/tool/pupillary_light_reflex': '/tool/pupillary_distance_cam',
  '/tool/pursuit_tracking_test': '/tool/eye_tracking_cognitive_load',
  '/tool/reynolds_number_calc': '/tool/beam_deflection_calc',
  '/tool/saliva_hydration_index': '/hubs/wellness',
  '/tool/screen_to_eye_lux_calibrator': '/tool/screen_pixel_ruler',
  '/tool/sleep_apnea_breathing_analyzer': '/hubs/wellness',
  '/tool/sleep_quality_analyzer': '/hubs/wellness',
  '/tool/stress_level_predictor': '/hubs/wellness',
  '/tool/tongue_coating_scanner': '/hubs/wellness',
  '/blog': '/',
  '/sitemap.html': '/sitemap',
  '/tool/zfs_capacity_calc': '/tool/zfs_raid_calculator',
  '/tool/console_storage_calculator': '/tool/console_storage_planner',
};

const GONE_ROUTES = new Set([
  '/tool/background_remover_ai',
  '/tool/image_compressor_converter',
  '/tool/ocr_image_to_text',
  '/tool/pdf_compressor',
  '/tool/pdf_merge_reorder',
  '/tool/pdf_metadata_remover',
  '/tool/pdf_split_pages',
  '/tool/whisper_audio_transcriber',
]);

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(), accelerometer=*, gyroscope=*, magnetometer=*, unload=*',
  'Content-Security-Policy-Report-Only': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://static.cloudflareinsights.com https://cdn.webpushr.com https://*.google.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.googleadservices.com https://*.doubleclick.net https://ep2.adtrafficquality.google https://*.adtrafficquality.google blob: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self' blob: data:; connect-src 'self' https: wss: blob: data: https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://ep2.adtrafficquality.google https://*.adtrafficquality.google; worker-src 'self' blob:; frame-src 'self' https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://ep2.adtrafficquality.google https://*.adtrafficquality.google https://*.googleadservices.com; object-src 'none'; base-uri 'self';",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Trailing slash normalization (enforce no trailing slash except root)
    if (pathname.length > 1 && pathname.endsWith('/')) {
      const cleanPath = pathname.slice(0, -1);
      return Response.redirect(`${url.origin}${cleanPath}${url.search}`, 301);
    }

    // 410 Gone for permanently removed commodity tools
    if (GONE_ROUTES.has(pathname)) {
      return new Response('410 Gone - This utility has been permanently removed.', {
        status: 410,
        statusText: 'Gone',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }

    // Direct 301 redirects
    if (REDIRECTS[pathname]) {
      return Response.redirect(`${url.origin}${REDIRECTS[pathname]}`, 301);
    }

    // Blog wildcard redirect: /blog/** -> /
    if (pathname.startsWith('/blog/')) {
      return Response.redirect(`${url.origin}/`, 301);
    }

    // Fetch static asset
    try {
      const response = await env.ASSETS.fetch(request);

      // Clone response and attach corporate-grade security headers
      const newHeaders = new Headers(response.headers);
      for (const [key, val] of Object.entries(SECURITY_HEADERS)) {
        newHeaders.set(key, val);
      }

      // Immutable caching for hashed assets
      if (pathname.startsWith('/_astro/') || pathname.startsWith('/assets/')) {
        newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (response.headers.get('content-type')?.includes('text/html')) {
        newHeaders.set('Cache-Control', 'public, max-age=0, must-revalidate');
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch {
      return new Response('404 Not Found', { status: 404, statusText: 'Not Found' });
    }
  },
};
