import { motion } from 'framer-motion';
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

export default function CinematicSlide({ slide, isActive, onPaperOpen }) {
  return (
    <section className="cinematic-slide" data-slide-id={slide.id} aria-label={slide.beatLabel}>
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

      <motion.div className="slide-content" variants={contentVariants} animate={isActive ? 'active' : 'idle'}>
        <p className="beat-label">{slide.beatLabel}</p>
        <PaperPoem
          title={slide.poemTitle}
          lines={slide.poemLines}
          crinkle={slide.crinkle}
          isActive={isActive}
          onOpen={onPaperOpen}
        />
      </motion.div>
    </section>
  );
}
