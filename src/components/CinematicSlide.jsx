import { motion } from 'framer-motion';
import { useMemo } from 'react';
import PaperPoem from './PaperPoem';

const mediaVariants = {
  idle: {
    scale: 1.04,
    opacity: 0.85
  },
  active: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 2.6,
      ease: [0.22, 0.61, 0.36, 1]
    }
  }
};

const contentVariants = {
  idle: { opacity: 0.5, y: 18 },
  active: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, ease: [0.2, 0.7, 0.2, 1], delay: 0.16 }
  }
};

// Emoji and particle config per slide: [emoji, count, sizeMin, sizeMax]
const SLIDE_EMOJI_CONFIG = [
  ['🌻', 18, 10, 22],   // 1 – Beginning (sunflower)
  ['🌠', 18, 10, 22],   // 2 – Falling Star
  ['💔', 18, 10, 22],   // 3 – Rejection (broken heart)
  ['💕', 18, 10, 22],   // 4 – Waiting (two hearts)
  ['👀', 18, 10, 22],   // 5 – Classroom Glance (eyes)
  ['🖤', 18, 10, 22],   // 6 – Dream (black heart)
  ['✨', 18, 10, 22],   // 7 – Firecrackers (sparkles)
  ['❤️', 28, 18, 32]   // 8 – Finale (hearts: more and bigger)
];

function useFloatingParticles(slideIndex) {
  return useMemo(() => {
    const [emoji, count, sizeMin, sizeMax] = SLIDE_EMOJI_CONFIG[slideIndex] ?? ['❤️', 18, 10, 22];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji,
      left: ((i * 19) % 100) + 1,
      size: sizeMin + ((i * 7) % (sizeMax - sizeMin + 1)),
      duration: 8 + ((i * 3) % 6),
      delay: ((i * 5) % 12) / 4,
      drift: ((i * 11) % 40) - 20,
      opacity: 0.12 + ((i * 3) % 6) * 0.04
    }));
  }, [slideIndex]);
}

export default function CinematicSlide({ slide, slideIndex, totalSlides, isActive, isLast, onPaperOpen }) {
  const romanNumeral = useMemo(() => {
    const numerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
    return numerals[slideIndex] || `${slideIndex + 1}`;
  }, [slideIndex]);

  const particles = useFloatingParticles(slideIndex);

  return (
    <section
      className={`cinematic-slide ${isLast ? 'cinematic-slide-finale' : ''}`}
      data-slide-id={slide.id}
      aria-label={slide.beatLabel}
    >
      <motion.div className="slide-media" variants={mediaVariants} animate={isActive ? 'active' : 'idle'}>
        {slide.mediaType === 'video' ? (
          <video className="slide-video" src={slide.background} autoPlay loop muted playsInline />
        ) : (
          <img className="slide-image" src={slide.background} alt="" />
        )}
      </motion.div>

      <div className="slide-grade" style={{ background: slide.grade }} />
      <div className="slide-vignette" />
      <div className="film-grain" />

      {slide.faces?.map((face) => (
        <motion.img
          key={`${slide.id}-${face.id}`}
          className="face-overlay"
          src={face.src}
          alt=""
          initial={{ opacity: 0, scale: 0.94 }}
          animate={isActive ? { opacity: 0.88, scale: 1 } : { opacity: 0.72, scale: 0.98 }}
          transition={{ duration: 1.8, ease: [0.2, 0.7, 0.2, 1] }}
          style={{
            top: face.top,
            left: face.left,
            width: face.width,
            rotate: `${face.rotation ?? 0}deg`
          }}
        />
      ))}

      {/* Floating emojis on every slide */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="floating-emoji"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`
          }}
          animate={{
            y: ['0vh', '-90vh'],
            x: [0, p.drift, -p.drift * 0.6],
            opacity: [0, p.opacity, 0],
            rotate: [0, p.drift * 2, -p.drift]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {p.emoji}
        </motion.span>
      ))}

      {/* Slide counter */}
      <motion.div
        className="slide-counter"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.52 : 0.2 }}
        transition={{ duration: 0.8 }}
      >
        {romanNumeral} / {totalSlides}
      </motion.div>

      <motion.div className="slide-content" variants={contentVariants} animate={isActive ? 'active' : 'idle'}>
        <p className="beat-label">{slide.beatLabel}</p>
        <PaperPoem title={slide.poemTitle} lines={slide.poemLines} crinkle={slide.crinkle} isActive={isActive} onOpen={onPaperOpen} />
      </motion.div>

      {/* Valentine's Day closing message on the last slide */}
      {isLast && (
        <motion.div
          className="valentine-finale"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.8, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <span className="finale-heart">&#10084;</span>
          <p className="finale-text">Happy Valentine&apos;s Day</p>
          <p className="finale-subtext">this story is ours, and it has only just begun</p>
        </motion.div>
      )}
    </section>
  );
}
