import React, { useEffect, useRef, useState } from 'react';
import Project01Particles from './Project01Particles';
import PeopleCarousel from './PeopleCarousel';
import './Project01Scene.css';

// Project Assets
import travelRouteMap from '../../assets/projects/scotiabank-scene/travel-route-map.png';
import cardOffers from '../../assets/projects/scotiabank-scene/card-offers.png';
import profileAccount from '../../assets/projects/scotiabank-scene/profile-account.png';
import earnMoreOnboarding from '../../assets/projects/scotiabank-scene/earn-more-onboarding.png';
import cardPointsBarcode from '../../assets/projects/scotiabank-scene/card-points-barcode.png';
import discoverRewardsMap from '../../assets/projects/scotiabank-scene/discover-rewards-map.png';
import homeDashboard from '../../assets/projects/scotiabank-scene/home-dashboard.png';
import figmaCanvasOverview from '../../assets/projects/scotiabank-scene/figma-canvas-overview.png';
import figmaFlowHierarchy from '../../assets/projects/scotiabank-scene/figma-flow-hierarchy.png';
import rewardsSpendPoints from '../../assets/projects/scotiabank-scene/rewards-spend-points.png';
import journeyCommuter from '../../assets/projects/scotiabank-scene/journey-commuter.png';
import lofiWireframesFlow from '../../assets/projects/scotiabank-scene/lofi-wireframes-flow.png';
import hifiFlowScreens from '../../assets/projects/scotiabank-scene/hifi-flow-screens.png';
import lofiWireframesRow from '../../assets/projects/scotiabank-scene/lofi-wireframes-row.png';
import whiteboardSketches from '../../assets/projects/scotiabank-scene/whiteboard-sketches.jpg';
import scenePlusLogo from '../../assets/projects/scotiabank-scene/scene-plus-logo.png';
import personaCommuter from '../../assets/projects/scotiabank-scene/persona-commuter.png';
import journeyCopycat from '../../assets/projects/scotiabank-scene/journey-copycat.png';
import personaCopycat from '../../assets/projects/scotiabank-scene/persona-copycat.png';

/**
 * Project01Scene Component
 * 
 * Immersive project experience for SCOTIABANK SCENE+.
 * Integrated directly into uxheer.me's spatial universe with dedicated local particles.
 */
