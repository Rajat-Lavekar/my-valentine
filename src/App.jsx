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

  return (
    <main className="app-shell">
      <SunflowerCursor rootRef={rootRef} />

      <div className={`experience-root ${isHolding ? 'hold-active' : ''}`} ref={rootRef}>
        <IntroGate
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
