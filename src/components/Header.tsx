import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { CONFIG } from '../config';
import { useQuote } from '../context/QuoteContext';

export const Header: React.FC = () => {
  const { totalItems, totalDistinct, openDrawer, lastAddedItem } = useQuote();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > 200 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        // Scrolling down -> hide header
        setIsVisible(false);
      } else {
        // Scrolling up -> show header
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? 'bg-[#0A0A0D]/80 backdrop-blur-xl border-b border-white/[0.07] py-3.5 shadow-2xl shadow-black/60'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Wordmark with subtle gold crown */}
        <a
          href="#"
          className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#D9B777] transition-transform duration-300 group-hover:-translate-y-0.5"
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
            <span className="font-serif text-xl sm:text-2xl text-[#F6F2EA] tracking-tight group-hover:text-gradient-gold transition-all duration-300">
              Rei do Copo
            </span>
          </div>
          <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-[#D9B777]/80 bg-[#15151B] px-2 py-0.5 rounded-full border border-[#D9B777]/20">
            {CONFIG.brand.experienceBadge}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {CONFIG.navigation.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#A9A4B2] hover:text-[#F6F2EA] transition-colors duration-200 relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#FF2E93] to-[#D9B777] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quote Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={openDrawer}
            className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border ${
              totalItems > 0
                ? 'bg-[#15151B] border-[#FF2E93]/40 text-[#F6F2EA] shadow-[0_0_20px_rgba(255,46,147,0.25)] hover:border-[#D9B777]'
                : 'bg-[#15151B]/70 border-white/[0.08] text-[#A9A4B2] hover:text-[#F6F2EA] hover:border-white/20'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${totalItems > 0 ? 'text-[#FF2E93]' : 'text-[#D9B777]'}`} />
            <span className="hidden sm:inline">Minha cotação</span>
            
            <AnimatePresence>
              {totalDistinct > 0 && (
                <motion.span
                  key={totalDistinct}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-mono font-bold bg-gradient-to-r from-[#FF2E93] to-[#D9B777] text-black"
                >
                  {totalDistinct}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Ripple pulse when item added */}
            {lastAddedItem && (
              <motion.span
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.8, repeat: 1 }}
                className="absolute inset-0 rounded-full border-2 border-[#D9B777] pointer-events-none"
              />
            )}
          </motion.button>

          {/* Direct WhatsApp CTA Button */}
          <a
            href={CONFIG.whatsapp.getWhatsAppUrl([])}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase font-mono text-[#D9B777] border border-[#D9B777]/30 bg-[#15151B] hover:bg-[#D9B777]/10 hover:border-[#D9B777] transition-all duration-300 shine-effect"
          >
            <span>Falar com consultor</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Abrir menu"
            className="lg:hidden p-2 text-[#A9A4B2] hover:text-[#F6F2EA] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-[#0A0A0D]/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-6"
          >
            <div className="flex flex-col gap-4">
              {CONFIG.navigation.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-serif text-[#F6F2EA] hover:text-[#D9B777] transition-colors py-2 border-b border-white/[0.04]"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={CONFIG.whatsapp.getWhatsAppUrl([])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 rounded-full text-sm font-semibold tracking-wider font-mono text-black bg-gradient-to-r from-[#FF2E93] to-[#D9B777] shadow-[0_0_30px_rgba(255,46,147,0.3)]"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
