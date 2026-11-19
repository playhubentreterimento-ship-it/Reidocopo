# Rei do Copo · Landing Page

> "Leve sua marca até onde você não imagina."

Landing page de alta conversão e estética luxo para a **Rei do Copo**, fabricante de ecopos personalizados com mais de 10 anos de mercado.

## Stack Técnica

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Animações & Gestos**: [Framer Motion](https://www.framer.com/motion/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Fontes**: Instrument Serif, Manrope e JetBrains Mono (via Google Fonts)

## Estrutura da Landing Page

1. **Header Flutuante Minimalista**: Wordmark serifado "Rei do Copo" com sutil coroa dourada, navegação e acionador da cotação.
2. **Hero com Efeito Ken Burns & 3D**: Headline com revelação por linha, copo em levitação contínua, chips assimétricos em vidro escuro e CTAs magnéticos com efeito shine.
3. **Scroll Storytelling**: Canvas 9:16 sincronizado com 240 frames WebP em alta definição, pré-carregamento progressivo, interpolação de sub-frame e legendas dinâmicas.
4. **Impacto ("Sua marca em mil mãos")**: Slider interativo de comparação antes/depois, contador animado `+10 anos de mercado`, faixa horizontal guiada pelo scroll e marquee infinito reversível.
5. **Diferenciais**: Afirmação gigante com palavras que se iluminam no scroll (*"Ecológico. Resistente. Seu."*) e 3 blocos com layouts exclusivos.
6. **Catálogo Interativo Bento**: Filtros em tabs animadas, cards com tilt 3D ao cursor, modal de detalhes com seletor de quantidade e feedback visual instantâneo.
7. **Como Funciona**: Três passos com numeração outline preenchida por gradiente e hairline dourada conectiva.
8. **FAQ Accordion**: 5 perguntas essenciais com animação de expansão suave.
9. **CTA Final & Rodapé**: Atmosfera de palco escuro, pulsos de luz e fechamento para contato imediato.
10. **Minha Cotação & WhatsApp**: Drawer lateral (desktop) / Bottom Sheet (mobile) com cálculo e geração automática do link `https://wa.me/...`.

## Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Compilar para produção
npm run build
```

## Deploy na Vercel

O projeto está 100% configurado para deploy automático na [Vercel](https://vercel.com):

1. Suba este repositório para o seu GitHub/GitLab/Bitbucket.
2. Acesse o painel da Vercel e clique em **"Add New... > Project"**.
3. Importe o repositório `rei-do-copo`.
4. As configurações padrão do Vite são detectadas automaticamente:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **"Deploy"**.
