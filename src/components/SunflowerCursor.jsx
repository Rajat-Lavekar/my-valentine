import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SunflowerCursor({ rootRef }) {
  const x = useMotionValue(-120);
  const y = useMotionValue(-120);
  const springX = useSpring(x, { stiffness: 460, damping: 34, mass: 0.24 });
  const springY = useSpring(y, { stiffness: 460, damping: 34, mass: 0.24 });

  const [isVisible, setIsVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerMedia = window.matchMedia('(pointer: fine)');
    const canUseCursor = pointerMedia.matches;
    setEnabled(canUseCursor);

    const mediaListener = (event) => {
      setEnabled(event.matches);
    };

    if (pointerMedia.addEventListener) {
      pointerMedia.addEventListener('change', mediaListener);
    } else {
      pointerMedia.addListener(mediaListener);
    }

    return () => {
      if (pointerMedia.removeEventListener) {
        pointerMedia.removeEventListener('change', mediaListener);
      } else {
        pointerMedia.removeListener(mediaListener);
      }
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('sunflower-cursor-enabled');
      return;
    }

    document.body.classList.add('sunflower-cursor-enabled');
    return () => {
      document.body.classList.remove('sunflower-cursor-enabled');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const rootNode = rootRef.current;
    const target = rootNode || window;

    const onPointerMove = (event) => {
      x.set(event.clientX - 20);
      y.set(event.clientY - 20);
      setIsVisible(true);

      const rotateTarget = event.target?.closest?.('[data-cursor-spin="true"]');
      setIsSpinning(Boolean(rotateTarget));
    };

    const onPointerLeave = () => {
      setIsVisible(false);
      setIsSpinning(false);
    };

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerleave', onPointerLeave);

    return () => {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [enabled, rootRef, x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      className={`sunflower-cursor ${isVisible ? 'cursor-visible' : ''}`}
      style={{ x: springX, y: springY }}
      animate={isSpinning ? { rotate: [0, 360] } : { rotate: 0 }}
      transition={isSpinning ? { duration: 1.25, ease: 'linear', repeat: Infinity } : { duration: 0.2 }}
    >
      <span className="cursor-petals" />
      <span className="cursor-core" />
    </motion.div>
  );
}
