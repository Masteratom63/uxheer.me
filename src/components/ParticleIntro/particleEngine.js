/**
 * ParticleEngine for uxheer.me
 * 
 * High-performance, persistent 3D spatial particle cosmos.
 * 
 * Lifecycle:
 *  1. Intro (0.0s - 9.4s): Arrival -> Logo -> HEER PATEL convergence -> Living Hold
 *  2. Dispersal (9.4s - 11.8s): Disperses directly into permanent 3D world coordinates
 *  3. Persistent Spatial Universe: Camera travels through the continuous particle field
 *     driven by user scroll, with section-based intensity modulation and true 3D parallax.
 */

import { INTRO_CONFIG } from './config';

// Easing functions
const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

const TOTAL_WORLD_Z = INTRO_CONFIG.particles.depth.totalWorldZ || 4800; // Total depth of the homepage cosmos

/**
 * Samples typography target coordinates from offscreen canvas for HEER PATEL
 * 
 * Uses letter-by-letter contour sampling with spatial minimum-distance rejection
 * (Poisson-disk style) to guarantee:
 *  - Even, elegant point spacing along letter strokes
 *  - Zero clumping on curves (e.g. top of 'P', 'R', 'A')
 *  - Crisp, open negative space inside counters
 *  - Shallow 3D depth for razor-sharp camera legibility
 */
