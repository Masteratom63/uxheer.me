/**
 * ParticleIntro Configuration
 * 
 * Fully centralized animation & particle tuning parameters.
 * Modify values here to adjust timings, counts, colors, and camera motion.
 */

export const INTRO_CONFIG = {
  // Particle counts & dimensions
  particles: {
    count: 440,             // Total particles (tuned for mobile 60fps & rich depth)
    minRadius: 1.2,         // Base radius in pixels (at focal depth z=0)
    maxRadius: 2.4,
    ambientFieldRatio: 0.18, // 18% of particles float freely as an ambient field around typography
    
    // Depth settings (Virtual 3D coordinates)
    depth: {
      minZ: -60,            // In front of focal plane
      maxZ: 500,            // Deep into the screen
      targetZ: 0,           // Where "HEER PATEL" is formed (focal plane)
      focalDistance: 520,   // Perspective camera focal length (FOV)
      dispersalMaxZ: 850,   // Where particles recede during transition out
      totalWorldZ: 4800,    // Total depth of the persistent 3D volume
    },

    // 4 Distinct Depth Layers for true 3D spatial travel
    layers: {
      far: {
        ratio: 0.20,        // 20% FAR particles: tiny, dim, sparse, slow movement
        radiusMin: 0.9,
        radiusMax: 1.4,
        alphaMin: 0.30,
        alphaMax: 0.50,
        parallax: 0.55,
      },
      mid: {
        ratio: 0.55,        // 55% MID particles: primary population, clearly visible, moderate parallax
        radiusMin: 1.8,
        radiusMax: 2.8,
        alphaMin: 0.65,
        alphaMax: 0.85,
        parallax: 1.0,
      },
      near: {
        ratio: 0.20,        // 20% NEAR particles: noticeably larger, brighter, stronger parallax
        radiusMin: 3.2,
        radiusMax: 4.8,
        alphaMin: 0.85,
        alphaMax: 1.0,
        parallax: 1.45,
      },
      foreground: {
        ratio: 0.05,        // 5% FOREGROUND particles: pass close to viewport, occasional crossing
        radiusMin: 4.8,
        radiusMax: 6.4,
        alphaMin: 0.90,
        alphaMax: 1.0,
        parallax: 1.90,
      },
    },

    // Motion & Physics
    motion: {
      ambientDriftSpeed: 0.0006, // Natural slow harmonic floating
      microDriftAmplitude: 0.45, // Living breathing motion on letters during hold phase (sub-pixel)
      arrivalStaggerMax: 0.30,   // Seconds of randomized stagger when particles begin converging
    },

    // Color Palette (Strictly UXHeer brand colors: Cyan #00D1FF, Green #14FF00, Soft Whites)
    colors: {
      // 74% soft titanium whites & crisp cool tones (pre-allocated static hex strings)
      neutrals: [
        { r: 255, g: 255, b: 255, weight: 0.55, hex: '#FFFFFF' }, // Crisp pure white
        { r: 238, g: 246, b: 255, weight: 0.30, hex: '#EEF6FF' }, // Soft starlight white
        { r: 215, g: 232, b: 250, weight: 0.15, hex: '#D7E8FA' }, // Cool titanium
      ],
      // 26% brand-derived accents: Cyan #00D1FF (50%) & Green #14FF00 (50%)
      accents: [
        { r: 0,   g: 209, b: 255, weight: 0.50, hex: '#00D1FF' }, // Brand Cyan #00D1FF
        { r: 20,  g: 255, b: 0,   weight: 0.50, hex: '#14FF00' }, // Brand Green #14FF00
      ],
      accentRatio: 0.26, // ~13% cyan, ~13% green, ~74% neutrals
    },
  },

  // Sequence Phase Timings (in seconds from timeline start)
  timeline: {
    // Phase 1: Arrival (Screen is dark, subtle particles already floating)
    arrival: {
      start: 0.0,
      duration: 0.8,
    },
    // Phase 2: Logo Presence (Logo subtly reveals and floats with particles around it)
    logo: {
      start: 0.6,
      fadeInDuration: 0.40,
      visibleDuration: 0.55,
      fadeOutDuration: 0.35,
      end: 1.9,
    },
    // Phase 3: Name Formation (Particles smoothly converge into typography)
    formation: {
      start: 1.7,
      duration: 1.6,
      easing: 'cubicOut', // smooth cinematic ease
    },
    // Phase 4: Hold (HEER PATEL holds clearly with subtle breathing drift)
    hold: {
      start: 3.3,
      duration: 0.9,
    },
    // Phase 5: Transition Out (Particles gently separate into depth, fading to dark)
    dispersal: {
      start: 4.2,
      duration: 0.8,
    },
    // Total sequence length before ready state
    totalDuration: 5.0,
  },

  // Camera Settings
  camera: {
    fov: 520,
    driftSpeedX: 0.0005,
    driftSpeedY: 0.00035,
    maxDriftX: 14,
    maxDriftY: 9,
    scrollDriftX: 38, // Organic lateral S-curve displacement
    scrollDriftY: 22, // Organic vertical undulating displacement
  },

  // Typography Settings
  typography: {
    text: 'HEER PATEL',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '500', // Medium font weight
    letterSpacing: 0.16, // in em
    
    // Responsive sizing relative to viewport width
    mobile: {
      maxViewportWidth: 540,
      fontSizeFactor: 0.082, // ~32px on 390px phone
      minFontSize: 24,
      maxFontSize: 42,
    },
    desktop: {
      fontSizeFactor: 0.052, // ~52px on 1000px screen
      minFontSize: 40,
      maxFontSize: 64,
    },
  },
};

/**
 * Determines device performance tier once during initialization.
 * Prioritizes spatial depth over particle count.
 * Never dynamically alters count while scrolling.
 */
export function getAdaptiveQuality(width = (typeof window !== 'undefined' ? window.innerWidth : 1000), nativeDpr = (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1)) {
  const isMobile = width <= 768;
  const isTablet = width > 768 && width <= 1024;

  const concurrency = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
  const deviceMemory = typeof navigator !== 'undefined' ? (navigator.deviceMemory || 4) : 4;

  let tier = 'desktop';
  let particleCount = 440;
  let dprCap = 1.75;

  if (isMobile) {
    if (concurrency >= 8 && deviceMemory >= 6) {
      // High-performance mobile (e.g. A16/A17/Snapdragon 8 Gen 2+)
      tier = 'mobile-high';
      particleCount = 280; // Upper mobile target ceiling
      dprCap = 1.35;
    } else if (concurrency >= 6 || deviceMemory >= 4) {
      // Mid-range mobile
      tier = 'mobile-mid';
      particleCount = 240;
      dprCap = 1.35;
    } else {
      // Lower-performance mobile
      tier = 'mobile-low';
      particleCount = 180;
      dprCap = 1.25;
    }
  } else if (isTablet) {
    tier = 'tablet';
    particleCount = 340;
    dprCap = 1.5;
  } else {
    tier = 'desktop';
    particleCount = 440;
    dprCap = 1.75;
  }

  const effectiveDpr = Math.min(nativeDpr, dprCap);

  return {
    tier,
    particleCount,
    effectiveDpr,
    isMobile,
  };
}

