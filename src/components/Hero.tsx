import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[100svh] w-full bg-[#0C0B0A] text-[#F4EFE6] flex flex-col justify-between pt-32 sm:pt-36 pb-12 sm:pb-16 overflow-hidden">
      <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Typography & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          {/* Subtle gold label */}
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8975A] mb-6 block">
            Ecopos Personalizados · Alta Resistência
          </span>

          {/* Headline */}
          <h1 className="font-serif font-normal text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[1.02] tracking-[-0.015em] text-[#F4EFE6] mb-8">
            Leve sua marca até onde você{' '}
            <span className="italic font-normal text-[#F4EFE6]">
              não imagina.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#A59E92] text-base sm:text-lg leading-[1.7] max-w-[540px] mb-10 font-normal">
            {CONFIG.brand.subtitle}
          </p>

          {/* Buttons: Rectangular 2px corners, clean luxury styling */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <a
              href="#catalogo"
              className="px-8 py-4 rounded-[2px] bg-[#F4EFE6] text-[#0C0B0A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#B8975A] hover:text-[#0C0B0A] transition-colors duration-200"
            >
              Montar minha cotação
            </a>

            <a
              href="#storytelling"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#A59E92] hover:text-[#F4EFE6] transition-colors duration-200 py-1 border-b border-[#A59E92]/40 hover:border-[#F4EFE6] group"
            >
              <span>Ver o processo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
        </motion.div>

        {/* Right Column: Single High 4:5 Photo (Clean, No Floating Elements) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[2px] overflow-hidden bg-[#161514] border border-white/[0.08] relative group">
            <img
              src="/assets/taca-preta-dourada.webp"
              alt="Taça Premium Black & Gold Rei do Copo"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* Subtle bottom caption */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#A59E92] bg-[#0C0B0A]/85 backdrop-blur-sm px-3 py-1.5 border border-white/[0.06]">
              <span>LINHA NOBRE</span>
              <span className="text-[#B8975A]">PRETO & OURO</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Base Hairline with +10 Anos */}
      <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-8 mt-16 sm:mt-20">
        <div className="pt-6 border-t border-[#B8975A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono tracking-[0.16em] uppercase text-[#A59E92]">
          <span className="text-[#B8975A] font-medium">
            {CONFIG.brand.experienceBadge}
          </span>
          <span className="text-[11px] text-[#6E675D]">
            Fabricação nacional de alta resistência para eventos
          </span>
        </div>
      </div>
    </section>
  );
};
