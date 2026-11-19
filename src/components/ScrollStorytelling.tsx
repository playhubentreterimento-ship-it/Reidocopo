import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SCROLL_MAP, STORYTELLING_STEPS, MODEL_CAPTIONS } from '../data/content';

const TOTAL_FRAMES = 240;

// Helper to format frame index to 6-digit padded string
const getFramePath = (index: number) => {
  const padded = String(Math.min(TOTAL_FRAMES - 1, Math.max(0, index))).padStart(6, '0');
  return `/frames/frame_${padded}.webp`;
};

// Map scroll progress (0..1) to frame index (0..239) via non-linear ranges
const mapProgressToFrame = (p: number): number => {
  const clamped = Math.max(0, Math.min(1, p));
  for (const range of SCROLL_MAP) {
    if (clamped >= range.pStart && clamped <= range.pEnd) {
      const segmentRatio = (clamped - range.pStart) / (range.pEnd - range.pStart || 1);
      const frameRatio = range.fStart + segmentRatio * (range.fEnd - range.fStart);
      return frameRatio * (TOTAL_FRAMES - 1);
    }
  }
  return clamped * (TOTAL_FRAMES - 1);
};

export const ScrollStorytelling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Progressive image caching state
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);
  const [initialReady, setInitialReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Framer Motion useScroll for container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring for high-end cinematic response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0005,
  });

  // Track numerical current progress value for step texts & captions
  const [currentP, setCurrentP] = useState(0);

  // Progressive frame loader: First 12 immediately, then batch the rest
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;

    const loadSingleImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(index);
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current[index] = img;
            loaded++;
            setLoadedCount(loaded);
            if (index < 12 && loaded >= 10) {
              setInitialReady(true);
            }
          }
          resolve(img);
        };
        img.onerror = () => {
          // Fallback resolve so loading continues
          resolve(img);
        };
      });
    };

    // Load initial 12 critical frames
    const loadInitial = async () => {
      const initialPromises = [];
      for (let i = 0; i < Math.min(16, TOTAL_FRAMES); i++) {
        initialPromises.push(loadSingleImage(i));
      }
      await Promise.all(initialPromises);
      if (!isCancelled) {
        setInitialReady(true);
      }

      // Progressively load remaining frames in idle / background chunks
      const remainingIndices: number[] = [];
      for (let i = 16; i < TOTAL_FRAMES; i++) {
        remainingIndices.push(i);
      }

      const chunkSize = 12;
      for (let i = 0; i < remainingIndices.length; i += chunkSize) {
        if (isCancelled) break;
        const chunk = remainingIndices.slice(i, i + chunkSize);
        await Promise.all(chunk.map(idx => loadSingleImage(idx)));
      }
    };

    loadInitial();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Canvas render loop connected to requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastRenderedFrame = -1;

    const render = () => {
      const p = smoothProgress.get();
      setCurrentP(p);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const frameVal = mapProgressToFrame(p);
          const fFloor = Math.floor(frameVal);
          const fCeil = Math.min(TOTAL_FRAMES - 1, fFloor + 1);
          const fFrac = frameVal - fFloor;

          const img1 = imagesRef.current[fFloor] || imagesRef.current[0];
          const img2 = imagesRef.current[fCeil] || img1;

          if (img1 && (fFloor !== lastRenderedFrame || fFrac > 0.01)) {
            lastRenderedFrame = fFloor;
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Draw base frame floor(f)
            ctx.globalAlpha = 1.0;
            ctx.drawImage(img1, 0, 0, width, height);

            // Sub-frame cross-dissolve with floor(f)+1
            if (img2 && img2 !== img1 && fFrac > 0.01) {
              ctx.globalAlpha = fFrac;
              ctx.drawImage(img2, 0, 0, width, height);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [smoothProgress]);

  // Adjust canvas size to device pixel ratio
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Canvas aspect ratio 9:16
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine current active caption based on frame
  const activeCaption = useMemo(() => {
    const frameIndex = Math.round(mapProgressToFrame(currentP));
    const found = MODEL_CAPTIONS.find(
      c => frameIndex >= c.frameStart && frameIndex <= c.frameEnd
    );
    return found ? found.label : 'ECOPO PERSONALIZADO';
  }, [currentP]);

  // Calculate dynamic glow color: hot magenta in beginning -> gold on final glass cup
  const glowStyle = useMemo(() => {
    if (currentP > 0.75) {
      return 'from-[#D9B777]/35 via-[#A8884A]/20 to-transparent';
    }
    if (currentP > 0.3) {
      return 'from-[#FF2E93]/25 via-[#D9B777]/20 to-transparent';
    }
    return 'from-[#FF2E93]/35 via-[#C9106F]/20 to-transparent';
  }, [currentP]);

  // If user prefers reduced motion, fallback to 3 static keyframes
  if (isReducedMotion) {
    return (
      <section id="storytelling" className="py-24 bg-[#0A0A0D] px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORYTELLING_STEPS.map((step, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#D9B777] mb-3 block">
                {step.microlabel}
              </span>
              <h3 className="font-serif text-3xl text-[#F6F2EA] mb-4">{step.title}</h3>
              <p className="text-[#A9A4B2] leading-relaxed mb-6">{step.text}</p>
              <img
                src={getFramePath(idx * 80)}
                alt={step.title}
                className="w-full aspect-[9/16] object-cover rounded-2xl"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="storytelling"
      ref={containerRef}
      className="relative w-full bg-[#0A0A0D] h-[600vh] md:h-[600vh] max-sm:h-[450vh]"
    >
      {/* Sticky 100svh Container */}
      <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden">
        {/* Ambient Stage Background & Dynamic Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className={`w-[360px] sm:w-[500px] h-[360px] sm:h-[500px] rounded-full blur-[140px] bg-gradient-to-b ${glowStyle} transition-colors duration-1000`}
          />
        </div>

        {/* Loading overlay if initial frames not loaded yet */}
        {!initialReady && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0A0A0D]/90 backdrop-blur-md">
            <div className="w-12 h-12 rounded-full border-2 border-white/[0.08] border-t-[#D9B777] animate-spin mb-4" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777]">
              Preparando visualização ({Math.round((loadedCount / 16) * 100)}%)
            </span>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-8 h-full flex items-center justify-between">
          {/* Left Column: Step Storytelling Texts (Desktop) */}
          <div className="hidden lg:flex flex-col justify-center w-[45%] max-w-xl z-20">
            {/* Step 1: 0..0.26 */}
            <motion.div
              style={{
                opacity: currentP <= 0.26 ? 1 : 0,
                transform: `translateY(${currentP <= 0.26 ? 0 : -20}px)`,
                pointerEvents: currentP <= 0.26 ? 'auto' : 'none',
              }}
              className={`transition-all duration-500 ${currentP <= 0.26 ? 'block' : 'hidden'}`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15151B] border border-[#D9B777]/30 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9B777]" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777]">
                  {STORYTELLING_STEPS[0].microlabel}
                </span>
              </div>
              <h2 className="font-serif text-[clamp(2.5rem,4.5vw,4.2rem)] leading-[1.02] tracking-tight text-[#F6F2EA] mb-6">
                Tudo começa com a{' '}
                <span className="italic text-gradient-brand">sua marca.</span>
              </h2>
              <p className="text-lg text-[#A9A4B2] leading-relaxed">
                {STORYTELLING_STEPS[0].text}
              </p>
            </motion.div>

            {/* Step 2: 0.26..0.62 */}
            <motion.div
              style={{
                opacity: currentP > 0.26 && currentP <= 0.62 ? 1 : 0,
                transform: `translateY(${
                  currentP > 0.26 && currentP <= 0.62 ? 0 : currentP <= 0.26 ? 20 : -20
                }px)`,
                pointerEvents: currentP > 0.26 && currentP <= 0.62 ? 'auto' : 'none',
              }}
              className={`transition-all duration-500 ${
                currentP > 0.26 && currentP <= 0.62 ? 'block' : 'hidden'
              }`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15151B] border border-[#FF2E93]/30 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E93]" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2E93]">
                  {STORYTELLING_STEPS[1].microlabel}
                </span>
              </div>
              <h2 className="font-serif text-[clamp(2.5rem,4.5vw,4.2rem)] leading-[1.02] tracking-tight text-[#F6F2EA] mb-6">
                Um modelo para{' '}
                <span className="italic text-gradient-brand">cada noite.</span>
              </h2>
              <p className="text-lg text-[#A9A4B2] leading-relaxed">
                {STORYTELLING_STEPS[1].text}
              </p>
            </motion.div>

            {/* Step 3: 0.62..1.0 */}
            <motion.div
              style={{
                opacity: currentP > 0.62 ? 1 : 0,
                transform: `translateY(${currentP > 0.62 ? 0 : 20}px)`,
                pointerEvents: currentP > 0.62 ? 'auto' : 'none',
              }}
              className={`transition-all duration-500 ${currentP > 0.62 ? 'block' : 'hidden'}`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15151B] border border-[#D9B777]/30 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9B777]" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777]">
                  {STORYTELLING_STEPS[2].microlabel}
                </span>
              </div>
              <h2 className="font-serif text-[clamp(2.5rem,4.5vw,4.2rem)] leading-[1.02] tracking-tight text-[#F6F2EA] mb-6">
                E ela vai aonde{' '}
                <span className="italic text-gradient-gold">você não está.</span>
              </h2>
              <p className="text-lg text-[#A9A4B2] leading-relaxed mb-8">
                {STORYTELLING_STEPS[2].text}
              </p>

              {/* Step 3 CTA Button */}
              <a
                href="#catalogo"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-black bg-gradient-to-r from-[#FF2E93] to-[#D9B777] shadow-[0_0_35px_rgba(255,46,147,0.35)] hover:shadow-[0_0_50px_rgba(217,183,119,0.5)] transition-all duration-300 shine-effect"
              >
                <span>{STORYTELLING_STEPS[2].ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Center Column: 9:16 Canvas & Floating Glass Caption */}
          <div className="relative flex-1 flex items-center justify-center h-full max-h-[90vh] py-4">
            <div className="relative aspect-[9/16] h-[78vh] sm:h-[84vh] max-h-[820px] rounded-3xl overflow-hidden glass-panel flex items-center justify-center shadow-[0_30px_70px_rgba(0,0,0,0.9)]">
              {/* HTML5 Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain filter contrast-105"
              />

              {/* Dynamic Glass Caption Badge on Bottom of Canvas */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <motion.div
                  key={activeCaption}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="px-4 py-1.5 rounded-full glass-chip flex items-center gap-2 border border-[#D9B777]/30 shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D9B777]" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F3E1B0] font-medium whitespace-nowrap">
                    {activeCaption}
                  </span>
                </motion.div>
              </div>

              {/* Reflection Highlight on Top Rim */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
              {/* Subtle ground shadow reflection */}
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#0A0A0D]/90 to-transparent pointer-events-none" />
            </div>

            {/* Vertical Progress Bar with 3 Stages */}
            <div className="hidden sm:flex flex-col items-center ml-6 sm:ml-8 h-64 relative justify-between">
              {/* Full line background */}
              <div className="absolute top-0 bottom-0 w-[2px] bg-white/[0.08] rounded-full" />
              {/* Dynamic progress fill line */}
              <div
                className="absolute top-0 w-[2px] bg-gradient-to-b from-[#FF2E93] to-[#D9B777] rounded-full transition-all duration-150"
                style={{ height: `${Math.min(100, Math.max(0, currentP * 100))}%` }}
              />

              {/* Point 1 */}
              <div
                className={`relative z-10 w-3 h-3 rounded-full border border-[#0A0A0D] transition-all duration-300 ${
                  currentP <= 0.26
                    ? 'bg-[#FF2E93] shadow-[0_0_12px_#FF2E93] scale-125'
                    : 'bg-[#D9B777]/40'
                }`}
              />
              {/* Point 2 */}
              <div
                className={`relative z-10 w-3 h-3 rounded-full border border-[#0A0A0D] transition-all duration-300 ${
                  currentP > 0.26 && currentP <= 0.62
                    ? 'bg-[#FF2E93] shadow-[0_0_12px_#FF2E93] scale-125'
                    : 'bg-[#D9B777]/40'
                }`}
              />
              {/* Point 3 */}
              <div
                className={`relative z-10 w-3 h-3 rounded-full border border-[#0A0A0D] transition-all duration-300 ${
                  currentP > 0.62
                    ? 'bg-[#D9B777] shadow-[0_0_12px_#D9B777] scale-125'
                    : 'bg-[#D9B777]/40'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Mobile Overlaid Step Texts (Bottom of Screen on Dark Gradient) */}
        <div className="lg:hidden absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/90 to-transparent z-20">
          <div className="max-w-md mx-auto text-center">
            {currentP <= 0.26 && (
              <div className="animate-fadeIn">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9B777] mb-1.5 block">
                  {STORYTELLING_STEPS[0].microlabel}
                </span>
                <h3 className="font-serif text-2xl text-[#F6F2EA] mb-2 leading-tight">
                  Tudo começa com a sua marca.
                </h3>
                <p className="text-xs text-[#A9A4B2] leading-relaxed line-clamp-2">
                  {STORYTELLING_STEPS[0].text}
                </p>
              </div>
            )}
            {currentP > 0.26 && currentP <= 0.62 && (
              <div className="animate-fadeIn">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2E93] mb-1.5 block">
                  {STORYTELLING_STEPS[1].microlabel}
                </span>
                <h3 className="font-serif text-2xl text-[#F6F2EA] mb-2 leading-tight">
                  Um modelo para cada noite.
                </h3>
                <p className="text-xs text-[#A9A4B2] leading-relaxed line-clamp-2">
                  {STORYTELLING_STEPS[1].text}
                </p>
              </div>
            )}
            {currentP > 0.62 && (
              <div className="animate-fadeIn">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9B777] mb-1.5 block">
                  {STORYTELLING_STEPS[2].microlabel}
                </span>
                <h3 className="font-serif text-2xl text-[#F6F2EA] mb-2 leading-tight">
                  E ela vai aonde você não está.
                </h3>
                <p className="text-xs text-[#A9A4B2] leading-relaxed mb-3 line-clamp-2">
                  {STORYTELLING_STEPS[2].text}
                </p>
                <a
                  href="#catalogo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-black bg-gradient-to-r from-[#FF2E93] to-[#D9B777]"
                >
                  <span>{STORYTELLING_STEPS[2].ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
