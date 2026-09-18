import React, { useEffect, useRef, useState } from 'react';
import Project02Particles from './Project02Particles';
import './Project02Scene.css';

// 7 New Instagram Graphic Works (Primary Body of Work)
import ahmedabadCover from '../../assets/projects/visual-communication/ahmedabad-urban-study-cover.jpg';
import ahmedabadDetail from '../../assets/projects/visual-communication/ahmedabad-urban-study-detail.jpg';
import canadaHistoryMag from '../../assets/projects/visual-communication/canada-history-magazine.jpg';
import ootyBanner from '../../assets/projects/visual-communication/ooty-explorer-banner.jpg';
import ootyCover from '../../assets/projects/visual-communication/ooty-explorer-cover.jpg';
import creationCard from '../../assets/projects/visual-communication/creation-identity-card.jpg';
import visitingCardMockup from '../../assets/projects/visual-communication/visiting-card-stone-mockup.jpg';

// Selected Earlier Visual Works
import coverOld from '../../assets/projects/visual-communication/cover-old.png';
import page2Old from '../../assets/projects/visual-communication/page-2-old.png';
import canadaCoverOld from '../../assets/projects/visual-communication/canada-cover-old.png';
import ootyCoverOld from '../../assets/projects/visual-communication/ooty-cover-old.png';
import ootyOption2Old from '../../assets/projects/visual-communication/ooty-image-2-option-2-old.png';
import visitingCardPost1 from '../../assets/projects/visual-communication/visiting-card-post-1.png';
import visitingCardPost2 from '../../assets/projects/visual-communication/visiting-card-post-2.png';

/**
 * Project02Scene Component
 * 
 * Immersive editorial visual experience for VISUAL COMMUNICATION.
 * An image-led, curated collection demonstrating typography, scale,
 * and visual storytelling across social, editorial, identity, and print.
 */
