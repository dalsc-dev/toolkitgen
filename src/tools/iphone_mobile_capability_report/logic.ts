/**
 * iPhone & Mobile Browser Capability Checker Logic
 * Algorithms for DPR, screen resolution, ProMotion refresh detection,
 * Web API support evaluation, and safe-area geometry.
 */

export interface MobileDisplayMetrics {
  cssWidth: number;
  cssHeight: number;
  devicePixelRatio: number;
  physicalWidth: number;
  physicalHeight: number;
  isP3ColorGamut: boolean;
  isHighDynamicRange: boolean;
  screenCategory: 'Retina' | 'Super Retina XDR' | 'ProMotion Super Retina XDR' | 'Standard Display';
}

export function evaluateMobileDisplay(params: {
  width: number;
  height: number;
  dpr: number;
  isP3?: boolean;
  isHdr?: boolean;
  refreshHz?: number;
}): MobileDisplayMetrics {
  const cssWidth = Math.max(1, params.width);
  const cssHeight = Math.max(1, params.height);
  const dpr = Math.max(1, params.dpr);
  const physicalWidth = Math.round(cssWidth * dpr);
  const physicalHeight = Math.round(cssHeight * dpr);
  const isP3 = Boolean(params.isP3);
  const isHdr = Boolean(params.isHdr);
  const hz = params.refreshHz || 60;

  let screenCategory: 'Retina' | 'Super Retina XDR' | 'ProMotion Super Retina XDR' | 'Standard Display' = 'Standard Display';

  if (dpr >= 3 && isP3 && isHdr && hz >= 115) {
    screenCategory = 'ProMotion Super Retina XDR';
  } else if (dpr >= 3 && isP3 && isHdr) {
    screenCategory = 'Super Retina XDR';
  } else if (dpr >= 2) {
    screenCategory = 'Retina';
  }

  return {
    cssWidth,
    cssHeight,
    devicePixelRatio: dpr,
    physicalWidth,
    physicalHeight,
    isP3ColorGamut: isP3,
    isHighDynamicRange: isHdr,
    screenCategory,
  };
}

export interface ProMotionEvaluation {
  deliveredFps: number;
  isProMotionHardwareLikely: boolean;
  isSafari60HzCapped: boolean;
  explanation: string;
  remedySteps: string[];
}

export function evaluateProMotionStatus(
  deliveredFps: number,
  isIosSafari: boolean,
  isHighDpiOled: boolean
): ProMotionEvaluation {
  const is120Hz = deliveredFps >= 115;
  const isProMotionCandidate = isHighDpiOled;

  if (is120Hz) {
    return {
      deliveredFps,
      isProMotionHardwareLikely: true,
      isSafari60HzCapped: false,
      explanation: 'ProMotion 120Hz Active: Your browser rendering pipeline is delivering full 120Hz refresh updates without 60fps power-saving throttles.',
      remedySteps: [],
    };
  }

  if (isIosSafari && isProMotionCandidate && !is120Hz) {
    return {
      deliveredFps,
      isProMotionHardwareLikely: true,
      isSafari60HzCapped: true,
      explanation: 'Safari 60fps Throttle Detected: Apple WebKit defaults requestAnimationFrame to 60Hz even on 120Hz ProMotion displays (iPhone 13 Pro through 16 Pro) to conserve battery life via the internal "Prefer Page Rendering Updates near 60fps" feature flag.',
      remedySteps: [
        'Open iOS Settings on your device.',
        'Navigate to Apps > Safari > Advanced > Feature Flags (or Experimental Features on older iOS).',
        'Locate the toggle named "Prefer Page Rendering Updates near 60fps".',
        'Turn this toggle OFF to unlock full 120Hz ProMotion rendering in web applications.',
        'Force close and restart Safari, then re-test.',
      ],
    };
  }

  return {
    deliveredFps,
    isProMotionHardwareLikely: false,
    isSafari60HzCapped: false,
    explanation: 'Standard 60Hz Display: Your display or browser operates within the standard 60Hz refresh baseline.',
    remedySteps: [],
  };
}

