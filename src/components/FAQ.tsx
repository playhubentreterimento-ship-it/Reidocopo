import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQ_ITEMS } from '../data/content';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="relative w-full bg-[#F4EFE6] text-[#1A1816] py-32 sm:py-40 border-t border-[#1A1816]/10">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8975A]/40 bg-[#EAE3D6] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8975A]" />
            <span className="font-sans font-semibold text-[13px] text-[#1A1816]">
              Dúvidas frequentes
            </span>
          </div>

          <h2 className="font-serif font-medium text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-[#1A1816] mb-6">
            Perguntas <span className="italic font-medium text-[#B8975A]">frequentes.</span>
          </h2>

          <p className="font-sans text-[17px] sm:text-[18px] text-[#6B655C] leading-[1.65] font-normal">
            Tudo o que você precisa saber sobre a fabricação dos seus ecopos personalizados.
          </p>
        </div>

        {/* Clean Line-separated Accordion List */}
        <div className="border-b border-[#1A1816]/15">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="border-t border-[#1A1816]/15">
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full py-6 sm:py-7 flex items-center justify-between text-left gap-6 group"
                >
                  <span className="font-serif text-[1.4rem] sm:text-[1.55rem] text-[#1A1816] font-medium group-hover:text-[#B8975A] transition-colors leading-snug">
                    {item.question}
                  </span>

                  <span
                    className={`flex-shrink-0 text-[#1A1816] transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-[#B8975A]' : ''
                    }`}
                  >
                    <Plus className="w-5 h-5 stroke-[1.25]" />
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 text-[#6B655C] font-sans text-[16px] sm:text-[17px] leading-[1.65] font-normal max-w-2xl">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
