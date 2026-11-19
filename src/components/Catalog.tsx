import React, { useState, useEffect } from 'react';
import { Check, Eye } from 'lucide-react';
import { CATALOG_CATEGORIES, CATALOG_ITEMS } from '../data/catalog';
import { CatalogItem } from '../types';
import { useQuote } from '../context/QuoteContext';
import { ProductModal } from './ProductModal';
import { fetchPublishedProducts, fetchCategories, isSupabaseConfigured } from '../lib/supabase';

// Skeleton Card no mesmo estilo visual do site
const SkeletonCard: React.FC = () => (
  <div className="flex flex-col justify-between bg-[#F4EFE6] border border-[#1A1816]/10 p-6 rounded-[14px] animate-pulse">
    <div className="relative aspect-[4/5] w-full bg-[#EAE3D6] rounded-[10px] mb-5" />
    <div>
      <div className="h-3 w-24 bg-[#EAE3D6] rounded-full mb-3" />
      <div className="h-6 w-3/4 bg-[#EAE3D6] rounded-md mb-3" />
      <div className="h-4 w-full bg-[#EAE3D6] rounded-md mb-2" />
      <div className="h-4 w-2/3 bg-[#EAE3D6] rounded-md mb-6" />
    </div>
    <div className="pt-4 border-t border-[#1A1816]/10 flex items-center gap-2.5">
      <div className="h-11 flex-1 bg-[#EAE3D6] rounded-full" />
      <div className="h-11 w-11 bg-[#EAE3D6] rounded-full" />
    </div>
  </div>
);

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
      className="group cursor-pointer flex flex-col justify-between bg-[#F4EFE6] border border-[#1A1816]/10 p-6 rounded-[14px] transition-all hover:border-[#B8975A] hover:shadow-lg"
    >
      {/* 4:5 Image Container com lazy loading e object-cover */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE3D6] rounded-[10px] p-6 flex items-center justify-center mb-5">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className={`max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
            item.cropClass || 'object-center'
          }`}
        />
        {item.badge && (
          <span className="absolute top-3 left-3 text-[12px] font-sans font-semibold text-[#1A1816] bg-[#F4EFE6] px-3 py-1 border border-[#1A1816]/10 rounded-full">
            {item.badge}
          </span>
        )}
      </div>

      {/* Typography: Name, Description, Hairline */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="font-sans font-semibold text-[12px] text-[#B8975A] block mb-1.5">
            {item.categoryLabel}
          </span>
          <h3 className="font-serif text-[1.4rem] sm:text-[1.55rem] text-[#1A1816] font-medium mb-2">
            {item.name}
          </h3>
          <p className="font-sans text-[14px] text-[#6B655C] line-clamp-1 mb-5 font-normal leading-relaxed">
            {item.shortDescription}
          </p>
        </div>

        {/* 1px Fine Separator */}
        <div className="pt-4 border-t border-[#1A1816]/10 flex items-center gap-2.5">
          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-3 px-5 rounded-full text-[14px] font-sans font-semibold transition-colors duration-200 flex items-center justify-center gap-2 border ${
              added
                ? 'bg-[#B8975A] text-[#0C0B0A] border-[#B8975A]'
                : 'border-[#1A1816]/30 text-[#1A1816] hover:bg-[#1A1816] hover:text-[#F4EFE6] hover:border-[#1A1816]'
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductModal(item);
            }}
            className="p-3 rounded-full border border-[#1A1816]/30 text-[#6B655C] hover:text-[#1A1816] hover:border-[#1A1816] transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Catalog: React.FC = () => {
  const [items, setItems] = useState<CatalogItem[]>(CATALOG_ITEMS);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([
    ...CATALOG_CATEGORIES,
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    let isMounted = true;

    async function loadCatalogFromSupabase() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        const [dbProducts, dbCategories] = await Promise.all([
          fetchPublishedProducts(),
          fetchCategories(),
        ]);

        if (!isMounted) return;

        // Se o Supabase retornou produtos, mapeia para o catálogo
        if (dbProducts && dbProducts.length > 0) {
          const mappedItems: CatalogItem[] = dbProducts.map((p) => {
            const coverImage =
              p.images && p.images.length > 0
                ? p.images[0]
                : '/assets/copo-degrade-rosa.webp';

            return {
              id: p.id,
              name: p.name,
              category: p.category,
              categoryLabel: p.category,
              shortDescription: p.description || '',
              fullDescription: p.description || '',
              image: coverImage,
              images: p.images || [coverImage],
              tags: p.tags || [],
              is_published: p.is_published,
              sort_order: p.sort_order,
            };
          });

          setItems(mappedItems);

          // Categorias dinâmicas
          if (dbCategories && dbCategories.length > 0) {
            const mappedCats = [
              { id: 'all', label: 'Todos os modelos' },
              ...dbCategories.map((c) => ({
                id: c.name,
                label: c.name,
              })),
            ];
            setCategories(mappedCats);
          }
        }
      } catch (err) {
        console.warn('Falha ao carregar do Supabase; usando dados estáticos como fallback:', err);
        // Fallback já garantido pelos estados iniciais
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCatalogFromSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section id="catalogo" className="relative w-full bg-[#F4EFE6] text-[#1A1816] py-32 sm:py-40 border-t border-[#1A1816]/10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8975A]/40 bg-[#EAE3D6] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8975A]" />
            <span className="font-sans font-semibold text-[13px] text-[#1A1816]">
              Catálogo de modelos
            </span>
          </div>

          <h2 className="font-serif font-medium text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-[#1A1816] mb-6">
            Escolha seus <span className="italic font-medium text-[#B8975A]">copos.</span>
          </h2>

          <p className="font-sans text-[17px] sm:text-[18px] text-[#6B655C] leading-[1.65] font-normal">
            Selecione os modelos, defina a quantidade e receba sua cotação direto no WhatsApp com um
            consultor dedicado.
          </p>
        </div>

        {/* Clean Text Filter Tabs with Champagne Underline */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-16 no-scrollbar gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`pb-2 font-sans text-[15px] transition-colors whitespace-nowrap border-b-2 ${
                activeCategory === category.id
                  ? 'text-[#1A1816] border-[#B8975A] font-semibold'
                  : 'text-[#6B655C] border-transparent hover:text-[#1A1816] font-medium'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Grid de produtos ou Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-[#6B655C]">
            <p className="font-serif text-2xl text-[#1A1816] mb-2 font-medium">
              Nenhum produto nesta categoria
            </p>
            <p className="text-sm">
              Explore outros modelos selecionando "Todos os modelos" acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <CleanCatalogCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <ProductModal />
    </section>
  );
};
