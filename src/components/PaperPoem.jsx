import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WEB_ASSETS } from '../data/webAssets';

const lineVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(2px)' },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.4 + index * 0.22,
      duration: 0.66,
      ease: [0.2, 0.7, 0.2, 1]
    }
  })
};

export default function PaperPoem({ title, lines, crinkle, isActive, onOpen }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const timersRef = useRef([]);

  const paperStyles = useMemo(() => {
    const safeCrinkle = Math.min(1, Math.max(0, crinkle));

    return {
      '--paper-crinkle': safeCrinkle,
      '--paper-shadow': 0.26 + safeCrinkle * 0.34,
      '--paper-light': 0.96 - safeCrinkle * 0.08,
      '--paper-dark': 0.88 - safeCrinkle * 0.18,
      '--paper-radius': `${Math.round(34 - safeCrinkle * 17)}px`
    };
  }, [crinkle]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    },
    []
  );

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const handleToggle = () => {
    if (isOpening || isClosing) {
      return;
    }

    clearTimers();

    if (isOpen) {
      setIsClosing(true);
      setIsOpen(false);

      [3, 2, 1, 0].forEach((nextStep, index) => {
        const timer = window.setTimeout(() => {
          setStep(nextStep);
        }, 180 * (index + 1));
        timersRef.current.push(timer);
      });

      const finishTimer = window.setTimeout(() => {
        setIsClosing(false);
        setStep(0);
      }, 840);
      timersRef.current.push(finishTimer);
      return;
    }

    setStep(0);
    setIsOpening(true);
    onOpen?.();

    [1, 2, 3, 4].forEach((nextStep, index) => {
      const timer = window.setTimeout(() => {
        setStep(nextStep);
      }, 220 * (index + 1));
      timersRef.current.push(timer);
    });

    const finishTimer = window.setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
      setStep(4);
    }, 1100);
    timersRef.current.push(finishTimer);
  };

  return (
    <div className="poem-wrap" style={paperStyles}>
      <motion.div
        className="paper-stage"
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
          }
        }}
        data-cursor-spin="true"
      >
        <AnimatePresence>
          {!isOpen && !isOpening && !isClosing && (
            <motion.div
              className="paper-crumple"
              key="paper-crumple"
              initial={{ opacity: 0, scale: 0.7, rotate: 16 }}
              animate={{ opacity: 1, scale: 1, rotate: [4, -6, 3, -2, 2] }}
              exit={{ opacity: 0, scale: 0.3, rotate: -22 }}
              transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
              style={{ backgroundImage: `url(${WEB_ASSETS.crumpledPaperTexture})` }}
            >
              <p className="paper-hint">tap to unfold</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className={`web-paper-shell ${isOpening || isOpen || isClosing ? 'web-paper-visible' : ''}`} data-step={step}>
          <div className="web-paper">
            <div className="web-fold fold-00">
              <div className="web-next-fold">
                <div className="web-fold fold-01">
                  <div className="web-next-fold">
                    <div className="web-fold fold-02">
                      <div className="web-next-fold">
                        <div className="web-fold fold-03">
                          <div className="paper-final-content">
                            <p className="paper-title">{title}</p>

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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
