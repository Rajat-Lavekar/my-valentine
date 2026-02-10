import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WEB_ASSETS } from '../data/webAssets';
import MoonSunMorph from './MoonSunMorph';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function IntroGate({ onComplete, onUnlockAudio, onStartIntroAudio, onStopIntroAudio, onInteractionCue }) {
  const dragX = useMotionValue(0);
  const [progress, setProgress] = useState(0);
  const [maxDrag, setMaxDrag] = useState(440);
  const [hasStarted, setHasStarted] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const completeRef = useRef(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
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
      const candidate = window.innerWidth * 0.62;
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
      const next = clamp(-value / maxDrag, 0, 1);
      setProgress(next);
    });

    return () => unsubscribe();
  }, [dragX, maxDrag]);

  useEffect(() => {
    if (progress < 0.985 || completeRef.current) {
      return;
    }

    completeRef.current = true;
    setFinishing(true);
    onInteractionCue?.();
    onStopIntroAudio?.();

    animate(dragX, -maxDrag, {
      duration: 0.32,
      ease: [0.2, 0.7, 0.2, 1]
    });

    window.setTimeout(() => {
      onComplete?.();
    }, 1500);
  }, [dragX, maxDrag, onComplete, onInteractionCue, onStopIntroAudio, progress]);

  const handleDragStart = async () => {
    if (hasStarted || finishing) {
      return;
    }

    setHasStarted(true);
    await onUnlockAudio?.();
    onStartIntroAudio?.();
    onInteractionCue?.();
  };

  return (
    <section className="intro-gate" aria-label="Intro">
      <motion.div
        className="intro-photo-layer"
        style={{
          backgroundImage: `url(${WEB_ASSETS.sunflowerField})`,
          opacity: 0.15 + progress * 0.82,
          filter: `saturate(${0.4 + progress * 0.8}) brightness(${0.34 + progress * 0.76})`
        }}
      />
      <motion.div className="intro-night-layer" style={{ opacity: 1 - progress }} />
      <motion.div className="intro-day-layer" style={{ opacity: progress }} />
      <div className="intro-vignette" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="pollen-particle"
          style={{ left: `${particle.left}%`, opacity: 0.16 + progress * 0.54 }}
          animate={{
            y: ['0vh', '-78vh'],
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

      <motion.div className="intro-sky-track" style={{ transform: `translateY(${(1 - progress) * -8}px)` }}>
        <motion.div
          className="moon-sun-orb"
          drag="x"
          dragElastic={0.04}
          dragMomentum={false}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          style={{ x: dragX }}
          onDragStart={handleDragStart}
          data-cursor-spin="true"
        >
          <motion.div className="orb-halo" style={{ opacity: 0.32 + progress * 0.58, scale: 0.85 + progress * 0.3 }} />
          <motion.div className="moon-sun-icon" style={{ color: progress > 0.5 ? '#f8ca70' : '#d8deef' }}>
            <MoonSunMorph progress={progress} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="intro-ground-sunflower"
        style={{
          rotate: `${30 - progress * 30}deg`,
          y: `${18 - progress * 18}px`
        }}
      >
        <span className="ground-stem" />
        <motion.img
          src={WEB_ASSETS.sunflowerPng}
          alt="sunflower"
          className="ground-head-image"
          style={{ filter: `saturate(${0.72 + progress * 0.35}) brightness(${0.7 + progress * 0.45})` }}
        />
      </motion.div>

      <motion.p className="intro-caption" animate={{ opacity: finishing ? 0 : 1 }} transition={{ duration: 0.6 }}>
        drag the moon to the left and wait for sunrise
      </motion.p>

      <motion.div
        className="intro-blackout"
        initial={{ opacity: 0 }}
        animate={{ opacity: finishing ? 1 : 0 }}
        transition={{ duration: 1.35, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </section>
  );
}
