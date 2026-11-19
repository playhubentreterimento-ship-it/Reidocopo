import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SCROLL_MAP, STORYTELLING_STEPS, MODEL_CAPTIONS } from '../data/content';

const TOTAL_FRAMES = 240;

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

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);
  const [initialReady, setInitialReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.0005,
  });

  const [currentP, setCurrentP] = useState(0);

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
        img.onerror = () => resolve(img);
      });
    };

    const loadInitial = async () => {
      const initialPromises = [];
      for (let i = 0; i < Math.min(16, TOTAL_FRAMES); i++) {
        initialPromises.push(loadSingleImage(i));
      }
      await Promise.all(initialPromises);
      if (!isCancelled) {
        setInitialReady(true);
      }

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
            ctx.globalAlpha = 1.0;
            ctx.drawImage(img1, 0, 0, width, height);

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

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeCaption = useMemo(() => {
    const frameIndex = Math.round(mapProgressToFrame(currentP));
    const found = MODEL_CAPTIONS.find(
      c => frameIndex >= c.frameStart && frameIndex <= c.frameEnd
    );
    return found ? found.label : 'ECOPO PERSONALIZADO';
  }, [currentP]);

  if (isReducedMotion) {
    return (
      <section id="storytelling" className="py-32 bg-[#0C0B0A] text-[#F4EFE6] px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STORYTELLING_STEPS.map((step, idx) => (
            <div key={idx} className="border-t border-[#B8975A]/30 pt-6">
              <span className="font-mono text-xs text-[#B8975A] mb-3 block">
                {step.stepNumber} · PROCESSO
              </span>
              <h3 className="font-serif text-3xl mb-4 font-normal">{step.title}</h3>
              <p className="text-[#A59E92] leading-relaxed mb-6 text-sm">{step.text}</p>
              <img
                src={getFramePath(idx * 80)}
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
      <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden m-0 p-0">
        {!initialReady && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0C0B0A]/95">
            <div className="w-8 h-8 rounded-full border border-white/[0.1] border-t-[#B8975A] animate-spin mb-4" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8975A]">
              Carregando visualização ({Math.round((loadedCount / 16) * 100)}%)
            </span>
          </div>
        )}

        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-5 sm:px-8 h-full flex items-center justify-between">
          {/* Left: Clean Editorial Step Texts */}
          <div className="hidden lg:flex flex-col justify-center w-[46%] max-w-xl z-20">
            {/* Step 1 */}
            <div
              className={`transition-all duration-500 ${
                currentP <= 0.26 ? 'opacity-100 translate-y-0 block' : 'opacity-0 -translate-y-4 hidden'
              }`}
            >
              <span className="font-serif text-3xl sm:text-4xl text-[#B8975A] block mb-3 font-normal">
                01
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A59E92] block mb-4">
                {STORYTELLING_STEPS[0].microlabel}
              </span>
              <h2 className="font-serif text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.05] tracking-tight text-[#F4EFE6] mb-6 font-normal">
                Tudo começa com a{' '}
                <span className="italic font-normal">sua marca.</span>
              </h2>
              <p className="text-base text-[#A59E92] leading-[1.7] max-w-md font-normal">
                {STORYTELLING_STEPS[0].text}
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`transition-all duration-500 ${
                currentP > 0.26 && currentP <= 0.62
                  ? 'opacity-100 translate-y-0 block'
                  : 'opacity-0 translate-y-4 hidden'
              }`}
            >
              <span className="font-serif text-3xl sm:text-4xl text-[#B8975A] block mb-3 font-normal">
                02
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A59E92] block mb-4">
                {STORYTELLING_STEPS[1].microlabel}
              </span>
              <h2 className="font-serif text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.05] tracking-tight text-[#F4EFE6] mb-6 font-normal">
                Um modelo para{' '}
                <span className="italic font-normal">cada noite.</span>
              </h2>
              <p className="text-base text-[#A59E92] leading-[1.7] max-w-md font-normal">
                {STORYTELLING_STEPS[1].text}
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`transition-all duration-500 ${
                currentP > 0.62 ? 'opacity-100 translate-y-0 block' : 'opacity-0 translate-y-4 hidden'
              }`}
            >
              <span className="font-serif text-3xl sm:text-4xl text-[#B8975A] block mb-3 font-normal">
                03
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A59E92] block mb-4">
                {STORYTELLING_STEPS[2].microlabel}
              </span>
              <h2 className="font-serif text-[clamp(2.5rem,4.2vw,3.75rem)] leading-[1.05] tracking-tight text-[#F4EFE6] mb-6 font-normal">
                E ela vai aonde{' '}
                <span className="italic font-normal">você não está.</span>
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

          {/* Center / Right: 9:16 Canvas & Discreet Clean Badge */}
          <div className="relative flex-1 flex items-center justify-center h-full max-h-[88vh] py-4">
            <div className="relative aspect-[9/16] h-[78vh] sm:h-[82vh] max-h-[780px] rounded-[2px] overflow-hidden bg-[#121110] border border-white/[0.08] flex items-center justify-center">
              {/* Static base fallback */}
              <img
                src="/frames/frame_000000.webp"
                alt="Ecopo 3D Storytelling"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              <canvas
                ref={canvasRef}
                className="relative z-10 w-full h-full object-contain"
              />

              {/* Minimalist discreet caption label */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="px-3.5 py-1.5 rounded-[2px] bg-[#0C0B0A]/90 border border-white/[0.1] text-[10px] font-mono uppercase tracking-[0.2em] text-[#F4EFE6] whitespace-nowrap">
                  {activeCaption}
                </div>
              </div>
            </div>

            {/* Vertical 1px Gold Progress Bar with 3 small dots */}
            <div className="hidden sm:flex flex-col items-center ml-8 h-60 relative justify-between">
              <div className="absolute top-0 bottom-0 w-[1px] bg-white/[0.1]" />
              <div
                className="absolute top-0 w-[1px] bg-[#B8975A] transition-all duration-150"
                style={{ height: `${Math.min(100, Math.max(0, currentP * 100))}%` }}
              />

              <div
                className={`relative z-10 w-2 h-2 rounded-full border border-[#0C0B0A] transition-colors ${
                  currentP <= 0.26 ? 'bg-[#B8975A]' : 'bg-[#3A3630]'
                }`}
              />
              <div
                className={`relative z-10 w-2 h-2 rounded-full border border-[#0C0B0A] transition-colors ${
                  currentP > 0.26 && currentP <= 0.62 ? 'bg-[#B8975A]' : 'bg-[#3A3630]'
                }`}
              />
              <div
                className={`relative z-10 w-2 h-2 rounded-full border border-[#0C0B0A] transition-colors ${
                  currentP > 0.62 ? 'bg-[#B8975A]' : 'bg-[#3A3630]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Mobile Overlaid Step Texts */}
        <div className="lg:hidden absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/95 to-transparent z-20">
          <div className="max-w-md mx-auto text-center">
            {currentP <= 0.26 && (
              <div>
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
            )}
            {currentP > 0.26 && currentP <= 0.62 && (
              <div>
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
            )}
            {currentP > 0.62 && (
              <div>
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
