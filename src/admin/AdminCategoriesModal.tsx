import React, { useState } from 'react';
import { DBCategory, createCategoryAdmin, updateCategoryAdmin, deleteCategoryAdmin } from '../lib/supabase';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check, AlertCircle, Loader2 } from 'lucide-react';

interface AdminCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: DBCategory[];
  onRefresh: () => Promise<void>;
}

export const AdminCategoriesModal: React.FC<AdminCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onRefresh,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      const nextOrder =
        categories.length > 0
          ? Math.max(...categories.map((c) => c.sort_order)) + 1
          : 1;

      await createCategoryAdmin(newCategoryName.trim(), nextOrder);
      setNewCategoryName('');
      setSuccess('Categoria adicionada com sucesso!');
      await onRefresh();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Erro ao criar categoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (category: DBCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setError(null);
  };

  const handleSaveEdit = async (id: string, sort_order: number) => {
    if (!editingName.trim()) return;

    setError(null);
    try {
      setLoading(true);
      await updateCategoryAdmin(id, editingName.trim(), sort_order);
      setEditingId(null);
      setSuccess('Categoria atualizada com sucesso!');
      await onRefresh();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Erro ao atualizar categoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
      return;
    }

    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      await deleteCategoryAdmin(id, name);
      setSuccess(`Categoria "${name}" excluída.`);
      await onRefresh();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Erro ao excluir categoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const currentCat = categories[index];
    const targetCat = categories[targetIndex];

    try {
      setLoading(true);
      const currentOrder = currentCat.sort_order;
      const targetOrder = targetCat.sort_order;

      // Swap sort_order
      await updateCategoryAdmin(currentCat.id, currentCat.name, targetOrder);
      await updateCategoryAdmin(targetCat.id, targetCat.name, currentOrder);
      await onRefresh();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Erro ao reordenar categoria.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0C0B0A]/85 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg bg-[#161514] border border-white/[0.08] text-[#F4EFE6] rounded-[20px] p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-[#F4EFE6]">
              Gerenciar Categorias
            </h2>
            <p className="font-sans text-xs text-[#A59E92] mt-1">
              Filtros que aparecem no catálogo do site
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A59E92] hover:text-[#F4EFE6] rounded-full hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Add new category form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da nova categoria..."
            className="flex-1 px-4 py-2.5 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !newCategoryName.trim()}
            className="px-5 py-2.5 rounded-full bg-[#B8975A] text-[#0C0B0A] font-semibold text-xs hover:bg-[#c9a767] transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Adicionar</span>
          </button>
        </form>

        {/* Category list */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {categories.length === 0 ? (
            <p className="text-center py-8 text-xs text-[#A59E92]">
              Nenhuma categoria cadastrada.
            </p>
          ) : (
            categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0C0B0A] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              >
                {editingId === category.id ? (
                  <div className="flex-1 flex items-center gap-2 mr-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#161514] border border-[#B8975A] rounded-lg text-sm text-[#F4EFE6] focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(category.id, category.sort_order)}
                      className="p-1.5 rounded-lg bg-[#B8975A] text-[#0C0B0A] hover:bg-[#c9a767]"
                      title="Salvar alteração"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg bg-white/[0.1] text-[#A59E92] hover:text-[#F4EFE6]"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#B8975A] w-5 text-center">
                      {index + 1}
                    </span>
                    <span className="font-sans text-sm font-medium text-[#F4EFE6]">
                      {category.name}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  {/* Reorder arrows */}
                  <button
                    disabled={index === 0 || loading}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1.5 text-[#A59E92] hover:text-[#F4EFE6] disabled:opacity-20 transition-colors"
                    title="Subir posição"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === categories.length - 1 || loading}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1.5 text-[#A59E92] hover:text-[#F4EFE6] disabled:opacity-20 transition-colors"
                    title="Descer posição"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit rename */}
                  {editingId !== category.id && (
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="p-1.5 text-[#A59E92] hover:text-[#B8975A] transition-colors ml-1"
                      title="Renomear categoria"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-1.5 text-[#A59E92] hover:text-red-400 transition-colors ml-1"
                    title="Excluir categoria"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white/[0.08] text-[#F4EFE6] text-xs font-semibold hover:bg-white/[0.15] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
