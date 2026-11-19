import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { CONFIG } from '../config';

export const QuoteDrawer: React.FC = () => {
  const { items, isOpen, closeDrawer, removeItem, updateQuantity, clearCart, totalItems } =
    useQuote();

  const whatsappUrl = CONFIG.whatsapp.getWhatsAppUrl(
    items.map(i => ({ name: i.item.name, quantity: i.quantity }))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 max-sm:pl-0 max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-[#0C0B0A] text-[#F4EFE6] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between max-sm:max-h-[85vh] rounded-none sm:rounded-none"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-[#F4EFE6] font-medium">Minha cotação</h3>
                  <span className="text-xs text-[#A59E92] font-normal">
                    {totalItems > 0 ? `${totalItems} unidades selecionadas` : 'Nenhum item'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="p-1.5 text-[#6E675D] hover:text-[#F4EFE6] transition-colors"
                      title="Limpar todos os itens"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.25]" />
                    </button>
                  )}
                  <button
                    onClick={closeDrawer}
                    className="p-1.5 text-[#A59E92] hover:text-[#F4EFE6] transition-colors"
                  >
                    <X className="w-5 h-5 stroke-[1.25]" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <span className="font-serif text-3xl text-[#B8975A] mb-3 font-medium">0</span>
                    <h4 className="font-serif text-2xl text-[#F4EFE6] mb-2 font-medium">
                      Sua cotação está vazia.
                    </h4>
                    <p className="text-sm text-[#A59E92] leading-relaxed mb-6 max-w-xs font-normal">
                      Escolha um modelo no catálogo para começar sua proposta personalizada.
                    </p>
                    <a
                      href="#catalogo"
                      onClick={closeDrawer}
                      className="px-6 py-3 rounded-full text-xs font-semibold text-[#0C0B0A] bg-[#F4EFE6] hover:bg-[#B8975A] transition-colors inline-flex items-center gap-2 group"
                    >
                      <span>Explorar modelos</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </a>
                  </div>
                ) : (
                  <AnimatePresence>
                    {items.map(({ item, quantity }) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="p-4 rounded-xl bg-[#161514] border border-white/[0.06] flex items-center gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-18 rounded-lg bg-[#1E1C1A] border border-white/[0.05] p-2 flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-base text-[#F4EFE6] truncate font-medium">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-[#B8975A] font-medium block mb-2">
                            {item.categoryLabel}
                          </span>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-[#0C0B0A] rounded-full border border-white/[0.08] p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, quantity - 50)}
                                className="w-6 h-6 flex items-center justify-center text-[#A59E92] hover:text-[#F4EFE6]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-semibold text-[#F4EFE6] w-12 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, quantity + 50)}
                                className="w-6 h-6 flex items-center justify-center text-[#A59E92] hover:text-[#F4EFE6]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-[#6E675D] hover:text-[#F4EFE6] transition-colors ml-auto"
                              title="Remover modelo"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[1.25]" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer / Finalize on WhatsApp */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/[0.08] bg-[#0C0B0A]">
                  <div className="flex items-center justify-between mb-4 text-xs font-medium">
                    <span className="text-[#A59E92]">Total de ecopos</span>
                    <span className="text-[#F4EFE6] font-semibold">{totalItems} unidades</span>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-full font-semibold text-[15px] text-[#0C0B0A] bg-[#F4EFE6] hover:bg-[#B8975A] transition-colors duration-200 flex items-center justify-center gap-2 group"
                  >
                    <span>Finalizar no WhatsApp</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>

                  <p className="text-[11px] text-[#6E675D] text-center mt-3">
                    Atendimento consultivo direto pelo WhatsApp.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
