import React, { useState } from 'react';
import { Plus, Check, Eye } from 'lucide-react';
import { CATALOG_CATEGORIES, CATALOG_ITEMS } from '../data/catalog';
import { CatalogCategory, CatalogItem } from '../types';
import { useQuote } from '../context/QuoteContext';
import { ProductModal } from './ProductModal';

const CleanCatalogCard: React.FC<{ item: CatalogItem }> = ({ item }) => {
  const { addItem, openProductModal } = useQuote();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item, 100);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => openProductModal(item)}
      className="group cursor-pointer flex flex-col justify-between bg-[#F4EFE6] border border-[#1A1816]/10 p-5 rounded-[2px] transition-colors hover:border-[#B8975A]"
    >
      {/* 4:5 Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE3D6] rounded-[2px] p-6 flex items-center justify-center mb-5">
        <img
          src={item.image}
          alt={item.name}
          className={`max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
            item.cropClass || 'object-center'
          }`}
        />
        {item.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-[0.16em] text-[#1A1816] bg-[#F4EFE6] px-2.5 py-0.5 border border-[#1A1816]/10 rounded-[2px]">
            {item.badge}
          </span>
        )}
      </div>

      {/* Typography: Name, Description, Hairline */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B8975A] block mb-1.5">
            {item.categoryLabel}
          </span>
          <h3 className="font-serif text-2xl text-[#1A1816] font-normal mb-2">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#6B655C] line-clamp-1 mb-4 font-normal leading-relaxed">
            {item.shortDescription}
          </p>
        </div>

        {/* 1px Fine Separator */}
        <div className="pt-4 border-t border-[#1A1816]/10 flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-3 px-4 rounded-[2px] text-xs font-mono uppercase tracking-[0.14em] font-medium transition-colors duration-200 flex items-center justify-center gap-1.5 border ${
              added
                ? 'bg-[#B8975A] text-[#0C0B0A] border-[#B8975A]'
                : 'border-[#1A1816]/25 text-[#1A1816] hover:bg-[#1A1816] hover:text-[#F4EFE6] hover:border-[#1A1816]'
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
            className="p-3 rounded-[2px] border border-[#1A1816]/25 text-[#6B655C] hover:text-[#1A1816] hover:border-[#1A1816] transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Catalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>('all');

  const filteredItems =
    activeCategory === 'all'
      ? CATALOG_ITEMS
      : CATALOG_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="catalogo" className="relative w-full bg-[#F4EFE6] text-[#1A1816] py-32 sm:py-40 border-t border-[#1A1816]/10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8975A] mb-4 block">
            Catálogo Exclusivo
          </span>

          <h2 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight font-normal text-[#1A1816] mb-6">
            Escolha seus <span className="italic font-normal">copos.</span>
          </h2>

          <p className="text-base text-[#6B655C] leading-[1.7] font-normal">
            Selecione os modelos, defina a quantidade e receba sua cotação direto no WhatsApp com um
            consultor dedicado.
          </p>
        </div>

        {/* Clean Text Filter Tabs with Champagne Underline */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-16 no-scrollbar gap-8">
          {CATALOG_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as CatalogCategory)}
              className={`pb-2 text-xs uppercase tracking-[0.16em] transition-colors whitespace-nowrap border-b ${
                activeCategory === category.id
                  ? 'text-[#1A1816] border-[#B8975A] font-semibold'
                  : 'text-[#6B655C] border-transparent hover:text-[#1A1816]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Regular 3-Column Grid (2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <CleanCatalogCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <ProductModal />
    </section>
  );
};
