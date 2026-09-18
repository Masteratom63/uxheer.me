import React, { useState, useEffect, useRef, useCallback } from 'react';
import ParticleIntro from './components/ParticleIntro/ParticleIntro';
import Statement from './components/Statement/Statement';
import SpatialGallery from './components/SpatialGallery/SpatialGallery';
import Project01Scene from './components/Project01Scene/Project01Scene';
import Project02Scene from './components/Project02Scene/Project02Scene';
import About from './components/About/About';
import Capabilities from './components/Capabilities/Capabilities';
import Contact from './components/Contact/Contact';
import { updateSpatial } from './utils/spatialController';

/**
 * App Component
 * 
 * Complete UXHeer Spatial Homepage Journey:
 *  1. INTRO: Particle Arrival -> Logo -> HEER PATEL -> Dispersal
 *  2. STATEMENT: Immediate 100vh viewport state at scroll=0, fluid editorial typography
 *  3. SELECTED WORK: Sequential 3D camera travel (Project 01 -> 02 -> 03)
 *     - PROJECT 01: SCOTIABANK SCENE+ (Immersive full project experience)
 *     - PROJECT 02: VISUAL COMMUNICATION (Curated editorial visual body of work)
 *  4. ABOUT / APPROACH: "I work across design, technology and visual communication."
 *  5. CAPABILITIES: Multi-depth spatial typography composition
 *  6. CONTACT: "Have something worth building? Let's talk." & calm final end state
 */
