import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, input, [role="button"]');
      const viewTarget = target.closest('[data-cursor="view"]');

      if (viewTarget) {
        setCursorText('Ver');
        setIsHovered(true);
      } else if (interactive) {
        setCursorText(null);
        setIsHovered(true);
      } else {
        setCursorText(null);
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-200"
      animate={{
        x: pos.x,
        y: pos.y,
        width: cursorText ? 64 : isHovered ? 38 : 14,
        height: cursorText ? 64 : isHovered ? 38 : 14,
      }}
      transition={{
        type: 'spring',
        damping: 24,
        stiffness: 300,
        mass: 0.2,
      }}
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-200 ${
          cursorText
            ? 'bg-[#15151B]/90 backdrop-blur-md border border-[#D9B777] shadow-[0_0_20px_rgba(217,183,119,0.4)] text-[11px] font-mono uppercase tracking-widest text-[#F3E1B0]'
            : isHovered
            ? 'bg-transparent border-2 border-[#FF2E93] shadow-[0_0_15px_rgba(255,46,147,0.5)]'
            : 'bg-transparent border border-[#D9B777] shadow-[0_0_8px_rgba(217,183,119,0.3)]'
        }`}
      >
        {cursorText && <span>{cursorText}</span>}
      </div>
    </motion.div>
  );
};
