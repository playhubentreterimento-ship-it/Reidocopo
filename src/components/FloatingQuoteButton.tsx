import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MessageSquare, ArrowRight } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { CONFIG } from '../config';

export const FloatingQuoteButton: React.FC = () => {
  const { totalItems, totalDistinct, openDrawer, items } = useQuote();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Visible after passing the hero (~500px)
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
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
          {/* Desktop Floating Pill Button */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hidden sm:block fixed bottom-8 right-8 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={openDrawer}
              className={`relative px-5 py-3.5 rounded-full flex items-center gap-3 backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
                totalItems > 0
                  ? 'bg-[#15151B]/90 border-[#D9B777]/50 shadow-[0_10px_35px_rgba(255,46,147,0.25)] hover:border-[#D9B777]'
                  : 'bg-[#15151B]/80 border-white/[0.1] text-[#A9A4B2] hover:text-[#F6F2EA]'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${totalItems > 0 ? 'text-[#FF2E93]' : 'text-[#D9B777]'}`} />
              <span className="text-xs font-mono uppercase tracking-wider text-[#F6F2EA] font-semibold">
                Minha cotação
              </span>

              {totalDistinct > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-gradient-to-r from-[#FF2E93] to-[#D9B777] text-black shadow-sm">
                  {totalDistinct}
                </span>
              )}
            </motion.button>
          </motion.div>

          {/* Mobile Bottom Fixed Bar */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#0A0A0D]/95 backdrop-blur-xl border-t border-white/[0.08] flex items-center gap-2"
          >
            <button
              onClick={openDrawer}
              className="flex-1 py-3 px-4 rounded-full bg-[#15151B] border border-white/[0.1] text-xs font-mono uppercase tracking-wider text-[#F6F2EA] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D9B777]" />
              <span>Cotação ({totalDistinct})</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#D9B777] text-black text-xs font-semibold tracking-wider font-mono uppercase flex items-center justify-center gap-1.5 shadow-lg"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-black" />
              <span>WhatsApp</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
