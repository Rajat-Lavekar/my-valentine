import { useEffect, useRef, useState } from 'react';

export function useTimedScrollHold({ rootRef, activeKey, enabled, holdMs = 900 }) {
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !activeKey) {
      setIsHolding(false);
      return;
    }

    // Briefly hold each active frame so audio/poetry can breathe before next scroll.
    setIsHolding(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsHolding(false);
      timeoutRef.current = null;
    }, holdMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [activeKey, enabled, holdMs]);

  useEffect(() => {
    if (!enabled || !isHolding) {
      return;
    }

    const rootNode = rootRef.current;
    if (!rootNode) {
      return;
    }

    const blockScroll = (event) => {
      event.preventDefault();
    };

    const blockKeys = (event) => {
      const blockedKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Spacebar'];
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    rootNode.addEventListener('wheel', blockScroll, { passive: false });
    rootNode.addEventListener('touchmove', blockScroll, { passive: false });
    window.addEventListener('keydown', blockKeys, { passive: false });

    return () => {
      rootNode.removeEventListener('wheel', blockScroll);
      rootNode.removeEventListener('touchmove', blockScroll);
      window.removeEventListener('keydown', blockKeys);
    };
  }, [enabled, isHolding, rootRef]);

  return isHolding;
}