export default function App() {
  const [stage, setStage] = useState('intro'); // 'intro' | 'experience'
  // Explicit Project 01 Lifecycle: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  const [projectState, setProjectState] = useState('CLOSED');
  // Explicit Project 02 Lifecycle: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  const [project02State, setProject02State] = useState('CLOSED');
  // Transition curtain state: 'idle' | 'fade-to-black' | 'fade-in-content'
  const [exitTransitionStage, setExitTransitionStage] = useState('idle');
  const currentRatioRef = useRef(0);
  const rafIdRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);

  const isProjectActive = projectState !== 'CLOSED' || project02State !== 'CLOSED';
  const isScrollLocked = stage === 'intro' || isProjectActive || exitTransitionStage !== 'idle';

  // Cleanup transition timers on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  // Callback when particle intro completes dispersal
  const handleIntroComplete = useCallback(() => {
    setStage('experience');
  }, []);

  // Lock scroll during intro, project view, or exit transition
  useEffect(() => {
    if (isScrollLocked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (stage === 'intro') {
        window.scrollTo(0, 0);
      }
    } else {
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowY = 'auto';
    }
  }, [stage, isScrollLocked]);

  // High-performance continuous scroll & camera lerp engine
  // Pauses while any project is active so homepage scroll never conflicts with project scene
  useEffect(() => {
    if (stage === 'intro' || isProjectActive) return;

    let isRunning = true;

    const lerpLoop = () => {
      if (!isRunning) return;

      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const target = Math.max(0, Math.min(scrollY / maxScroll, 1));

      // Weighty, responsive spatial camera smoothing with velocity damping
      const rawDiff = target - currentRatioRef.current;
      const clampedDiff = Math.max(-0.05, Math.min(0.05, rawDiff));
      currentRatioRef.current += clampedDiff * 0.095;
      const cur = currentRatioRef.current;

      // Broadcast to all spatial sections directly (Zero React reconciliations on scroll!)
      updateSpatial(cur);

      rafIdRef.current = requestAnimationFrame(lerpLoop);
    };

    rafIdRef.current = requestAnimationFrame(lerpLoop);

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [stage, isProjectActive]);

  // ===================================================================
  // Project 01 Handlers (Scotiabank Scene+)
  // ===================================================================
  const handleEnterProject01 = useCallback(() => {
    setProjectState((prev) => {
      if (prev !== 'CLOSED') return prev;
      return 'OPENING';
    });
  }, []);

  const handleOpenComplete = useCallback(() => {
    setProjectState((prev) => {
      if (prev !== 'OPENING') return prev;
      return 'OPEN';
    });
  }, []);

  const handleTriggerExit = useCallback(() => {
    setProjectState((prev) => {
      if (prev !== 'OPEN') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.16;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.16;
      updateSpatial(0.16);
      setProjectState('CLOSED');

      fadeTimerRef.current = setTimeout(() => {
        updateSpatial(0.16);
        setExitTransitionStage('fade-in-content');

        setTimeout(() => {
          setExitTransitionStage('idle');
        }, 650);
      }, 120);
    }, 650);
  }, []);

  // Seamless transition directly from Project 01 to Project 02
  const handleContinueFromProject01To02 = useCallback(() => {
    setProjectState((prev) => {
      if (prev !== 'OPEN') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.34;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.34;
      updateSpatial(0.34);
      setProjectState('CLOSED');
      setProject02State('OPENING');

      fadeTimerRef.current = setTimeout(() => {
        updateSpatial(0.34);
        setExitTransitionStage('fade-in-content');

        setTimeout(() => {
          setExitTransitionStage('idle');
        }, 650);
      }, 120);
    }, 650);
  }, []);

  const handleExitComplete = useCallback(() => {
    // Coordinated inside handleTriggerExit
  }, []);

  // ===================================================================
  // Project 02 Handlers (Visual Communication)
  // ===================================================================
  const handleEnterProject02 = useCallback(() => {
    setProject02State((prev) => {
      if (prev !== 'CLOSED') return prev;
      return 'OPENING';
    });
  }, []);

  const handleOpenProject02Complete = useCallback(() => {
    setProject02State((prev) => {
      if (prev !== 'OPENING') return prev;
      return 'OPEN';
    });
  }, []);

  const handleTriggerExitProject02 = useCallback(() => {
    setProject02State((prev) => {
      if (prev !== 'OPEN') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.34;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.34;
      updateSpatial(0.34);
      setProject02State('CLOSED');

      fadeTimerRef.current = setTimeout(() => {
        updateSpatial(0.34);
        setExitTransitionStage('fade-in-content');

        setTimeout(() => {
          setExitTransitionStage('idle');
        }, 650);
      }, 120);
    }, 650);
  }, []);

  // Seamless transition directly from Project 02 back to Project 01
  const handleBackFromProject02To01 = useCallback(() => {
    setProject02State((prev) => {
      if (prev !== 'OPEN') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.16;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.16;
      updateSpatial(0.16);
      setProject02State('CLOSED');
      setProjectState('OPENING');

      fadeTimerRef.current = setTimeout(() => {
        updateSpatial(0.16);
        setExitTransitionStage('fade-in-content');

        setTimeout(() => {
          setExitTransitionStage('idle');
        }, 650);
      }, 120);
    }, 650);
  }, []);

  // Seamless transition directly from Project 02 toward Project 03
  const handleContinueFromProject02To03 = useCallback(() => {
    setProject02State((prev) => {
      if (prev !== 'OPEN') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.48;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.48;
      updateSpatial(0.48);
      setProject02State('CLOSED');

      fadeTimerRef.current = setTimeout(() => {
        updateSpatial(0.48);
        setExitTransitionStage('fade-in-content');

        setTimeout(() => {
          setExitTransitionStage('idle');
        }, 650);
      }, 120);
    }, 650);
  }, []);

  const handleExitProject02Complete = useCallback(() => {
    // Coordinated inside handleTriggerExitProject02
  }, []);

  const isIntroFinished = stage === 'experience';
  const activeLifecycleClass = projectState !== 'CLOSED' 
    ? `project-${projectState.toLowerCase()}`
    : project02State !== 'CLOSED'
    ? `project-${project02State.toLowerCase()}`
    : '';

  return (
    <main className={`spatial-experience ${isProjectActive ? 'project-active' : ''} ${activeLifecycleClass}`}>
      {/* Seamless Black Transition Curtain for Project Exit */}
      <div
        className={`spatial-black-curtain stage-${exitTransitionStage}`}
        aria-hidden="true"
      />

      {/* ONE Persistent 3D Spatial Particle Field throughout the Homepage */}
      <ParticleIntro
        onComplete={handleIntroComplete}
        isIntroFinished={isIntroFinished}
      />

      {/* 1. STATEMENT: Immediate 100vh Spatial Statement */}
      <Statement isVisible={isIntroFinished} />

      {/* 2. SELECTED WORK: Sequential 3D Spatial Gallery (Project 01 -> 02 -> 03) */}
      <SpatialGallery
        isIntroFinished={isIntroFinished}
        onEnterProject01={handleEnterProject01}
        onEnterProject02={handleEnterProject02}
        projectState={projectState !== 'CLOSED' ? projectState : project02State}
      />

      {/* PROJECT 01 IMMERSIVE PRESENTATION: Scotiabank Scene+ with Isolated Lifecycle */}
      <Project01Scene
        lifecycleState={projectState}
        onOpenComplete={handleOpenComplete}
        onExitTrigger={handleTriggerExit}
        onExitComplete={handleExitComplete}
        onContinueToProject02={handleContinueFromProject01To02}
      />

      {/* PROJECT 02 IMMERSIVE PRESENTATION: Visual Communication */}
      <Project02Scene
        lifecycleState={project02State}
        onOpenComplete={handleOpenProject02Complete}
        onExitTrigger={handleTriggerExitProject02}
        onExitComplete={handleExitProject02Complete}
        onBackToProject01={handleBackFromProject02To01}
        onGoToProject03={handleContinueFromProject02To03}
      />

      {/* 3. ABOUT / APPROACH */}
      <About isIntroFinished={isIntroFinished} />

      {/* 4. CAPABILITIES: Multi-Depth Spatial Typography */}
      <Capabilities isIntroFinished={isIntroFinished} />

      {/* 5. CONTACT & CALM END STATE */}
      <Contact isIntroFinished={isIntroFinished} />

      {/* Real Scrollable Document Track (Enables native mobile touch swiping across full journey) */}
      {isIntroFinished && (
        <div
          className="spatial-scroll-track"
          style={{
            height: '680vh',
            width: '100%',
            pointerEvents: 'none',
            visibility: 'hidden',
          }}
          aria-hidden="true"
        />
      )}
    </main>
  );
}
