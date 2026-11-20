/**
 * Foldable & Dual-Screen Device Tester Logic
 * Implements Device Posture API parsing, Viewport Segments geometry,
 * and crease touch continuity tracking.
 */

export type PostureType = 'continuous' | 'folded' | 'unsupported';

export interface PostureEvaluation {
  posture: PostureType;
  isFolded: boolean;
  postureDescription: string;
  recommendedLayout: 'Single Unified Viewport' | 'Dual-Pane Master-Detail' | 'Laptop / Console Split';
}

export function evaluateDevicePosture(postureState?: string | null): PostureEvaluation {
  const norm = (postureState || '').trim().toLowerCase();

  if (norm === 'folded') {
    return {
      posture: 'folded',
      isFolded: true,
      postureDescription: 'Folded / Book Posture: Physical hinge is bent at an angle, presenting two distinct active visual surfaces.',
      recommendedLayout: 'Dual-Pane Master-Detail',
    };
  }

  if (norm === 'continuous') {
    return {
      posture: 'continuous',
      isFolded: false,
      postureDescription: 'Continuous / Flat Posture: Display is fully unfolded (180 degrees), presenting a unified large-screen canvas.',
      recommendedLayout: 'Single Unified Viewport',
    };
  }

  return {
    posture: 'unsupported',
    isFolded: false,
    postureDescription: 'Standard Planar Screen: Device Posture API is not detected or device features a conventional rigid display.',
    recommendedLayout: 'Single Unified Viewport',
  };
}

export interface ViewportSegment {
  indexX: number;
  indexY: number;
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface FoldableGeometry {
  isFoldableDetected: boolean;
  foldOrientation: 'vertical' | 'horizontal' | 'none';
  creasePositionPx: number;
  creaseThicknessPx: number;
  segments: ViewportSegment[];
}

export function calculateFoldableGeometry(params: {
  viewportWidth: number;
  viewportHeight: number;
  segment00Width?: number;
  segment00Height?: number;
  segment10Left?: number;
  segment01Top?: number;
}): FoldableGeometry {
  const vW = Math.max(1, params.viewportWidth);
  const vH = Math.max(1, params.viewportHeight);

  // Check for dual vertical segments (Book fold, e.g. Galaxy Z Fold, Pixel Fold, Surface Duo)
  if (params.segment00Width && params.segment00Width < vW && params.segment10Left) {
    const seg0W = params.segment00Width;
    const seg1Left = params.segment10Left;
    const creaseThickness = Math.max(0, seg1Left - seg0W);

    return {
      isFoldableDetected: true,
      foldOrientation: 'vertical',
      creasePositionPx: seg0W,
      creaseThicknessPx: creaseThickness,
      segments: [
        { indexX: 0, indexY: 0, width: seg0W, height: vH, top: 0, left: 0 },
        { indexX: 1, indexY: 0, width: vW - seg1Left, height: vH, top: 0, left: seg1Left },
      ],
    };
  }

  // Check for dual horizontal segments (Clamshell fold, e.g. Galaxy Z Flip, Razr)
  if (params.segment00Height && params.segment00Height < vH && params.segment01Top) {
    const seg0H = params.segment00Height;
    const seg1Top = params.segment01Top;
    const creaseThickness = Math.max(0, seg1Top - seg0H);

    return {
      isFoldableDetected: true,
      foldOrientation: 'horizontal',
      creasePositionPx: seg0H,
      creaseThicknessPx: creaseThickness,
      segments: [
        { indexX: 0, indexY: 0, width: vW, height: seg0H, top: 0, left: 0 },
        { indexX: 0, indexY: 1, width: vW, height: vH - seg1Top, top: seg1Top, left: 0 },
      ],
    };
  }

  // Fallback planar display
  return {
    isFoldableDetected: false,
    foldOrientation: 'none',
    creasePositionPx: 0,
    creaseThicknessPx: 0,
    segments: [{ indexX: 0, indexY: 0, width: vW, height: vH, top: 0, left: 0 }],
  };
}

export interface TouchSample {
  x: number;
  y: number;
  timestamp: number;
}

export interface CreaseContinuityResult {
  totalPoints: number;
  creaseTraversals: number;
  maxCoordinateJumpPx: number;
  hasDeadZone: boolean;
  touchSmoothnessScore: number; // 0 to 100%
}

export function evaluateCreaseTouchContinuity(
  samples: TouchSample[],
  creaseCoordinate: number,
  isVerticalFold: boolean = true
): CreaseContinuityResult {
  if (!samples || samples.length < 5) {
    return {
      totalPoints: samples ? samples.length : 0,
      creaseTraversals: 0,
      maxCoordinateJumpPx: 0,
      hasDeadZone: false,
      touchSmoothnessScore: 100,
    };
  }

  let traversals = 0;
  let maxJump = 0;
  let deadZoneDetected = false;

  const creaseThreshold = 10; // 10px buffer around hinge

  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1];
    const curr = samples[i];

    const prevCoord = isVerticalFold ? prev.x : prev.y;
    const currCoord = isVerticalFold ? curr.x : curr.y;

    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxJump) {
      maxJump = dist;
    }

    // Check if path crossed the crease
    if (
      (prevCoord <= creaseCoordinate && currCoord > creaseCoordinate) ||
      (prevCoord >= creaseCoordinate && currCoord < creaseCoordinate)
    ) {
      traversals++;

      // If a coordinate jumps by more than 45px across the crease, it indicates touch coordinate snapping or a deadzone
      if (Math.abs(currCoord - prevCoord) > 45) {
        deadZoneDetected = true;
      }
    }

    // Check if points inside the crease zone stall with dt > 60ms
    if (Math.abs(currCoord - creaseCoordinate) <= creaseThreshold) {
      const dt = curr.timestamp - prev.timestamp;
      if (dt > 80 && dist > 30) {
        deadZoneDetected = true;
      }
    }
  }

  // Smoothness score decreases with excessive coordinate jumps
  const penalty = Math.min(60, maxJump * 0.8) + (deadZoneDetected ? 30 : 0);
  const touchSmoothnessScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  return {
    totalPoints: samples.length,
    creaseTraversals: traversals,
    maxCoordinateJumpPx: Math.round(maxJump * 10) / 10,
    hasDeadZone: deadZoneDetected,
    touchSmoothnessScore,
  };
}
