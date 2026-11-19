import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { DIFFERENTIALS } from '../data/content';

export const Differentials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to light up the three giant words sequentially
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'center center'],
  });

  const word1Opacity = useTransform(scrollYProgress, [0, 0.35], [0.25, 1]);
  const word2Opacity = useTransform(scrollYProgress, [0.35, 0.7], [0.25, 1]);
  const word3Opacity = useTransform(scrollYProgress, [0.7, 1.0], [0.25, 1]);

  return (
    <section
      id="diferenciais"
      ref={containerRef}
      className="relative w-full bg-[#0A0A0D] py-28 sm:py-36 overflow-hidden border-t border-white/[0.05]"
    >
      {/* Background glow highlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#FF2E93]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Top Tag */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151B] border border-[#D9B777]/30 shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9B777]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F3E1B0]">
              O Padrão Rei do Copo
            </span>
          </motion.div>
        </div>

        {/* Giant Statement: "Ecológico. Resistente. Seu." */}
        <div className="text-center mb-20 sm:mb-28">
          <h2 className="font-serif text-[clamp(2.8rem,7.5vw,7.5rem)] leading-[0.95] tracking-tight">
            <motion.span
              style={{ opacity: word1Opacity }}
              className="inline-block transition-opacity duration-300 text-[#F6F2EA]"
            >
              Ecológico.{' '}
            </motion.span>
            <motion.span
              style={{ opacity: word2Opacity }}
              className="inline-block transition-opacity duration-300 text-gradient-gold italic"
            >
              Resistente.{' '}
            </motion.span>
            <motion.span
              style={{ opacity: word3Opacity }}
              className="inline-block transition-opacity duration-300 text-gradient-brand font-normal"
            >
              Seu.
            </motion.span>
          </h2>
        </div>

        {/* 3 Asymmetric bespoke items (completely different layouts) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Item 1: Ecológico (Large showcase card with real cropped photo + text) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -6 }}
            className="lg:col-span-7 rounded-3xl glass-panel p-8 sm:p-10 relative overflow-hidden group border border-white/[0.08] hover:border-[#FF2E93]/60 hover:shadow-[0_0_50px_rgba(255,46,147,0.25)] transition-all duration-500 flex flex-col justify-between"
          >
            <div className="relative z-10">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777] block mb-3">
                {DIFFERENTIALS[0].tag}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F6F2EA] mb-4">
                {DIFFERENTIALS[0].title}
              </h3>
              <p className="text-base sm:text-lg text-[#A9A4B2] leading-relaxed max-w-lg mb-8">
                {DIFFERENTIALS[0].description}
              </p>
            </div>

            {/* Inset Photo Frame showcasing cup in nature / outdoor context */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mt-auto border border-white/[0.08]">
              <img
                src="/assets/copo-brasil-praia.webp"
                alt="Ecopo ecológico reutilizável"
                className="w-full h-full object-cover crop-hide-bottom group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D]/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass-chip border border-[#D9B777]/30">
                <RefreshCw className="w-3.5 h-3.5 text-[#D9B777]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#F3E1B0]">
                  Reutilização Contínua
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column with Items 2 and 3 */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            {/* Item 2: Alta Resistência (Bespoke typographic layout with fine-line icon) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              whileHover={{ y: -6 }}
              className="flex-1 rounded-3xl glass-panel p-8 sm:p-10 relative overflow-hidden group border border-white/[0.08] hover:border-[#D9B777]/60 hover:shadow-[0_0_45px_rgba(217,183,119,0.2)] transition-all duration-500 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777]">
                  {DIFFERENTIALS[1].tag}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#1D1D25] border border-white/[0.08] flex items-center justify-center text-[#D9B777] group-hover:scale-110 group-hover:border-[#D9B777] transition-all duration-300">
                  <ShieldCheck className="w-6 h-6 stroke-[1.25]" />
                </div>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl text-[#F6F2EA] mb-3">
                {DIFFERENTIALS[1].title}
              </h3>
              <p className="text-base text-[#A9A4B2] leading-relaxed">
                {DIFFERENTIALS[1].description}
              </p>

              {/* Decorative delicate hairline ruler */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#6E6A78]">
                <span>POLÍMERO NOBRE</span>
                <span className="text-[#D9B777]">ZERO TRINCAS</span>
              </div>
            </motion.div>

            {/* Item 3: 100% Personalizável (Micro-animated interactive layer layout) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="flex-1 rounded-3xl glass-panel p-8 sm:p-10 relative overflow-hidden group border border-white/[0.08] hover:border-[#FF2E93]/60 hover:shadow-[0_0_50px_rgba(255,46,147,0.25)] transition-all duration-500 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2E93]">
                  {DIFFERENTIALS[2].tag}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#1D1D25] border border-white/[0.08] flex items-center justify-center text-[#FF2E93] group-hover:scale-110 group-hover:border-[#FF2E93] transition-all duration-300">
                  <Layers className="w-6 h-6 stroke-[1.25]" />
                </div>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl text-[#F6F2EA] mb-3">
                {DIFFERENTIALS[2].title}
              </h3>
              <p className="text-base text-[#A9A4B2] leading-relaxed mb-6">
                {DIFFERENTIALS[2].description}
              </p>

              {/* Micro-animation of color layers */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#FF2E93] border-2 border-[#15151B] animate-pulse" />
                  <div className="w-7 h-7 rounded-full bg-[#D9B777] border-2 border-[#15151B]" />
                  <div className="w-7 h-7 rounded-full bg-[#101015] border-2 border-[#D9B777]" />
                </div>
                <span className="text-xs font-mono text-[#F3E1B0]">
                  Garantia de fidelidade cromática
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