export interface WebApiAuditResult {
  apiName: string;
  category: 'Graphics' | 'Hardware HID' | 'Storage & Memory' | 'Sensors & Media';
  isSupported: boolean;
  safariStatus: 'Native Support' | 'WebKit Blocked / Unsupported' | 'Experimental / Flag Required';
  notes: string;
}

export function auditWebApis(env: {
  hasWebGpu?: boolean;
  hasWebXr?: boolean;
  hasWebHid?: boolean;
  hasWebBluetooth?: boolean;
  hasFileSystemAccess?: boolean;
  hasSharedArrayBuffer?: boolean;
  hasWebCodecs?: boolean;
}): WebApiAuditResult[] {
  return [
    {
      apiName: 'WebGPU',
      category: 'Graphics',
      isSupported: Boolean(env.hasWebGpu),
      safariStatus: 'Native Support',
      notes: 'Hardware-accelerated compute shaders and modern graphics pipeline (supported in Safari on iOS 17+ and macOS Sonoma+).',
    },
    {
      apiName: 'WebXR Device API',
      category: 'Sensors & Media',
      isSupported: Boolean(env.hasWebXr),
      safariStatus: 'Experimental / Flag Required',
      notes: 'Immersive AR/VR session management. Requires manual feature flag activation in Safari.',
    },
    {
      apiName: 'WebHID (Human Interface Devices)',
      category: 'Hardware HID',
      isSupported: Boolean(env.hasWebHid),
      safariStatus: 'WebKit Blocked / Unsupported',
      notes: 'Direct 16-bit USB/Bluetooth gamepad & peripheral inspection. Intentionally omitted by Apple WebKit due to fingerprinting concerns.',
    },
    {
      apiName: 'Web Bluetooth API',
      category: 'Hardware HID',
      isSupported: Boolean(env.hasWebBluetooth),
      safariStatus: 'WebKit Blocked / Unsupported',
      notes: 'GATT service discovery and BLE peripheral communication. Blocked by WebKit on iOS.',
    },
    {
      apiName: 'File System Access API',
      category: 'Storage & Memory',
      isSupported: Boolean(env.hasFileSystemAccess),
      safariStatus: 'WebKit Blocked / Unsupported',
      notes: 'Direct read/write access to user filesystem folders (Origin Private File System OPFS is supported, but directory picker is blocked).',
    },
    {
      apiName: 'SharedArrayBuffer & Atomics',
      category: 'Storage & Memory',
      isSupported: Boolean(env.hasSharedArrayBuffer),
      safariStatus: 'Native Support',
      notes: 'High-performance multi-threaded memory sharing between Web Workers (requires Cross-Origin-Opener-Policy COOP headers).',
    },
    {
      apiName: 'WebCodecs API',
      category: 'Sensors & Media',
      isSupported: Boolean(env.hasWebCodecs),
      safariStatus: 'Native Support',
      notes: 'Low-latency access to hardware video decoders and audio processing streams.',
    },
  ];
}

export interface SafeAreaGeometry {
  top: number;
  right: number;
  bottom: number;
  left: number;
  hasNotchOrDynamicIsland: boolean;
  hasHomeIndicatorBar: boolean;
}

export function parseSafeAreaInsets(top: number, right: number, bottom: number, left: number): SafeAreaGeometry {
  const safeTop = Math.max(0, top);
  const safeRight = Math.max(0, right);
  const safeBottom = Math.max(0, bottom);
  const safeLeft = Math.max(0, left);

  return {
    top: safeTop,
    right: safeRight,
    bottom: safeBottom,
    left: safeLeft,
    hasNotchOrDynamicIsland: safeTop >= 44, // iPhone X through 16 Pro status bar / Dynamic Island range (44px - 59px)
    hasHomeIndicatorBar: safeBottom >= 21,  // iPhone home indicator gesture bar (typically 34px)
  };
}
