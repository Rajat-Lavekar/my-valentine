import { useCallback, useEffect, useRef } from 'react';
import { INTRO_AUDIO, SLIDES_AUDIO, OUTRO_AUDIO } from '../data/slides';

// ── Volume targets for each zone ─────────────────────────────────────────────
const INTRO_VOLUME = 0.45;
const SLIDES_VOLUME = 0.5;
const OUTRO_VOLUME = 0.5;

// ── Smooth volume fading ─────────────────────────────────────────────────────
function fadeVolume(audio, to, durationMs = 1200) {
  if (!audio) {
    return;
  }

  // Cancel any in-flight fade
  if (audio._fadeId) {
    cancelAnimationFrame(audio._fadeId);
    audio._fadeId = null;
  }

  const from = audio.volume;

  if (Math.abs(from - to) < 0.01) {
    audio.volume = to;
    if (to === 0) {
      audio.pause();
    }
    return;
  }

  const start = performance.now();

  function step() {
    const elapsed = performance.now() - start;
    const t = Math.min(elapsed / durationMs, 1);
    // Ease-out curve for natural-sounding crossfades
    const eased = 1 - (1 - t) * (1 - t);
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * eased));

    if (t < 1) {
      audio._fadeId = requestAnimationFrame(step);
    } else {
      audio._fadeId = null;
      audio.volume = to;
      if (to === 0) {
        audio.pause();
      }
    }
  }

  audio._fadeId = requestAnimationFrame(step);
}

// ── Main hook ────────────────────────────────────────────────────────────────
export function useCinematicAudio({ slides, activeSlideId, introComplete }) {
  const introAudioRef = useRef(null);
  const slidesAudioRef = useRef(null);
  const outroAudioRef = useRef(null);
  const currentZoneRef = useRef(null);
  const audioCtxRef = useRef(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const createAudioElement = useCallback((src, loop = true) => {
    const audio = new Audio();
    audio.src = src;
    audio.loop = loop;
    audio.volume = 0;
    audio.preload = 'auto';
    return audio;
  }, []);

  const ensureAudioCtx = useCallback(async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // ── Zone detection ───────────────────────────────────────────────────────
  // Intro music: intro gate + 1st slide only. Slides music: from 2nd slide, no loop. Outro: last slide.

  const getZone = useCallback(
    (slideId) => {
      if (!slideId) {
        return null;
      }
      const idx = slides.findIndex((s) => s.id === slideId);
      if (idx < 0) {
        return null;
      }
      if (idx <= 0) {
        return 'intro';
      }
      if (idx >= slides.length - 1) {
        return 'outro';
      }
      return 'slides';
    },
    [slides]
  );

  // ── Public API ───────────────────────────────────────────────────────────

  const unlockAudio = useCallback(async () => {
    try {
      await ensureAudioCtx();
    } catch {
      // AudioContext creation can fail on some browsers; non-critical.
    }

    // Pre-create audio elements so they are ready when the zone kicks in
    if (!introAudioRef.current) {
      introAudioRef.current = createAudioElement(INTRO_AUDIO, true);
    }
    if (!slidesAudioRef.current) {
      slidesAudioRef.current = createAudioElement(SLIDES_AUDIO, false);
    }
    if (!outroAudioRef.current) {
      outroAudioRef.current = createAudioElement(OUTRO_AUDIO, false);
    }
  }, [createAudioElement, ensureAudioCtx]);

  // Called on first drag – starts the intro music immediately
  const startIntroBed = useCallback(() => {
    const audio = introAudioRef.current;
    if (!audio || !audio.paused) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
    fadeVolume(audio, INTRO_VOLUME, 1400);
  }, []);

  // No-op: the zone system handles when to stop each track
  const stopIntroBed = useCallback(() => {}, []);

  // ── Zone-based crossfades ────────────────────────────────────────────────
  useEffect(() => {
    if (!introComplete || !activeSlideId) {
      return;
    }

    const newZone = getZone(activeSlideId);
    if (newZone === currentZoneRef.current) {
      return;
    }

    const prev = currentZoneRef.current;
    currentZoneRef.current = newZone;

    // Fade out previous zone
    if (prev === 'intro') {
      fadeVolume(introAudioRef.current, 0, 1200);
    }
    if (prev === 'slides') {
      fadeVolume(slidesAudioRef.current, 0, 1200);
    }
    if (prev === 'outro') {
      fadeVolume(outroAudioRef.current, 0, 1200);
    }

    // Fade in new zone
    if (newZone === 'intro') {
      const a = introAudioRef.current;
      if (a) {
        if (a.paused) {
          a.play().catch(() => {});
        }
        fadeVolume(a, INTRO_VOLUME, 1000);
      }
    }

    if (newZone === 'slides') {
      const a = slidesAudioRef.current;
      if (a) {
        if (a.paused) {
          a.currentTime = 0;
          a.play().catch(() => {});
        }
        fadeVolume(a, SLIDES_VOLUME, 1400);
      }
    }

    if (newZone === 'outro') {
      const a = outroAudioRef.current;
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
        fadeVolume(a, OUTRO_VOLUME, 1400);
      }
    }
  }, [activeSlideId, introComplete, getZone]);

  // ── SFX: gentle chime (oscillator-based, no audio files needed) ──────────

  const playInteractionCue = useCallback(async () => {
    let ctx;
    try {
      ctx = await ensureAudioCtx();
    } catch {
      return;
    }

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698, now);
    osc1.frequency.exponentialRampToValueAtTime(523, now + 0.3);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(659, now + 0.35);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.04);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.55);
  }, [ensureAudioCtx]);

  // ── SFX: paper crinkle (white noise burst) ──────────────────────────────

  const playPaperFx = useCallback(async () => {
    let ctx;
    try {
      ctx = await ensureAudioCtx();
    } catch {
      return;
    }

    const now = ctx.currentTime;
    const len = Math.round(ctx.sampleRate * 0.15);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.Q.setValueAtTime(0.7, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.18);
  }, [ensureAudioCtx]);

  // ── Teardown ─────────────────────────────────────────────────────────────

  useEffect(
    () => () => {
      [introAudioRef, slidesAudioRef, outroAudioRef].forEach((ref) => {
        if (ref.current) {
          if (ref.current._fadeId) {
            cancelAnimationFrame(ref.current._fadeId);
          }
          ref.current.pause();
          ref.current.src = '';
          ref.current = null;
        }
      });

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    },
    []
  );

  return {
    unlockAudio,
    startIntroBed,
    stopIntroBed,
    playInteractionCue,
    playPaperFx
  };
}
