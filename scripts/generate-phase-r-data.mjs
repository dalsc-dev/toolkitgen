import fs from 'fs';

// 1. Generate capability-audit.csv
const capabilityRows = [
  {
    slug: 'usb_c_pd_negotiator_sniffer',
    name: "USB-C Power Delivery 'Handshake' Sniffer",
    claim: 'Sniff USB-C Power Delivery packet negotiation in browser',
    api: 'Web Serial API (navigator.serial) + JS Fallback Simulator',
    support: 'Chrome / Edge on Desktop (Windows, Mac, Linux, ChromeOS). Not on Android/iOS/Firefox/Safari.',
    verdict: 'Partly true',
    wording: "USB-C Power Delivery Hardware Sniffer & Protocol Simulator (Requires USB Serial Analyzer Hardware or Interactive Mode)"
  },
  {
    slug: 'wifi_dead_zone_logger',
    name: 'Wi-Fi Dead Zone Logger',
    claim: 'Scan Wi-Fi signal strength (dBm) and map dead zones',
    api: 'MediaDevices getUserMedia (camera) + JS synthetic random generator',
    support: 'Unsupported in web browsers (No W3C API exposes raw Wi-Fi RSSI dBm or BSSID).',
    verdict: 'Overclaim',
    wording: "Manual AR Wi-Fi Heatmap Planner (Visual Room Distance Estimator — Browser cannot read hardware RSSI directly)"
  },
  {
    slug: 'pwm_flicker_eye_health_scanner',
    name: 'PWM Flicker Eye Health Scanner',
    claim: 'Detect high-frequency OLED/LCD PWM screen flicker using phone camera',
    api: 'MediaDevices getUserMedia (camera canvas pixel luminance analysis)',
    support: 'All modern browsers with camera. Rolling shutter captures banding up to ~480Hz, but cannot measure exact kHz frequency.',
    verdict: 'Partly true',
    wording: "Screen Flicker & Rolling Shutter Banding Detector (Visual PWM Presence Check, Not a Photodiode Meter)"
  },
  {
    slug: 'nfc_data_ghost_eraser',
    name: 'NFC Data Ghost Eraser',
    claim: 'Deep military-grade erase of NFC tags',
    api: 'Web NFC API (NDEFReader)',
    support: 'Chrome on Android over HTTPS only. Completely unsupported on iOS, Safari, Firefox, and Desktop.',
    verdict: 'Partly true',
    wording: "NDEF Tag Content Overwriter (Chrome on Android only — Overwrites standard NDEF records; cannot wipe locked proprietary sectors)"
  },
  {
    slug: 'hrtf_spatial_audio_profiler',
    name: 'Personalized HRTF (Spatial Audio) Profiler',
    claim: 'Create personalized 3D audio HRTF profile using selfie camera',
    api: 'MediaDevices getUserMedia + synthetic pinna measurement + Web Audio PannerNode',
    support: 'Web Audio API supported everywhere; Pinna anthropometric scanning is an algorithmic approximation.',
    verdict: 'Partly true',
    wording: "Spatial Audio HRTF Simulator & Virtual Surround Sound Calibrator (Approximation based on head geometry)"
  },
  {
    slug: 'spatial_audio_seal_tester',
    name: "IEM/Earbud 'Seal' & Isolation Quality Test",
    claim: 'Test acoustic seal and sub-bass isolation of earbuds',
    api: 'Web Audio API (OscillatorNode, GainNode, StereoPanner)',
    support: 'Supported on all modern browsers (Chrome, Safari, Firefox, Edge, iOS, Android).',
    verdict: 'True',
    wording: "Acoustic Earbud Seal & Sub-Bass Isolation Test (Pure Psychoacoustic Phase Test)"
  },
  {
    slug: 'web_bluetooth_scan',
    name: 'Bluetooth LE Scanner',
    claim: 'Scan for nearby BLE beacons and peripherals in browser',
    api: 'Web Bluetooth API (navigator.bluetooth.requestDevice)',
    support: 'Chrome / Edge on Desktop (Mac, Windows, Linux, ChromeOS) and Android. Unsupported in Firefox and Safari/iOS.',
    verdict: 'True',
    wording: "Bluetooth LE Device Scanner & GATT Explorer (Requires Chrome/Edge with Bluetooth permissions)"
  },
  {
    slug: 'ble_rssi_meter',
    name: 'Find Lost Bluetooth Device',
    claim: 'Track live distance to lost BLE devices using signal RSSI',
    api: 'Web Bluetooth API (device.watchAdvertisements()) + Web Audio beeper',
    support: 'Chrome on Android and Mac (partially behind flags for continuous advertisement tracking). Desktop Windows requires paired devices.',
    verdict: 'Partly true',
    wording: "Bluetooth RSSI Signal Strength Tracker (Chrome/Android — Requires device advertising permissions)"
  },
  {
    slug: 'magnetometer_metal_find',
    name: 'Metal Detector & Stud Finder',
    claim: 'Detect studs and magnetic metals using device sensors',
    api: 'DeviceOrientationEvent / DeviceMotionEvent (approximated magnetic heading)',
    support: 'Approximates magnetic disturbances via compass tilt on mobile. Real Generic Sensor Magnetometer requires HTTPS + Chrome Android flags.',
    verdict: 'Partly true',
    wording: "Magnetic Compass Anomaly & Stud Locator (Mobile devices with compass sensors only)"
  },
  {
    slug: 'battery_discharge_monitor',
    name: 'Battery Drain Test',
    claim: 'Monitor real-time battery drain curve and charging wattage',
    api: 'Battery Status API (navigator.getBattery)',
    support: 'Chrome / Edge / Opera on Windows, Android, Linux, ChromeOS. Blocked in Safari and Firefox for fingerprinting prevention.',
    verdict: 'True',
    wording: "Battery Discharge & Drain Curve Monitor (Chromium browsers on Windows/Android/ChromeOS)"
  }
];

const capHeaders = 'slug,toolName,claimedCapability,underlyingBrowserAPI,actualBrowserSupport,verdict,recommendedWordingFix';
const capRows = capabilityRows.map(r => 
  `"${r.slug}","${r.name}","${r.claim}","${r.api}","${r.support}","${r.verdict}","${r.wording}"`
);
fs.writeFileSync('capability-audit.csv', [capHeaders, ...capRows].join('\n') + '\n');
console.log('Wrote capability-audit.csv');