export function sampleTypographyTargets(width, height, totalCount) {
  const { typography: tCfg } = INTRO_CONFIG;
  const isMobile = width <= tCfg.mobile.maxViewportWidth;
  const cfg = isMobile ? tCfg.mobile : tCfg.desktop;

  // Responsive font size calculation
  let fontSize = Math.round(width * cfg.fontSizeFactor);
  fontSize = Math.max(cfg.minFontSize, Math.min(cfg.maxFontSize, fontSize));

  const text = tCfg.text;
  const letterSpacingEm = tCfg.letterSpacing;
  const letterSpacingPx = fontSize * letterSpacingEm;

  // Render text offscreen to extract accurate stroke contours
  const offscreen = document.createElement('canvas');
  const dpr = 1;
  const offW = Math.ceil(width);
  const offH = Math.ceil(height);
  offscreen.width = offW;
  offscreen.height = offH;

  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, offW, offH);

  // Use Medium font weight
  ctx.font = `${tCfg.fontWeight} ${fontSize}px ${tCfg.fontFamily}`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  const charWidths = [];
  let totalTextWidth = 0;
  for (let i = 0; i < text.length; i++) {
    const w = ctx.measureText(text[i]).width;
    charWidths.push(w);
    totalTextWidth += w + (i < text.length - 1 ? letterSpacingPx : 0);
  }

  const centerY = height / 2;

  // Draw each character with explicit tracking
  let currentX = (width - totalTextWidth) / 2;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], currentX, centerY);
    currentX += charWidths[i] + letterSpacingPx;
  }

  const imgData = ctx.getImageData(0, 0, offW, offH);
  const pixels = imgData.data;

  // Calibrated target point budgets for Medium 500 weight (~170 points total)
  // Scale budget appropriately if total particle pool is on a lower tier
  const budgetScale = totalCount ? Math.min(1.0, Math.max(0.65, totalCount / 280)) : 1.0;
  const charPointBudgets = {
    'H': Math.round(22 * budgetScale),
    'E': Math.round(18 * budgetScale),
    'R': Math.round(22 * budgetScale),
    'P': Math.round(20 * budgetScale),
    'A': Math.round(22 * budgetScale),
    'T': Math.round(16 * budgetScale),
    'L': Math.round(15 * budgetScale),
  };

  // Adjusted distance rejection allows particles to span the Medium 500 stroke width
  // while strictly preventing overlap or chunky clumping
  const minDistance = isMobile ? Math.max(2.8, fontSize * 0.088) : Math.max(3.6, fontSize * 0.076);
  const minDistanceSq = minDistance * minDistance;

  const targets = [];
  let charStartX = (width - totalTextWidth) / 2;

  for (let c = 0; c < text.length; c++) {
    const char = text[c];
    const charW = charWidths[c];
    if (char === ' ') {
      charStartX += charW + letterSpacingPx;
      continue;
    }

    const budget = charPointBudgets[char] || 18;
    const minPixelX = Math.floor((charStartX - 2) * dpr);
    const maxPixelX = Math.ceil((charStartX + charW + 2) * dpr);
    const minPixelY = Math.floor((centerY - fontSize * 0.7) * dpr);
    const maxPixelY = Math.ceil((centerY + fontSize * 0.7) * dpr);

    // Collect solid stroke pixels (alpha > 150 captures full Medium 500 stroke body)
    const charCandidates = [];
    const step = 2;

    for (let py = minPixelY; py <= maxPixelY; py += step) {
      if (py < 0 || py >= offH) continue;
      for (let px = minPixelX; px <= maxPixelX; px += step) {
        if (px < 0 || px >= offW) continue;
        const idx = (py * offW + px) * 4;
        const alpha = pixels[idx];
        if (alpha > 150) {
          const worldX = (px / dpr) - (width / 2);
          const worldY = (py / dpr) - (height / 2);
          charCandidates.push({ x: worldX, y: worldY });
        }
      }
    }

    if (charCandidates.length === 0) {
      charStartX += charW + letterSpacingPx;
      continue;
    }

    // Shuffle candidates to eliminate row/column scanline bias
    for (let i = charCandidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = charCandidates[i];
      charCandidates[i] = charCandidates[j];
      charCandidates[j] = temp;
    }

    // Poisson-disk style distance rejection sampling
    const selected = [];
    let currentDistSq = minDistanceSq;
    let attempts = 0;

    while (selected.length < budget && attempts < 3) {
      for (let i = 0; i < charCandidates.length; i++) {
        const pt = charCandidates[i];
        let tooClose = false;

        for (let j = 0; j < selected.length; j++) {
          const dx = pt.x - selected[j].x;
          const dy = pt.y - selected[j].y;
          if (dx * dx + dy * dy < currentDistSq) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          selected.push(pt);
          if (selected.length >= budget) break;
        }
      }

      currentDistSq *= 0.75;
      attempts++;
    }

    // Assign shallow 3D depth (-2.5px to +2.5px) for crisp camera legibility
    for (let i = 0; i < selected.length; i++) {
      targets.push({
        x: selected[i].x,
        y: selected[i].y,
        z: (Math.random() - 0.5) * 5.0,
      });
    }

    charStartX += charW + letterSpacingPx;
  }

  return targets;
}

/**
 * Returns section intensity modulation based on scroll progress
 */
export function getSectionIntensity(scrollRatio) {
  if (scrollRatio <= 0.08) {
    // STATEMENT: quiet, restrained, editorial focus with distinct spatial depth
    return 0.44;
  }
  if (scrollRatio <= 0.20) {
    // STATEMENT -> PROJECT 01: camera travels forward, volume expands into full 3D
    const p = (scrollRatio - 0.08) / 0.12;
    return 0.44 + p * (0.86 - 0.44);
  }
  if (scrollRatio <= 0.54) {
    // PROJECTS 01, 02, 03: rich spatial depth with particles behind, around, and occasional foreground
    return 0.86;
  }
  if (scrollRatio <= 0.68) {
    // ABOUT: space breathes gently, maintaining deep spatial awareness
    const p = (scrollRatio - 0.54) / 0.14;
    return 0.86 - p * (0.86 - 0.60);
  }
  if (scrollRatio <= 0.84) {
    // CAPABILITIES: kinetic spatial energy
    return 0.78;
  }
  // CONTACT & END: calm, settled, deep hold
  const p = Math.min(1, (scrollRatio - 0.84) / 0.14);
  return 0.78 - p * (0.78 - 0.50);
}

