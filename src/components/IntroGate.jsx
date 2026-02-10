import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const introTransition = {
  duration: 1.3,
  ease: [0.2, 0.7, 0.2, 1]
};

export default function IntroGate({
  interactionsRequired = 6,
  onComplete,
  onUnlockAudio,
  onStartIntroAudio,
  onStopIntroAudio,
  onInteractionCue
}) {
  const [touchCount, setTouchCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => {
        const drift = ((index * 17) % 90) / 10;
        const left = ((index * 13) % 100) + 0.5;
        const duration = 6 + ((index * 7) % 8);
        const delay = ((index * 11) % 15) / 10;

        return { id: index, drift, left, duration, delay };
      }),
    []
  );

  const progress = Math.min(1, touchCount / interactionsRequired);

  const handleInteract = async () => {
    if (finishing) {
      return;
    }

    if (!started) {
      setStarted(true);
      await onUnlockAudio?.();
      onStartIntroAudio?.();
    }

    onInteractionCue?.();

    const nextCount = touchCount + 1;
    setTouchCount(nextCount);

    if (nextCount < interactionsRequired) {
      return;
    }

    setFinishing(true);
    onStopIntroAudio?.();

    window.setTimeout(() => {
      onComplete?.();
    }, 1600);
  };

  return (
    <section className="intro-gate" aria-label="Intro">
      <div className="intro-gradient" />
      <div className="intro-vignette" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="pollen-particle"
          style={{ left: `${particle.left}%` }}
          animate={{
            y: ['0vh', '-86vh'],
            x: [0, particle.drift, -particle.drift * 0.8],
            opacity: [0, 0.55, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}

      <motion.div
        className="sunflower-trigger"
        onClick={handleInteract}
        whileHover={{ scale: finishing ? 1 : 1.03 }}
        whileTap={{ scale: finishing ? 1 : 0.97 }}
        animate={{
          rotate: finishing ? 0 : [0, 2, -2, 0],
          scale: finishing ? 1.06 : 1
        }}
        transition={{
          rotate: {
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          scale: introTransition
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleInteract();
          }
        }}
      >
        <span className="sunflower-core" />
        <span className="sunflower-progress" style={{ '--progress': progress }} />
      </motion.div>

      <motion.p
        className="intro-caption"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: finishing ? 0 : 1 }}
        transition={introTransition}
      >
        press the sunflower until the night opens
      </motion.p>

      <motion.div
        className="intro-blackout"
        initial={{ opacity: 0 }}
        animate={{ opacity: finishing ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </section>
  );
}
