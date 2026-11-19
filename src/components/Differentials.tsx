import React from 'react';
import { DIFFERENTIALS } from '../data/content';

export const Differentials: React.FC = () => {
  return (
    <section id="diferenciais" className="relative w-full bg-[#F4EFE6] text-[#1A1816] py-32 sm:py-40 border-t border-[#1A1816]/10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Subtle pill label with gold dot */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8975A]/40 bg-[#EAE3D6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8975A]" />
            <span className="font-sans font-semibold text-[13px] text-[#1A1816]">
              O padrão Rei do Copo
            </span>
          </div>
        </div>

        {/* Statement Title: Fraunces 500 with Italic Gold */}
        <div className="text-center mb-20 sm:mb-24">
          <h2 className="font-serif font-medium text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-[#1A1816]">
            Ecológico.{' '}
            <span className="italic font-medium text-[#B8975A]">Resistente.</span>{' '}
            Seu.
          </h2>
        </div>

        {/* 3 Columns separated by 1px vertical hairlines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
          {DIFFERENTIALS.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between py-2 md:px-10 ${
                idx > 0 ? 'md:border-l md:border-[#1A1816]/15' : ''
              }`}
            >
              <div>
                <span className="font-serif text-4xl sm:text-5xl text-[#B8975A] block mb-5 font-medium">
                  0{idx + 1}
                </span>

                <span className="font-sans font-semibold text-[12px] text-[#6B655C] block mb-2 tracking-[0.04em]">
                  {item.tag}
                </span>

                <h3 className="font-serif text-[1.45rem] sm:text-[1.6rem] text-[#1A1816] mb-3 font-medium">
                  {item.title}
                </h3>

                <p className="font-sans font-normal text-[17px] text-[#6B655C] leading-[1.65]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