/**
 * Initializes the single persistent 3D particle cosmos
 */
export function createParticleSystem(width, height, customCount) {
  const { particles: pCfg } = INTRO_CONFIG;
  const count = customCount || pCfg.count;

  // Sample fine, contour-accurate letter targets
  const typographyTargets = sampleTypographyTargets(width, height, count);
  const letterCount = typographyTargets.length;
  const particles = [];

  const isMobile = width <= 540;
  const spreadX = isMobile ? width * 1.35 : width * 1.65;
  const spreadY = isMobile ? height * 1.35 : height * 1.55;

  let fgCount = 0;
  const totalForeground = Math.floor(count * pCfg.layers.foreground.ratio);

  for (let i = 0; i < count; i++) {
    const isLetter = i < letterCount;
    const targetData = isLetter ? typographyTargets[i] : null;

    // 1. Assign Depth Layer (FOREGROUND, NEAR, MID, FAR) for persistent cosmos
    const layerRatio = i / count;
    let layer;
    if (layerRatio < pCfg.layers.foreground.ratio) {
      layer = 'foreground';
    } else if (layerRatio < pCfg.layers.foreground.ratio + pCfg.layers.near.ratio) {
      layer = 'near';
    } else if (layerRatio < pCfg.layers.foreground.ratio + pCfg.layers.near.ratio + pCfg.layers.mid.ratio) {
      layer = 'mid';
    } else {
      layer = 'far';
    }

    const lCfg = pCfg.layers[layer];
    const baseRadius = lCfg.radiusMin + Math.random() * (lCfg.radiusMax - lCfg.radiusMin);
    const baseAlpha = lCfg.alphaMin + Math.random() * (lCfg.alphaMax - lCfg.alphaMin);
    const parallaxWeight = lCfg.parallax;

    // Fine, delicate particle size for HEER PATEL formation (0.95px - 1.40px)
    // Avoids chunky clusters and preserves negative space
    const introRadius = isLetter
      ? (isMobile ? 1.05 + Math.random() * 0.30 : 1.15 + Math.random() * 0.35)
      : (isMobile ? 0.90 + Math.random() * 0.35 : 1.00 + Math.random() * 0.40);

    const introAlpha = isLetter
      ? (0.92 + Math.random() * 0.08)
      : (0.45 + Math.random() * 0.35);

    // 2. Brand Color Language (Strictly UXHeer Cyan #00D1FF, Green #14FF00, Soft Whites)
    const isAccent = Math.random() < pCfg.colors.accentRatio;
    let color;
    if (isAccent) {
      const accList = pCfg.colors.accents;
      color = accList[Math.floor(Math.random() * accList.length)];
    } else {
      const neuList = pCfg.colors.neutrals;
      color = neuList[Math.floor(Math.random() * neuList.length)];
    }
    const colorStyle = color.hex || `rgb(${color.r},${color.g},${color.b})`;

    // 3. Initial position in Phase 1 (Arrival)
    const x0 = (Math.random() - 0.5) * (width * 1.3);
    const y0 = (Math.random() - 0.5) * (height * 1.3);
    const z0 = pCfg.depth.minZ + Math.random() * (pCfg.depth.maxZ - pCfg.depth.minZ);

    // 4. Target position for Phase 3 (Name Formation: HEER PATEL)
    let xt, yt, zt;
    if (isLetter && targetData) {
      xt = targetData.x;
      yt = targetData.y;
      zt = targetData.z; // Shallow, crisp 3D letter depth
    } else {
      // Ambient floating particles around the typography
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.min(width, height) * (0.28 + Math.random() * 0.35);
      xt = Math.cos(angle) * radius;
      yt = Math.sin(angle) * (radius * 0.55);
      zt = 60 + Math.random() * 320;
    }

    // 5. Permanent 3D World Coordinates for the Continuous Spatial Journey
    let worldX, worldY, worldZ;
    let driftAmpX = 8;
    let driftAmpY = 6;
    let driftAmpZ = 8;
    let velX = 0;
    let velY = 0;

    if (layer === 'far') {
      worldX = (Math.random() - 0.5) * (spreadX * 1.4);
      worldY = (Math.random() - 0.5) * (spreadY * 1.4);
      worldZ = Math.random() * TOTAL_WORLD_Z;
      driftAmpX = 3.5;
      driftAmpY = 3.0;
      driftAmpZ = 4.0;
    } else if (layer === 'mid') {
      worldX = (Math.random() - 0.5) * spreadX;
      worldY = (Math.random() - 0.5) * spreadY;
      worldZ = Math.random() * TOTAL_WORLD_Z;
      driftAmpX = 8.5;
      driftAmpY = 6.5;
      driftAmpZ = 9.0;
    } else if (layer === 'near') {
      worldZ = Math.random() * TOTAL_WORLD_Z;
      driftAmpX = 14.0;
      driftAmpY = 10.0;
      driftAmpZ = 13.0;

      if (worldZ < 450) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.min(width, height) * (0.36 + Math.random() * 0.44);
        worldX = Math.cos(angle) * dist;
        worldY = Math.sin(angle) * (dist * 0.72);
      } else {
        worldX = (Math.random() - 0.5) * (spreadX * 0.95);
        worldY = (Math.random() - 0.5) * (spreadY * 0.95);
      }
    } else {
      worldZ = (fgCount / totalForeground) * TOTAL_WORLD_Z + (Math.random() - 0.5) * 60;
      fgCount++;

      driftAmpX = 18.0;
      driftAmpY = 14.0;
      driftAmpZ = 16.0;

      const corridor = fgCount % 4;
      if (corridor === 0) {
        worldX = -width * (0.28 + Math.random() * 0.22);
        worldY = height * (0.22 + Math.random() * 0.24);
        velX = 0.9;
        velY = -0.55;
      } else if (corridor === 1) {
        worldX = width * (0.30 + Math.random() * 0.22);
        worldY = -height * (0.15 + Math.random() * 0.28);
        velX = -0.8;
        velY = 0.45;
      } else if (corridor === 2) {
        worldX = -width * (0.32 + Math.random() * 0.20);
        worldY = -height * (0.24 + Math.random() * 0.20);
        velX = 0.65;
        velY = 0.5;
      } else {
        worldX = width * (0.26 + Math.random() * 0.24);
        worldY = height * (0.25 + Math.random() * 0.20);
        velX = -0.7;
        velY = -0.4;
      }
    }

    const curveDir = Math.random() < 0.5 ? -1 : 1;
    const curveMagnitude = 35 + Math.random() * 65;

    particles.push({
      id: i,
      layer,
      isLetter,
      isAccent,
      color,
      colorStyle,
      introRadius,
      introAlpha,
      baseRadius,
      baseAlpha,
      parallaxWeight,

      // Trajectory anchors
      x0, y0, z0,
      xt, yt, zt,
      worldX, worldY, worldZ,

      stagger: Math.random() * pCfg.motion.arrivalStaggerMax,
      curveMagnitude: curveMagnitude * curveDir,
      curveZ: (Math.random() - 0.5) * 60,

      // Harmonic frequencies for natural living floating
      freqX: 0.32 + Math.random() * 0.45,
      freqY: 0.28 + Math.random() * 0.42,
      freqZ: 0.18 + Math.random() * 0.32,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseZ: Math.random() * Math.PI * 2,
      driftAmpX,
      driftAmpY,
      driftAmpZ,
      velX,
      velY,

      // Current render state
      x: x0,
      y: y0,
      z: z0,
      relZ: 0,
      screenX: 0,
      screenY: 0,
      screenRadius: 1,
      screenAlpha: 0,
      inFrontOfCards: false,
    });
  }

  return particles;
}

