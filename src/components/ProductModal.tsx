import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, MessageSquare, Sparkles } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { CONFIG } from '../config';

export const ProductModal: React.FC = () => {
  const { selectedProductForModal, closeProductModal, addItem } = useQuote();
  const [quantity, setQuantity] = useState(100);
  const [added, setAdded] = useState(false);

  if (!selectedProductForModal) return null;

  const item = selectedProductForModal;

  const handleAdd = () => {
    addItem(item, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeProductModal();
    }, 1200);
  };

  const directWhatsAppUrl = CONFIG.whatsapp.getWhatsAppUrl([{ name: item.name, quantity }]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProductModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative z-10 w-full max-w-3xl rounded-3xl glass-panel p-6 sm:p-10 border border-white/[0.1] shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={closeProductModal}
            className="absolute top-6 right-6 p-2 rounded-full bg-[#1D1D25] text-[#A9A4B2] hover:text-[#F6F2EA] hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Product Image Showcase */}
            <div className="relative aspect-[3/4] max-h-[380px] rounded-2xl overflow-hidden glass-chip p-6 flex items-center justify-center border border-white/[0.08]">
              <img
                src={item.image}
                alt={item.name}
                className={`w-full h-full object-contain filter contrast-105 drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] ${
                  item.cropClass || 'object-center'
                }`}
              />
              {item.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] bg-gradient-to-r from-[#FF2E93] to-[#D9B777] text-black font-bold">
                  {item.badge}
                </div>
              )}
            </div>

            {/* Right: Product Details & Controls */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777] block mb-2">
                  {item.categoryLabel}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#F6F2EA] mb-4">
                  {item.name}
                </h3>
                <p className="text-sm sm:text-base text-[#A9A4B2] leading-relaxed mb-6 font-normal">
                  {item.fullDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono tracking-wider text-[#F3E1B0] bg-[#1D1D25] px-3 py-1 rounded-full border border-white/[0.06]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add Action */}
              <div className="pt-6 border-t border-white/[0.08]">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#A9A4B2]">
                    Quantidade para cotação
                  </span>
                  <div className="flex items-center gap-3 bg-[#1D1D25] rounded-full p-1 border border-white/[0.08]">
                    <button
                      onClick={() => setQuantity(q => Math.max(50, q - 50))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#F6F2EA] hover:bg-white/[0.08] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-semibold text-[#F6F2EA] w-14 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 50)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#F6F2EA] hover:bg-white/[0.08] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAdd}
                    className={`flex-1 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      added
                        ? 'bg-[#D9B777] text-black shadow-[0_0_30px_rgba(217,183,119,0.5)]'
                        : 'bg-gradient-to-r from-[#FF2E93] to-[#D9B777] text-black hover:shadow-[0_0_35px_rgba(255,46,147,0.35)]'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Adicionado à Cotação ✓</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Adicionar à Cotação</span>
                      </>
                    )}
                  </button>

                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-full bg-[#1D1D25] border border-white/[0.1] text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/40 transition-colors flex items-center justify-center"
                    title="Cotar este modelo agora no WhatsApp"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
