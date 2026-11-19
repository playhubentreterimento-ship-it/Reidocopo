import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SCROLL_MAP, STORYTELLING_STEPS, MODEL_CAPTIONS } from '../data/content';

const TOTAL_FRAMES = 120;

const getFramePath = (index: number) => {
  const padded = String(Math.min(TOTAL_FRAMES - 1, Math.max(0, index))).padStart(6, '0');
  return `/frames/frame_${padded}.webp`;
};

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

  // Direct DOM references for 60fps zero-react-render updates
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const mobileStep1Ref = useRef<HTMLDivElement>(null);
  const mobileStep2Ref = useRef<HTMLDivElement>(null);
  const mobileStep3Ref = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  const dot3Ref = useRef<HTMLDivElement>(null);

  // Store ImageBitmaps in a ref (never in useState)
  const bitmapsRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );

  const [initialReady, setInitialReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const lastDrawnValRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Framer Motion native scroll connection
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // useSpring with stiffness 140, damping 26, mass 0.8 for immediate native response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.8,
    restDelta: 0.0005,
  });

  // Progressive ImageBitmap loader: batches of 10, initial 12 first
  useEffect(() => {
    let isCancelled = false;

    const loadSingleBitmap = async (
      index: number
    ): Promise<ImageBitmap | HTMLImageElement | null> => {
      if (bitmapsRef.current[index]) return bitmapsRef.current[index];

      const url = getFramePath(index);

      // Prefer createImageBitmap for off-thread GPU decode
      if ('createImageBitmap' in window) {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          if (isCancelled) return null;
          const bmp = await createImageBitmap(blob);
          if (isCancelled) {
            bmp.close?.();
            return null;
          }
          bitmapsRef.current[index] = bmp;
          return bmp;
        } catch {
          // Fallback to Image
        }
      }

      return new Promise(resolve => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          if (!isCancelled) bitmapsRef.current[index] = img;
          resolve(img);
        };
        img.onerror = () => resolve(null);
      });
    };

    const loadSequence = async () => {
      // 1. First 12 frames with highest priority
      const initialPromises = [];
      for (let i = 0; i < Math.min(12, TOTAL_FRAMES); i++) {
        initialPromises.push(loadSingleBitmap(i));
      }
      await Promise.all(initialPromises);
      if (!isCancelled) {
        setInitialReady(true);
        drawFrame(0);
      }

      // 2. Remaining frames in batches of 10
      const remaining: number[] = [];
      for (let i = 12; i < TOTAL_FRAMES; i++) {
        remaining.push(i);
      }

      const batchSize = 10;
      for (let i = 0; i < remaining.length; i += batchSize) {
        if (isCancelled) break;
        const batch = remaining.slice(i, i + batchSize);
        await Promise.all(batch.map(idx => loadSingleBitmap(idx)));
      }
    };

    loadSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Canvas drawing function optimized for 60fps
  const drawFrame = (frameVal: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fFloor = Math.floor(frameVal);
    const fCeil = Math.min(TOTAL_FRAMES - 1, fFloor + 1);
    const fFrac = frameVal - fFloor;

    const img1 = bitmapsRef.current[fFloor] || bitmapsRef.current[0];
    const img2 = bitmapsRef.current[fCeil] || img1;

    if (!img1) return;

    ctx.imageSmoothingQuality = 'medium';
    ctx.imageSmoothingEnabled = true;

    const w = canvas.width;
    const h = canvas.height;

    // Crossfade optimization: draw single frame if close to boundary
    if (fFrac < 0.04 || !img2 || img2 === img1) {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img1, 0, 0, w, h);
    } else if (fFrac > 0.96) {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img2, 0, 0, w, h);
    } else {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img1, 0, 0, w, h);
      ctx.globalAlpha = fFrac;
      ctx.drawImage(img2, 0, 0, w, h);
    }

    lastDrawnValRef.current = frameVal;
  };

  // Fixed internal canvas dimension = displayed size x min(dpr, 1.5)
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      const newWidth = Math.round(rect.width * dpr);
      const newHeight = Math.round(rect.height * dpr);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        if (lastDrawnValRef.current >= 0) {
          drawFrame(lastDrawnValRef.current);
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Subscribe to motionValue "change" without React re-renders
  useEffect(() => {
    let lastStep = -1;
    let lastCaption = '';

    const unsubscribe = smoothProgress.on('change', (p: number) => {
      const clampedP = Math.max(0, Math.min(1, p));
      const frameVal = mapProgressToFrame(clampedP);

      // Only schedule canvas redraw if frameVal changed noticeably (>0.01)
      if (Math.abs(frameVal - lastDrawnValRef.current) > 0.01) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          drawFrame(frameVal);
        });
      }

      // Step text visibility updates via direct DOM
      const step = clampedP <= 0.26 ? 1 : clampedP <= 0.62 ? 2 : 3;
      if (step !== lastStep) {
        lastStep = step;

        // Desktop steps
        if (step1Ref.current) {
          step1Ref.current.style.display = step === 1 ? 'block' : 'none';
          step1Ref.current.style.opacity = step === 1 ? '1' : '0';
        }
        if (step2Ref.current) {
          step2Ref.current.style.display = step === 2 ? 'block' : 'none';
          step2Ref.current.style.opacity = step === 2 ? '1' : '0';
        }
        if (step3Ref.current) {
          step3Ref.current.style.display = step === 3 ? 'block' : 'none';
          step3Ref.current.style.opacity = step === 3 ? '1' : '0';
        }

        // Mobile steps
        if (mobileStep1Ref.current)
          mobileStep1Ref.current.style.display = step === 1 ? 'block' : 'none';
        if (mobileStep2Ref.current)
          mobileStep2Ref.current.style.display = step === 2 ? 'block' : 'none';
        if (mobileStep3Ref.current)
          mobileStep3Ref.current.style.display = step === 3 ? 'block' : 'none';

        // Dots
        if (dot1Ref.current)
          dot1Ref.current.style.backgroundColor = step === 1 ? '#B8975A' : '#3A3630';
        if (dot2Ref.current)
          dot2Ref.current.style.backgroundColor = step === 2 ? '#B8975A' : '#3A3630';
        if (dot3Ref.current)
          dot3Ref.current.style.backgroundColor = step === 3 ? '#B8975A' : '#3A3630';
      }

      // Caption label update
      const frameIndex = Math.round(frameVal);
      const foundCaption = MODEL_CAPTIONS.find(
        c => frameIndex >= c.frameStart && frameIndex <= c.frameEnd
      );
      const captionText = foundCaption ? foundCaption.label : 'ECOPO PERSONALIZADO';
      if (captionText !== lastCaption && captionRef.current) {
        lastCaption = captionText;
        captionRef.current.textContent = captionText;
      }

      // Progress bar vertical height
      if (progressLineRef.current) {
        progressLineRef.current.style.height = `${(clampedP * 100).toFixed(1)}%`;
      }
    });

    return () => {
      unsubscribe();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [smoothProgress]);

  if (isReducedMotion) {
    return (
      <section
        id="storytelling"
        className="py-32 bg-[#0C0B0A] text-[#F4EFE6] px-6 max-w-[1200px] mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STORYTELLING_STEPS.map((step, idx) => (
            <div key={idx} className="border-t border-[#B8975A]/30 pt-6">
              <span className="font-mono text-xs text-[#B8975A] mb-3 block">
                {step.stepNumber} · PROCESSO
              </span>
              <h3 className="font-serif text-3xl mb-4 font-normal">{step.title}</h3>
              <p className="text-[#A59E92] leading-relaxed mb-6 text-sm">{step.text}</p>
              <img
                src={getFramePath(idx * 40)}
                alt={step.title}
                className="w-full aspect-[9/16] object-cover rounded-[2px] border border-white/[0.08]"
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
      className="relative w-full bg-[#0C0B0A] text-[#F4EFE6] h-[300vh] max-sm:h-[240vh] m-0 p-0"
    >
      {/* Sticky 100svh Container with will-change: transform */}
      <div
        style={{ willChange: 'transform' }}
        className="sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden m-0 p-0"
      >
        {!initialReady && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0C0B0A]">
            <div className="w-8 h-8 rounded-full border border-white/[0.1] border-t-[#B8975A] animate-spin mb-4" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8975A]">
              Carregando visualização
            </span>
          </div>
        )}

        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-5 sm:px-8 h-full flex items-center justify-between">
          {/* Left: Step Storytelling Texts */}
          <div className="hidden lg:flex flex-col justify-center w-[46%] max-w-xl z-20">
            {/* Step 1 */}
            <div ref={step1Ref} className="transition-opacity duration-300 block opacity-100">
              <span className="font-serif text-3xl sm:text-4xl text-[#B8975A] block mb-3 font-normal">
                01
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A59E92] block mb-4">
                {STORYTELLING_STEPS[0].microlabel}
              </span>
              <h2 className="font-serif text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.05] tracking-tight text-[#F4EFE6] mb-6 font-normal">
                Tudo começa com a <span className="italic font-normal">sua marca.</span>
              </h2>
              <p className="text-base text-[#A59E92] leading-[1.7] max-w-md font-normal">
                {STORYTELLING_STEPS[0].text}
              </p>
            </div>

            {/* Step 2 */}
            <div ref={step2Ref} className="transition-opacity duration-300 hidden opacity-0">
              <span className="font-serif text-3xl sm:text-4xl text-[#B8975A] block mb-3 font-normal">
                02
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A59E92] block mb-4">
                {STORYTELLING_STEPS[1].microlabel}
              </span>
              <h2 className="font-serif text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.05] tracking-tight text-[#F4EFE6] mb-6 font-normal">
                Um modelo para <span className="italic font-normal">cada noite.</span>
              </h2>
              <p className="text-base text-[#A59E92] leading-[1.7] max-w-md font-normal">
                {STORYTELLING_STEPS[1].text}
              </p>
            </div>

            {/* Step 3 */}
            <div ref={step3Ref} className="transition-opacity duration-300 hidden opacity-0">
              <span className="font-serif text-3xl sm:text-4xl text-[#B8975A] block mb-3 font-normal">
                03
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A59E92] block mb-4">
                {STORYTELLING_STEPS[2].microlabel}
              </span>
              <h2 className="font-serif text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.05] tracking-tight text-[#F4EFE6] mb-6 font-normal">
                E ela vai aonde <span className="italic font-normal">você não está.</span>
              </h2>
              <p className="text-base text-[#A59E92] leading-[1.7] max-w-md font-normal mb-8">
                {STORYTELLING_STEPS[2].text}
              </p>

              <a
                href="#catalogo"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-[2px] bg-[#F4EFE6] text-[#0C0B0A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#B8975A] transition-colors"
              >
                <span>{STORYTELLING_STEPS[2].ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Center / Right: 9:16 Canvas (Clean, No shadows, No heavy filters) */}
          <div className="relative flex-1 flex items-center justify-center h-full max-h-[88vh] py-4">
            <div className="relative aspect-[9/16] h-[78vh] sm:h-[82vh] max-h-[780px] rounded-[2px] bg-[#0C0B0A] border border-white/[0.08] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain block"
              />

              {/* Minimal caption badge without backdrop-filter */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div
                  ref={captionRef}
                  className="px-3.5 py-1.5 rounded-[2px] bg-[#0C0B0A] border border-white/[0.1] text-[10px] font-mono uppercase tracking-[0.2em] text-[#F4EFE6] whitespace-nowrap"
                >
                  FOSCO DEGRADÊ
                </div>
              </div>
            </div>

            {/* Vertical 1px Gold Progress Bar */}
            <div className="hidden sm:flex flex-col items-center ml-8 h-60 relative justify-between">
              <div className="absolute top-0 bottom-0 w-[1px] bg-white/[0.1]" />
              <div
                ref={progressLineRef}
                className="absolute top-0 w-[1px] bg-[#B8975A]"
                style={{ height: '0%' }}
              />

              <div
                ref={dot1Ref}
                className="relative z-10 w-2 h-2 rounded-full border border-[#0C0B0A] bg-[#B8975A]"
              />
              <div
                ref={dot2Ref}
                className="relative z-10 w-2 h-2 rounded-full border border-[#0C0B0A] bg-[#3A3630]"
              />
              <div
                ref={dot3Ref}
                className="relative z-10 w-2 h-2 rounded-full border border-[#0C0B0A] bg-[#3A3630]"
              />
            </div>
          </div>
        </div>

        {/* Mobile Overlaid Step Texts */}
        <div className="lg:hidden absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/95 to-transparent z-20 pointer-events-none">
          <div className="max-w-md mx-auto text-center pointer-events-auto">
            <div ref={mobileStep1Ref} className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B8975A] mb-1 block">
                01 · IDENTIDADE
              </span>
              <h3 className="font-serif text-2xl text-[#F4EFE6] mb-2 font-normal">
                Tudo começa com a sua marca.
              </h3>
              <p className="text-xs text-[#A59E92] leading-relaxed line-clamp-2">
                {STORYTELLING_STEPS[0].text}
              </p>
            </div>

            <div ref={mobileStep2Ref} className="hidden">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B8975A] mb-1 block">
                02 · INFINITAS POSSIBILIDADES
              </span>
              <h3 className="font-serif text-2xl text-[#F4EFE6] mb-2 font-normal">
                Um modelo para cada noite.
              </h3>
              <p className="text-xs text-[#A59E92] leading-relaxed line-clamp-2">
                {STORYTELLING_STEPS[1].text}
              </p>
            </div>

            <div ref={mobileStep3Ref} className="hidden">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B8975A] mb-1 block">
                03 · PRESENÇA
              </span>
              <h3 className="font-serif text-2xl text-[#F4EFE6] mb-2 font-normal">
                E ela vai aonde você não está.
              </h3>
              <p className="text-xs text-[#A59E92] leading-relaxed mb-4 line-clamp-2">
                {STORYTELLING_STEPS[2].text}
              </p>
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[2px] text-xs font-medium uppercase tracking-[0.14em] text-[#0C0B0A] bg-[#F4EFE6]"
              >
                <span>{STORYTELLING_STEPS[2].ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