/**
 * Updates 3D physics, timeline states, and scroll camera projection
 */
export function updateParticles(particles, time, width, height, scrollRatio = 0, isIntroFinished = false) {
  const { timeline, camera: camCfg, particles: pCfg } = INTRO_CONFIG;
  const fov = camCfg.fov;

  const tFormStart = timeline.formation.start;
  const tFormDuration = timeline.formation.duration;
  const tHoldStart = timeline.hold.start;
  const tDispersalStart = timeline.dispersal.start;
  const tDispersalDuration = timeline.dispersal.duration;
  const tIntroTotal = timeline.totalDuration;

  // Check if we are in the scrollable homepage journey
  const inScrollMode = isIntroFinished || time >= tIntroTotal;

  if (inScrollMode) {
    // -----------------------------------------------------------------
    // HOMEPAGE CONTINUOUS SCROLL MODE
    // Camera travels forward through the persistent 3D spatial volume
    // -----------------------------------------------------------------
    const camZ = scrollRatio * TOTAL_WORLD_Z;
    const sectionIntensity = getSectionIntensity(scrollRatio);

    const camTimeX = Math.sin(time * camCfg.driftSpeedX * 1000) * camCfg.maxDriftX;
    const camTimeY = Math.cos(time * camCfg.driftSpeedY * 1000) * camCfg.maxDriftY;
    const scrollCurveX = Math.sin(scrollRatio * Math.PI * 3.2 + 0.3) * camCfg.scrollDriftX;
    const scrollCurveY = Math.cos(scrollRatio * Math.PI * 2.6) * camCfg.scrollDriftY;

    const camX = camTimeX + scrollCurveX;
    const camY = camTimeY + scrollCurveY;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const driftX = Math.sin(time * p.freqX + p.phaseX) * p.driftAmpX + (p.velX ? p.velX * Math.sin(time * 0.45) * 22 : 0);
      const driftY = Math.cos(time * p.freqY + p.phaseY) * p.driftAmpY + (p.velY ? p.velY * Math.cos(time * 0.45) * 18 : 0);
      const driftZ = Math.sin(time * p.freqZ + p.phaseZ) * p.driftAmpZ;

      p.x = p.worldX + driftX;
      p.y = p.worldY + driftY;
      p.z = p.worldZ + driftZ;

      let relZ = ((p.z - camZ) % TOTAL_WORLD_Z + TOTAL_WORLD_Z) % TOTAL_WORLD_Z;

      let nearFade = 1.0;
      if (relZ < 35) {
        nearFade = Math.max(0, (relZ - 6) / 29);
      }

      let farFade = 1.0;
      if (relZ > TOTAL_WORLD_Z - 700) {
        farFade = Math.max(0, (TOTAL_WORLD_Z - relZ) / 700);
      }

      const totalZ = relZ + fov;
      if (totalZ > 10 && nearFade > 0) {
        const scale = fov / totalZ;

        const relX = p.x - camX * p.parallaxWeight;
        const relY = p.y - camY * p.parallaxWeight;

        p.screenX = relX * scale + width / 2;
        p.screenY = relY * scale + height / 2;
        p.relZ = relZ;

        if (p.layer === 'foreground') {
          p.screenRadius = Math.max(p.baseRadius * (scale * 1.15), 2.4);
        } else if (p.layer === 'near') {
          p.screenRadius = Math.max(p.baseRadius * (scale * 1.05), 1.6);
        } else if (p.layer === 'mid') {
          p.screenRadius = Math.max(p.baseRadius * scale, 1.1);
        } else {
          p.screenRadius = Math.max(p.baseRadius * Math.min(scale, 0.45), 0.7);
        }

        let layerIntensity = sectionIntensity;
        if (p.layer === 'foreground') {
          layerIntensity = scrollRatio <= 0.08 ? 0.30 : Math.min(1.0, sectionIntensity * 1.25);
        } else if (p.layer === 'near') {
          layerIntensity = scrollRatio <= 0.08 ? 0.45 : Math.min(1.0, sectionIntensity * 1.15);
        }

        const depthFactor = Math.min(Math.max(scale * 1.1, 0.25), 1.05);
        p.screenAlpha = p.baseAlpha * depthFactor * layerIntensity * nearFade * farFade;

        p.inFrontOfCards = (p.layer === 'foreground') || (p.layer === 'near' && relZ < 240);
        p.haloAlpha = 1.0;
      } else {
        p.screenAlpha = 0;
        p.inFrontOfCards = false;
        p.haloAlpha = 0;
      }
    }
    return;
  }

  // -------------------------------------------------------------------
  // INTRO ANIMATION PHASES (Arrival -> Logo -> HEER PATEL -> Dispersal)
  // Fine, crisp, elegant points forming the identity mark
  // -------------------------------------------------------------------
  const camTimeX = Math.sin(time * camCfg.driftSpeedX * 1000) * camCfg.maxDriftX;
  const camTimeY = Math.cos(time * camCfg.driftSpeedY * 1000) * camCfg.maxDriftY;
  const scrollCurveX = Math.sin(0.3) * camCfg.scrollDriftX;
  const scrollCurveY = Math.cos(0.0) * camCfg.scrollDriftY;

  const isDispersal = time >= tDispersalStart;
  const dispersalElapsed = isDispersal ? (time - tDispersalStart) : 0;
  const dispersalProgress = isDispersal ? Math.min(dispersalElapsed / tDispersalDuration, 1.0) : 0;
  const dispersalEased = isDispersal ? easeInOutSine(dispersalProgress) : 0;

  // Camera X & Y seamlessly ease from intro centered drift into scroll mode base path
  const camX = camTimeX + (isDispersal ? scrollCurveX * dispersalEased : 0);
  const camY = camTimeY + (isDispersal ? scrollCurveY * dispersalEased : 0);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    const driftX = Math.sin(time * p.freqX + p.phaseX) * 10;
    const driftY = Math.cos(time * p.freqY + p.phaseY) * 8;
    const driftZ = Math.sin(time * p.freqZ + p.phaseZ) * 14;

    let targetX, targetY, targetZ;
    let phaseAlphaMultiplier = 1.0;

    if (time < tFormStart) {
      // Phase 1 & 2: Arrival & Logo Presence
      targetX = p.x0 + driftX;
      targetY = p.y0 + driftY;
      targetZ = p.z0 + driftZ;
      phaseAlphaMultiplier = Math.min(time / 0.8, 1.0);
    } else if (time < tHoldStart) {
      // Phase 3: Name Formation (Convergence)
      const particleStartTime = tFormStart + p.stagger;
      if (time < particleStartTime) {
        targetX = p.x0 + driftX;
        targetY = p.y0 + driftY;
        targetZ = p.z0 + driftZ;
      } else {
        const effectiveDuration = Math.max(tFormDuration - p.stagger, 1.0);
        const rawProgress = Math.min((time - particleStartTime) / effectiveDuration, 1.0);
        const eased = easeOutQuint(rawProgress);

        const arc = Math.sin(rawProgress * Math.PI);
        const arcOffsetX = p.curveMagnitude * arc;
        const arcOffsetY = (p.curveMagnitude * 0.35) * arc;
        const arcOffsetZ = p.curveZ * arc;

        targetX = p.x0 + (p.xt - p.x0) * eased + arcOffsetX;
        targetY = p.y0 + (p.yt - p.y0) * eased + arcOffsetY;
        targetZ = p.z0 + (p.zt - p.z0) * eased + arcOffsetZ;

        if (p.isLetter) {
          const livingFactor = eased;
          targetX += Math.sin(time * 2.2 + p.phaseX) * (pCfg.motion.microDriftAmplitude * 0.6 * livingFactor);
          targetY += Math.cos(time * 2.2 + p.phaseY) * (pCfg.motion.microDriftAmplitude * 0.6 * livingFactor);
        } else {
          targetX += driftX * 0.5;
          targetY += driftY * 0.5;
        }
      }
    } else if (time < tDispersalStart) {
      // Phase 4: Hold (Crisp, legible, living breathing letters)
      if (p.isLetter) {
        const microX = Math.sin(time * 1.8 + p.phaseX) * (pCfg.motion.microDriftAmplitude * 0.5);
        const microY = Math.cos(time * 2.0 + p.phaseY) * (pCfg.motion.microDriftAmplitude * 0.5);
        targetX = p.xt + microX;
        targetY = p.yt + microY;
        targetZ = p.zt;
      } else {
        targetX = p.xt + driftX * 0.7;
        targetY = p.yt + driftY * 0.7;
        targetZ = p.zt + driftZ * 0.7;
      }
    } else {
      // Phase 5: Dispersal directly into the EXACT scroll mode world position!
      // Dest world coordinates match inScrollMode at scrollRatio = 0
      const destDriftX = Math.sin(time * p.freqX + p.phaseX) * p.driftAmpX + (p.velX ? p.velX * Math.sin(time * 0.45) * 22 : 0);
      const destDriftY = Math.cos(time * p.freqY + p.phaseY) * p.driftAmpY + (p.velY ? p.velY * Math.cos(time * 0.45) * 18 : 0);
      const destDriftZ = Math.sin(time * p.freqZ + p.phaseZ) * p.driftAmpZ;

      const destX = p.worldX + destDriftX;
      const destY = p.worldY + destDriftY;
      const destZ = p.worldZ + destDriftZ;

      const holdX = p.xt + (p.isLetter ? Math.sin(time * 1.8 + p.phaseX) * (pCfg.motion.microDriftAmplitude * 0.5) : (destDriftX * 0.7));
      const holdY = p.yt + (p.isLetter ? Math.cos(time * 2.0 + p.phaseY) * (pCfg.motion.microDriftAmplitude * 0.5) : (destDriftY * 0.7));
      const holdZ = p.zt;

      targetX = holdX + (destX - holdX) * dispersalEased;
      targetY = holdY + (destY - holdY) * dispersalEased;
      targetZ = holdZ + (destZ - holdZ) * dispersalEased;
    }

    p.x = targetX;
    p.y = targetY;
    p.z = targetZ;

    if (!isDispersal) {
      // Standard perspective projection for Phases 1-4
      const relX = p.x - camX;
      const relY = p.y - camY;
      const relZ = p.z + fov;

      if (relZ > 10) {
        const scale = fov / relZ;
        p.screenX = relX * scale + width / 2;
        p.screenY = relY * scale + height / 2;
        p.relZ = p.z;
        p.screenRadius = Math.max(p.introRadius * scale, 0.65);
        const depthFactor = Math.min(Math.max(scale * 1.15, 0.2), 1.0);
        p.screenAlpha = p.introAlpha * depthFactor * phaseAlphaMultiplier;
        p.inFrontOfCards = false;
        p.haloAlpha = 0;
      } else {
        p.screenAlpha = 0;
        p.inFrontOfCards = false;
        p.haloAlpha = 0;
      }
    } else {
      // Phase 5: Projection smoothly interpolates into the exact inScrollMode formula!
      const relZ = ((p.z - 0) % TOTAL_WORLD_Z + TOTAL_WORLD_Z) % TOTAL_WORLD_Z;
      let nearFade = 1.0;
      if (relZ < 35) {
        nearFade = Math.max(0, (relZ - 6) / 29);
      }
      let farFade = 1.0;
      if (relZ > TOTAL_WORLD_Z - 700) {
        farFade = Math.max(0, (TOTAL_WORLD_Z - relZ) / 700);
      }

      const totalZ = relZ + fov;
      if (totalZ > 10 && nearFade > 0) {
        const scale = fov / totalZ;

        // Effective parallax weight smoothly eases from 1.0 to p.parallaxWeight
        const effParallax = 1.0 + (p.parallaxWeight - 1.0) * dispersalEased;
        const relX = p.x - camX * effParallax;
        const relY = p.y - camY * effParallax;

        p.screenX = relX * scale + width / 2;
        p.screenY = relY * scale + height / 2;
        p.relZ = relZ;

        // Target radius in scroll mode
        let destRadius;
        if (p.layer === 'foreground') {
          destRadius = Math.max(p.baseRadius * (scale * 1.15), 2.4);
        } else if (p.layer === 'near') {
          destRadius = Math.max(p.baseRadius * (scale * 1.05), 1.6);
        } else if (p.layer === 'mid') {
          destRadius = Math.max(p.baseRadius * scale, 1.1);
        } else {
          destRadius = Math.max(p.baseRadius * Math.min(scale, 0.45), 0.7);
        }

        const startRadius = Math.max(p.introRadius * scale, 0.65);
        p.screenRadius = startRadius + (destRadius - startRadius) * dispersalEased;

        // Target alpha in scroll mode
        const sectionIntensity = getSectionIntensity(0); // 0.44
        let layerIntensity = sectionIntensity;
        if (p.layer === 'foreground') {
          layerIntensity = 0.30;
        } else if (p.layer === 'near') {
          layerIntensity = 0.45;
        }
        const depthFactor = Math.min(Math.max(scale * 1.1, 0.25), 1.05);
        const destAlpha = p.baseAlpha * depthFactor * layerIntensity * nearFade * farFade;

        const startAlpha = p.introAlpha * Math.min(Math.max(scale * 1.15, 0.2), 1.0);
        p.screenAlpha = startAlpha + (destAlpha - startAlpha) * dispersalEased;

        p.inFrontOfCards = (p.layer === 'foreground') || (p.layer === 'near' && relZ < 240);
        p.haloAlpha = dispersalEased;
      } else {
        p.screenAlpha = 0;
        p.inFrontOfCards = false;
        p.haloAlpha = 0;
      }
    }
  }
}

