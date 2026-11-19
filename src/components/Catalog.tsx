import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Eye, Sparkles } from 'lucide-react';
import { CATALOG_CATEGORIES, CATALOG_ITEMS } from '../data/catalog';
import { CatalogCategory, CatalogItem } from '../types';
import { useQuote } from '../context/QuoteContext';
import { ProductModal } from './ProductModal';

// Individual Bento Card with 3D tilt and mouse reflection
const CatalogCard: React.FC<{ item: CatalogItem }> = ({ item }) => {
  const { addItem, openProductModal } = useQuote();
  const [added, setAdded] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply 3D tilt on devices with hover pointer
    if (window.matchMedia('(hover: hover)').matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
      const yPercent = (y / rect.height - 0.5) * 2;

      setRotate({
        x: -yPercent * 6, // max 6 deg
        y: xPercent * 6,
      });
      setGlowPos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    }
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item, 100);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  // Bento sizing classes
  const sizeClasses =
    item.bentoSize === 'tall'
      ? 'md:col-span-6 lg:col-span-4 min-h-[460px]'
      : item.bentoSize === 'wide'
      ? 'md:col-span-12 lg:col-span-8 min-h-[400px]'
      : 'md:col-span-6 lg:col-span-4 min-h-[420px]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => openProductModal(item)}
      data-cursor="view"
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.15s ease-out, border-color 0.3s ease',
      }}
      className={`relative col-span-1 ${sizeClasses} rounded-3xl glass-panel p-6 sm:p-7 flex flex-col justify-between group cursor-pointer border border-white/[0.08] hover:border-[#D9B777]/50 hover:shadow-[0_20px_50px_rgba(255,46,147,0.15)] overflow-hidden`}
    >
      {/* Light Reflection overlay following cursor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 240px at ${glowPos.x}% ${glowPos.y}%, rgba(255,46,147,0.15), rgba(217,183,119,0.08), transparent 70%)`,
        }}
      />

      {/* Top Bar: Category Microlabel & Badge */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9B777]">
          {item.categoryLabel}
        </span>
        {item.badge && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#1D1D25] border border-[#D9B777]/30 text-[#F3E1B0]">
            {item.badge}
          </span>
        )}
      </div>

      {/* Central Product Image */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center my-4 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`max-h-[220px] sm:max-h-[260px] w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] filter contrast-105 group-hover:scale-105 transition-transform duration-500 ${
            item.cropClass || 'object-center'
          }`}
        />
        {/* Subtle ground shadow */}
        <div className="absolute bottom-2 w-32 h-3 bg-black/60 rounded-full blur-sm pointer-events-none" />
      </div>

      {/* Bottom Content: Name, Short Desc, Tags & Actions */}
      <div className="relative z-10 mt-auto pt-4 border-t border-white/[0.06]">
        <h3 className="font-serif text-2xl text-[#F6F2EA] group-hover:text-gradient-gold transition-colors duration-300 mb-2">
          {item.name}
        </h3>
        <p className="text-xs sm:text-sm text-[#A9A4B2] line-clamp-2 mb-4 font-normal">
          {item.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {item.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-mono tracking-wider text-[#A9A4B2] bg-[#101015]/80 px-2 py-0.5 rounded-full border border-white/[0.05]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold tracking-wider font-mono uppercase transition-all duration-300 flex items-center justify-center gap-1.5 ${
              added
                ? 'bg-[#D9B777] text-black shadow-[0_0_20px_rgba(217,183,119,0.5)]'
                : 'bg-[#1D1D25] text-[#F6F2EA] border border-white/[0.08] hover:bg-gradient-to-r hover:from-[#FF2E93] hover:to-[#D9B777] hover:text-black hover:border-transparent'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Adicionado ✓</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar à cotação</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductModal(item);
            }}
            className="p-2.5 rounded-full bg-[#1D1D25] text-[#A9A4B2] hover:text-[#F6F2EA] border border-white/[0.08] transition-colors"
            title="Ver detalhes do modelo"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const Catalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>('all');

  const filteredItems =
    activeCategory === 'all'
      ? CATALOG_ITEMS
      : CATALOG_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="catalogo" className="relative w-full bg-[#0A0A0D] py-28 sm:py-36 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#D9B777]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-[#FF2E93]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151B] border border-[#D9B777]/30 mb-5 shadow-lg shadow-black/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9B777]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F3E1B0]">
              Catálogo Interativo
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.98] tracking-tight text-[#F6F2EA] mb-6"
          >
            Escolha seus <span className="italic text-gradient-brand">copos.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-[#A9A4B2] leading-relaxed"
          >
            Selecione os modelos, defina a quantidade e receba sua cotação direto no WhatsApp com um
            consultor exclusivo.
          </motion.p>
        </div>

        {/* Animated Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-14 no-scrollbar gap-2 sm:gap-3">
          {CATALOG_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as CatalogCategory)}
              className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-mono tracking-wider uppercase transition-all duration-300 whitespace-nowrap flex-shrink-0 border ${
                activeCategory === category.id
                  ? 'text-black font-semibold border-transparent shadow-[0_0_25px_rgba(255,46,147,0.3)]'
                  : 'text-[#A9A4B2] border-white/[0.08] bg-[#15151B]/60 hover:text-[#F6F2EA] hover:border-white/20'
              }`}
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#D9B777]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <CatalogCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Product Details Modal */}
      <ProductModal />
    </section>
  );
};
