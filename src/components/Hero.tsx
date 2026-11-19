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
          {/* Selo: Plus Jakarta Sans 600, 13px em formato de pílula com ponto dourado */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#B8975A]/40 bg-[#161514] mb-8 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#B8975A]" />
            <span className="font-sans font-semibold text-[13px] text-[#F4EFE6]">
              {CONFIG.brand.experienceBadge}
            </span>
          </div>

          {/* H1: Fraunces 500, clamp(2.8rem, 6.4vw, 5.6rem), line-height 1.02, letter-spacing -0.025em */}
          <h1 className="font-serif font-medium text-[clamp(2.8rem,6.4vw,5.6rem)] leading-[1.02] tracking-[-0.025em] text-[#F4EFE6] mb-8 max-w-[620px]">
            Leve sua marca até onde você{' '}
            <span className="italic font-medium text-[#B8975A]">
              não imagina.
            </span>
          </h1>

          {/* Subtítulo: Plus Jakarta Sans 400, 17-18px, line-height 1.65 */}
          <p className="font-sans font-normal text-[#A59E92] text-[17px] sm:text-[18px] leading-[1.65] max-w-[540px] mb-10">
            {CONFIG.brand.subtitle}
          </p>

          {/* Botões: Plus Jakarta Sans 600, 15-16px, sem caixa-alta, pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 mb-8">
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#F4EFE6] text-[#0C0B0A] font-sans font-semibold text-[15px] sm:text-[16px] hover:bg-[#B8975A] hover:text-[#0C0B0A] transition-colors duration-200"
            >
              <span>Montar minha cotação</span>
              <span className="text-lg leading-none">→</span>
            </a>

            <a
              href="#storytelling"
              className="inline-flex items-center gap-2 font-sans font-semibold text-[15px] sm:text-[16px] text-[#A59E92] hover:text-[#F4EFE6] transition-colors duration-200 py-1 border-b border-[#A59E92]/40 hover:border-[#F4EFE6] group"
            >
              <span>Ver o processo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>

          {/* Linha de confiança abaixo do CTA da hero: 13-14px com 3 itens reais */}
          <div className="flex flex-wrap items-center gap-2.5 text-[13px] sm:text-[14px] text-[#A59E92] font-sans font-normal">
            <span>Orçamento sem compromisso</span>
            <span className="text-[#B8975A] text-xs">●</span>
            <span>Personalização total</span>
            <span className="text-[#B8975A] text-xs">●</span>
            <span>Alta resistência</span>
          </div>
        </motion.div>

        {/* Right Column: Single High 4:5 Photo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[14px] overflow-hidden bg-[#161514] border border-white/[0.08] relative group shadow-2xl">
            <img
              src="/assets/taca-preta-dourada.webp"
              alt="Taça Premium Black & Gold Rei do Copo"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[13px] font-sans font-medium text-[#A59E92] bg-[#0C0B0A]/85 backdrop-blur-sm px-4 py-2 rounded-full border border-white/[0.06]">
              <span>Linha Nobre</span>
              <span className="text-[#B8975A]">Preto & Ouro</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Base Hairline */}
      <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-8 mt-14 sm:mt-18">
        <div className="pt-6 border-t border-[#B8975A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans tracking-[0.04em] text-[#A59E92]">
          <span className="text-[#B8975A] font-medium text-[13px]">
            Ecopos sustentáveis e 100% reutilizáveis
          </span>
          <span className="text-[12px] text-[#6E675D]">
            Fabricação nacional de alta resistência para eventos
          </span>
        </div>
      </div>
    </section>
  );
};
