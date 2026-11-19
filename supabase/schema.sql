-- ========================================================
-- REI DO COPO - SCHEMA SUPABASE & SEED INICIAL
-- Cole este script no SQL Editor do painel Supabase
-- ========================================================

-- 1. Habilitar extensão pgcrypto (para gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Criar bucket de armazenamento público para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Conceder Permissões Globais para a API (anon, authenticated, authenticator)
GRANT USAGE ON SCHEMA public TO anon, authenticated, authenticator, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, authenticator, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, authenticator, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, authenticator, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, authenticator, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, authenticator, service_role;

-- 6. Políticas de RLS para CATEGORIAS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categorias são visíveis publicamente" ON public.categories;
DROP POLICY IF EXISTS "Apenas autenticados podem inserir categorias" ON public.categories;
DROP POLICY IF EXISTS "Apenas autenticados podem atualizar categorias" ON public.categories;
DROP POLICY IF EXISTS "Apenas autenticados podem excluir categorias" ON public.categories;
DROP POLICY IF EXISTS "categories_select_anon" ON public.categories;
DROP POLICY IF EXISTS "categories_all_authenticated" ON public.categories;

CREATE POLICY "categories_select_anon"
    ON public.categories FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "categories_all_authenticated"
    ON public.categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Políticas de RLS para PRODUTOS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visitantes podem ler apenas produtos publicados" ON public.products;
DROP POLICY IF EXISTS "Apenas autenticados podem inserir produtos" ON public.products;
DROP POLICY IF EXISTS "Apenas autenticados podem atualizar produtos" ON public.products;
DROP POLICY IF EXISTS "Apenas autenticados podem excluir produtos" ON public.products;
DROP POLICY IF EXISTS "products_select_anon" ON public.products;
DROP POLICY IF EXISTS "products_all_authenticated" ON public.products;

CREATE POLICY "products_select_anon"
    ON public.products FOR SELECT
    TO anon
    USING (is_published = true);

CREATE POLICY "products_all_authenticated"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Forçar recarga imediata do cache do PostgREST
NOTIFY pgrst, 'reload schema';

-- 8. Políticas de RLS para STORAGE (bucket product-images)
DROP POLICY IF EXISTS "Imagens de produtos são públicas" ON storage.objects;
CREATE POLICY "Imagens de produtos são públicas"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Apenas autenticados podem enviar imagens" ON storage.objects;
CREATE POLICY "Apenas autenticados podem enviar imagens"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Apenas autenticados podem atualizar imagens" ON storage.objects;
CREATE POLICY "Apenas autenticados podem atualizar imagens"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images')
    WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Apenas autenticados podem excluir imagens" ON storage.objects;
CREATE POLICY "Apenas autenticados podem excluir imagens"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');

-- 9. SEED: Inserir Categorias Iniciais
INSERT INTO public.categories (name, sort_order)
VALUES 
    ('Fosco degradê', 1),
    ('Estampa total', 2),
    ('Com alça', 3),
    ('Taças premium', 4)
ON CONFLICT (name) DO NOTHING;

-- 10. SEED: Inserir Produtos Iniciais (com caminhos existentes de /assets/)
INSERT INTO public.products (name, category, description, tags, images, is_published, sort_order)
VALUES
    (
        'Copo Fosco Degradê',
        'Fosco degradê',
        'Acabamento acetinado de toque aveludado e transição suave de tonalidades. Desenvolvido para eventos que exigem refinamento visual e sensorial.',
        ARRAY['Toque Aveludado', 'Degradê Suave', 'Sem BPA'],
        ARRAY['/assets/copo-degrade-rosa.webp'],
        true,
        1
    ),
    (
        'Taça Premium Black & Gold',
        'Taças premium',
        'Silhueta elegante com contraste marcante e presença imponente em celebrações. Estrutura equilibrada em polímero nobre que preserva o frescor sem quebra.',
        ARRAY['Linha Nobre', 'Festa VIP', 'Resistência Superior'],
        ARRAY['/assets/taca-preta-dourada.webp'],
        true,
        2
    ),
    (
        'Copo Estampa Total 360°',
        'Estampa total',
        'Área visual completa contornando todo o corpo do copo com máxima vivacidade. Perfeito para projetos gráficos ousados e identidades dinâmicas.',
        ARRAY['Gravação 360°', 'Alta Definição', 'Cores Vivas'],
        ARRAY['/assets/copos-choppada.webp'],
        true,
        3
    ),
    (
        'Copo com Cordão & Alça',
        'Com alça',
        'Mobilidade absoluta para os convidados com tirante confortável e fixação firme. Solução ideal para festivais e grandes comemorações.',
        ARRAY['Tirante Exclusivo', 'Praticidade', 'Zero Perda'],
        ARRAY['/assets/copos-vermelhos-cordoes.webp'],
        true,
        4
    ),
    (
        'Copo Artesanal Ice & Craft',
        'Estampa total',
        'Estrutura reforçada para bebidas geladas e apreciação com nitidez cristalina. Resistência térmica aprimorada para chopps e coquetéis.',
        ARRAY['Encorpado', 'Choque Térmico', 'Linha Bar'],
        ARRAY['/assets/copo-lupulo-gelo.webp'],
        true,
        5
    ),
    (
        'Copo Sunset Glow',
        'Fosco degradê',
        'Reflexos luminosos quentes que interagem com a iluminação cenográfica do palco. Pigmentação translúcida especial que ganha vida sob refletores.',
        ARRAY['Cenográfico', 'Efeito Glow', 'Brilho Intenso'],
        ARRAY['/assets/copos-festa-iluminados.webp'],
        true,
        6
    ),
    (
        'Copo Solar Daylight',
        'Estampa total',
        'Ideal para eventos ao ar livre, beira-mar, sunsets e celebrações diurnas. Polímero com proteção UV que preserva o brilho sob sol contínuo.',
        ARRAY['Proteção UV', 'Open Air', 'Super Resistente'],
        ARRAY['/assets/copo-brasil-praia.webp'],
        true,
        7
    ),
    (
        'Copo Neon Club Edition',
        'Fosco degradê',
        'Atmosfera magnética com reação vibrante em ambientes de luz negra e clubbing. Destaque absoluto em pistas de dança com fluorescência elegante sob luz UV.',
        ARRAY['Reativo UV', 'Pista & Palco', 'Inquebrável'],
        ARRAY['/assets/hero-bar-da-ink.webp'],
        true,
        8
    )
ON CONFLICT DO NOTHING;
