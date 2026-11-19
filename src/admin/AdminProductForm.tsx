import React, { useState, useRef } from 'react';
import {
  DBProduct,
  DBCategory,
  createProductAdmin,
  updateProductAdmin,
  createCategoryAdmin,
  uploadProductImageToStorage,
} from '../lib/supabase';
import {
  compressAndConvertToWebP,
  MAX_IMAGES_PER_PRODUCT,
} from '../lib/imageCompression';
import {
  X,
  Upload,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  Tag as TagIcon,
} from 'lucide-react';

interface LocalImage {
  id: string;
  url: string;
  file?: File;
  isExisting: boolean;
}

interface AdminProductFormProps {
  product?: DBProduct | null;
  categories: DBCategory[];
  onClose: () => void;
  onSuccess: (savedProduct: DBProduct) => void;
  onRefreshCategories: () => Promise<void>;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  categories,
  onClose,
  onSuccess,
  onRefreshCategories,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(
    product?.category || (categories[0]?.name ?? '')
  );
  const [description, setDescription] = useState(product?.description || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [isPublished, setIsPublished] = useState(
    product ? product.is_published : true
  );

  // Imagens
  const [images, setImages] = useState<LocalImage[]>(() => {
    if (product && product.images && product.images.length > 0) {
      return product.images.map((url, idx) => ({
        id: `existing-${idx}-${url}`,
        url,
        isExisting: true,
      }));
    }
    return [];
  });

  // Nova categoria inline
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [catLoading, setCatLoading] = useState(false);

  // Estados de envio
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contador de descrição (máx 220 caracteres)
  const maxDescLength = 220;

  // Adicionar Tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Processar arquivos de imagem selecionados
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const availableSlots = MAX_IMAGES_PER_PRODUCT - images.length;
    if (availableSlots <= 0) {
      setErrorMessage(`O limite máximo é de ${MAX_IMAGES_PER_PRODUCT} fotos por produto.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      setErrorMessage(
        `Apenas ${availableSlots} foto(s) foram adicionadas para não ultrapassar o limite de ${MAX_IMAGES_PER_PRODUCT}.`
      );
    }

    setUploadStatusText('Otimizando fotos...');
    const newLocalImages: LocalImage[] = [];

    for (const file of filesToProcess) {
      try {
        const compressed = await compressAndConvertToWebP(file);
        newLocalImages.push({
          id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: compressed.previewUrl,
          file: compressed.file,
          isExisting: false,
        });
      } catch (err: unknown) {
        const errObj = err as Error;
        setErrorMessage(errObj.message || 'Erro ao processar imagem.');
      }
    }

    setImages((prev) => [...prev, ...newLocalImages]);
    setUploadStatusText('');
  };

  // Reordenar fotos
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newArr = [...images];
    const item = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = item;
    setImages(newArr);
  };

  const setCoverImage = (index: number) => {
    if (index === 0) return;
    const newArr = [...images];
    const [selected] = newArr.splice(index, 1);
    newArr.unshift(selected);
    setImages(newArr);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Criar categoria inline
  const handleSaveInlineCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      setCatLoading(true);
      const newCat = await createCategoryAdmin(newCatName.trim());
      await onRefreshCategories();
      setCategory(newCat.name);
      setNewCatName('');
      setIsAddingNewCategory(false);
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(errObj.message || 'Erro ao adicionar categoria.');
    } finally {
      setCatLoading(false);
    }
  };

  // Submeter produto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Por favor, informe o nome do produto.');
      return;
    }

    if (!category.trim()) {
      setErrorMessage('Por favor, selecione ou crie uma categoria.');
      return;
    }

    try {
      setSaving(true);
      const finalImageUrls: string[] = [];
      const totalImagesToUpload = images.filter((img) => !img.isExisting && img.file).length;
      let uploadedCount = 0;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.isExisting) {
          finalImageUrls.push(img.url);
        } else if (img.file) {
          setUploadStatusText(
            `Enviando foto ${uploadedCount + 1} de ${totalImagesToUpload}...`
          );
          const uploadedUrl = await uploadProductImageToStorage(img.file);
          finalImageUrls.push(uploadedUrl);
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / totalImagesToUpload) * 100));
        }
      }

      setUploadStatusText('Salvando dados do produto...');

      let savedProduct: DBProduct;

      if (isEditing && product) {
        savedProduct = await updateProductAdmin(product.id, {
          name: name.trim(),
          category: category.trim(),
          description: description.trim() || null,
          tags,
          images: finalImageUrls,
          is_published: isPublished,
        });
      } else {
        savedProduct = await createProductAdmin({
          name: name.trim(),
          category: category.trim(),
          description: description.trim() || null,
          tags,
          images: finalImageUrls,
          is_published: isPublished,
          sort_order: 0,
        });
      }

      setSuccessMessage('Produto salvo e já está no site!');
      setTimeout(() => {
        onSuccess(savedProduct);
      }, 1200);
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(errObj.message || 'Erro ao salvar produto.');
    } finally {
      setSaving(false);
      setUploadProgress(null);
      setUploadStatusText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0C0B0A]/85 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-2xl bg-[#161514] border border-white/[0.08] text-[#F4EFE6] rounded-[20px] p-6 sm:p-8 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-[#F4EFE6]">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <p className="font-sans text-xs text-[#A59E92] mt-0.5">
              {isEditing
                ? 'Atualize os dados e fotos do modelo'
                : 'Cadastre um novo copo com fotos otimizadas'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A59E92] hover:text-[#F4EFE6] rounded-full hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Nome do Produto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A59E92] mb-2">
              Nome do produto <span className="text-[#B8975A]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Copo Fosco Degradê Sunset"
              className="w-full px-4 py-3 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors"
            />
          </div>

          {/* 2. Categoria com inline create */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#A59E92]">
                Categoria <span className="text-[#B8975A]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                className="text-xs text-[#B8975A] hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova categoria</span>
              </button>
            </div>

            {isAddingNewCategory ? (
              <div className="flex gap-2 p-3 rounded-xl bg-[#0C0B0A] border border-[#B8975A]/40 mb-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nome da categoria..."
                  className="flex-1 px-3 py-1.5 bg-[#161514] border border-white/[0.1] rounded-lg text-sm text-[#F4EFE6] focus:outline-none focus:border-[#B8975A]"
                />
                <button
                  type="button"
                  disabled={catLoading || !newCatName.trim()}
                  onClick={handleSaveInlineCategory}
                  className="px-4 py-1.5 rounded-lg bg-[#B8975A] text-[#0C0B0A] font-semibold text-xs hover:bg-[#c9a767] transition-colors disabled:opacity-50"
                >
                  {catLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.08] text-[#A59E92] hover:text-[#F4EFE6] text-xs"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] focus:outline-none focus:border-[#B8975A] transition-colors cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-[#161514] text-[#F4EFE6]">
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 3. Descrição com contador de 220 caracteres */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#A59E92]">
                Descrição do produto
              </label>
              <span
                className={`text-xs font-mono ${
                  description.length > maxDescLength
                    ? 'text-red-400 font-bold'
                    : 'text-[#6E675D]'
                }`}
              >
                {description.length}/{maxDescLength}
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={maxDescLength}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o acabamento, toque, material e diferenciais para eventos..."
              className="w-full px-4 py-3 bg-[#0C0B0A] border border-white/[0.12] rounded-2xl text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* 4. Tags / Diferenciais (Chips) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A59E92] mb-2">
              Tags / Características rápidas
            </label>
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <TagIcon className="w-4 h-4 text-[#6E675D] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Ex: Toque Aveludado, Sem BPA (pressione Enter)"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2.5 rounded-full bg-white/[0.08] text-[#F4EFE6] text-xs font-medium hover:bg-white/[0.15] transition-colors"
              >
                Adicionar
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#B8975A]/15 text-[#B8975A] border border-[#B8975A]/30"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 5. Fotos do Produto (Upload, Prévia, Reordenar e Definir Capa) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#A59E92]">
                Fotos do produto ({images.length}/{MAX_IMAGES_PER_PRODUCT})
              </label>
              <span className="text-[11px] text-[#A59E92]">
                A 1ª foto é a capa principal
              </span>
            </div>

            {/* Dropzone & Picker */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-white/[0.15] hover:border-[#B8975A] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#0C0B0A]/50 hover:bg-[#0C0B0A] group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Upload className="w-8 h-8 mx-auto text-[#6E675D] group-hover:text-[#B8975A] transition-colors mb-2" />
              <p className="text-xs font-sans font-medium text-[#F4EFE6] mb-1">
                Clique para selecionar da galeria / câmera ou arraste até aqui
              </p>
              <p className="text-[11px] text-[#6E675D]">
                Conversão automática para WebP (máx. 1400px, 0.82) · Até 10 MB por foto
              </p>
            </div>

            {/* Status text or progress */}
            {uploadStatusText && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#B8975A]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{uploadStatusText}</span>
              </div>
            )}

            {uploadProgress !== null && (
              <div className="w-full bg-[#0C0B0A] rounded-full h-1.5 mt-2 overflow-hidden border border-white/[0.08]">
                <div
                  className="bg-[#B8975A] h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Thumbnails Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className={`relative rounded-xl overflow-hidden border p-1 bg-[#0C0B0A] flex flex-col items-center justify-between ${
                      index === 0
                        ? 'border-[#B8975A] ring-1 ring-[#B8975A]'
                        : 'border-white/[0.1]'
                    }`}
                  >
                    {/* Badge Capa */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#B8975A] text-[#0C0B0A] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Capa</span>
                      </span>
                    )}

                    {/* Image Preview */}
                    <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#161514] flex items-center justify-center p-2">
                      <img
                        src={img.url}
                        alt={`Foto ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Image Controls */}
                    <div className="w-full flex items-center justify-between pt-2 px-1 text-[#A59E92]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveImage(index, 'left')}
                          className="p-1 hover:text-[#F4EFE6] disabled:opacity-20"
                          title="Mover para a esquerda"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === images.length - 1}
                          onClick={() => moveImage(index, 'right')}
                          className="p-1 hover:text-[#F4EFE6] disabled:opacity-20"
                          title="Mover para a direita"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(index)}
                          className="text-[10px] text-[#B8975A] hover:underline"
                          title="Definir como foto de capa"
                        >
                          Definir capa
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 hover:text-red-400"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Interruptor "Publicado" */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#0C0B0A] border border-white/[0.08]">
            <div>
              <span className="block text-sm font-sans font-medium text-[#F4EFE6]">
                Visível no catálogo (Publicado)
              </span>
              <span className="block text-xs text-[#6E675D]">
                Se desmarcado, o copo fica oculto aos visitantes do site
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/[0.15] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#0C0B0A] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B8975A]"></div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 rounded-full text-xs font-semibold text-[#A59E92] hover:text-[#F4EFE6] transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-full bg-[#F4EFE6] text-[#0C0B0A] text-sm font-semibold hover:bg-[#B8975A] transition-colors disabled:opacity-50 flex items-center gap-2 group"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <span>Salvar produto</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