export default function Project01Scene({
  lifecycleState = 'CLOSED', // 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  onOpenComplete,
  onExitTrigger,
  onExitComplete,
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

  // Scroll to top on new open lifecycle
  useEffect(() => {
    if (lifecycleState === 'OPENING') {
      setScrollProgress(0);
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

  // Exclusive local scroll calculation (drives Project01 local particle camera)
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
    const fraction = Math.min(1, Math.max(0, el.scrollTop / maxScroll));
    setScrollProgress(fraction);
  };

  if (lifecycleState === 'CLOSED') return null;

  const figmaEmbedUrl = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FUtscEjwxnDJG6ZstkCHyTY%2FScene---Lo-fi-Wireframes%3Ftype%3Ddesign%26node-id%3D579-3275%26t%3D1QEyExtRq3VOIFyc-1%26scaling%3Dcontain%26page-id%3D0%253A1%26starting-point-node-id%3D579%253A3275";
  const figmaDirectUrl = "https://www.figma.com/proto/UtscEjwxnDJG6ZstkCHyTY/Scene---Lo-fi-Wireframes?type=design&node-id=579-3275&t=1QEyExtRq3VOIFyc-1&scaling=contain&page-id=0%3A1&starting-point-node-id=579%3A3275";

  return (
    <div
      className={`project-scene-root state-${lifecycleState.toLowerCase()}`}
      role="region"
      aria-label="Project 01: Scotiabank Scene+"
    >
      {/* 1. Viewport-fixed Local 3D Particle Canvas */}
      <Project01Particles
        scrollProgress={scrollProgress}
        lifecycleState={lifecycleState}
        onOpenComplete={onOpenComplete}
        onExitComplete={onExitComplete}
      />

      {/* 2. Sticky Viewport Close Button (Guaranteed fixed to viewport top-right) */}
      <button
        className="project-spatial-dismiss"
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
        className="project-scroll-viewport"
        onScroll={handleScroll}
      >
        <div className="project-immersive-content">
        {/* =================================================================== */}
        {/* PROJECT INTRO */}
        {/* =================================================================== */}
        <header className="project-chapter intro-chapter">
          <div className="project-intro-brand-row">
            <img
              src={scenePlusLogo}
              alt="Scene+ Logo"
              className="project-brand-mark"
              loading="eager"
            />
            <span className="project-meta-pill">UX / UI / PRODUCT DESIGN</span>
          </div>

          <h1 className="project-headline-hero">
            SCOTIABANK SCENE+
          </h1>

          <p className="project-statement-lead">
            Reimagining a banking experience for a younger generation.
          </p>

          {/* Minimal Vertical Scroll Prompt (Exact match to homepage language) */}
          <div className="project-vertical-scroll-cue" aria-hidden="true">
            <span className="minimal-scroll-text">SCROLL</span>
            <span className="minimal-scroll-line" />
          </div>
        </header>

        {/* =================================================================== */}
        {/* CHAPTER 01 — THE QUESTION */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-question">
          <div className="chapter-marker">
            <span className="chapter-num">01</span>
            <span className="chapter-label">THE QUESTION</span>
          </div>

          <div className="editorial-statement-block">
            <h2 className="statement-quote">
              How might a bank become relevant to people who are just beginning their financial lives?
            </h2>

            <div className="statement-context-body">
              <p>
                Scotiabank wanted to attract a younger audience and encourage deeper engagement with its banking services and tools.
              </p>
              <p>
                The primary demographic was people aged approximately 18–24 who were entering critical milestones such as their first job, first car, postsecondary education, or living independently for the first time.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 02 — WE STARTED WITH ASSUMPTIONS */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-assumptions">
          <div className="chapter-marker">
            <span className="chapter-num">02</span>
            <span className="chapter-label">WE STARTED WITH ASSUMPTIONS</span>
          </div>

          <div className="assumptions-narrative">
            <p className="section-lead-para">
              Our team initially explored conventional fintech assumptions:
            </p>

            <ul className="assumptions-list">
              <li>Personalized financial experiences</li>
              <li>Detailed budgeting and expense categorizations</li>
              <li>Financial tracking and automated money management</li>
              <li>Savings targets and gamified progress bars</li>
              <li>Scene rewards and student-tailored banking packages</li>
            </ul>

            <div className="artifact-frame single-artifact">
              <img
                src={whiteboardSketches}
                alt="Early ideation whiteboard sketches exploring initial layout concepts"
                className="project-artifact-img"
                loading="lazy"
              />
              <span className="artifact-caption">
                Early whiteboard sketches exploring initial dashboard, map, and points concepts.
              </span>
            </div>

            <div className="narrative-pivot-statement">
              <span className="pivot-line" aria-hidden="true" />
              <h3 className="pivot-text">
                But research changed the direction.
              </h3>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 03 — RESEARCH (Reworked: Methodology & Process) */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-research">
          <div className="chapter-marker">
            <span className="chapter-num">03</span>
            <span className="chapter-label">RESEARCH</span>
          </div>

          <h3 className="research-process-title">How we looked</h3>
          <p className="section-lead-para">
            We investigated early financial habits through a structured discovery process—moving from broad inquiries to deep qualitative insights and behavioral synthesis.
          </p>

          {/* Structured Research Methodology Sequence */}
          <div className="research-methodology-track">
            <div className="method-step-card">
              <span className="method-step-num">01</span>
              <h4 className="method-step-name">SURVEY</h4>
              <span className="method-step-metric">33 Responses</span>
              <p className="method-step-desc">
                Quantitative mapping of primary banking apps, spending habits, and reward awareness.
              </p>
            </div>

            <div className="method-track-arrow" aria-hidden="true">→</div>

            <div className="method-step-card">
              <span className="method-step-num">02</span>
              <h4 className="method-step-name">INTERVIEWS</h4>
              <span className="method-step-metric">12 In-depth Sessions</span>
              <p className="method-step-desc">
                One-on-one sessions exploring financial trade-offs, anxieties, and daily routines.
              </p>
            </div>

            <div className="method-track-arrow" aria-hidden="true">→</div>

            <div className="method-step-card">
              <span className="method-step-num">03</span>
              <h4 className="method-step-name">PATTERNS</h4>
              <span className="method-step-metric">Behavior Synthesis</span>
              <p className="method-step-desc">
                Uncovering mental budgeting shortcuts, transit costs, and guilt around non-essential spend.
              </p>
            </div>

            <div className="method-track-arrow" aria-hidden="true">→</div>

            <div className="method-step-card">
              <span className="method-step-num">04</span>
              <h4 className="method-step-name">DESIGN QUESTIONS</h4>
              <span className="method-step-metric">Opportunity Framing</span>
              <p className="method-step-desc">
                Translating behavioral friction into daily value: transit rewards, liquid points, and clarity.
              </p>
            </div>
          </div>

          {/* Research Findings */}
          <div className="research-findings-stream">
            <div className="finding-row">
              <span className="finding-bullet" />
              <p className="finding-text">Mobile banking was already the norm.</p>
            </div>
            <div className="finding-row">
              <span className="finding-bullet" />
              <p className="finding-text">Immediate financial needs mattered far more than long-term planning.</p>
            </div>
            <div className="finding-row">
              <span className="finding-bullet" />
              <p className="finding-text">Many participants relied on mental notes rather than structured budgeting.</p>
            </div>
            <div className="finding-row">
              <span className="finding-bullet" />
              <p className="finding-text">Spending could create persistent guilt or stress.</p>
            </div>
            <div className="finding-row">
              <span className="finding-bullet" />
              <p className="finding-text">Unexpected expenses provoked real financial anxiety.</p>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 04 — PEOPLE (Balanced Desktop Gallery + Clean Mobile Stack) */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-people">
          <div className="chapter-marker">
            <span className="chapter-num">04</span>
            <span className="chapter-label">PEOPLE</span>
          </div>

          <p className="section-lead-para">
            Synthesized research into two core personas representing different behavioral archetypes and friction points.
          </p>

          <div className="personas-deep-dive">
            {/* Persona 1: The Commuter / Researcher */}
            <article className="persona-spatial-stage">
              <header className="persona-stage-header">
                <span className="persona-badge">ARCHETYPE 01</span>
                <h3 className="persona-title">The Commuter / Researcher</h3>
                <p className="persona-subtitle">
                  3rd Year UX Student • Wilfrid Laurier University • Balances tight commute costs with daily essentials.
                </p>
              </header>

              <PeopleCarousel
                personaImg={personaCommuter}
                personaAlt="Persona Profile: The Commuter / Researcher"
                personaCaption="Persona Profile — The Commuter / Researcher"
                journeyImg={journeyCommuter}
                journeyAlt="Journey Map: The Commuter / Researcher"
                journeyCaption="Experience Journey Map — Awareness to Daily Usage"
              />
            </article>

            {/* Persona 2: The Copycat */}
            <article className="persona-spatial-stage">
              <header className="persona-stage-header">
                <span className="persona-badge">ARCHETYPE 02</span>
                <h3 className="persona-title">The Copycat</h3>
                <p className="persona-subtitle">
                  2nd Year Business Student • Wilfrid Laurier University • Driven by peer recommendations and tangible rewards.
                </p>
              </header>

              <PeopleCarousel
                personaImg={personaCopycat}
                personaAlt="Persona Profile: The Copycat"
                personaCaption="Persona Profile — The Copycat"
                journeyImg={journeyCopycat}
                journeyAlt="Journey Map: The Copycat"
                journeyCaption="Experience Journey Map — Referral & Social Rewards"
              />
            </article>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 05 — THE SHIFT */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-shift">
          <div className="chapter-marker">
            <span className="chapter-num">05</span>
            <span className="chapter-label">THE SHIFT</span>
          </div>

          <div className="shift-triad-composition">
            <div className="shift-stage-block">
              <span className="shift-tag">STAGE 01</span>
              <h3 className="shift-heading">WHAT WE THOUGHT</h3>
              <p className="shift-desc">
                Young adults wanted automated budgeting spreadsheets, complex categorization graphs, and disciplined savings locks.
              </p>
            </div>

            <div className="shift-arrow-indicator" aria-hidden="true">↓</div>

            <div className="shift-stage-block active-contrast">
              <span className="shift-tag">STAGE 02</span>
              <h3 className="shift-heading">WHAT WE LEARNED</h3>
              <p className="shift-desc">
                Rigid budgets induced guilt and stress. Students prioritized day-to-day liquidity, relief on transit fares, and discounts on routine groceries over abstract long-term charts.
              </p>
            </div>

            <div className="shift-arrow-indicator" aria-hidden="true">↓</div>

            <div className="shift-stage-block highlight-design">
              <span className="shift-tag">STAGE 03</span>
              <h3 className="shift-heading">WHAT WE DESIGNED</h3>
              <p className="shift-desc">
                A seamless rewards ecosystem anchored to everyday life—earning points on public transit, unlocking instant discounts at nearby grocery stores, and making banking feel rewarding rather than punitive.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 06 — BUILDING THE EXPERIENCE */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-pillars">
          <div className="chapter-marker">
            <span className="chapter-num">06</span>
            <span className="chapter-label">BUILDING THE EXPERIENCE</span>
          </div>

          <p className="section-lead-para">
            Four foundational pillars architected around the user's daily financial routine.
          </p>

          <div className="pillars-spatial-list">
            {/* Pillar 1: BANKING */}
            <article className="pillar-stage-card">
              <div className="pillar-info-pane">
                <span className="pillar-index">01</span>
                <h3 className="pillar-title">BANKING</h3>
                <p className="pillar-summary">
                  Immediate visibility of points balances, digital Scene barcode access, and friction-free card management with transparent account verification.
                </p>
              </div>
              <div className="pillar-visual-pane dual-screens">
                <div className="screen-frame">
                  <img
                    src={cardPointsBarcode}
                    alt="Digital Scene+ Card & Barcode"
                    className="pillar-screen-img"
                    loading="lazy"
                  />
                  <span className="screen-tag">Digital Card & History</span>
                </div>
                <div className="screen-frame">
                  <img
                    src={cardOffers}
                    alt="Card Offers browsing"
                    className="pillar-screen-img"
                    loading="lazy"
                  />
                  <span className="screen-tag">Scotiabank Card Offers</span>
                </div>
              </div>
            </article>

            {/* Pillar 2: SCENE */}
            <article className="pillar-stage-card">
              <div className="pillar-info-pane">
                <span className="pillar-index">02</span>
                <h3 className="pillar-title">SCENE REWARDS</h3>
                <p className="pillar-summary">
                  Consolidated redemption paths across groceries, dining, movies, retail, and credit balances. Points become liquid everyday value.
                </p>
              </div>
              <div className="pillar-visual-pane single-screen">
                <div className="screen-frame">
                  <img
                    src={rewardsSpendPoints}
                    alt="Spend Points categories and trending local rewards"
                    className="pillar-screen-img"
                    loading="lazy"
                  />
                  <span className="screen-tag">Spend Your Points</span>
                </div>
              </div>
            </article>

            {/* Pillar 3: EXPLORE */}
            <article className="pillar-stage-card">
              <div className="pillar-info-pane">
                <span className="pillar-index">03</span>
                <h3 className="pillar-title">EXPLORE</h3>
                <p className="pillar-summary">
                  Contextual discovery map spotlighting nearby partner locations, grocery offers, and dining spots with filtered map pins and instant directions.
                </p>
              </div>
              <div className="pillar-visual-pane single-screen">
                <div className="screen-frame">
                  <img
                    src={discoverRewardsMap}
                    alt="Discover Rewards Map with partner pins"
                    className="pillar-screen-img"
                    loading="lazy"
                  />
                  <span className="screen-tag">Discover Rewards Map</span>
                </div>
              </div>
            </article>

            {/* Pillar 4: TRAVEL */}
            <article className="pillar-stage-card">
              <div className="pillar-info-pane">
                <span className="pillar-index">04</span>
                <h3 className="pillar-title">TRAVEL</h3>
                <p className="pillar-summary">
                  Transforming costly daily commutes into rewarded journeys—earning Scene+ points passively on transit routes across regional corridors.
                </p>
              </div>
              <div className="pillar-visual-pane single-screen">
                <div className="screen-frame">
                  <img
                    src={travelRouteMap}
                    alt="Travel Route Map with Scotiabank points banner"
                    className="pillar-screen-img"
                    loading="lazy"
                  />
                  <span className="screen-tag">Transit Route Rewards</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 07 — ITERATION */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-iteration">
          <div className="chapter-marker">
            <span className="chapter-num">07</span>
            <span className="chapter-label">ITERATION</span>
          </div>

          <div className="iteration-progression-bar" aria-label="Design Evolution Sequence">
            <span className="prog-step">SKETCH</span>
            <span className="prog-arrow">→</span>
            <span className="prog-step">WIREFRAME</span>
            <span className="prog-arrow">→</span>
            <span className="prog-step">LOW FIDELITY</span>
            <span className="prog-arrow">→</span>
            <span className="prog-step">MEDIUM FIDELITY</span>
            <span className="prog-arrow">→</span>
            <span className="prog-step active">HIGH FIDELITY</span>
          </div>

          <div className="iteration-gallery">
            <div className="artifact-frame wide-artifact">
              <img
                src={lofiWireframesRow}
                alt="Wireframe architecture progression row"
                className="project-artifact-img"
                loading="lazy"
              />
              <span className="artifact-caption">
                Wireframe layout exploration: Home, Rewards, Travel, Card, Account, and Map modules.
              </span>
            </div>

            <div className="artifact-frame wide-artifact">
              <img
                src={figmaFlowHierarchy}
                alt="Full prototype flow hierarchy containing 100+ screens"
                className="project-artifact-img"
                loading="lazy"
              />
              <span className="artifact-caption">
                Comprehensive prototype architecture covering over 100 screen states and user flows.
              </span>
            </div>

            <div className="artifact-frame wide-artifact">
              <img
                src={figmaCanvasOverview}
                alt="Figma canvas overview with complete design system and responsive screens"
                className="project-artifact-img"
                loading="lazy"
              />
              <span className="artifact-caption">
                Figma production canvas: unified design tokens, components, and high-fidelity layouts.
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 08 — TESTING */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-testing">
          <div className="chapter-marker">
            <span className="chapter-num">08</span>
            <span className="chapter-label">TESTING</span>
          </div>

          <div className="testing-method-strip">
            <span className="method-pill">CARD SORTING</span>
            <span className="method-pill">TREE TESTING</span>
            <span className="method-pill">USABILITY TESTING</span>
            <span className="method-pill">EYE TRACKING</span>
            <span className="method-pill">THINK ALOUD</span>
          </div>

          <div className="testing-philosophy-quote">
            <h3 className="philosophy-text">
              We designed → we tested → we learned → we changed.
            </h3>
            <p className="philosophy-desc">
              Every prototype iteration was evaluated against realistic student user tasks to expose friction, comprehension hurdles, and visual ambiguity before finalizing code and design specs.
            </p>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 09 — WHAT CHANGED */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-changes">
          <div className="chapter-marker">
            <span className="chapter-num">09</span>
            <span className="chapter-label">WHAT CHANGED</span>
          </div>

          <p className="section-lead-para">
            Key refinements directly triggered by usability test insights:
          </p>

          <div className="changes-grid">
            <div className="change-card">
              <span className="change-num">01</span>
              <h4 className="change-title">Unclaimed / Missed Points</h4>
              <p className="change-detail">
                Users misunderstood the phrasing around "missed points," feeling they were being penalized. Refined to positive, actionable "Redeem Unclaimed PTS" with clear reward paths.
              </p>
            </div>

            <div className="change-card">
              <span className="change-num">02</span>
              <h4 className="change-title">Interactive Map Clutter</h4>
              <p className="change-detail">
                Participants reported feeling overwhelmed by dense pin overlays. Streamlined controls, added distinct category filters (Grocery, Pharmacy, Gas), and clarified destination cards.
              </p>
            </div>

            <div className="change-card">
              <span className="change-num">03</span>
              <h4 className="change-title">Offer Affordances</h4>
              <p className="change-detail">
                Users struggled to distinguish clickable merchant offers from static banners. Enhanced contrast, added explicit "View Offer" buttons, and increased touch targets.
              </p>
            </div>

            <div className="change-card">
              <span className="change-num">04</span>
              <h4 className="change-title">Travel Section Cohesion</h4>
              <p className="change-detail">
                Early testers felt transit tracking seemed like an isolated third-party utility. Harmonized typography, colour palettes, and bottom navigation with the core banking interface.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 10 — NOT EVERYTHING SURVIVED */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-survived">
          <div className="chapter-marker">
            <span className="chapter-num">10</span>
            <span className="chapter-label">NOT EVERYTHING SURVIVED</span>
          </div>

          <div className="survived-flow-status">
            <span className="status-step">DESIGNED</span>
            <span className="status-arrow">→</span>
            <span className="status-step">TESTED</span>
            <span className="status-arrow">→</span>
            <span className="status-step">QUESTIONED</span>
            <span className="status-arrow">→</span>
            <span className="status-step removed">REMOVED</span>
          </div>

          <div className="survived-case-body">
            <div className="survived-explanation">
              <h3 className="case-title">The XP Gamification System</h3>
              <p>
                We designed an experience-point level-up progression (e.g. "Level 15 — 2,570 pts out of 3,000") intended to boost daily app engagement.
              </p>
              <p>
                During usability testing, participants found the gaming metaphor confusing when managing real money. It added cognitive overhead without delivering practical financial clarity.
              </p>
              <p className="case-verdict">
                Testing confirmed that honesty and direct liquidity mattered more than artificial levels. The XP mechanics were consciously cut from the final release.
              </p>
            </div>

            <div className="artifact-frame survived-artifact">
              <img
                src={hifiFlowScreens}
                alt="High fidelity screens showing the tested and removed Level 15 XP Rewards bar"
                className="project-artifact-img"
                loading="lazy"
              />
              <span className="artifact-caption">
                Tested & Removed: The Level 15 XP progression bar (right panel) that was eliminated after user testing.
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 11 — THE FINAL EXPERIENCE */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-final-climax">
          <div className="chapter-marker">
            <span className="chapter-num">11</span>
            <span className="chapter-label">THE FINAL EXPERIENCE</span>
          </div>

          <p className="section-lead-para">
            The finished mobile product: an intuitive, unified banking and lifestyle rewards ecosystem.
          </p>

          <div className="cinematic-screen-flow">
            {/* 1. Home Dashboard */}
            <div className="cinematic-stage-item">
              <div className="cinematic-meta">
                <span className="cinematic-index">01</span>
                <h3 className="cinematic-name">HOME</h3>
                <p className="cinematic-desc">
                  Personalized welcome, points summary, instant unclaimed PTS redemption, and curated nearby merchant offers.
                </p>
              </div>
              <div className="cinematic-device">
                <img
                  src={homeDashboard}
                  alt="Home Dashboard Screen"
                  className="final-screen-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 2. Scene / Rewards */}
            <div className="cinematic-stage-item">
              <div className="cinematic-meta">
                <span className="cinematic-index">02</span>
                <h3 className="cinematic-name">SCENE / REWARDS</h3>
                <p className="cinematic-desc">
                  Intuitive categories for spending points—from dining and entertainment to grocery discounts and direct statement credits.
                </p>
              </div>
              <div className="cinematic-device">
                <img
                  src={rewardsSpendPoints}
                  alt="Rewards Spend Your Points Screen"
                  className="final-screen-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 3. Discover Rewards Map */}
            <div className="cinematic-stage-item">
              <div className="cinematic-meta">
                <span className="cinematic-index">03</span>
                <h3 className="cinematic-name">EXPLORE</h3>
                <p className="cinematic-desc">
                  Live merchant map with instant category toggles, walking radius indicators, and one-tap transit rewards integration.
                </p>
              </div>
              <div className="cinematic-device">
                <img
                  src={discoverRewardsMap}
                  alt="Discover Rewards Map Screen"
                  className="final-screen-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 4. Travel Points Map */}
            <div className="cinematic-stage-item">
              <div className="cinematic-meta">
                <span className="cinematic-index">04</span>
                <h3 className="cinematic-name">TRAVEL</h3>
                <p className="cinematic-desc">
                  Route-based rewards converting essential student commutes between Brantford and Hamilton into passive banking points.
                </p>
              </div>
              <div className="cinematic-device">
                <img
                  src={travelRouteMap}
                  alt="Travel Points Route Map Screen"
                  className="final-screen-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 5. Banking / Card */}
            <div className="cinematic-stage-item">
              <div className="cinematic-meta">
                <span className="cinematic-index">05</span>
                <h3 className="cinematic-name">BANKING & CARD</h3>
                <p className="cinematic-desc">
                  In-store digital barcode, real-time balance calculations, recent reward transactions, and active promotion codes.
                </p>
              </div>
              <div className="cinematic-device">
                <img
                  src={cardPointsBarcode}
                  alt="Scene+ Card & Points Barcode Screen"
                  className="final-screen-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 6. Onboarding */}
            <div className="cinematic-stage-item">
              <div className="cinematic-meta">
                <span className="cinematic-index">06</span>
                <h3 className="cinematic-name">ONBOARDING</h3>
                <p className="cinematic-desc">
                  Frictionless signup allowing new users to join Scotiabank and activate rewards in just a few quick taps.
                </p>
              </div>
              <div className="cinematic-device">
                <img
                  src={earnMoreOnboarding}
                  alt="Earn More Points Onboarding Screen"
                  className="final-screen-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 7. Card Offers */}
            <div className="cinematic-stage-item">
              <div className="cinematic-meta">
                <span className="cinematic-index">07</span>
                <h3 className="cinematic-name">CARD BROWSING</h3>
                <p className="cinematic-desc">
                  Curated credit and debit offerings comparing student perks, Scene+ Visa benefits, and sign-up reward accelerators.
                </p>
              </div>
              <div className="cinematic-device">
                <img
                  src={cardOffers}
                  alt="Card Offers Browsing Screen"
                  className="final-screen-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 8. Profile & Account */}
            <div className="cinematic-stage-item">
              <div className="cinematic-meta">
                <span className="cinematic-index">08</span>
                <h3 className="cinematic-name">PROFILE</h3>
                <p className="cinematic-desc">
                  Transparent account verification prompting missing info with zero guesswork to ensure members unlock full points value.
                </p>
              </div>
              <div className="cinematic-device">
                <img
                  src={profileAccount}
                  alt="Profile and Account Settings Screen"
                  className="final-screen-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 12 — PROTOTYPE (Interactive Figma Embed & Direct Launch) */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-prototype">
          <div className="chapter-marker">
            <span className="chapter-num">12</span>
            <span className="chapter-label">PROTOTYPE</span>
          </div>

          <div className="prototype-header-row">
            <div>
              <h2 className="prototype-headline">EXPERIENCE THE FINAL PRODUCT</h2>
              <p className="prototype-lead">
                Explore the final Scene+ experience through the interactive prototype.
              </p>
            </div>

            <a
              href={figmaDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="prototype-external-link"
            >
              <span>EXPLORE THE PROTOTYPE</span>
              <span className="link-arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="prototype-embed-container">
            <iframe
              className="prototype-figma-iframe"
              title="Scotiabank Scene+ Interactive Prototype"
              src={figmaEmbedUrl}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 13 — RESULTS */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-results">
          <div className="chapter-marker">
            <span className="chapter-num">13</span>
            <span className="chapter-label">RESULTS</span>
          </div>

          <div className="results-metrics-grid">
            <div className="result-metric-card">
              <span className="result-stat">15%</span>
              <p className="result-desc">Faster credit-card applications</p>
            </div>
            <div className="result-metric-card">
              <span className="result-stat">15%</span>
              <p className="result-desc">Improvement in comprehension of nearby offerings</p>
            </div>
            <div className="result-metric-card">
              <span className="result-stat">35%</span>
              <p className="result-desc">Faster account opening</p>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CHAPTER 14 — RECOGNITION */}
        {/* =================================================================== */}
        <section className="project-chapter chapter-recognition">
          <div className="chapter-marker">
            <span className="chapter-num">14</span>
            <span className="chapter-label">RECOGNITION</span>
          </div>

          <div className="recognition-content-block">
            <div className="recognition-award-row">
              <span className="recognition-accent" />
              <div className="recognition-text-wrap">
                <h3 className="recognition-title">SCOTIABANK EXPERIENTIAL LEARNING AWARD</h3>
                <p className="recognition-sub">Awarded for human-centered mobile banking innovation.</p>
              </div>
            </div>

            <div className="recognition-award-row">
              <span className="recognition-accent" />
              <div className="recognition-text-wrap">
                <h3 className="recognition-title">2ND PLACE — CAPSTONE DESIGN</h3>
                <p className="recognition-sub">Recognized across graduating cohort design evaluations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* PROJECT EXIT */}
        {/* =================================================================== */}
        <footer className="project-chapter project-exit-chapter">
          <div className="exit-spatial-wrapper">
            <span className="exit-eyebrow">PORTFOLIO CONTINUATION</span>
            <h3 className="exit-prompt-title">End of Project 01</h3>
            <p className="exit-prompt-desc">
              Return to the spatial cosmos and continue exploring the selected work.
            </p>

            <button
              className="exit-spatial-btn"
              onClick={handleTriggerExit}
              aria-label="Continue to Project 02"
            >
              <span>CONTINUE TOWARD PROJECT 02</span>
              <span className="exit-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  </div>
  );
}
