import fs from "fs";

const CANONICAL_13_CATEGORIES = [
  "Audio / Sound",
  "Display / Screen",
  "Hardware / Diagnostics",
  "Vision / Optometry",
  "Wellness / Biofeedback",
  "Gaming / Input",
  "Developer / Data",
  "Crypto / Security",
  "Productivity / Utility",
  "Camera / Sensor",
  "Brain / Cognition",
  "System / Network",
  "Everyday / Fun"
];

// Read legacy script.js toolsData
const scriptContent = fs.readFileSync("legacy/public/script.js", "utf-8");
const match = scriptContent.match(/let\s+toolsData\s*=\s*(\[[\s\S]*?\]);\s*window\.goToRandomTool/);
const toolsData = eval(match[1]);

// Check each tool in src/content/tools/*.json
const toolFiles = fs.readdirSync("src/content/tools").filter(f => f.endsWith(".json"));

console.log(`Checking ${toolFiles.length} content tool files...`);

// Mapping heuristic based on slug, tags, name, and legacy data
export function mapTo13Categories(tool) {
  const id = tool.id || "";
  const name = tool.name || "";
  const cat = tool.category || "";
  const tags = tool.tags || [];
  const text = `${id} ${name} ${cat} ${tags.join(" ")}`.toLowerCase();

  // 1. Vision / Optometry
  if (
    id === "amsler_grid_macular" ||
    id === "astigmatism_fan_chart" ||
    id === "color_blindness_sim" ||
    id === "contrast_sensitivity_function" ||
    id === "duochrome_vision_balance" ||
    id === "pupillary_distance_cam" ||
    id === "visual_acuity_snellen" ||
    id === "blue_light_visualizer" ||
    id === "pwm_flicker_eye_health_scanner" ||
    id === "tool-proximity" ||
    id === "tool-blink-monitor"
  ) {
    return "Vision / Optometry";
  }

  // 2. Audio / Sound
  if (
    id === "audio_latency_loopback" ||
    id === "av_sync_flash_tool" ||
    id === "binaural_beat_brainwave_gen" ||
    id === "cpr_metronome_bpm" ||
    id === "headphone_driver_rattle_test" ||
    id === "hearing_age_test" ||
    id === "hearing_audiogram_test" ||
    id === "hrtf_spatial_audio_profiler" ||
    id === "lufs_loudness_meter" ||
    id === "mic_latency_loopback" ||
    id === "mic_spectrum_analyzer" ||
    id === "noise_dosimeter_test" ||
    id === "rhythm_synchronization_test" ||
    id === "spatial_audio_seal_tester" ||
    id === "stereo_left_right_test" ||
    id === "stereo_phase_test" ||
    id === "tinnitus_frequency_matcher" ||
    id === "voice_pitch_monitor" ||
    id === "beat_maker_typing"
  ) {
    return "Audio / Sound";
  }

  // 3. Display / Screen
  if (
    id === "dead_pixel_check" ||
    id === "dead_pixel_strobe" ||
    id === "display_color_gamut_visualizer" ||
    id === "flicker_fusion_threshold" ||
    id === "monitor_backlight_bleed" ||
    id === "monitor_dead_zone_ruler" ||
    id === "monitor_gamma_calibrator" ||
    id === "monitor_refresh_tester" ||
    id === "oled_burn_in_fixer" ||
    id === "oled_burnin_protector" ||
    id === "screen_pixel_ruler" ||
    id === "seizure_flash_check" ||
    id === "lut_previewer_webgl" ||
    id === "sensor_dust_visualizer"
  ) {
    return "Display / Screen";
  }

  // 4. Camera / Sensor
  if (
    id === "ai_face_age_scanner" ||
    id === "emotion_sentiment_cam" ||
    id === "eye_contact_tracker" ||
    id === "eye_tracking_cognitive_load" ||
    id === "focal_length_sim" ||
    id === "magnetometer_metal_find" ||
    id === "resistor_camera_id" ||
    id === "stroboscope_tachometer" ||
    id === "webcam_hardware_fps_test" ||
    id === "webcam_heart_rate_ppg"
  ) {
    return "Camera / Sensor";
  }

  // 5. Gaming / Input
  if (
    id === "game_ping_stability_test" ||
    id === "gamepad_drift_visualizer" ||
    id === "gamepad_snapback_diagnostic" ||
    id === "gyro_balance_challenge" ||
    id === "keyboard_chatter_detector" ||
    id === "keyboard_latency_test" ||
    id === "mouse_dpi_deviation_analyzer" ||
    id === "mouse_polling_rate_hz" ||
    id === "nkey_rollover_tester" ||
    id === "touchpad_gesture_heatmap" ||
    id === "vibration_motor_test" ||
    id === "voice_controlled_platformer" ||
    id === "edpi_sensitivity_calc"
  ) {
    return "Gaming / Input";
  }

  // 6. Wellness / Biofeedback
  if (
    id === "breathing_coherence_trainer" ||
    id === "hand_tremor_stability" ||
    id === "hrv_biofeedback_trainer" ||
    id === "iv_drip_rate_tapper" ||
    id === "posture_guard_ai" ||
    id === "health_metrics_dashboard" ||
    id === "master_health_audit" ||
    id === "body_fat_navy_method" ||
    id === "tool-jaw-align" ||
    id === "tool-tech-neck" ||
    id === "tool-stress" ||
    id === "tool-nsdr" ||
    id === "tool-caffeine" ||
    id === "tool-chronotype" ||
    id === "tool-screen-time" ||
    id === "tool-detox"
  ) {
    return "Wellness / Biofeedback";
  }

  // 7. Brain / Cognition
  if (
    id === "bionic_reading_engine" ||
    id === "digital_dementia_risk_test" ||
    id === "flow_state_dashboard" ||
    id === "dark_pattern_simulator" ||
    id === "tool-zeigarnik" ||
    id === "tool-mind-clear" ||
    id === "tool-cognitive-debt" ||
    id === "tool-intention"
  ) {
    return "Brain / Cognition";
  }

  // 8. Crypto / Security
  if (
    id === "aes_gcm_vault_local" ||
    id === "browser_fingerprint_id" ||
    id === "data_anonymizer_local" ||
    id === "exif_data_scrubber" ||
    id === "invisible_watermark_steno" ||
    id === "jwt_debugger_offline" ||
    id === "nfc_data_ghost_eraser" ||
    id === "offline_qr_airgap" ||
    id === "password_strength_visual_analyzer"
  ) {
    return "Crypto / Security";
  }

  // 9. Hardware / Diagnostics
  if (
    id === "battery_discharge_monitor" ||
    id === "ble_rssi_meter" ||
    id === "device_motion_logger" ||
    id === "gerber_file_viewer" ||
    id === "gpu_thermal_throttling_test" ||
    id === "haptic_rhythm_designer" ||
    id === "logic_gate_simulator" ||
    id === "ssd_speed_benchmark" ||
    id === "usb_c_pd_negotiator_sniffer" ||
    id === "web_bluetooth_scan" ||
    id === "web_serial_terminal" ||
    id === "webgpu_compute_flops_benchmark" ||
    id === "webgpu_vram_thermal_check" ||
    id === "master_hardware_diagnostic"
  ) {
    return "Hardware / Diagnostics";
  }

  // 10. System / Network
  if (
    id === "airdrop_web_universal" ||
    id === "browser_history_analyzer" ||
    id === "docker_compose_linter" ||
    id === "wifi_dead_zone_logger" ||
    id === "wifi_speed_stability"
  ) {
    return "System / Network";
  }

  // 11. Developer / Data
  if (
    id === "advanced_search_operator_builder" ||
    id === "cron_job_visualizer" ||
    id === "curl_to_fetch_axios" ||
    id === "latex_equation_editor" ||
    id === "regex_flowchart_gen" ||
    id === "sqlite_wasm_explorer" ||
    id === "statistical_dist_plot" ||
    id === "text_token_reducer"
  ) {
    return "Developer / Data";
  }

  // 12. Everyday / Fun
  if (
    id === "color_mixer_challenge" ||
    id === "mandi_chest_lucky_picker" ||
    id === "ring_size_calibrator" ||
    id === "satellite_view_guesser" ||
    id === "wiki_speed_racer" ||
    id === "wrist_watch_visualizer" ||
    id === "chat_timeline_visualizer" ||
    id === "life_stats_dashboard" ||
    id === "ig_follower_insights"
  ) {
    return "Everyday / Fun";
  }

  // 13. Productivity / Utility (includes Finance, Startups, Freelancers, Document tools)
  if (
    id === "black_scholes_heatmap" ||
    id === "bulk_certificate_generator" ||
    id === "finance_suite_local" ||
    id === "google_takeout_visualizer" ||
    id === "option_strategy_builder" ||
    id === "printer_test_sheet" ||
    id === "prompt_template_builder" ||
    id === "screen_reader_sim" ||
    id === "emi_true_cost_analyzer" ||
    id.startsWith("tool-freemium") ||
    id.startsWith("tool-equity") ||
    id.startsWith("tool-wcds") ||
    id.startsWith("tool-daoc") ||
    id.startsWith("tool-zombie") ||
    id.startsWith("tool-runway") ||
    id.startsWith("tool-saas-metrics") ||
    id.startsWith("tool-cap-table") ||
    id.startsWith("tool-exit-waterfall") ||
    id.startsWith("tool-unit-economics") ||
    id.startsWith("tool-validator") ||
    id.startsWith("tool-registries") ||
    id.startsWith("tool-contract") ||
    id.startsWith("tool-ppp") ||
    id.startsWith("tool-ltv-cac") ||
    id.startsWith("tool-risk-analyzer") ||
    id.startsWith("tool-scope-creep") ||
    id.startsWith("tool-ai-roi") ||
    id.startsWith("tool-zoom-tax") ||
    id.startsWith("tool-creator-revenue") ||
    id.startsWith("tool-hourly-rate") ||
    id.startsWith("tool-global-tax") ||
    id.startsWith("tool-red-flag") ||
    id.startsWith("tool-freelance-contract")
  ) {
    return "Productivity / Utility";
  }

  // Fallback
  return "Productivity / Utility";
}

// Test mapping on all 126 tools
const catDistribution = {};
CANONICAL_13_CATEGORIES.forEach(c => catDistribution[c] = 0);

for (const tf of toolFiles) {
  const tool = JSON.parse(fs.readFileSync(`src/content/tools/${tf}`, "utf-8"));
  const assigned = mapTo13Categories(tool);
  catDistribution[assigned] = (catDistribution[assigned] || 0) + 1;
}

console.log("\nDistribution of 126 tools across 13 categories:");
CANONICAL_13_CATEGORIES.forEach(c => {
  console.log(`- ${c}: ${catDistribution[c]} tools`);
});
