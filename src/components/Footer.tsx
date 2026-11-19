import React from 'react';
import { ArrowUp, Globe } from 'lucide-react';
import { CONFIG } from '../config';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#0C0B0A] text-[#A59E92] border-t border-[#B8975A]/40 pt-20 pb-14">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08] items-start">
          {/* Brand Wordmark & Tagline */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-5">
              <svg
                className="w-4 h-4 text-[#B8975A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              >
                <path d="M3 18h18M4 18l2-10 6 5 6-5 2 10H4z" />
                <circle cx="6" cy="8" r="0.75" fill="#B8975A" />
                <circle cx="12" cy="13" r="0.75" fill="#B8975A" />
                <circle cx="18" cy="8" r="0.75" fill="#B8975A" />
              </svg>
              <span className="font-serif text-2xl text-[#F4EFE6] tracking-tight">
                Rei do Copo
              </span>
            </div>
            <p className="text-sm text-[#A59E92] leading-[1.7] max-w-sm mb-6 font-normal">
              {CONFIG.brand.tagline} Fabricação nacional de ecopos personalizados com alta resistência
              para eventos em todo o país.
            </p>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#B8975A]">
              {CONFIG.brand.experienceBadge}
            </span>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EFE6] mb-5">
              Navegação
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.12em]">
              {CONFIG.navigation.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#F4EFE6] transition-colors py-1 text-[#A59E92]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Direct Contact & Social */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4EFE6] mb-5">
              Atendimento Direto
            </span>
            <a
              href={CONFIG.whatsapp.getWhatsAppUrl([])}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.12em] text-[#F4EFE6] py-2 border-b border-[#B8975A]/60 hover:border-[#B8975A] transition-colors mb-6"
            >
              Falar no WhatsApp →
            </a>
            <div className="flex items-center gap-4 text-[#A59E92]">
              <a
                href="#"
                className="hover:text-[#F4EFE6] transition-colors"
                title="Instagram"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-[#F4EFE6] transition-colors"
                title="Website"
              >
                <Globe className="w-4 h-4 stroke-[1.25]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono tracking-[0.12em] uppercase text-[#6E675D]">
          <span>
            © {new Date().getFullYear()} Rei do Copo · Ecopos Personalizados.
          </span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-[#F4EFE6] transition-colors"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5 stroke-[1.25]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
