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
              className="px-6 py-3.5 rounded-full bg-[#0C0B0A] text-[#F4EFE6] border border-[#B8975A]/60 text-[14px] hover:bg-[#B8975A] hover:text-[#0C0B0A] hover:border-[#B8975A] transition-colors shadow-2xl flex items-center gap-3 font-semibold group"
            >
              <span>Minha cotação</span>
              {totalDistinct > 0 ? (
                <span className="w-5 h-5 rounded-full bg-[#B8975A] text-[#0C0B0A] group-hover:bg-[#0C0B0A] group-hover:text-[#F4EFE6] text-xs flex items-center justify-center font-bold">
                  {totalDistinct}
                </span>
              ) : (
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              )}
            </button>
          </motion.div>

          {/* Mobile Bottom Fixed Bar */}
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#0C0B0A]/95 backdrop-blur-md border-t border-white/[0.08] flex items-center gap-2"
          >
            <button
              onClick={openDrawer}
              className="flex-1 py-3 px-4 rounded-full bg-[#161514] border border-white/[0.1] text-xs font-semibold text-[#F4EFE6] text-center"
            >
              Cotação {totalDistinct > 0 ? `(${totalDistinct})` : ''}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-full bg-[#F4EFE6] text-[#0C0B0A] text-xs font-semibold text-center flex items-center justify-center gap-1.5"
            >
              <span>WhatsApp</span>
              <span>→</span>
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
