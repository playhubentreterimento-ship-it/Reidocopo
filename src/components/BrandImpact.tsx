import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Sparkles, MoveHorizontal } from 'lucide-react';
import { MARQUEE_TEXT } from '../data/content';

const GALLERY_PHOTOS = [
  {
    src: '/assets/copo-degrade-rosa.webp',
    alt: 'Copo Fosco Degradê em celebração',
    label: 'FOSCO DEGRADÊ',
    height: 'h-[360px] sm:h-[440px]',
  },
  {
    src: '/assets/taca-preta-dourada.webp',
    alt: 'Taça Premium Black & Gold',
    label: 'TAÇA VIP',
    height: 'h-[320px] sm:h-[390px]',
  },
  {
    src: '/assets/copos-festa-iluminados.webp',
    alt: 'Copos iluminados na pista',
    label: 'ATMOSFERA DE PISTA',
    cropClass: 'crop-hide-bottom',
    height: 'h-[380px] sm:h-[470px]',
  },
  {
    src: '/assets/copos-vermelhos-cordoes.webp',
    alt: 'Copos vermelhos com cordões',
    label: 'COM ALÇA & TIRANTE',
    cropClass: 'crop-hide-top',
    height: 'h-[340px] sm:h-[410px]',
  },
  {
    src: '/assets/copo-brasil-praia.webp',
    alt: 'Copo solar evento praia',
    label: 'VERÃO & OPEN AIR',
    cropClass: 'crop-hide-bottom',
    height: 'h-[360px] sm:h-[430px]',
  },
  {
    src: '/assets/copos-choppada.webp',
    alt: 'Copo Choppada estampa total',
    label: 'ESTAMPA TOTAL 360°',
    cropClass: 'crop-hide-top',
    height: 'h-[370px] sm:h-[450px]',
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

  // Horizontal Sticky Scroll
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: horizontalScroll } = useScroll({
    target: horizontalSectionRef,
    offset: ['start start', 'end end'],
  });

  const translateX = useTransform(horizontalScroll, [0, 1], ['0%', '-55%']);

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
    <section id="impacto" className="relative w-full bg-[#0A0A0D] py-24 sm:py-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF2E93]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-[#D9B777]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Section Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-20 text-center">
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
        <div className="mt-12 flex justify-center">
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
      <div className="max-w-4xl mx-auto px-5 sm:px-8 mb-28">
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
      <div className="relative w-full py-5 border-y border-white/[0.06] bg-[#101015]/60 overflow-hidden mb-28">
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

      {/* Sticky Horizontal Gallery Strip */}
      <div ref={horizontalSectionRef} className="relative h-[280vh] w-full">
        <div className="sticky top-20 sm:top-24 h-[calc(100svh-6rem)] w-full overflow-hidden flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full mb-6 flex items-end justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777] block mb-2">
                GALERIA DE EXPERIÊNCIAS
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F6F2EA]">
                Ecopos nos melhores palcos
              </h3>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-[#A9A4B2]">
              Scroll vertical guia o horizonte →
            </span>
          </div>

          {/* Horizontal Track with Parallax & Hover Glow */}
          <motion.div
            style={{ x: translateX }}
            className="flex items-center gap-6 sm:gap-8 px-5 sm:px-8 will-change-transform"
          >
            {GALLERY_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-[270px] sm:w-[340px] ${photo.height} rounded-3xl overflow-hidden glass-panel group relative border border-white/[0.08] hover:border-[#D9B777]/50 transition-all duration-500 shadow-2xl`}
              >
                <div className="relative w-full h-full overflow-hidden">
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
                <div className="absolute bottom-5 inset-x-5 flex items-center justify-between z-10">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F3E1B0] px-3 py-1 rounded-full glass-chip border border-[#D9B777]/30">
                    {photo.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
