import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const unfoldSheetVariants = {
  initial: {
    scale: 0.3,
    rotate: -15,
    y: 28,
    opacity: 0.12,
    borderRadius: '58% 42% 54% 46% / 61% 39% 55% 45%',
    filter: 'blur(1.1px)'
  },
  open: {
    scale: 1,
    rotate: 0,
    y: 0,
    opacity: 1,
    borderRadius: 'var(--paper-radius)',
    filter: 'blur(0px)',
    transition: {
      duration: 1.25,
      ease: [0.2, 0.7, 0.2, 1]
    }
  }
};

const crumpleVariants = {
  visible: {
    scale: 1,
    opacity: 1,
    rotate: [0, -6, 3, -2, 0],
    transition: {
      rotate: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
    }
  },
  hidden: {
    scale: 0.2,
    opacity: 0,
    rotate: 12,
    transition: { duration: 0.42, ease: [0.2, 0.7, 0.2, 1] }
  }
};

const foldTop = {
  initial: { rotateX: -108, opacity: 0.9 },
  open: {
    rotateX: 0,
    opacity: 0.16,
    transition: { duration: 0.75, delay: 0.08, ease: [0.2, 0.7, 0.2, 1] }
  }
};

const foldBottom = {
  initial: { rotateX: 106, opacity: 0.9 },
  open: {
    rotateX: 0,
    opacity: 0.16,
    transition: { duration: 0.78, delay: 0.16, ease: [0.2, 0.7, 0.2, 1] }
  }
};

const foldLeft = {
  initial: { rotateY: 96, opacity: 0.85 },
  open: {
    rotateY: 0,
    opacity: 0.13,
    transition: { duration: 0.71, delay: 0.24, ease: [0.2, 0.7, 0.2, 1] }
  }
};

const foldRight = {
  initial: { rotateY: -98, opacity: 0.85 },
  open: {
    rotateY: 0,
    opacity: 0.13,
    transition: { duration: 0.71, delay: 0.28, ease: [0.2, 0.7, 0.2, 1] }
  }
};

const lineVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(2px)' },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.7 + index * 0.22,
      duration: 0.66,
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
    <div className="poem-wrap" style={paperStyles}>
      <motion.div
        className="paper-stage"
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpen();
          }
        }}
        data-cursor-spin="true"
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="paper-crumple"
              key="paper-crumple"
              variants={crumpleVariants}
              initial="visible"
              animate="visible"
              exit="hidden"
            >
              <span className="crumple-crease crease-1" />
              <span className="crumple-crease crease-2" />
              <span className="crumple-crease crease-3" />
              <p className="paper-hint">tap to unfold</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className={`paper-poem ${isOpen ? 'paper-open' : 'paper-closed'}`} variants={unfoldSheetVariants} initial="initial" animate={isOpen ? 'open' : 'initial'}>
          <motion.span className="paper-fold fold-top" variants={foldTop} initial="initial" animate={isOpen ? 'open' : 'initial'} />
          <motion.span className="paper-fold fold-bottom" variants={foldBottom} initial="initial" animate={isOpen ? 'open' : 'initial'} />
          <motion.span className="paper-fold fold-left" variants={foldLeft} initial="initial" animate={isOpen ? 'open' : 'initial'} />
          <motion.span className="paper-fold fold-right" variants={foldRight} initial="initial" animate={isOpen ? 'open' : 'initial'} />

          <p className="paper-title">{title}</p>

          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div key="paper-lines" className="paper-lines" initial="hidden" animate={isActive ? 'visible' : 'hidden'}>
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
    </div>
  );
}
