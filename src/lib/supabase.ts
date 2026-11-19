import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('seu-projeto')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface DBProduct {
  id: string;
  name: string;
  category: string;
  description: string | null;
  tags: string[];
  images: string[];
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface DBCategory {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

// -------------------------------------------------------------
// SERVIÇOS DO SITE PÚBLICO
// -------------------------------------------------------------

export async function fetchPublishedProducts(): Promise<DBProduct[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos do Supabase:', error);
    throw error;
  }

  return data || [];
}

export async function fetchCategories(): Promise<DBCategory[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Erro ao buscar categorias do Supabase:', error);
    throw error;
  }

  return data || [];
}

// -------------------------------------------------------------
// SERVIÇOS DO PAINEL ADMINISTRATIVO (REQUER AUTENTICAÇÃO)
// -------------------------------------------------------------

export async function fetchAllProductsAdmin(): Promise<DBProduct[]> {
  if (!supabase) throw new Error('Supabase não configurado');

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProductAdmin(
  product: Omit<DBProduct, 'id' | 'created_at'>
): Promise<DBProduct> {
  if (!supabase) throw new Error('Supabase não configurado');

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductAdmin(
  id: string,
  updates: Partial<Omit<DBProduct, 'id' | 'created_at'>>
): Promise<DBProduct> {
  if (!supabase) throw new Error('Supabase não configurado');

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProductAdmin(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado');

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleProductStatusAdmin(
  id: string,
  is_published: boolean
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado');

  const { error } = await supabase
    .from('products')
    .update({ is_published })
    .eq('id', id);

  if (error) throw error;
}

export async function updateProductSortOrderAdmin(
  id: string,
  sort_order: number
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado');

  const { error } = await supabase
    .from('products')
    .update({ sort_order })
    .eq('id', id);

  if (error) throw error;
}

// -------------------------------------------------------------
// GERENCIAMENTO DE CATEGORIAS
// -------------------------------------------------------------

export async function createCategoryAdmin(
  name: string,
  sort_order: number = 0
): Promise<DBCategory> {
  if (!supabase) throw new Error('Supabase não configurado');

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: name.trim(), sort_order }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategoryAdmin(
  id: string,
  name: string,
  sort_order: number
): Promise<DBCategory> {
  if (!supabase) throw new Error('Supabase não configurado');

  const { data, error } = await supabase
    .from('categories')
    .update({ name: name.trim(), sort_order })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategoryAdmin(id: string, name: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado');

  // Verifica se alguma peça usa esta categoria
  const { data: productsUsing, error: countError } = await supabase
    .from('products')
    .select('id, name')
    .eq('category', name)
    .limit(1);

  if (countError) throw countError;

  if (productsUsing && productsUsing.length > 0) {
    throw new Error(
      `Não é possível excluir a categoria "${name}" pois ela está vinculada a produtos existentes.`
    );
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// UPLOAD DE IMAGENS NO SUPABASE STORAGE
// -------------------------------------------------------------

export async function uploadProductImageToStorage(
  file: File,
  folder: string = 'catalog'
): Promise<string> {
  if (!supabase) throw new Error('Supabase não configurado');

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const filePath = `${folder}/${timestamp}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
