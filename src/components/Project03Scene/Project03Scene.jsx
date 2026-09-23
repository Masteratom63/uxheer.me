import React, { useEffect, useRef, useState } from 'react';
import Project02Particles from '../Project02Scene/Project02Particles';
import './Project03Scene.css';

// Porch Private Assets
import firstSketchImg from '../../assets/projects/porch-private/first-sketch.jpg';
import firstDigitalDraftImg from '../../assets/projects/porch-private/first-digital-draft.jpg';
import modifiedDigitalDraftImg from '../../assets/projects/porch-private/modified-digital-draft.jpg';
import finalDesignDraftImg from '../../assets/projects/porch-private/final-design-draft.png';
import finalDesignColourImg from '../../assets/projects/porch-private/final-design-colour.png';
import actualPorchImg from '../../assets/projects/porch-private/actual-porch-environment.jpg';
import contextualPresentationImg from '../../assets/projects/porch-private/contextual-presentation.jpg';

/**
 * Project03Scene Component — PORCH PRIVATE
 * 
 * PRODUCT / OBJECT / INDUSTRIAL DESIGN
 * 
 * A physical product concept that disguises secure delivery storage
 * as a functional porch bench, allowing food and package deliveries
 * to integrate naturally into residential porch architecture.
 */
export default function Project03Scene({
  lifecycleState = 'CLOSED', // 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  onOpenComplete,
  onExitTrigger,
  onExitComplete,
  onBackToProject02,
}) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Trigger exit wave transition (OPEN -> CLOSING)
  const handleTriggerExit = () => {
    if (lifecycleState === 'CLOSING' || lifecycleState === 'CLOSED') return;
    if (onExitTrigger) {
      onExitTrigger();
    }
  };

  // Trigger smooth transition back toward Project 02
  const handleBackToProject02 = () => {
    if (lifecycleState === 'CLOSING' || lifecycleState === 'CLOSED') return;
    if (onBackToProject02) {
      onBackToProject02();
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

  // Exclusive local scroll calculation (drives Project03 local particle camera)
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
      className={`project03-scene-root state-${lifecycleState.toLowerCase()}`}
      role="region"
      aria-label="Project 03: Porch Private"
    >
      {/* 1. Viewport-fixed Local 3D Particle Canvas with Entry/Exit Ripple Waves (Reused) */}
      <Project02Particles
        scrollProgress={scrollProgress}
        lifecycleState={lifecycleState}
        onOpenComplete={onOpenComplete}
        onExitComplete={onExitComplete}
      />

      {/* 2. Subtle Ambient Vignette & Spatial Atmosphere */}
      <div className="project03-ambient-backdrop" aria-hidden="true" />

      {/* 3. Sticky Viewport Close Button (Top-Right, matching portfolio standard) */}
      <button
        className="project03-spatial-dismiss"
        onClick={handleTriggerExit}
        aria-label="Return to portfolio space"
        type="button"
      >
        <span className="dismiss-icon" aria-hidden="true">✕</span>
        <span className="dismiss-label">RETURN</span>
      </button>

      {/* 4. Dedicated Content Scroll Viewport */}
      <div
        ref={containerRef}
        className="project03-scroll-viewport"
        onScroll={handleScroll}
      >
        <div className="project03-editorial-content">
          {/* =================================================================== */}
          {/* 01 — ENTRY */}
          {/* =================================================================== */}
          <header className="project03-chapter intro-chapter">
            <div className="project03-intro-meta">
              <span className="project03-meta-pill">PRODUCT / OBJECT / INDUSTRIAL DESIGN</span>
            </div>

            <h1 className="project03-headline-hero">
              PORCH PRIVATE
            </h1>

            <p className="project03-statement-lead">
              “A physical product concept that turns package storage into part of the porch.”
            </p>

            <div className="project03-scroll-cue" aria-hidden="true">
              <span className="minimal-scroll-text">SCROLL ↓</span>
              <span className="minimal-scroll-line" />
            </div>
          </header>

          {/* =================================================================== */}
          {/* 02 — THE PROBLEM */}
          {/* =================================================================== */}
          <section className="project03-chapter chapter-problem">
            <div className="chapter-header-row">
              <span className="chapter-number">01</span>
              <h2 className="chapter-title">THE PROBLEM</h2>
            </div>

            <p className="project03-prose">
              “Deliveries are often left outside the front door, exposed to weather, visibility, and unwanted attention.”
            </p>

            <div className="project03-media-frame context-porch-frame">
              <img
                src={actualPorchImg}
                alt="Snow-covered residential porch demonstrating real-world weather and delivery exposure"
                className="project03-image"
                loading="eager"
              />
              <div className="project03-caption-row">
                <span className="caption-tag">ENVIRONMENT</span>
                <span className="caption-text">Residential porch setting under extreme winter weather conditions</span>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* 03 — EXPLORATION */}
          {/* =================================================================== */}
          <section className="project03-chapter chapter-exploration">
            <div className="chapter-header-row">
              <span className="chapter-number">02</span>
              <h2 className="chapter-title">EXPLORATION</h2>
            </div>

            <p className="project03-prose">
              “The first ideas explored how delivery storage could become something that naturally belonged on a porch.”
            </p>

            <div className="project03-media-frame sketch-frame">
              <img
                src={firstSketchImg}
                alt="Initial sketchbook page exploring Porch Box multi-compartment delivery concepts"
                className="project03-image sketch-image"
                loading="lazy"
              />
              <div className="project03-caption-row">
                <span className="caption-tag">EARLY THINKING</span>
                <span className="caption-text">Initial ideation notebook: cedarwood structure, thermal food insulation & seating function</span>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* 04 — DEVELOPING THE FORM */}
          {/* =================================================================== */}
          <section className="project03-chapter chapter-development">
            <div className="chapter-header-row">
              <span className="chapter-number">03</span>
              <h2 className="chapter-title">DEVELOPING THE FORM</h2>
            </div>

            <p className="project03-prose">
              “The form developed around a simple idea: conceal the delivery space inside something that already belongs in the home’s entry environment.”
            </p>

            {/* Spatial Progression Layout (Progression over standard grid) */}
            <div className="development-progression-track">
              {/* Stage 1: Digital Volume & Compartment Partitioning */}
              <div className="development-stage stage-early">
                <div className="stage-meta-indicator">
                  <span className="stage-step-dot" />
                  <span className="stage-step-label">STAGE 01 — COMPARTMENT PARTITIONING</span>
                </div>
                <div className="project03-media-frame digital-draft-frame">
                  <img
                    src={firstDigitalDraftImg}
                    alt="Early digital draft of vertical 4-tier storage cabinet"
                    className="project03-image"
                    loading="lazy"
                  />
                  <div className="project03-caption-row">
                    <span className="caption-tag">DIGITAL MODEL</span>
                    <span className="caption-text">4-compartment vertical partitioning separating food deliveries from parcels</span>
                  </div>
                </div>
              </div>

              {/* Transition Indicator */}
              <div className="progression-connector" aria-hidden="true">
                <span className="connector-line" />
                <span className="connector-arrow">↓</span>
              </div>

              {/* Stage 2: Insulation & Security Integration */}
              <div className="development-stage stage-iteration">
                <div className="stage-meta-indicator">
                  <span className="stage-step-dot" />
                  <span className="stage-step-label">STAGE 02 — INSULATION & INTEGRATION</span>
                </div>
                <div className="project03-media-frame digital-draft-frame">
                  <img
                    src={modifiedDigitalDraftImg}
                    alt="Modified digital iteration showing thermal insulation and concealed battery integration"
                    className="project03-image"
                    loading="lazy"
                  />
                  <div className="project03-caption-row">
                    <span className="caption-tag">STRUCTURAL EVOLUTION</span>
                    <span className="caption-text">Integrated thermal food insulation, internal battery housing, and secure ground anchoring</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* 05 — REFINING THE OBJECT */}
          {/* =================================================================== */}
          <section className="project03-chapter chapter-refinement">
            <div className="chapter-header-row">
              <span className="chapter-number">04</span>
              <h2 className="chapter-title">REFINING THE OBJECT</h2>
            </div>

            <p className="project03-prose">
              “Iterations refined the proportions, storage arrangement, and relationship between the bench and its concealed compartments.”
            </p>

            <div className="project03-media-frame refinement-frame">
              <img
                src={finalDesignDraftImg}
                alt="Technical perspective line drawing of refined dual-drawer bench with seating cushion"
                className="project03-image line-drawing-image"
                loading="lazy"
              />
              <div className="project03-caption-row">
                <span className="caption-tag">FORM REFINEMENT</span>
                <span className="caption-text">Horizontal bench architecture, contoured seating cushion, and recessed drawer pulls</span>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* 06 — THE FINAL OBJECT */}
          {/* =================================================================== */}
          <section className="project03-chapter chapter-final-object">
            <div className="chapter-header-row">
              <span className="chapter-number">05</span>
              <div className="final-object-title-group">
                <span className="final-design-tag">FINAL DESIGN</span>
                <h2 className="chapter-title">PORCH PRIVATE</h2>
              </div>
            </div>

            {/* Hero Exhibition Presentation for the Final Object */}
            <div className="final-object-hero-stage">
              <div className="final-object-glow-backdrop" aria-hidden="true" />
              <div className="project03-media-frame hero-product-frame">
                <img
                  src={finalDesignColourImg}
                  alt="Final rendered design of Porch Private showing cedarwood body and grey seating cushion"
                  className="project03-image hero-product-image"
                  loading="lazy"
                />
              </div>
              <div className="project03-caption-row center-caption">
                <span className="caption-tag">COMPLETED CONCEPT</span>
                <span className="caption-text">Disguising secure delivery storage as residential porch seating furniture</span>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* 07 — IN CONTEXT */}
          {/* =================================================================== */}
          <section className="project03-chapter chapter-context">
            <div className="chapter-header-row">
              <span className="chapter-number">06</span>
              <h2 className="chapter-title">IN CONTEXT</h2>
            </div>

            <p className="project03-prose context-lead">
              “One object, different homes, different conditions.”
            </p>

            <div className="project03-media-frame cinematic-context-frame">
              <img
                src={contextualPresentationImg}
                alt="Porch Private presented across four residential architectures and environmental conditions"
                className="project03-image cinematic-context-image"
                loading="lazy"
              />
              <div className="project03-caption-row">
                <span className="caption-tag">ARCHITECTURAL ADAPTATION</span>
                <span className="caption-text">Brick porch daylight, rainstorm siding, winter snow log cabin, and dusk stone entry</span>
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* 08 — EXIT */}
          {/* =================================================================== */}
          <footer className="project03-chapter project03-exit-chapter">
            <div className="exit-spatial-wrapper">
              <p className="project03-exit-quote">
                “Designed to make delivery storage feel like part of the place it belongs.”
              </p>
              <h3 className="exit-prompt-title">END OF PORCH PRIVATE</h3>

              <div className="exit-nav-group">
                <button
                  className="exit-spatial-btn exit-prev-btn"
                  onClick={handleBackToProject02}
                  aria-label="Go back to Project 02"
                  type="button"
                >
                  <span className="exit-arrow-prev" aria-hidden="true">←</span>
                  <span>PROJECT 02</span>
                </button>

                <button
                  className="exit-spatial-btn exit-home-btn"
                  onClick={handleTriggerExit}
                  aria-label="Return to portfolio space"
                  type="button"
                >
                  <span>PORTFOLIO SPACE</span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
