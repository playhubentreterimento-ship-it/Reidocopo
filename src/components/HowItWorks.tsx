import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Layers, Send, PartyPopper } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/content';

export const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 90%'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const stepIcons = [
    <Layers className="w-6 h-6 stroke-[1.25] text-[#FF2E93]" key={1} />,
    <Send className="w-6 h-6 stroke-[1.25] text-[#D9B777]" key={2} />,
    <PartyPopper className="w-6 h-6 stroke-[1.25] text-[#F3E1B0]" key={3} />,
  ];

  const stepImages = [
    '/assets/copo-degrade-rosa.webp',
    '/assets/copos-choppada.webp',
    '/assets/taca-preta-dourada.webp',
  ];

  return (
    <section
      id="como-funciona"
      ref={containerRef}
      className="relative w-full bg-[#0A0A0D] py-28 sm:py-36 overflow-hidden border-t border-white/[0.05]"
    >
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#FF2E93]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151B] border border-[#D9B777]/30 mb-5 shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9B777]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F3E1B0]">
              Fluxo Sem Fricção
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.98] tracking-tight text-[#F6F2EA] mb-6"
          >
            Como <span className="italic text-gradient-gold">funciona.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-[#A9A4B2] leading-relaxed"
          >
            Três etapas descomplicadas para colocar a sua marca nas mãos dos seus convidados.
          </motion.p>
        </div>

        {/* 3 Step Sequence with Connecting Animated Gold Line */}
        <div className="relative">
          {/* Vertical Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-[2px] bg-white/[0.08]">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-[#FF2E93] via-[#F3E1B0] to-[#D9B777]"
            />
          </div>

          <div className="space-y-16 sm:space-y-24">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className={`flex flex-col lg:flex-row items-center gap-8 sm:gap-12 ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content Box */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-serif text-6xl sm:text-7xl font-normal text-transparent [-webkit-text-stroke:1.5px_#D9B777] opacity-80">
                      {step.step}
                    </span>
                    <div className="p-3 rounded-2xl bg-[#15151B] border border-white/[0.08] shadow-lg">
                      {stepIcons[idx]}
                    </div>
                  </div>

                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777] mb-2 block">
                    {step.label}
                  </span>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#F6F2EA] mb-4">
                    {step.title}
                  </h3>

                  <p className="text-base sm:text-lg text-[#A9A4B2] leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>

                {/* Photo Inset Frame */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-[380px] aspect-[4/3] rounded-3xl overflow-hidden glass-panel p-6 flex items-center justify-center border border-white/[0.08] group hover:border-[#D9B777]/50 transition-all duration-500 shadow-xl">
                    <img
                      src={stepImages[idx]}
                      alt={step.title}
                      className="max-h-[190px] w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#D9B777] animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
