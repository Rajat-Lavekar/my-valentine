import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const paperVariants = {
  closed: {
    rotateX: 24,
    rotateZ: -4,
    scale: 0.89,
    y: 36,
    opacity: 0.85,
    filter: 'blur(0.2px)'
  },
  open: {
    rotateX: 0,
    rotateZ: 0,
    scale: 1,
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: [0.2, 0.7, 0.2, 1]
    }
  }
};

const lineVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(2px)' },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.5 + index * 0.24,
      duration: 0.68,
      ease: [0.2, 0.7, 0.2, 1]
    }
  })
};

export default function PaperPoem({ title, lines, crinkle, isActive, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const paperStyles = useMemo(() => {
    const safeCrinkle = Math.min(1, Math.max(0, crinkle));

    return {
      // Crumple gradually relaxes across later slides to mirror emotional resolution.
      '--paper-crinkle': safeCrinkle,
      '--paper-shadow': 0.26 + safeCrinkle * 0.34,
      '--paper-light': 0.96 - safeCrinkle * 0.08,
      '--paper-dark': 0.88 - safeCrinkle * 0.18,
      '--paper-radius': `${Math.round(34 - safeCrinkle * 17)}px`
    };
  }, [crinkle]);

  const handleOpen = () => {
    if (isOpen) {
      return;
    }

    setIsOpen(true);
    onOpen?.();
  };

  return (
    <motion.div className="poem-wrap" initial={false}>
      <motion.div
        className={`paper-poem ${isOpen ? 'paper-open' : 'paper-closed'}`}
        style={paperStyles}
        variants={paperVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpen();
          }
        }}
      >
        <p className="paper-title">{title}</p>
        {!isOpen && <p className="paper-hint">touch to unfold</p>}

        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="paper-lines"
              className="paper-lines"
              initial="hidden"
              animate={isActive ? 'visible' : 'hidden'}
            >
              {lines.map((line, index) => (
                <motion.p key={`${title}-${index}`} custom={index} variants={lineVariants}>
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
