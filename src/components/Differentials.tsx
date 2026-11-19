import React from 'react';
import { DIFFERENTIALS } from '../data/content';

export const Differentials: React.FC = () => {
  return (
    <section id="diferenciais" className="relative w-full bg-[#F4EFE6] text-[#1A1816] py-32 sm:py-40 border-t border-[#1A1816]/10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Subtle label */}
        <div className="text-center mb-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8975A]">
            O Padrão Rei do Copo
          </span>
        </div>

        {/* Statement Title */}
        <div className="text-center mb-20 sm:mb-24">
          <h2 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.05] tracking-tight font-normal text-[#1A1816]">
            Ecológico.{' '}
            <span className="italic font-normal">Resistente.</span>{' '}
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
                <span className="font-serif text-3xl sm:text-4xl text-[#B8975A] block mb-6 font-normal">
                  0{idx + 1}
                </span>

                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6B655C] block mb-3">
                  {item.tag}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1816] mb-4 font-normal">
                  {item.title}
                </h3>

                <p className="text-base text-[#6B655C] leading-[1.7] font-normal">
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
