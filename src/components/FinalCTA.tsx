import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';
import { CONFIG } from '../config';

export const FinalCTA: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-full bg-[#0A0A0D] py-32 sm:py-40 overflow-hidden border-t border-white/[0.05]">
      {/* Pulsing Slow Magenta and Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#FF2E93]/20 via-[#D9B777]/15 to-transparent rounded-full blur-[170px] pointer-events-none animate-pulse-glow" />

      {/* Floating Decorative Cutout Silhouette Cups in Background Parallax */}
      <motion.div
        style={{
          transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)`,
        }}
        className="absolute -top-10 -left-12 sm:left-10 w-44 sm:w-60 opacity-20 pointer-events-none"
      >
        <img
          src="/assets/copo-degrade-rosa.webp"
          alt=""
          className="w-full object-contain filter blur-[1px]"
        />
      </motion.div>

      <motion.div
        style={{
          transform: `translate(${mousePos.x * -22}px, ${mousePos.y * -22}px)`,
        }}
        className="absolute -bottom-16 -right-12 sm:right-12 w-52 sm:w-72 opacity-25 pointer-events-none"
      >
        <img
          src="/assets/taca-preta-dourada.webp"
          alt=""
          className="w-full object-contain filter blur-[1px]"
        />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
        {/* Experience Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151B] border border-[#D9B777]/30 mb-8 shadow-xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D9B777]" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F3E1B0]">
            {CONFIG.brand.experienceBadge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.94] tracking-tight text-[#F6F2EA] mb-8"
        >
          Sua marca merece{' '}
          <span className="italic text-gradient-brand">chegar longe.</span>
        </motion.h2>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-xl text-[#A9A4B2] max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Ecopos de altíssima durabilidade que transformam eventos comuns em momentos inesquecíveis.
          Monte sua cotação em instantes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="#catalogo"
            className="w-full sm:w-auto px-9 py-4 rounded-full font-semibold text-sm sm:text-base text-black bg-gradient-to-r from-[#FF2E93] via-[#F3E1B0] to-[#D9B777] shadow-[0_0_40px_rgba(255,46,147,0.35)] hover:shadow-[0_0_60px_rgba(217,183,119,0.5)] transition-all duration-300 shine-effect text-center"
          >
            Montar minha cotação
          </a>

          <a
            href={CONFIG.whatsapp.getWhatsAppUrl([])}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-medium text-sm sm:text-base text-[#F6F2EA] bg-[#15151B] hover:bg-[#1D1D25] border border-white/[0.1] hover:border-[#25D366]/50 transition-all duration-300"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>Falar no WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
