import { useCallback, useEffect, useRef } from 'react';
import { INTRO_AUDIO, INTRO_CUE_AUDIO, PAPER_AUDIO } from '../data/slides';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function useCinematicAudio({ slides, activeSlideId, introComplete }) {
  const contextRef = useRef(null);
  const bufferCacheRef = useRef(new Map());
  const loadingCacheRef = useRef(new Map());
  const activeSlideRef = useRef(null);
  // Story clips are one-shot by slide so revisiting a frame does not retrigger it.
  const playedSlideRef = useRef(new Set());
  const introInstanceRef = useRef(null);

  const ensureContext = useCallback(async () => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }

    if (contextRef.current.state === 'suspended') {
      await contextRef.current.resume();
    }

    return contextRef.current;
  }, []);

  const loadBuffer = useCallback(
    async (url) => {
      if (!url) {
        return null;
      }

      if (bufferCacheRef.current.has(url)) {
        return bufferCacheRef.current.get(url);
      }

      if (!loadingCacheRef.current.has(url)) {
        const loadingPromise = (async () => {
          const context = await ensureContext();
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Audio fetch failed for ${url}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);
          bufferCacheRef.current.set(url, audioBuffer);
          return audioBuffer;
        })();

        loadingCacheRef.current.set(url, loadingPromise);
      }

      try {
        return await loadingCacheRef.current.get(url);
      } finally {
        loadingCacheRef.current.delete(url);
      }
    },
    [ensureContext]
  );

  const stopInstance = useCallback((instance, fadeOutSeconds = 0.55) => {
    if (!instance || !instance.gain || !instance.source || !contextRef.current) {
      return;
    }

    const context = contextRef.current;
    const now = context.currentTime;

    instance.gain.gain.cancelScheduledValues(now);
    instance.gain.gain.setValueAtTime(instance.gain.gain.value, now);
    instance.gain.gain.linearRampToValueAtTime(0.0001, now + fadeOutSeconds);

    window.setTimeout(() => {
      try {
        instance.source.stop();
      } catch {
        // Stopping twice should not crash the experience.
      }
      try {
        instance.source.disconnect();
        instance.gain.disconnect();
      } catch {
        // Ignore disconnect errors during teardown.
      }
    }, Math.ceil(fadeOutSeconds * 1000) + 30);
  }, []);

  const spawnClip = useCallback(
    async (url, options = {}) => {
      const { loop = false, volume = 0.8, fadeInSeconds = 0.28 } = options;
      const context = await ensureContext();
      const buffer = await loadBuffer(url);

      if (!buffer) {
        return null;
      }

      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      source.loop = loop;

      const targetVolume = clamp(volume, 0, 1);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.linearRampToValueAtTime(targetVolume, context.currentTime + fadeInSeconds);

      source.connect(gain);
      gain.connect(context.destination);
      source.start(0);

      return { source, gain, url };
    },
    [ensureContext, loadBuffer]
  );

  const unlockAudio = useCallback(async () => {
    try {
      await ensureContext();
    } catch (error) {
      console.warn('Unable to unlock audio context', error);
    }
  }, [ensureContext]);

  const startIntroBed = useCallback(async () => {
    if (introInstanceRef.current || !INTRO_AUDIO) {
      return;
    }

    try {
      const instance = await spawnClip(INTRO_AUDIO, {
        loop: true,
        volume: 0.42,
        fadeInSeconds: 1.1
      });

      introInstanceRef.current = instance;
    } catch (error) {
      console.warn('Unable to start intro bed', error);
    }
  }, [spawnClip]);

  const stopIntroBed = useCallback(() => {
    if (!introInstanceRef.current) {
      return;
    }

    stopInstance(introInstanceRef.current, 1.1);
    introInstanceRef.current = null;
  }, [stopInstance]);

  const playInteractionCue = useCallback(async () => {
    if (!INTRO_CUE_AUDIO) {
      return;
    }

    try {
      const instance = await spawnClip(INTRO_CUE_AUDIO, {
        loop: false,
        volume: 0.53,
        fadeInSeconds: 0.03
      });

      if (instance?.source) {
        instance.source.onended = () => {
          try {
            instance.source.disconnect();
            instance.gain.disconnect();
          } catch {
            // Ignore cue teardown errors.
          }
        };
      }
    } catch (error) {
      console.warn('Unable to play interaction cue', error);
    }
  }, [spawnClip]);

  const playPaperFx = useCallback(async () => {
    if (!PAPER_AUDIO) {
      return;
    }

    try {
      const instance = await spawnClip(PAPER_AUDIO, {
        loop: false,
        volume: 0.36,
        fadeInSeconds: 0.02
      });

      if (instance?.source) {
        instance.source.onended = () => {
          try {
            instance.source.disconnect();
            instance.gain.disconnect();
          } catch {
            // Ignore paper cue teardown errors.
          }
        };
      }
    } catch (error) {
      console.warn('Unable to play paper SFX', error);
    }
  }, [spawnClip]);

  useEffect(() => {
    if (!introComplete) {
      if (activeSlideRef.current) {
        stopInstance(activeSlideRef.current.instance, 0.35);
        activeSlideRef.current = null;
      }
      return;
    }

    if (!activeSlideId) {
      if (activeSlideRef.current) {
        stopInstance(activeSlideRef.current.instance, 0.5);
        activeSlideRef.current = null;
      }
      return;
    }

    const currentInstance = activeSlideRef.current;
    if (currentInstance && currentInstance.slideId === activeSlideId) {
      return;
    }

    if (currentInstance) {
      stopInstance(currentInstance.instance, 0.5);
      activeSlideRef.current = null;
    }

    const slide = slides.find((item) => item.id === activeSlideId);
    if (!slide?.audio || playedSlideRef.current.has(activeSlideId)) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const instance = await spawnClip(slide.audio, {
          loop: false,
          volume: 0.9,
          fadeInSeconds: 0.36
        });

        if (!instance) {
          return;
        }

        if (cancelled) {
          stopInstance(instance, 0.08);
          return;
        }

        playedSlideRef.current.add(activeSlideId);
        activeSlideRef.current = { slideId: activeSlideId, instance };

        instance.source.onended = () => {
          if (activeSlideRef.current?.slideId === activeSlideId) {
            activeSlideRef.current = null;
          }
          try {
            instance.source.disconnect();
            instance.gain.disconnect();
          } catch {
            // Ignore teardown disconnect errors.
          }
        };
      } catch (error) {
        console.warn(`Unable to play clip for ${activeSlideId}`, error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSlideId, introComplete, slides, spawnClip, stopInstance]);

  useEffect(
    () => () => {
      stopIntroBed();
      if (activeSlideRef.current) {
        stopInstance(activeSlideRef.current.instance, 0.2);
      }

      if (contextRef.current && contextRef.current.state !== 'closed') {
        contextRef.current.close();
      }
    },
    [stopInstance, stopIntroBed]
  );

  return {
    unlockAudio,
    startIntroBed,
    stopIntroBed,
    playInteractionCue,
    playPaperFx
  };
}
