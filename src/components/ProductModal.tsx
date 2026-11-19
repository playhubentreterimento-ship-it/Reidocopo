import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, MessageSquare } from 'lucide-react';
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
    }, 1000);
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
          className="fixed inset-0 bg-[#0C0B0A]/85 backdrop-blur-sm"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-3xl rounded-[16px] bg-[#F4EFE6] text-[#1A1816] p-8 sm:p-12 border border-[#1A1816]/10 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={closeProductModal}
            className="absolute top-6 right-6 p-2 text-[#6B655C] hover:text-[#1A1816] transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: Product Image */}
            <div className="relative aspect-[4/5] rounded-[12px] overflow-hidden bg-[#EAE3D6] border border-[#1A1816]/10 p-6 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className={`max-h-full max-w-full object-contain ${item.cropClass || 'object-center'}`}
              />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="font-sans font-semibold text-[13px] text-[#B8975A] block mb-2">
                  {item.categoryLabel}
                </span>

                <h3 className="font-serif text-[1.8rem] sm:text-[2.2rem] text-[#1A1816] mb-4 font-medium leading-tight">
                  {item.name}
                </h3>

                <p className="font-sans text-[15px] sm:text-[16px] text-[#6B655C] leading-[1.65] mb-6 font-normal">
                  {item.fullDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[12px] font-sans font-medium text-[#6B655C] bg-[#EAE3D6] px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add */}
              <div className="pt-6 border-t border-[#1A1816]/10">
                <div className="flex items-center justify-between mb-6 text-sm font-sans font-medium text-[#6B655C]">
                  <span>Quantidade desejada</span>
                  <div className="flex items-center gap-3 bg-[#EAE3D6] rounded-full p-1 border border-[#1A1816]/10">
                    <button
                      onClick={() => setQuantity(q => Math.max(50, q - 50))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1816] hover:bg-[#F4EFE6] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-sans text-sm font-semibold text-[#1A1816] w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 50)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1816] hover:bg-[#F4EFE6] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    className={`flex-1 py-3.5 px-6 rounded-full text-[15px] font-sans font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                      added
                        ? 'bg-[#B8975A] text-[#0C0B0A]'
                        : 'bg-[#1A1816] text-[#F4EFE6] hover:bg-[#B8975A] hover:text-[#0C0B0A]'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Adicionado ✓</span>
                      </>
                    ) : (
                      <>
                        <span>Adicionar à cotação</span>
                        <span className="text-base leading-none">→</span>
                      </>
                    )}
                  </button>

                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-full bg-[#EAE3D6] border border-[#1A1816]/10 text-[#1A1816] hover:bg-[#1A1816] hover:text-[#F4EFE6] transition-colors flex items-center justify-center"
                    title="Cotar no WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
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
