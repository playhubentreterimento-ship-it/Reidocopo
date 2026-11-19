import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { CONFIG } from '../config';

export const FloatingQuoteButton: React.FC = () => {
  const { totalDistinct, openDrawer, items } = useQuote();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = CONFIG.whatsapp.getWhatsAppUrl(
    items.map(i => ({ name: i.item.name, quantity: i.quantity }))
  );

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop Floating Discreet Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="hidden sm:block fixed bottom-8 right-8 z-40"
          >
            <button
              onClick={openDrawer}
              className="px-5 py-3 rounded-[2px] bg-[#0C0B0A] text-[#F4EFE6] border border-[#B8975A]/60 text-xs font-mono uppercase tracking-[0.16em] hover:bg-[#B8975A] hover:text-[#0C0B0A] hover:border-[#B8975A] transition-colors shadow-xl flex items-center gap-3 font-medium"
            >
              <span>Minha cotação</span>
              {totalDistinct > 0 && (
                <span className="text-[#B8975A] font-bold group-hover:text-[#0C0B0A]">
                  ({totalDistinct})
                </span>
              )}
            </button>
          </motion.div>

          {/* Mobile Bottom Fixed Bar */}
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#0C0B0A] border-t border-white/[0.08] flex items-center gap-2"
          >
            <button
              onClick={openDrawer}
              className="flex-1 py-3 px-4 rounded-[2px] bg-[#161514] border border-white/[0.1] text-xs font-mono uppercase tracking-[0.14em] text-[#F4EFE6] text-center"
            >
              Cotação {totalDistinct > 0 ? `(${totalDistinct})` : ''}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-[2px] bg-[#F4EFE6] text-[#0C0B0A] text-xs font-medium uppercase tracking-[0.14em] text-center flex items-center justify-center gap-1.5"
            >
              <span>WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
