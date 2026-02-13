import { useCallback, useEffect, useRef, useState } from 'react';
import CinematicSlide from './components/CinematicSlide';
import IntroGate from './components/IntroGate';
import SunflowerCursor from './components/SunflowerCursor';
import { storySlides } from './data/slides';
import { useActiveSlide } from './hooks/useActiveSlide';
import { useCinematicAudio } from './hooks/useCinematicAudio';
import { useTimedScrollHold } from './hooks/useTimedScrollHold';

export default function App() {
  const rootRef = useRef(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const { activeSlideId } = useActiveSlide({
    rootRef,
    enabled: introComplete
  });

  const isHolding = useTimedScrollHold({
    rootRef,
    activeKey: activeSlideId,
    enabled: introComplete,
    holdMs: 950
  });

  const { unlockAudio, startIntroBed, stopIntroBed, playInteractionCue, playPaperFx } = useCinematicAudio({
    slides: storySlides,
    activeSlideId,
    introComplete
  });

  const handleIntroComplete = useCallback(() => {
    // Intro gates the entire story, so we only unlock scroll after the fade-out lands.
    setIntroComplete(true);

    const rootNode = rootRef.current;
    if (!rootNode) {
      return;
    }

    window.requestAnimationFrame(() => {
      // Start the cinematic timeline at the first narrative frame.
      rootNode.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }, []);

  const handleIntroReset = useCallback(() => {
    setIntroComplete(false);

    const rootNode = rootRef.current;
    if (!rootNode) {
      return;
    }

    rootNode.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const rootNode = rootRef.current;
    if (!rootNode) {
      return;
    }

    // Body stays fixed and the internal container owns all timeline scrolling.
    rootNode.style.overflowY = introComplete ? 'auto' : 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [introComplete]);

  useEffect(() => {
    const rootNode = rootRef.current;
    if (!rootNode) {
      return;
    }

    const syncScrollTop = () => {
      setScrollTop(rootNode.scrollTop);
    };

    syncScrollTop();
    rootNode.addEventListener('scroll', syncScrollTop, { passive: true });

    return () => {
      rootNode.removeEventListener('scroll', syncScrollTop);
    };
  }, []);

  const viewportHeight = typeof window === 'undefined' ? 0 : window.innerHeight;
  const introIsVisible = scrollTop < viewportHeight * 0.72;

  return (
    <main className="app-shell">
      <SunflowerCursor rootRef={rootRef} />

      <div className={`experience-root ${isHolding ? 'hold-active' : ''}`} ref={rootRef}>
        <IntroGate
          introIsVisible={introIsVisible}
          onReset={handleIntroReset}
          onUnlockAudio={unlockAudio}
          onStartIntroAudio={startIntroBed}
          onInteractionCue={playInteractionCue}
          onStopIntroAudio={stopIntroBed}
          onComplete={handleIntroComplete}
        />

        {storySlides.map((slide) => (
          <CinematicSlide
            key={slide.id}
            slide={slide}
            isActive={activeSlideId === slide.id}
            onPaperOpen={playPaperFx}
          />
        ))}
      </div>
    </main>
  );
}
