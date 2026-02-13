import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SunflowerCursor({ rootRef }) {
  const x = useMotionValue(-120);
  const y = useMotionValue(-120);

  const outerX = useSpring(x, { stiffness: 760, damping: 48, mass: 0.14 });
  const outerY = useSpring(y, { stiffness: 760, damping: 48, mass: 0.14 });
  const innerX = useSpring(x, { stiffness: 1200, damping: 62, mass: 0.08 });
  const innerY = useSpring(y, { stiffness: 1200, damping: 62, mass: 0.08 });

  const [isVisible, setIsVisible] = useState(false);
  const [isActiveTarget, setIsActiveTarget] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerMedia = window.matchMedia('(pointer: fine)');
    setEnabled(pointerMedia.matches);

    const onChange = (event) => setEnabled(event.matches);
    if (pointerMedia.addEventListener) {
      pointerMedia.addEventListener('change', onChange);
    } else {
      pointerMedia.addListener(onChange);
    }

    return () => {
      if (pointerMedia.removeEventListener) {
        pointerMedia.removeEventListener('change', onChange);
      } else {
        pointerMedia.removeListener(onChange);
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
      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);

      const interactive = event.target?.closest?.('[data-cursor-spin="true"], button, [role="button"], a');
      setIsActiveTarget(Boolean(interactive));
    };

    const onPointerLeave = () => {
      setIsVisible(false);
      setIsActiveTarget(false);
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
    <>
      <motion.div
        className={`fancy-cursor-outer ${isVisible ? 'cursor-visible' : ''}`}
        style={{ x: outerX, y: outerY }}
        animate={isActiveTarget ? { scale: 1.45, opacity: 0.86 } : { scale: 1, opacity: 0.74 }}
        transition={{ duration: 0.16 }}
      />
      <motion.div
        className={`fancy-cursor-inner ${isVisible ? 'cursor-visible' : ''}`}
        style={{ x: innerX, y: innerY }}
        animate={isActiveTarget ? { scale: 0.78 } : { scale: 1 }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
}
