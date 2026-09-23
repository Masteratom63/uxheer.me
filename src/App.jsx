import React, { useState, useEffect, useRef, useCallback } from 'react';
import ParticleIntro from './components/ParticleIntro/ParticleIntro';
import Statement from './components/Statement/Statement';
import SpatialGallery from './components/SpatialGallery/SpatialGallery';
import Project01Scene from './components/Project01Scene/Project01Scene';
import Project02Scene from './components/Project02Scene/Project02Scene';
import Project03Scene from './components/Project03Scene/Project03Scene';
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
// Exact calibrated keyframe stops for each spatial section
const SECTION_STOPS = [
  0.00, // 0: Statement
  0.16, // 1: Project 01 (Scotiabank Scene+)
  0.34, // 2: Project 02 (Visual Communication)
  0.48, // 3: Project 03 (Global Capital Exchange)
  0.61, // 4: About / Approach
  0.77, // 5: Capabilities
  0.92, // 6: Contact & Calm End State
];

export default function App() {
  const [stage, setStage] = useState('intro'); // 'intro' | 'experience'
  // Explicit Project 01 Lifecycle: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  const [projectState, setProjectState] = useState('CLOSED');
  // Explicit Project 02 Lifecycle: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  const [project02State, setProject02State] = useState('CLOSED');
  // Explicit Project 03 Lifecycle: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  const [project03State, setProject03State] = useState('CLOSED');
  // Transition curtain state: 'idle' | 'fade-to-black' | 'fade-in-content'
  const [exitTransitionStage, setExitTransitionStage] = useState('idle');
  const currentRatioRef = useRef(0);
  const targetRatioRef = useRef(0);
  const currentSectionIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const transitionCooldownTimerRef = useRef(null);
  const rafIdRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);

  const isProjectActive = projectState !== 'CLOSED' || project02State !== 'CLOSED' || project03State !== 'CLOSED';
  const isScrollLocked = stage === 'intro' || isProjectActive || exitTransitionStage !== 'idle';

  // Cleanup transition timers on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (transitionCooldownTimerRef.current) clearTimeout(transitionCooldownTimerRef.current);
    };
  }, []);

  // Jump or advance smoothly to exact section stop
  const goToSection = useCallback((newIndex) => {
    const clampedIndex = Math.max(0, Math.min(SECTION_STOPS.length - 1, newIndex));
    currentSectionIndexRef.current = clampedIndex;
    const targetRatio = SECTION_STOPS[clampedIndex];
    targetRatioRef.current = targetRatio;

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetScroll = maxScroll * targetRatio;
    window.scrollTo({ top: targetScroll, behavior: 'instant' });
  }, []);

  // Callback when particle intro completes dispersal
  const handleIntroComplete = useCallback(() => {
    setStage('experience');
    currentSectionIndexRef.current = 0;
    targetRatioRef.current = 0;
    currentRatioRef.current = 0;
    updateSpatial(0);
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
  // Smoothly drives spatial camera to exact section stop at responsive 0.16 speed
  useEffect(() => {
    if (stage === 'intro' || isProjectActive) return;

    let isRunning = true;

    const lerpLoop = () => {
      if (!isRunning) return;

      const target = targetRatioRef.current;

      // Responsive spatial camera smoothing toward exact section stop
      const rawDiff = target - currentRatioRef.current;
      if (Math.abs(rawDiff) < 0.00005) {
        currentRatioRef.current = target;
      } else {
        currentRatioRef.current += rawDiff * 0.16;
      }
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

  // Discrete Section-by-Section Scroll Trigger
  // Advances cleanly between sections and stops exactly on each keyframe
  useEffect(() => {
    if (stage === 'intro' || isProjectActive) return;

    // Ensure transition lock is fully clear on every mount
    isTransitioningRef.current = false;

    let touchStartY = 0;
    let touchStartX = 0;

    const handleWheel = (e) => {
      e.preventDefault();

      if (isTransitioningRef.current) return;
      if (Math.abs(e.deltaY) < 16) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = currentSectionIndexRef.current + direction;

      if (nextIndex >= 0 && nextIndex < SECTION_STOPS.length) {
        isTransitioningRef.current = true;
        goToSection(nextIndex);

        clearTimeout(transitionCooldownTimerRef.current);
        transitionCooldownTimerRef.current = setTimeout(() => {
          isTransitioningRef.current = false;
        }, 600);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (isTransitioningRef.current) return;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY - touchEndY;
      const diffX = touchStartX - touchEndX;

      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 36) {
        const direction = diffY > 0 ? 1 : -1;
        const nextIndex = currentSectionIndexRef.current + direction;

        if (nextIndex >= 0 && nextIndex < SECTION_STOPS.length) {
          isTransitioningRef.current = true;
          goToSection(nextIndex);

          clearTimeout(transitionCooldownTimerRef.current);
          transitionCooldownTimerRef.current = setTimeout(() => {
            isTransitioningRef.current = false;
          }, 550);
        }
      }
    };

    const handleKeyDown = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey) {
        e.preventDefault();
        if (!isTransitioningRef.current) {
          const nextIndex = currentSectionIndexRef.current + 1;
          if (nextIndex < SECTION_STOPS.length) {
            isTransitioningRef.current = true;
            goToSection(nextIndex);
            clearTimeout(transitionCooldownTimerRef.current);
            transitionCooldownTimerRef.current = setTimeout(() => {
              isTransitioningRef.current = false;
            }, 550);
          }
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        if (!isTransitioningRef.current) {
          const nextIndex = currentSectionIndexRef.current - 1;
          if (nextIndex >= 0) {
            isTransitioningRef.current = true;
            goToSection(nextIndex);
            clearTimeout(transitionCooldownTimerRef.current);
            transitionCooldownTimerRef.current = setTimeout(() => {
              isTransitioningRef.current = false;
            }, 550);
          }
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSection(SECTION_STOPS.length - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (transitionCooldownTimerRef.current) {
        clearTimeout(transitionCooldownTimerRef.current);
      }
      isTransitioningRef.current = false;
    };
  }, [stage, isProjectActive, goToSection]);

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
      if (prev === 'CLOSED' || prev === 'CLOSING') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.16;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.16;
      targetRatioRef.current = 0.16;
      currentSectionIndexRef.current = 1;
      updateSpatial(0.16);
      setProjectState('CLOSED');
      isTransitioningRef.current = false;

      fadeTimerRef.current = setTimeout(() => {
        updateSpatial(0.16);
        setExitTransitionStage('fade-in-content');

        setTimeout(() => {
          setExitTransitionStage('idle');
          isTransitioningRef.current = false;
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
      targetRatioRef.current = 0.34;
      currentSectionIndexRef.current = 2;
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
      if (prev === 'CLOSED' || prev === 'CLOSING') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.34;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.34;
      targetRatioRef.current = 0.34;
      currentSectionIndexRef.current = 2;
      updateSpatial(0.34);
      setProject02State('CLOSED');
      isTransitioningRef.current = false;

      fadeTimerRef.current = setTimeout(() => {
        updateSpatial(0.34);
        setExitTransitionStage('fade-in-content');

        setTimeout(() => {
          setExitTransitionStage('idle');
          isTransitioningRef.current = false;
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
      targetRatioRef.current = 0.16;
      currentSectionIndexRef.current = 1;
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
    isTransitioningRef.current = false;
    setProject02State((prev) => {
      if (prev === 'CLOSED' || prev === 'CLOSING') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.48;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.48;
      targetRatioRef.current = 0.48;
      currentSectionIndexRef.current = 3;
      updateSpatial(0.48);
      setProject02State('CLOSED');
      setProject03State('OPENING');

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

  // ===================================================================
  // Project 03 Handlers (Porch Private)
  // ===================================================================
  const handleEnterProject03 = useCallback(() => {
    isTransitioningRef.current = false;
    setProject03State((prev) => {
      if (prev !== 'CLOSED') return prev;
      return 'OPENING';
    });
  }, []);

  const handleOpenProject03Complete = useCallback(() => {
    setProject03State((prev) => {
      if (prev !== 'OPENING') return prev;
      return 'OPEN';
    });
  }, []);

  const handleTriggerExitProject03 = useCallback(() => {
    setProject03State((prev) => {
      if (prev === 'CLOSED' || prev === 'CLOSING') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.48;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.48;
      targetRatioRef.current = 0.48;
      currentSectionIndexRef.current = 3;
      updateSpatial(0.48);
      setProject03State('CLOSED');
      isTransitioningRef.current = false;

      fadeTimerRef.current = setTimeout(() => {
        updateSpatial(0.48);
        setExitTransitionStage('fade-in-content');

        setTimeout(() => {
          setExitTransitionStage('idle');
          isTransitioningRef.current = false;
        }, 650);
      }, 120);
    }, 650);
  }, []);

  // Seamless transition directly from Project 03 back to Project 02
  const handleBackFromProject03To02 = useCallback(() => {
    isTransitioningRef.current = false;
    setProject03State((prev) => {
      if (prev === 'CLOSED' || prev === 'CLOSING') return prev;
      return 'CLOSING';
    });

    setExitTransitionStage('fade-to-black');

    transitionTimerRef.current = setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.34;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.34;
      targetRatioRef.current = 0.34;
      currentSectionIndexRef.current = 2;
      updateSpatial(0.34);
      setProject03State('CLOSED');
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

  const handleExitProject03Complete = useCallback(() => {
    // Coordinated inside handleTriggerExitProject03
  }, []);

  const isIntroFinished = stage === 'experience';
  const activeLifecycleClass = projectState !== 'CLOSED' 
    ? `project-${projectState.toLowerCase()}`
    : project02State !== 'CLOSED'
    ? `project-${project02State.toLowerCase()}`
    : project03State !== 'CLOSED'
    ? `project-${project03State.toLowerCase()}`
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
        onEnterProject03={handleEnterProject03}
        projectState={
          projectState !== 'CLOSED'
            ? projectState
            : project02State !== 'CLOSED'
            ? project02State
            : project03State
        }
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

      {/* PROJECT 03 IMMERSIVE PRESENTATION: Porch Private */}
      <Project03Scene
        lifecycleState={project03State}
        onOpenComplete={handleOpenProject03Complete}
        onExitTrigger={handleTriggerExitProject03}
        onExitComplete={handleExitProject03Complete}
        onBackToProject02={handleBackFromProject03To02}
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
