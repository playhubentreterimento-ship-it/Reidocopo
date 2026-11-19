import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/content';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="relative w-full bg-[#0A0A0D] py-28 sm:py-36 overflow-hidden border-t border-white/[0.05]">
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-[#D9B777]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151B] border border-[#D9B777]/30 mb-5 shadow-lg"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#D9B777]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F3E1B0]">
              Tire Suas Dúvidas
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.98] tracking-tight text-[#F6F2EA] mb-6"
          >
            Perguntas <span className="italic text-gradient-brand">frequentes.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-[#A9A4B2] leading-relaxed"
          >
            Tudo o que você precisa saber sobre a fabricação dos seus ecopos personalizados.
          </motion.p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-[#15151B] border-[#D9B777]/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-[#101015]/80 border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left gap-4"
                >
                  <span
                    className={`font-serif text-xl sm:text-2xl transition-colors duration-200 ${
                      isOpen ? 'text-[#F6F2EA]' : 'text-[#F6F2EA]/90'
                    }`}
                  >
                    {item.question}
                  </span>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#D9B777] text-black rotate-45 shadow-[0_0_15px_rgba(217,183,119,0.5)]'
                        : 'bg-[#1D1D25] text-[#A9A4B2] hover:text-[#F6F2EA]'
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[2]" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-7 pt-2 text-[#A9A4B2] text-sm sm:text-base leading-relaxed border-t border-white/[0.05]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
