import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/content';

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className="relative w-full bg-[#EAE3D6] text-[#1A1816] py-32 sm:py-40 border-t border-[#1A1816]/10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8975A]/40 bg-[#F4EFE6] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8975A]" />
            <span className="font-sans font-semibold text-[13px] text-[#1A1816]">
              Processo transparente
            </span>
          </div>

          <h2 className="font-serif font-medium text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-[#1A1816] mb-6">
            Como <span className="italic font-medium text-[#B8975A]">funciona.</span>
          </h2>

          <p className="font-sans text-[17px] sm:text-[18px] text-[#6B655C] leading-[1.65] font-normal">
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
                {/* Step Number Circle */}
                <div className="w-14 h-14 rounded-full bg-[#F4EFE6] border border-[#B8975A] flex items-center justify-center font-serif text-2xl text-[#B8975A] mb-8 font-medium shadow-sm">
                  {step.step}
                </div>

                <span className="font-sans font-semibold text-[12px] text-[#6B655C] block mb-2 tracking-[0.04em]">
                  {step.label}
                </span>

                <h3 className="font-serif text-[1.45rem] sm:text-[1.6rem] text-[#1A1816] mb-3 font-medium">
                  {step.title}
                </h3>

                <p className="font-sans text-[16px] text-[#6B655C] leading-[1.65] font-normal">
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