export default function Project02Scene({
  lifecycleState = 'CLOSED', // 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  onOpenComplete,
  onExitTrigger,
  onExitComplete,
  onBackToProject01,
  onGoToProject03,
}) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Trigger exit wave transition (OPEN -> CLOSING)
  const handleTriggerExit = () => {
    if (lifecycleState !== 'OPEN') return;
    if (onExitTrigger) {
      onExitTrigger();
    }
  };

  // Trigger smooth transition back toward Project 01
  const handleBackToProject01 = () => {
    if (lifecycleState !== 'OPEN') return;
    if (onBackToProject01) {
      onBackToProject01();
    } else if (onExitTrigger) {
      onExitTrigger();
    }
  };

  // Trigger smooth transition forward toward Project 03
  const handleGoToProject03 = () => {
    if (lifecycleState !== 'OPEN') return;
    if (onGoToProject03) {
      onGoToProject03();
    } else if (onExitTrigger) {
      onExitTrigger();
    }
  };

  const lastScrollTopRef = useRef(0);
  const maxReachedProgressRef = useRef(0);

  // Scroll to top on new open lifecycle
  useEffect(() => {
    if (lifecycleState === 'OPENING') {
      setScrollProgress(0);
      lastScrollTopRef.current = 0;
      maxReachedProgressRef.current = 0;
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [lifecycleState]);

  // Escape key support during OPEN state
  useEffect(() => {
    if (lifecycleState === 'OPEN') {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleTriggerExit();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lifecycleState]);

  // Exclusive local scroll calculation (drives Project02 local particle camera)
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const currentScrollTop = el.scrollTop;
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
    const rawFraction = Math.min(1, Math.max(0, currentScrollTop / maxScroll));

    if (currentScrollTop >= lastScrollTopRef.current) {
      const progressiveFraction = Math.max(rawFraction, maxReachedProgressRef.current);
      maxReachedProgressRef.current = progressiveFraction;
      setScrollProgress(progressiveFraction);
    } else {
      maxReachedProgressRef.current = rawFraction;
      setScrollProgress(rawFraction);
    }
    lastScrollTopRef.current = currentScrollTop;
  };

  if (lifecycleState === 'CLOSED') return null;

  return (
    <div
      className={`project02-scene-root state-${lifecycleState.toLowerCase()}`}
      role="region"
      aria-label="Project 02: Visual Communication"
    >
      {/* 1. Viewport-fixed Local 3D Particle Canvas with Entry/Exit Ripple Waves */}
      <Project02Particles
        scrollProgress={scrollProgress}
        lifecycleState={lifecycleState}
        onOpenComplete={onOpenComplete}
        onExitComplete={onExitComplete}
      />

      {/* 2. Subtle Ambient Vignette & Spatial Gradients (Behind particles/content) */}
      <div className="project02-ambient-backdrop" aria-hidden="true" />

      {/* 3. Sticky Viewport Close Button (Top-Right, matching portfolio standard) */}
      <button
        className="project02-spatial-dismiss"
        onClick={handleTriggerExit}
        aria-label="Return to portfolio space"
        type="button"
      >
        <span className="dismiss-icon" aria-hidden="true">✕</span>
        <span className="dismiss-label">RETURN</span>
      </button>

      {/* 3. Dedicated Content Scroll Viewport */}
      <div
        ref={containerRef}
        className="project02-scroll-viewport"
        onScroll={handleScroll}
      >
        <div className="project02-editorial-content">
          {/* =================================================================== */}
          {/* SECTION 01 — ENTRY */}
          {/* =================================================================== */}
          <header className="project02-chapter intro-chapter">
            <div className="project02-intro-meta">
              <span className="project02-meta-pill">GRAPHIC / VISUAL / SOCIAL / IDENTITY</span>
            </div>

            <h1 className="project02-headline-hero">
              VISUAL COMMUNICATION
            </h1>

            <p className="project02-statement-lead">
              A curated visual body of work exploring typography, scale, and imagery across social, editorial, and physical identity systems.
            </p>

            <div className="project02-scroll-cue" aria-hidden="true">
              <span className="minimal-scroll-text">SCROLL</span>
              <span className="minimal-scroll-line" />
            </div>
          </header>

          {/* =================================================================== */}
          {/* SECTION 02 & 03 — CURRENT WORK & VISUAL SERIES (7 Instagram Pieces) */}
          {/* =================================================================== */}
          <section className="project02-chapter chapter-current-work">
            <div className="chapter-marker">
              <span className="chapter-num">01</span>
              <span className="chapter-label">CURRENT WORK</span>
            </div>

            <p className="section-lead-para">
              Design as visual storytelling—capturing architecture, place, and tangible brand artifacts.
            </p>

            {/* Sequence 1: Ahmedabad Urban Study (Diptych Narrative) */}
            <article className="visual-exhibit-block exhibit-ahmedabad">
              <div className="exhibit-header">
                <span className="exhibit-tag">URBAN STUDY · 2026</span>
                <h2 className="exhibit-title">Ahmedabad: Old Streets. New Stories.</h2>
              </div>

              <div className="diptych-grid">
                <div className="artwork-stage dominant-stage">
                  <div className="artwork-frame">
                    <img
                      src={ahmedabadCover}
                      alt="Ahmedabad Urban Study: Old Streets, New Stories full cover with architectural archway"
                      className="artwork-img"
                      loading="eager"
                    />
                  </div>
                  <span className="artwork-caption">
                    Full Composition — Monumental condensed typography framing human warmth and historic stone architecture.
                  </span>
                </div>

                <div className="artwork-stage detail-stage">
                  <div className="artwork-frame">
                    <img
                      src={ahmedabadDetail}
                      alt="Ahmedabad Urban Study: Detail showing type and context"
                      className="artwork-img"
                      loading="lazy"
                    />
                  </div>
                  <span className="artwork-caption">
                    Type & Context Detail — Structural balance between typographic hierarchy and narrative imagery.
                  </span>
                </div>
              </div>
            </article>

            {/* Sequence 2: Nature Magazine — Canada Feature */}
            <article className="visual-exhibit-block exhibit-magazine">
              <div className="exhibit-header">
                <span className="exhibit-tag">EDITORIAL PUBLICATION · WINTER 2025</span>
                <h2 className="exhibit-title">History Magazine: The Past of Canada</h2>
              </div>

              <div className="magazine-hero-stage">
                <div className="artwork-frame hero-frame">
                  <img
                    src={canadaHistoryMag}
                    alt="History Magazine Cover: Nature - Most Historically Unexplored Canadian Places"
                    className="artwork-img"
                    loading="lazy"
                  />
                </div>
                <div className="exhibit-editorial-note">
                  <p className="note-lead">Atmospheric Typography Integration</p>
                  <p className="note-body">
                    Translucent letterforms embedded into alpine cloud cover, paired with deliberate hierarchy across glacial lake waters.
                  </p>
                </div>
              </div>
            </article>

            {/* Sequence 3: The Explorer Series — Nilgiris & Ooty */}
            <article className="visual-exhibit-block exhibit-explorer">
              <div className="exhibit-header">
                <span className="exhibit-tag">LANDSCAPE PUBLICATION · VOL. 01</span>
                <h2 className="exhibit-title">The Explorer: Nilgiris & Ooty</h2>
              </div>

              <div className="explorer-composition">
                <div className="artwork-stage panoramic-stage">
                  <div className="artwork-frame banner-frame">
                    <img
                      src={ootyBanner}
                      alt="The Explorer Vol 01: Ooty banner crop showing scale and typographic anchor"
                      className="artwork-img"
                      loading="lazy"
                    />
                  </div>
                  <span className="artwork-caption">
                    Scale Study — Typographic anchor overlaid onto high-altitude tea plantation topography.
                  </span>
                </div>

                <div className="artwork-stage full-stage">
                  <div className="artwork-frame portrait-frame">
                    <img
                      src={ootyCover}
                      alt="The Explorer: Among the tea gardens of the Nilgiris full vertical cover"
                      className="artwork-img"
                      loading="lazy"
                    />
                  </div>
                  <span className="artwork-caption">
                    Complete Editorial Cover — Aerial winding road through lush terraces with serif editorial captioning.
                  </span>
                </div>
              </div>
            </article>

            {/* Sequence 4: Brand Identity & Tactile Artifact */}
            <article className="visual-exhibit-block exhibit-identity">
              <div className="exhibit-header">
                <span className="exhibit-tag">IDENTITY & TACTILE PRINT</span>
                <h2 className="exhibit-title">Personal Brand System & Tactile Objects</h2>
              </div>

              <div className="identity-diptych-grid">
                <div className="artwork-stage square-stage">
                  <div className="artwork-frame square-frame">
                    <img
                      src={creationCard}
                      alt="Creation of Adam artistic hand metaphor holding modern dark gradient Heer Patel identity card"
                      className="artwork-img"
                      loading="lazy"
                    />
                  </div>
                  <span className="artwork-caption">
                    Metaphor & Medium — Classical art framing the modern digital-first discipline taxonomy.
                  </span>
                </div>

                <div className="artwork-stage square-stage">
                  <div className="artwork-frame square-frame">
                    <img
                      src={visitingCardMockup}
                      alt="Physical business cards on natural travertine stone mockup showing front, back, and QR code"
                      className="artwork-img"
                      loading="lazy"
                    />
                  </div>
                  <span className="artwork-caption">
                    Physical Expression — Tactile matte dark stock with luminous cyan accents and QR portfolio link.
                  </span>
                </div>
              </div>
            </article>
          </section>

          {/* =================================================================== */}
          {/* SECTION 04 — EXPLORATION / ALTERNATE */}
          {/* =================================================================== */}
          <section className="project02-chapter chapter-exploration">
            <div className="chapter-marker">
              <span className="chapter-num">02</span>
              <span className="chapter-label">EXPLORATION & PROCESS</span>
            </div>

            <div className="editorial-statement-block">
              <h2 className="statement-quote">
                Typographic Evolution: Testing Scale & Contrast
              </h2>
              <div className="statement-context-body">
                <p>
                  Before finalizing the Nilgiris cover, multiple iterations explored title weight, letter tracking, and foreground hierarchy to test how heavy condensed typography balanced with expansive natural textures.
                </p>
              </div>
            </div>

            <div className="exploration-comparison-grid">
              <div className="artwork-stage exploration-item">
                <span className="exploration-badge">EARLIER EXPLORATION</span>
                <div className="artwork-frame">
                  <img
                    src={ootyCoverOld}
                    alt="Earlier Ooty cover exploration"
                    className="artwork-img"
                    loading="lazy"
                  />
                </div>
                <span className="artwork-caption">
                  Option 01 — Direct title placement testing baseline alignment against hill contours.
                </span>
              </div>

              <div className="artwork-stage exploration-item dominant-item">
                <span className="exploration-badge highlight-badge">TYPOGRAPHIC VARIATION</span>
                <div className="artwork-frame">
                  <img
                    src={ootyOption2Old}
                    alt="Ooty Image 2 Option 2 design exploration"
                    className="artwork-img"
                    loading="lazy"
                  />
                </div>
                <span className="artwork-caption">
                  Option 02 — High-density condensed type scale study testing depth separation.
                </span>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* SECTION 05 — SELECTED EARLIER WORK */}
          {/* =================================================================== */}
          <section className="project02-chapter chapter-earlier-work">
            <div className="chapter-marker">
              <span className="chapter-num">03</span>
              <span className="chapter-label">SELECTED EARLIER WORK</span>
            </div>

            <p className="section-lead-para">
              Archival visual communications spanning editorial layouts, publication covers, and physical collateral.
            </p>

            {/* Earlier Spread & Magazine */}
            <div className="earlier-work-stream">
              <div className="earlier-work-row">
                <div className="earlier-card">
                  <span className="earlier-meta">EDITORIAL SPREAD · COVER</span>
                  <div className="artwork-frame">
                    <img
                      src={coverOld}
                      alt="Selected earlier magazine cover"
                      className="artwork-img"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="earlier-card">
                  <span className="earlier-meta">EDITORIAL SPREAD · INTERIOR</span>
                  <div className="artwork-frame">
                    <img
                      src={page2Old}
                      alt="Selected earlier magazine interior page 2 spread"
                      className="artwork-img"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="earlier-work-row">
                <div className="earlier-card">
                  <span className="earlier-meta">PUBLICATION STUDY · CANADA</span>
                  <div className="artwork-frame">
                    <img
                      src={canadaCoverOld}
                      alt="Selected earlier Canada publication cover"
                      className="artwork-img"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="earlier-card">
                  <span className="earlier-meta">IDENTITY COLLATERAL · ITERATIONS</span>
                  <div className="dual-card-stack">
                    <div className="artwork-frame compact-frame">
                      <img
                        src={visitingCardPost1}
                        alt="Earlier visiting card post 1"
                        className="artwork-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="artwork-frame compact-frame">
                      <img
                        src={visitingCardPost2}
                        alt="Earlier visiting card post 2"
                        className="artwork-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* SECTION 06 — ACROSS FORMATS */}
          {/* =================================================================== */}
          <section className="project02-chapter chapter-formats">
            <div className="chapter-marker">
              <span className="chapter-num">04</span>
              <span className="chapter-label">ACROSS FORMATS</span>
            </div>

            <div className="formats-manifesto-strip">
              <span className="format-item">SOCIAL</span>
              <span className="format-dot" aria-hidden="true">·</span>
              <span className="format-item">EDITORIAL</span>
              <span className="format-dot" aria-hidden="true">·</span>
              <span className="format-item">IDENTITY</span>
              <span className="format-dot" aria-hidden="true">·</span>
              <span className="format-item">PRINT</span>
              <span className="format-dot" aria-hidden="true">·</span>
              <span className="format-item highlight">VISUAL COMMUNICATION</span>
            </div>

            <p className="formats-subtext">
              Unified by typographic clarity, controlled hierarchy, and respect for negative space across physical and digital mediums.
            </p>
          </section>

          {/* =================================================================== */}
          {/* SECTION 07 — EXIT */}
          {/* =================================================================== */}
          <footer className="project02-chapter project02-exit-chapter">
            <div className="exit-spatial-wrapper">
              <span className="exit-eyebrow">PORTFOLIO CONTINUATION</span>
              <h3 className="exit-prompt-title">End of Visual Communication</h3>
              <p className="exit-prompt-desc">
                Continue traveling through the selected work or return to previous chapters.
              </p>

              <div className="exit-nav-group">
                <button
                  className="exit-spatial-btn exit-prev-btn"
                  onClick={handleBackToProject01}
                  aria-label="Go back to Project 01"
                  type="button"
                >
                  <span className="exit-arrow-prev" aria-hidden="true">←</span>
                  <span>GO BACK TO PROJECT 01</span>
                </button>

                <button
                  className="exit-spatial-btn exit-next-btn"
                  onClick={handleGoToProject03}
                  aria-label="Go to Project 03"
                  type="button"
                >
                  <span>GO TO PROJECT 03</span>
                  <span className="exit-arrow" aria-hidden="true">→</span>
                </button>
              </div>

              <button
                className="exit-spatial-sublink"
                onClick={handleTriggerExit}
                aria-label="Return to portfolio space"
                type="button"
              >
                RETURN TO PORTFOLIO SPACE
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
