import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { CONFIG } from '../config';
import { useQuote } from '../context/QuoteContext';

export const Header: React.FC = () => {
  const { totalDistinct, openDrawer } = useQuote();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-[#0C0B0A] border-b border-white/[0.08] py-4'
          : 'bg-transparent py-6 sm:py-7'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Typographic Wordmark with delicate fine-line gold crown */}
        <a
          href="#"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
        >
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
          <span className="font-serif text-xl sm:text-2xl text-[#F4EFE6] tracking-tight">
            Rei do Copo
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {CONFIG.navigation.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] text-[#A59E92] hover:text-[#F4EFE6] transition-colors relative group py-1 font-medium font-sans"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#B8975A] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={openDrawer}
            className="px-5 py-2.5 rounded-full border border-[#B8975A]/60 text-[14px] font-sans font-semibold text-[#F4EFE6] hover:bg-[#B8975A] hover:text-[#0C0B0A] hover:border-[#B8975A] transition-colors duration-200"
          >
            Cotação {totalDistinct > 0 ? `(${totalDistinct})` : ''}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Menu"
            className="md:hidden p-1.5 text-[#F4EFE6] hover:text-[#B8975A] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0C0B0A] border-b border-white/[0.08] px-6 py-8"
          >
            <div className="flex flex-col gap-5">
              {CONFIG.navigation.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl text-[#F4EFE6] hover:text-[#B8975A] transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/[0.08]">
                <a
                  href={CONFIG.whatsapp.getWhatsAppUrl([])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3.5 rounded-[2px] bg-[#F4EFE6] text-[#0C0B0A] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#B8975A] transition-colors"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
