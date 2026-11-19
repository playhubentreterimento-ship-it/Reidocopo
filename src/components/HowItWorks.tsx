import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/content';

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className="relative w-full bg-[#EAE3D6] text-[#1A1816] py-32 sm:py-40 border-t border-[#1A1816]/10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20 sm:mb-24">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8975A] mb-4 block">
            Processo Transparente
          </span>

          <h2 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight font-normal text-[#1A1816] mb-6">
            Como <span className="italic font-normal">funciona.</span>
          </h2>

          <p className="text-base text-[#6B655C] leading-[1.7] font-normal">
            Três etapas descomplicadas para colocar a sua marca nas mãos dos seus convidados.
          </p>
        </div>

        {/* 3 Steps in Horizontal Line with Fine Gold Hairline */}
        <div className="relative">
          {/* 1px Fine Connecting Hairline (Desktop) */}
          <div className="hidden md:block absolute top-7 left-12 right-12 h-[1px] bg-[#B8975A]/40 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-start bg-[#EAE3D6] md:pr-6">
                {/* Step Number Circle / Indicator */}
                <div className="w-14 h-14 rounded-[2px] bg-[#F4EFE6] border border-[#B8975A] flex items-center justify-center font-serif text-2xl text-[#B8975A] mb-8 font-normal shadow-sm">
                  {step.step}
                </div>

                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6B655C] block mb-2">
                  {step.label}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1816] mb-4 font-normal">
                  {step.title}
                </h3>

                <p className="text-sm sm:text-base text-[#6B655C] leading-[1.7] font-normal">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
