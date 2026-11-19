import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, MoveHorizontal } from 'lucide-react';
import { MARQUEE_TEXT } from '../data/content';

const GALLERY_PHOTOS = [
  {
    src: '/assets/copo-degrade-rosa.webp',
    alt: 'Copo Fosco Degradê em celebração',
    label: 'FOSCO DEGRADÊ',
    span: 'sm:col-span-7 h-[340px] sm:h-[380px]',
  },
  {
    src: '/assets/taca-preta-dourada.webp',
    alt: 'Taça Premium Black & Gold',
    label: 'TAÇA VIP',
    span: 'sm:col-span-5 h-[340px] sm:h-[380px]',
  },
  {
    src: '/assets/copos-festa-iluminados.webp',
    alt: 'Copos iluminados na pista',
    label: 'ATMOSFERA DE PISTA',
    cropClass: 'crop-hide-bottom',
    span: 'sm:col-span-4 h-[300px] sm:h-[340px]',
  },
  {
    src: '/assets/copos-vermelhos-cordoes.webp',
    alt: 'Copos vermelhos com cordões',
    label: 'COM ALÇA & TIRANTE',
    cropClass: 'crop-hide-top',
    span: 'sm:col-span-4 h-[300px] sm:h-[340px]',
  },
  {
    src: '/assets/copo-brasil-praia.webp',
    alt: 'Copo solar evento praia',
    label: 'VERÃO & OPEN AIR',
    cropClass: 'crop-hide-bottom',
    span: 'sm:col-span-4 h-[300px] sm:h-[340px]',
  },
  {
    src: '/assets/copos-choppada.webp',
    alt: 'Copo Choppada estampa total',
    label: 'ESTAMPA TOTAL 360°',
    cropClass: 'crop-hide-top',
    span: 'sm:col-span-12 h-[260px] sm:h-[300px]',
  },
];

