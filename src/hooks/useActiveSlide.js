import { useEffect, useRef, useState } from 'react';

export function useActiveSlide({ rootRef, enabled }) {
  const visibilityRef = useRef(new Map());
  const [activeSlideId, setActiveSlideId] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setActiveSlideId(null);
      return;
    }

    const rootNode = rootRef.current;
    if (!rootNode) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slideId = entry.target.getAttribute('data-slide-id');
          if (slideId) {
            visibilityRef.current.set(slideId, entry.intersectionRatio);
          }
        });

        let strongestSlide = null;
        let strongestRatio = 0;

        visibilityRef.current.forEach((ratio, slideId) => {
          if (ratio > strongestRatio) {
            strongestRatio = ratio;
            strongestSlide = slideId;
          }
        });

        if (strongestSlide && strongestRatio > 0.55) {
          setActiveSlideId(strongestSlide);
        }
      },
      {
        root: rootNode,
        threshold: [0.25, 0.45, 0.6, 0.75, 0.9]
      }
    );

    const slideNodes = rootNode.querySelectorAll('[data-slide-id]');
    slideNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [enabled, rootRef]);

  return { activeSlideId };
}
