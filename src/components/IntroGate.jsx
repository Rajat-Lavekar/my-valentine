import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WEB_ASSETS } from '../data/webAssets';
import MoonSunMorph from './MoonSunMorph';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function IntroGate({
  introIsVisible,
  onComplete,
  onReset,
  onUnlockAudio,
  onStartIntroAudio,
  onStopIntroAudio,
  onInteractionCue
}) {
  const dragX = useMotionValue(0);
  const [progress, setProgress] = useState(0);
  const [maxDrag, setMaxDrag] = useState(440);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lockDrag, setLockDrag] = useState(false);
  const [orbSession, setOrbSession] = useState(0);

  const completeRef = useRef(false);
  const resetRef = useRef(true);

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: ((index * 17) % 100) + 0.5,
        duration: 7 + ((index * 5) % 8),
        delay: ((index * 9) % 16) / 10,
        drift: ((index * 13) % 90) / 14
      })),
    []
  );

  useEffect(() => {
    const updateMaxDrag = () => {
      const candidate = window.innerWidth * 0.58;
      setMaxDrag(clamp(candidate, 190, 680));
    };

    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);

    return () => {
      window.removeEventListener('resize', updateMaxDrag);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = dragX.on('change', (value) => {
      const next = clamp(value / maxDrag, 0, 1);
      setProgress(next);
    });

    return () => unsubscribe();
  }, [dragX, maxDrag]);

  useEffect(() => {
    if (!completeRef.current && progress >= 0.99) {
      completeRef.current = true;
      resetRef.current = false;
      setIsComplete(true);
      setLockDrag(true);
      setOrbSession((current) => current + 1);
      onInteractionCue?.();
      onStopIntroAudio?.();

      animate(dragX, maxDrag, {
        duration: 0.24,
        ease: [0.2, 0.7, 0.2, 1]
      });

      window.setTimeout(() => {
        onComplete?.();
      }, 520);
      return;
    }

    if (completeRef.current && !resetRef.current && progress <= 0.06) {
      resetRef.current = true;
      completeRef.current = false;
      setIsComplete(false);
      setLockDrag(false);
      onReset?.();
      onStartIntroAudio?.();
    }
  }, [dragX, maxDrag, onComplete, onInteractionCue, onReset, onStartIntroAudio, onStopIntroAudio, progress]);

  useEffect(() => {
    if (introIsVisible) {
      setLockDrag(false);
    }
  }, [introIsVisible]);

  const handleDragStart = async () => {
    if (!hasStarted) {
      setHasStarted(true);
      await onUnlockAudio?.();
      onStartIntroAudio?.();
      onInteractionCue?.();
    }
  };

  const handleDragEnd = () => {
    const target = progress >= 0.5 ? maxDrag : 0;

    animate(dragX, target, {
      duration: 0.38,
      ease: [0.2, 0.7, 0.2, 1]
    });
  };

  const orbitWidth = maxDrag + 120;
  const arcLift = -Math.sin(progress * Math.PI) * 56;
  const canDrag = introIsVisible && !lockDrag;

  return (
    <section className="intro-gate" aria-label="Intro">
      <motion.div
        className="intro-photo-layer"
        style={{
          backgroundImage: `url(${WEB_ASSETS.sunflowerField})`,
          opacity: 0.2 + progress * 0.78,
          filter: `saturate(${0.52 + progress * 0.78}) brightness(${0.42 + progress * 0.84})`
        }}
      />
      <motion.div className="intro-night-layer" style={{ opacity: 1 - progress }} />
      <motion.div className="intro-day-layer" style={{ opacity: progress }} />
      <div className="intro-vignette" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="pollen-particle"
          style={{ left: `${particle.left}%`, opacity: 0.14 + progress * 0.56 }}
          animate={{
            y: ['0vh', '-82vh'],
            x: [0, particle.drift, -particle.drift],
            opacity: [0, 0.25 + progress * 0.6, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}

      <div className="intro-orbit-shell" style={{ width: `${orbitWidth}px` }}>
        <motion.div
          key={orbSession}
          className="moon-sun-orb"
          drag={canDrag ? 'x' : false}
          dragElastic={0.04}
          dragMomentum={false}
          dragConstraints={{ left: 0, right: maxDrag }}
          style={{ x: dragX, y: arcLift }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          data-cursor-spin="true"
        >
          <motion.div
            className="orb-halo"
            style={{
              opacity: 0.26 + progress * 0.62,
              scale: 0.8 + progress * 0.36
            }}
          />
          <motion.div className="moon-sun-icon-wrap" style={{ rotate: -14 + progress * 14 }}>
            <MoonSunMorph progress={progress} />
          </motion.div>
        </motion.div>
      </div>

      <div className="intro-sunflower-anchor">
        <motion.div
          className="intro-sunflower-head-wrap"
          style={{
            rotate: `${24 - progress * 36}deg`,
            x: `${-12 + progress * 18}px`,
            y: `${10 - progress * 10}px`
          }}
        >
          <motion.img
            src={WEB_ASSETS.sunflowerIntroPng}
            alt="sunflower"
            className="intro-sunflower-head"
            style={{
              filter: `drop-shadow(0 14px 22px rgba(11, 6, 3, 0.42)) saturate(${0.74 + progress * 0.36}) brightness(${0.7 + progress * 0.5})`
            }}
          />
        </motion.div>
      </div>

      <motion.div
        className="intro-thought-cloud"
        animate={{
          opacity: isComplete ? 0.84 : 1,
          y: isComplete ? 3 : 0
        }}
        transition={{ duration: 0.35 }}
      >
        <p>
          {isComplete
            ? 'The Sun is awake now... scroll down to begin our story together'
            : 'Gently drag the moon across the sky and let the Sunflower whisper our story to you'}
        </p>
        <span className="thought-tail thought-tail-1" />
        <span className="thought-tail thought-tail-2" />
        <span className="thought-tail thought-tail-3" />
      </motion.div>
    </section>
  );
}
