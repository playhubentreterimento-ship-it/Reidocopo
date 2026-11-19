import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, Shield, Recycle, Palette } from 'lucide-react';
import { CONFIG } from '../config';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [primaryBtnPos, setPrimaryBtnPos] = useState({ x: 0, y: 0 });
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const cupY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  // Mouse move handler for 3D parallax chips
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });

      // Magnetic button attraction (within 80px radius)
      if (primaryBtnRef.current) {
        const rect = primaryBtnRef.current.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (dist < 80) {
          const pullX = ((e.clientX - btnCenterX) / 80) * 8;
          const pullY = ((e.clientY - btnCenterY) / 80) * 8;
          setPrimaryBtnPos({ x: pullX, y: pullY });
        } else {
          setPrimaryBtnPos({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#0A0A0D] pt-24 pb-16 lg:py-0"
    >
      {/* Background with Ken Burns zoom + parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none z-0"
      >
        <div className="relative w-full h-full overflow-hidden">
          <img
            src="/assets/hero-bar-da-ink.webp"
            alt="Rei do Copo atmosfera de celebração"
            className="w-full h-full object-cover object-center animate-[kenBurns_24s_ease-in-out_infinite_alternate] opacity-40 brightness-90 filter contrast-110"
          />
          {/* Gradients overlay: top to bottom dark blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0D]/40 via-[#0A0A0D]/70 to-[#0A0A0D]" />
          {/* Radial Stage Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_10%,#0A0A0D_85%)] opacity-90" />
          {/* Subtle Stage Magenta/Gold ambient glows */}
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#FF2E93]/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#D9B777]/10 rounded-full blur-[160px] pointer-events-none" />
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100svh-6rem)]">
        {/* Left Column (Headline, Subhead, CTAs) */}
        <motion.div
          style={{ y: textY }}
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          {/* Experience Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#15151B]/80 border border-[#D9B777]/30 backdrop-blur-md mb-6 w-fit shadow-lg shadow-black/40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9B777] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F3E1B0]">
              {CONFIG.brand.experienceBadge}
            </span>
          </motion.div>

          {/* Headline with Text Reveal by Line */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="font-serif text-[clamp(2.6rem,7.5vw,7.2rem)] leading-[0.93] tracking-[-0.025em] text-[#F6F2EA]"
            >
              Leve sua marca até onde você{' '}
              <span className="italic font-normal text-gradient-brand inline-block">
                não imagina.
              </span>
            </motion.h1>
          </div>

          {/* Subheadline in fade-up */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="text-base sm:text-lg lg:text-xl text-[#A9A4B2] leading-relaxed max-w-xl mb-10 font-normal"
          >
            {CONFIG.brand.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
          >
            {/* Primary Magnetic CTA */}
            <motion.a
              ref={primaryBtnRef}
              href="#catalogo"
              style={{
                transform: `translate(${primaryBtnPos.x}px, ${primaryBtnPos.y}px)`,
              }}
              whileTap={{ scale: 0.97 }}
              className="relative group px-8 py-4 rounded-full text-sm sm:text-base font-semibold tracking-wide text-black text-center bg-gradient-to-r from-[#FF2E93] via-[#F3E1B0] to-[#D9B777] shadow-[0_0_40px_rgba(255,46,147,0.35)] hover:shadow-[0_0_60px_rgba(217,183,119,0.5)] transition-all duration-300 shine-effect cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-black" />
                Montar minha cotação
              </span>
            </motion.a>

            {/* Secondary Ghost CTA */}
            <motion.a
              href="#storytelling"
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm sm:text-base font-medium text-[#F6F2EA] bg-[#15151B]/60 hover:bg-[#1D1D25] border border-white/[0.09] hover:border-[#D9B777]/50 backdrop-blur-md transition-all duration-300 group cursor-pointer"
            >
              <span>Ver o processo</span>
              <span className="text-[#D9B777] group-hover:translate-y-1 transition-transform duration-300">
                ↓
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right Column: Floating Cup & Asymmetric Glass Chips */}
        <motion.div
          style={{ y: cupY }}
          className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[560px]"
        >
          {/* Subtle Stage Platform Backlight */}
          <div className="absolute w-72 h-72 sm:w-88 sm:h-88 bg-gradient-to-tr from-[#FF2E93]/20 via-[#D9B777]/15 to-transparent rounded-full blur-[80px] pointer-events-none" />

          {/* Central Glass Showcase Card with Floating Cup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
            className="relative z-10 w-full max-w-[320px] sm:max-w-[360px] aspect-[4/5] rounded-3xl glass-panel p-6 flex flex-col items-center justify-center group"
          >
            {/* Top glass hairline indicator */}
            <div className="w-full flex justify-between items-center mb-4 text-[#A9A4B2] text-xs font-mono">
              <span className="text-[#D9B777] tracking-wider">ECOPO PREMIUM</span>
              <span className="text-[10px] uppercase opacity-75">100% PERSONALIZÁVEL</span>
            </div>

            {/* Floating Cup Image with Levitation Animation */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-visible">
              <motion.img
                src="/assets/copo-degrade-rosa.webp"
                alt="Ecopo fosco degradê Rei do Copo"
                className="w-auto h-[260px] sm:h-[310px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] filter contrast-105 animate-levitate"
              />
              {/* Ground reflection illusion */}
              <div className="absolute bottom-1 w-36 h-4 bg-black/60 rounded-[100%] blur-md" />
            </div>

            {/* Bottom model name */}
            <div className="w-full text-center mt-3 pt-3 border-t border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#F3E1B0]">
                Fosco Degradê Acetinado
              </span>
            </div>
          </motion.div>

          {/* Glass Chip 1: Alta Resistência (Top Right) */}
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.9 }}
            style={{
              transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
            }}
            className="absolute top-4 right-0 sm:-right-4 z-20 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl glass-chip"
          >
            <Shield className="w-4 h-4 text-[#D9B777]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#F6F2EA]">
              Alta Resistência
            </span>
          </motion.div>

          {/* Glass Chip 2: 100% Personalizável (Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 1.1 }}
            style={{
              transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
            }}
            className="absolute bottom-6 left-0 sm:-left-6 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl glass-chip"
          >
            <Palette className="w-4 h-4 text-[#FF2E93]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#F6F2EA]">
              100% Personalizável
            </span>
          </motion.div>

          {/* Glass Chip 3: Ecológico (Top Left - desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 1.3 }}
            style={{
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
            }}
            className="absolute -top-3 left-2 sm:left-4 z-20 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-chip"
          >
            <Recycle className="w-3.5 h-3.5 text-[#F3E1B0]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#F6F2EA]">
              Ecológico
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#6E6A78]">
          Scroll
        </span>
        <div className="w-[1.5px] h-8 bg-white/[0.08] relative overflow-hidden rounded-full">
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-1/2 bg-gradient-to-b from-[#FF2E93] to-[#D9B777]"
          />
        </div>
      </motion.div>
    </section>
  );
};
