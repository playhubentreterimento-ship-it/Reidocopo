import React, { useState, useEffect } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  DBProduct,
  DBCategory,
  fetchAllProductsAdmin,
  fetchCategories,
  deleteProductAdmin,
  toggleProductStatusAdmin,
  updateProductSortOrderAdmin,
} from '../lib/supabase';
import { AdminLogin } from './AdminLogin';
import { AdminProductForm } from './AdminProductForm';
import { AdminCategoriesModal } from './AdminCategoriesModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Layers,
  LogOut,
  ExternalLink,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<unknown | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Dados
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filtros e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modais
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Confirmação de exclusão
  const [deletingProduct, setDeletingProduct] = useState<DBProduct | null>(null);

  // Feedbacks
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Efeito para meta robots noindex
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      meta?.setAttribute('content', 'index, follow');
    };
  }, []);

  // Monitorar autenticação no Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setAuthChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setAuthChecking(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Carregar dados quando logado
  const loadData = async () => {
    if (!supabase) return;
    try {
      setLoadingData(true);
      setActionError(null);
      const [fetchedProducts, fetchedCats] = await Promise.all([
        fetchAllProductsAdmin(),
        fetchCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCats);
    } catch (err: unknown) {
      const errObj = err as Error;
      setActionError(errObj.message || 'Erro ao carregar dados do catálogo.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  // Logout
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  // Alternar Publicado/Oculto
  const handleToggleStatus = async (product: DBProduct) => {
    try {
      const newStatus = !product.is_published;
      await toggleProductStatusAdmin(product.id, newStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_published: newStatus } : p))
      );
      setActionSuccess(
        `Produto "${product.name}" agora está ${newStatus ? 'publicado' : 'oculto'}.`
      );
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      const errObj = err as Error;
      setActionError(errObj.message || 'Erro ao alterar status.');
    }
  };

  // Reordenar produtos
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredProducts.length) return;

    const currentProd = filteredProducts[index];
    const targetProd = filteredProducts[targetIndex];

    try {
      const currentOrder = currentProd.sort_order;
      const targetOrder = targetProd.sort_order;

      // Troca os valores de sort_order
      await updateProductSortOrderAdmin(currentProd.id, targetOrder);
      await updateProductSortOrderAdmin(targetProd.id, currentOrder);

      await loadData();
    } catch (err: unknown) {
      const errObj = err as Error;
      setActionError(errObj.message || 'Erro ao reordenar produto.');
    }
  };

  // Excluir produto
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProductAdmin(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setActionSuccess(`Produto "${deletingProduct.name}" excluído com sucesso.`);
      setDeletingProduct(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      const errObj = err as Error;
      setActionError(errObj.message || 'Erro ao excluir produto.');
    }
  };

  // Filtragem
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  // Tela de carregamento inicial
  if (authChecking) {
    return (
      <div className="min-h-screen w-full bg-[#0C0B0A] flex flex-col items-center justify-center text-[#F4EFE6]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8975A] mb-3" />
        <span className="text-sm font-sans text-[#A59E92]">Carregando painel...</span>
      </div>
    );
  }

  // Se não autenticado, tela de login
  if (!session) {
    return <AdminLogin onSuccess={() => setAuthChecking(true)} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#0C0B0A] text-[#F4EFE6] font-sans pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#161514]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl sm:text-2xl text-[#F4EFE6] font-medium tracking-tight">
              Rei do Copo
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#B8975A]/15 text-[#B8975A] border border-[#B8975A]/30 text-[11px] font-semibold">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3.5 py-2 rounded-full border border-white/[0.12] hover:border-[#B8975A] text-xs font-medium text-[#F4EFE6] flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#B8975A]" />
              <span className="hidden sm:inline">Categorias</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-full border border-white/[0.12] hover:border-[#B8975A] text-xs font-medium text-[#F4EFE6] flex items-center gap-1.5 transition-colors"
              title="Ver site público"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#A59E92]" />
              <span className="hidden sm:inline">Ver site</span>
            </a>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3.5 sm:py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-xs font-medium text-[#A59E92] hover:text-[#F4EFE6] flex items-center gap-1.5 transition-colors"
              title="Sair do painel"
            >
              <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#F4EFE6]">
              Catálogo de Produtos
            </h1>
            <p className="text-xs sm:text-sm text-[#A59E92] mt-1 font-normal">
              {products.length} {products.length === 1 ? 'modelo cadastrado' : 'modelos cadastrados'} · As alterações aparecem no site na hora.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#F4EFE6] text-[#0C0B0A] text-sm font-semibold hover:bg-[#B8975A] transition-colors flex items-center justify-center gap-2 group shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Novo produto</span>
          </button>
        </div>

        {/* Global Feedback Banners */}
        {actionError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{actionError}</span>
          </div>
        )}

        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6E675D] absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, categoria ou tag..."
              className="w-full pl-11 pr-4 py-3 bg-[#161514] border border-white/[0.08] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors"
            />
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-[#161514] border border-white/[0.08] rounded-full text-sm text-[#F4EFE6] focus:outline-none focus:border-[#B8975A] transition-colors cursor-pointer"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products List */}
        {loadingData ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#A59E92]">
            <Loader2 className="w-8 h-8 animate-spin text-[#B8975A] mb-3" />
            <span className="text-sm">Carregando catálogo...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/[0.1] rounded-2xl p-8 bg-[#161514]/40">
            <p className="font-serif text-xl text-[#F4EFE6] mb-2 font-medium">
              Nenhum produto encontrado
            </p>
            <p className="text-xs text-[#A59E92] mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Cadastre o primeiro produto para exibir no site.'}
            </p>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="px-5 py-2.5 rounded-full bg-[#B8975A] text-[#0C0B0A] text-xs font-semibold hover:bg-[#c9a767] transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar produto</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product, index) => {
              const coverImage =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : '/assets/copo-degrade-rosa.webp';

              return (
                <div
                  key={product.id}
                  className="bg-[#161514] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Reorder Arrows on Desktop */}
                    <div className="hidden sm:flex flex-col items-center gap-1 text-[#6E675D]">
                      <button
                        disabled={index === 0}
                        onClick={() => handleReorder(index, 'up')}
                        className="hover:text-[#F4EFE6] disabled:opacity-20 transition-colors p-1"
                        title="Subir posição"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-[11px] text-[#B8975A]">
                        {index + 1}
                      </span>
                      <button
                        disabled={index === filteredProducts.length - 1}
                        onClick={() => handleReorder(index, 'down')}
                        className="hover:text-[#F4EFE6] disabled:opacity-20 transition-colors p-1"
                        title="Descer posição"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-[#0C0B0A] border border-white/[0.08] p-2 flex items-center justify-center flex-shrink-0">
                      <img
                        src={coverImage}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-[#B8975A] uppercase tracking-wider">
                          {product.category}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 ${
                            product.is_published
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-700/30 text-zinc-400 border border-zinc-700/50'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.is_published ? 'bg-emerald-400' : 'bg-zinc-400'
                            }`}
                          />
                          <span>{product.is_published ? 'Publicado' : 'Oculto'}</span>
                        </span>

                        {product.images && product.images.length > 1 && (
                          <span className="text-[11px] text-[#A59E92]">
                            · {product.images.length} fotos
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-base sm:text-lg text-[#F4EFE6] font-medium truncate">
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="text-xs text-[#A59E92] line-clamp-1 mt-0.5 font-normal">
                          {product.description}
                        </p>
                      )}

                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {product.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#A59E92]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.08]">
                    {/* Mobile Reorder Controls */}
                    <div className="sm:hidden flex items-center gap-1 text-[#6E675D]">
                      <button
                        disabled={index === 0}
                        onClick={() => handleReorder(index, 'up')}
                        className="p-2 border border-white/[0.1] rounded-lg disabled:opacity-20"
                        title="Subir"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === filteredProducts.length - 1}
                        onClick={() => handleReorder(index, 'down')}
                        className="p-2 border border-white/[0.1] rounded-lg disabled:opacity-20"
                        title="Descer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Published/Hidden */}
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`p-2.5 rounded-full border transition-colors ${
                          product.is_published
                            ? 'border-white/[0.1] text-[#A59E92] hover:text-[#F4EFE6] hover:bg-white/[0.05]'
                            : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                        }`}
                        title={product.is_published ? 'Ocultar do site' : 'Publicar no site'}
                      >
                        {product.is_published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsFormOpen(true);
                        }}
                        className="px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-[#F4EFE6] flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#B8975A]" />
                        <span>Editar</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="p-2.5 rounded-full border border-white/[0.08] text-[#A59E92] hover:text-red-400 hover:border-red-400/40 transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Form Modal (Create or Edit) */}
      {isFormOpen && (
        <AdminProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
            loadData();
          }}
          onRefreshCategories={loadData}
        />
      )}

      {/* Categories Manager Modal */}
      <AdminCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onRefresh={loadData}
      />

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#161514] border border-white/[0.1] rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-xl font-medium text-[#F4EFE6] mb-2">
              Excluir produto?
            </h3>
            <p className="text-xs text-[#A59E92] mb-6 leading-relaxed">
              Tem certeza que deseja excluir <strong>"{deletingProduct.name}"</strong>? Esta
              ação não pode ser desfeita.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 rounded-full bg-white/[0.08] text-xs font-semibold text-[#A59E92] hover:text-[#F4EFE6] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-full bg-red-500 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
