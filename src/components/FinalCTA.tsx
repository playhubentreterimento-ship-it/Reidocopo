import React from 'react';
import { CONFIG } from '../config';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative w-full bg-[#0C0B0A] text-[#F4EFE6] py-36 sm:py-48 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 text-center">
        {/* Subtle gold label pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8975A]/40 bg-[#B8975A]/10 text-xs text-[#B8975A] font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8975A]" />
          <span>Inicie seu projeto</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.08] tracking-[-0.02em] text-[#F4EFE6] mb-8 font-medium max-w-3xl mx-auto">
          Sua marca merece{' '}
          <span className="italic font-medium text-[#B8975A]">chegar longe.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-[#A59E92] text-base sm:text-lg leading-[1.65] max-w-xl mx-auto mb-12 font-normal">
          Ecopos de altíssima durabilidade que transformam eventos comuns em momentos memoráveis.
          Monte sua cotação em instantes.
        </p>

        {/* Pill Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="#catalogo"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F4EFE6] text-[#0C0B0A] text-[15px] font-semibold hover:bg-[#B8975A] transition-colors duration-200 inline-flex items-center justify-center gap-2 group"
          >
            <span>Montar minha cotação</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>

          <a
            href={CONFIG.whatsapp.getWhatsAppUrl([])}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#F4EFE6] hover:text-[#B8975A] transition-colors duration-200 py-3"
          >
            <span>Falar no WhatsApp</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