// Module-scoped depth comparator avoids per-frame closure allocation
function depthComparator(a, b) {
  return (b.relZ || b.z) - (a.relZ || a.z);
}

/**
 * Renders particles onto background and foreground canvas layers
 * Completely zero-allocation render loop: uses pre-allocated color strings and globalAlpha
 */
export function renderParticles(bgCtx, fgCtx, particles, width, height, isIntroFinished = false) {
  bgCtx.clearRect(0, 0, width, height);
  if (fgCtx) fgCtx.clearRect(0, 0, width, height);

  // Depth-sort using static comparator (zero closure allocation)
  particles.sort(depthComparator);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (p.screenAlpha <= 0.01) continue;

    const r = p.screenRadius;
    const x = p.screenX;
    const y = p.screenY;

    const margin = r + 15;
    if (x < -margin || x > width + margin || y < -margin || y > height + margin) continue;

    const useFg = p.inFrontOfCards && fgCtx;
    const ctx = useFg ? fgCtx : bgCtx;

    // Atmospheric halo smoothly eases in with dispersal and persists in scroll mode
    // During HEER PATEL formation & hold, particles render as clean, crisp, pointillist dots
    if (p.haloAlpha > 0 && p.isAccent && (p.layer === 'near' || p.layer === 'foreground') && r >= 2.2) {
      // 1. Soft atmospheric halo (Zero string allocations via globalAlpha + pre-allocated colorStyle)
      ctx.globalAlpha = p.screenAlpha * 0.22 * p.haloAlpha;
      ctx.fillStyle = p.colorStyle;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.85, 0, Math.PI * 2);
      ctx.fill();

      // 2. Crisp luminous core
      ctx.globalAlpha = p.screenAlpha;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Clean, crisp pointillist dot (Zero string allocations via globalAlpha + pre-allocated colorStyle)
      ctx.globalAlpha = p.screenAlpha;
      ctx.fillStyle = p.colorStyle;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

