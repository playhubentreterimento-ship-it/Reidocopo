import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, MessageSquare, ArrowRight, ShoppingBag } from 'lucide-react';
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer Panel (Side drawer on desktop, bottom sheet on mobile) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 max-sm:pl-0 max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-[#101015] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between max-sm:rounded-t-3xl max-sm:max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/[0.07] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#15151B] border border-[#D9B777]/30 flex items-center justify-center text-[#D9B777]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#F6F2EA]">Minha Cotação</h3>
                    <span className="font-mono text-[11px] text-[#A9A4B2]">
                      {totalItems > 0 ? `${totalItems} unidades selecionadas` : 'Nenhum item'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="p-2 text-[#6E6A78] hover:text-[#FF2E93] transition-colors"
                      title="Limpar todos os itens"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={closeDrawer}
                    className="p-2 rounded-full bg-[#15151B] text-[#A9A4B2] hover:text-[#F6F2EA] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="w-16 h-16 rounded-3xl glass-panel border border-white/[0.08] flex items-center justify-center text-[#6E6A78] mb-4">
                      <ShoppingBag className="w-8 h-8 stroke-[1.25]" />
                    </div>
                    <h4 className="font-serif text-2xl text-[#F6F2EA] mb-2">
                      Sua cotação está vazia.
                    </h4>
                    <p className="text-sm text-[#A9A4B2] leading-relaxed mb-6 max-w-xs">
                      Escolha um modelo no catálogo para começar sua proposta personalizada.
                    </p>
                    <a
                      href="#catalogo"
                      onClick={closeDrawer}
                      className="px-6 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#FF2E93] to-[#D9B777] shadow-lg"
                    >
                      Explorar modelos
                    </a>
                  </div>
                ) : (
                  <AnimatePresence>
                    {items.map(({ item, quantity }) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="p-4 rounded-2xl bg-[#15151B] border border-white/[0.06] flex items-center gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-20 rounded-xl bg-[#101015] border border-white/[0.05] p-2 flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full w-auto object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-lg text-[#F6F2EA] truncate">
                            {item.name}
                          </h4>
                          <span className="font-mono text-[10px] uppercase text-[#D9B777] block mb-2">
                            {item.categoryLabel}
                          </span>

                          {/* Stepper with slide digits */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-[#101015] rounded-full border border-white/[0.06] p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, quantity - 50)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[#A9A4B2] hover:text-[#F6F2EA] hover:bg-white/[0.06]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-semibold text-[#F6F2EA] w-12 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, quantity + 50)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[#A9A4B2] hover:text-[#F6F2EA] hover:bg-white/[0.06]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-[#6E6A78] hover:text-[#FF2E93] transition-colors ml-auto"
                              title="Remover modelo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
                <div className="p-6 border-t border-white/[0.08] bg-[#0A0A0D]/60 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4 text-xs font-mono">
                    <span className="text-[#A9A4B2] uppercase tracking-wider">
                      Total de Ecopos
                    </span>
                    <span className="text-[#D9B777] font-semibold text-sm">
                      {totalItems} unidades
                    </span>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-full font-semibold text-sm tracking-wide text-black bg-gradient-to-r from-[#FF2E93] via-[#F3E1B0] to-[#D9B777] shadow-[0_0_35px_rgba(255,46,147,0.35)] hover:shadow-[0_0_50px_rgba(217,183,119,0.5)] transition-all duration-300 flex items-center justify-center gap-2 shine-effect"
                  >
                    <MessageSquare className="w-4 h-4 fill-black" />
                    <span>Finalizar no WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <p className="text-[11px] text-[#6E6A78] text-center mt-3">
                    Proposta personalizada sem compromisso direto com consultor.
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
