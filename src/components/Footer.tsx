import React from 'react';
import { ArrowUp, MessageSquare, Instagram, Globe } from 'lucide-react';
import { CONFIG } from '../config';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#07070A] border-t border-[#D9B777]/20 pt-16 pb-12 overflow-hidden text-[#A9A4B2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/[0.06] items-start">
          {/* Brand Wordmark & Tagline */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-[#D9B777]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              >
                <path d="M3 18h18M4 18l2-10 6 5 6-5 2 10H4z" />
                <circle cx="6" cy="8" r="1" fill="#D9B777" />
                <circle cx="12" cy="13" r="1" fill="#D9B777" />
                <circle cx="18" cy="8" r="1" fill="#D9B777" />
              </svg>
              <span className="font-serif text-2xl text-[#F6F2EA] tracking-tight">
                Rei do Copo
              </span>
            </div>
            <p className="text-sm text-[#A9A4B2] leading-relaxed max-w-sm mb-4">
              {CONFIG.brand.tagline} Fabricação premium de ecopos personalizados com alta resistência
              para eventos em todo o país.
            </p>
            <span className="font-mono text-xs uppercase tracking-widest text-[#D9B777] bg-[#15151B] px-3 py-1 rounded-full border border-[#D9B777]/25">
              {CONFIG.brand.experienceBadge}
            </span>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 flex flex-col">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F6F2EA] mb-4">
              Navegação
            </span>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {CONFIG.navigation.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#D9B777] transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Direct Contact & Social */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F6F2EA] mb-4">
              Atendimento Direto
            </span>
            <a
              href={CONFIG.whatsapp.getWhatsAppUrl([])}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#15151B] border border-white/[0.08] hover:border-[#25D366]/40 text-xs text-[#F6F2EA] transition-colors mb-4"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Solicitar Cotação WhatsApp</span>
            </a>
            <div className="flex items-center gap-3 text-[#A9A4B2]">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#15151B] border border-white/[0.06] flex items-center justify-center hover:text-[#D9B777] hover:border-[#D9B777]/40 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#15151B] border border-white/[0.06] flex items-center justify-center hover:text-[#D9B777] hover:border-[#D9B777]/40 transition-colors"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6E6A78]">
          <span>
            © {new Date().getFullYear()} Rei do Copo · Ecopos Personalizados. Todos os direitos
            reservados.
          </span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-[#D9B777] transition-colors"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
