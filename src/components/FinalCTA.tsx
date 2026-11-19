import React from 'react';
import { CONFIG } from '../config';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative w-full bg-[#0C0B0A] text-[#F4EFE6] py-36 sm:py-48 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 text-center">
        {/* Subtle gold label */}
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8975A] mb-6 block">
          Inicie Seu Projeto
        </span>

        {/* Headline */}
        <h2 className="font-serif text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[1.02] tracking-[-0.015em] text-[#F4EFE6] mb-8 font-normal max-w-3xl mx-auto">
          Sua marca merece{' '}
          <span className="italic font-normal">chegar longe.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-[#A59E92] text-base sm:text-lg leading-[1.7] max-w-xl mx-auto mb-12 font-normal">
          Ecopos de altíssima durabilidade que transformam eventos comuns em momentos memoráveis.
          Monte sua cotação em instantes.
        </p>

        {/* Two Rectangular 2px Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6">
          <a
            href="#catalogo"
            className="w-full sm:w-auto px-9 py-4 rounded-[2px] bg-[#F4EFE6] text-[#0C0B0A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#B8975A] hover:text-[#0C0B0A] transition-colors duration-200"
          >
            Montar minha cotação
          </a>

          <a
            href={CONFIG.whatsapp.getWhatsAppUrl([])}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-9 py-4 rounded-[2px] border border-white/25 text-[#F4EFE6] text-xs uppercase tracking-[0.14em] font-medium hover:border-[#B8975A] hover:text-[#B8975A] transition-colors duration-200"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