export const BrandImpact: React.FC = () => {
  // Before / After Slider state
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(95, Math.max(5, pos)));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleSliderMove(e.touches[0].clientX);
  };

  // Marquee scroll direction reaction
  const [scrollDirection, setScrollDirection] = useState<'normal' | 'reverse'>('normal');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY.current) {
        setScrollDirection('normal');
      } else {
        setScrollDirection('reverse');
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Count up animation for +10 anos
  const countRef = useRef<HTMLSpanElement>(null);
  const isCountInView = useInView(countRef, { once: true });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (isCountInView) {
      let start = 0;
      const end = 10;
      const duration = 1200;
      const stepTime = duration / end;
      const timer = setInterval(() => {
        start += 1;
        setDisplayCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isCountInView]);

  return (
    <section id="impacto" className="relative w-full bg-[#0A0A0D] pt-16 sm:pt-20 pb-20 sm:pb-24 overflow-hidden m-0">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF2E93]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-[#D9B777]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Section Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-14 sm:mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151B] border border-[#D9B777]/30 mb-6 shadow-lg shadow-black/50"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D9B777]" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F3E1B0]">
            Sua Marca Em Mil Mãos
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-tight text-[#F6F2EA] max-w-4xl mx-auto mb-6"
        >
          Sem marca, é só um copo.{' '}
          <span className="italic text-gradient-brand">Com ela, é lembrança.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg text-[#A9A4B2] max-w-2xl mx-auto leading-relaxed"
        >
          Um copo descartável termina no lixo em minutos. Um ecopo personalizado acompanha seu
          convidado para casa e mantém sua história viva nos momentos mais autênticos.
        </motion.p>

        {/* Counter: +10 anos de mercado */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 px-8 py-4 rounded-3xl glass-panel border border-[#D9B777]/25 shadow-xl">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-5xl sm:text-6xl text-gradient-gold font-normal">
                +<span ref={countRef}>{displayCount}</span>
              </span>
              <span className="font-serif text-2xl text-[#D9B777] italic">anos</span>
            </div>
            <div className="h-[1px] sm:h-10 w-16 sm:w-[1px] bg-white/[0.1]" />
            <div className="text-center sm:text-left">
              <span className="block font-mono text-xs uppercase tracking-[0.2em] text-[#F6F2EA]">
                Tradição & Excelência
              </span>
              <span className="text-xs text-[#A9A4B2]">
                Fabricando ecopos de alta resistência para todo o Brasil.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Before / After Comparison */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 mb-16 sm:mb-20">
        <div className="text-center mb-6">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D9B777]">
            Interativo · Arraste para comparar
          </span>
        </div>

        <div
          ref={sliderContainerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] rounded-3xl overflow-hidden select-none cursor-ew-resize glass-panel shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/[0.08]"
        >
          {/* AFTER Image (Full colored personalized cup) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/assets/copos-choppada.webp"
              alt="Ecopo Personalizado com Marca Viva"
              className="w-full h-full object-cover crop-hide-top brightness-105 contrast-105"
            />
            {/* Label After */}
            <div className="absolute bottom-5 right-5 px-4 py-1.5 rounded-full glass-chip border border-[#D9B777]/30">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F3E1B0] font-semibold">
                DEPOIS · COM MARCA
              </span>
            </div>
          </div>

          {/* BEFORE Image (Desaturated cold monochrome) */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="relative w-full h-full">
              <img
                src="/assets/copos-choppada.webp"
                alt="Copo genérico sem identidade"
                className="absolute inset-0 w-full h-full object-cover crop-hide-top filter grayscale contrast-90 brightness-75"
                style={{
                  width: sliderContainerRef.current?.offsetWidth || '100%',
                  maxWidth: 'none',
                }}
              />
              <div className="absolute inset-0 bg-[#0A0A0D]/30" />
            </div>

            {/* Label Before */}
            <div className="absolute bottom-5 left-5 px-4 py-1.5 rounded-full glass-panel border border-white/[0.1]">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A9A4B2]">
                ANTES · SEM MARCA
              </span>
            </div>
          </div>

          {/* Vertical Divider Hairline with Gold Knob */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FF2E93] via-[#F3E1B0] to-[#D9B777] z-30"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#15151B] border-2 border-[#D9B777] shadow-[0_0_20px_rgba(217,183,119,0.6)] flex items-center justify-center text-[#D9B777]">
              <MoveHorizontal className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Slow Marquee Banner */}
      <div className="relative w-full py-5 border-y border-white/[0.06] bg-[#101015]/60 overflow-hidden mb-16 sm:mb-20">
        <motion.div
          animate={{
            x: scrollDirection === 'normal' ? ['0%', '-50%'] : ['-50%', '0%'],
          }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
          className="flex whitespace-nowrap gap-8 w-fit"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.1em] text-transparent [-webkit-text-stroke:1px_rgba(246,242,234,0.35)] hover:[-webkit-text-stroke:1px_#D9B777] transition-all duration-300"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Galeria Estática de Fotos (Sem Sticky, Altura Natural) */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777] block mb-2">
              GALERIA DE EXPERIÊNCIAS
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#F6F2EA]">
              Ecopos nos melhores palcos
            </h3>
          </div>
          <span className="sm:hidden font-mono text-[11px] text-[#A9A4B2]">
            Arraste para o lado →
          </span>
        </div>

        {/* Desktop: Grade Assimétrica Natural */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-6 items-stretch">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <div
              key={idx}
              className={`${photo.span} rounded-3xl overflow-hidden glass-panel group relative border border-white/[0.08] hover:border-[#D9B777]/50 transition-all duration-500 shadow-xl flex flex-col justify-end`}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-110 ${
                    photo.cropClass || 'object-center'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/90 via-transparent to-transparent opacity-80" />
              </div>

              {/* Bottom glass label */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F3E1B0] px-3.5 py-1 rounded-full glass-chip border border-[#D9B777]/30">
                  {photo.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carrossel Horizontal com Scroll-Snap Nativo */}
        <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-5 px-5">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <div
              key={idx}
              className="snap-center flex-shrink-0 w-[270px] aspect-[4/5] rounded-3xl overflow-hidden glass-panel group relative border border-white/[0.08] flex flex-col justify-end shadow-xl"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`w-full h-full object-cover ${photo.cropClass || 'object-center'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/90 via-transparent to-transparent opacity-80" />
              </div>

              <div className="relative z-10 p-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F3E1B0] px-3 py-1 rounded-full glass-chip border border-[#D9B777]/30">
                  {photo.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
