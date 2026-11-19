import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';

const GALLERY_PHOTOS = [
  {
    src: '/assets/copo-degrade-rosa.webp',
    alt: 'Copo Fosco Degradê',
    label: 'FOSCO DEGRADÊ',
    span: 'sm:col-span-7 h-[360px] sm:h-[420px]',
  },
  {
    src: '/assets/taca-preta-dourada.webp',
    alt: 'Taça Premium Black & Gold',
    label: 'TAÇA NOBRE',
    span: 'sm:col-span-5 h-[360px] sm:h-[420px]',
  },
  {
    src: '/assets/copos-festa-iluminados.webp',
    alt: 'Copos iluminados em festa',
    label: 'ATMOSFERA NOTURNA',
    cropClass: 'crop-hide-bottom',
    span: 'sm:col-span-4 h-[320px] sm:h-[360px]',
  },
  {
    src: '/assets/copos-vermelhos-cordoes.webp',
    alt: 'Copos com alça e tirante',
    label: 'COM ALÇA & TIRANTE',
    cropClass: 'crop-hide-top',
    span: 'sm:col-span-4 h-[320px] sm:h-[360px]',
  },
  {
    src: '/assets/copo-brasil-praia.webp',
    alt: 'Copo solar evento praia',
    label: 'OPEN AIR & SUNSET',
    cropClass: 'crop-hide-bottom',
    span: 'sm:col-span-4 h-[320px] sm:h-[360px]',
  },
  {
    src: '/assets/copos-choppada.webp',
    alt: 'Copo Choppada estampa total',
    label: 'ESTAMPA TOTAL 360°',
    cropClass: 'crop-hide-top',
    span: 'sm:col-span-12 h-[280px] sm:h-[320px]',
  },
];

export const BrandImpact: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(95, Math.max(5, pos)));
  };

  const countRef = useRef<HTMLSpanElement>(null);
  const isCountInView = useInView(countRef, { once: true });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (isCountInView) {
      let start = 0;
      const end = 10;
      const stepTime = 1200 / end;
      const timer = setInterval(() => {
        start += 1;
        setDisplayCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isCountInView]);

  return (
    <>
      {/* Bloco 1: Impacto "Sua marca em mil mãos" (Fundo Marfim #F4EFE6) */}
      <section id="impacto" className="relative w-full bg-[#F4EFE6] text-[#1A1816] py-32 sm:py-40">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8975A] mb-4 block">
              Sua Marca Em Mil Mãos
            </span>

            <h2 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.01em] text-[#1A1816] mb-6 font-normal">
              Sem marca, é só um copo.{' '}
              <span className="italic font-normal">Com ela, é lembrança.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#6B655C] leading-[1.7] max-w-xl mx-auto font-normal">
              Um descartável termina no lixo em minutos. Um ecopo personalizado acompanha seu
              convidado para casa e mantém sua história viva nos momentos mais autênticos.
            </p>

            {/* Contador +10 Anos Limpo */}
            <div className="mt-10 flex justify-center">
              <div className="inline-flex items-center gap-6 pt-6 border-t border-[#B8975A]/40 text-left">
                <span className="font-serif text-5xl sm:text-6xl text-[#1A1816] font-normal leading-none">
                  +<span ref={countRef}>{displayCount}</span>{' '}
                  <span className="italic text-2xl sm:text-3xl font-normal text-[#B8975A]">anos</span>
                </span>
                <div className="h-8 w-[1px] bg-[#1A1816]/15" />
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#6B655C]">
                  Tradição em Ecopos no Brasil
                </span>
              </div>
            </div>
          </div>

          {/* Comparativo Antes / Depois Limpo (Hairline Divider) */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.14em] text-[#6B655C] mb-3">
              <span>Antes · Neutro</span>
              <span>Depois · Personalizado</span>
            </div>

            <div
              ref={sliderContainerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={(e) => isDragging && handleSliderMove(e.clientX)}
              onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[480px] rounded-[2px] overflow-hidden select-none cursor-ew-resize bg-[#EAE3D6] border border-[#1A1816]/10"
            >
              {/* After */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src="/assets/copos-choppada.webp"
                  alt="Ecopo personalizado"
                  className="w-full h-full object-cover crop-hide-top"
                />
              </div>

              {/* Before (Grayscale) */}
              <div
                className="absolute inset-0 h-full overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="relative w-full h-full">
                  <img
                    src="/assets/copos-choppada.webp"
                    alt="Copo genérico sem marca"
                    className="absolute inset-0 w-full h-full object-cover crop-hide-top filter grayscale contrast-90 brightness-90"
                    style={{
                      width: sliderContainerRef.current?.offsetWidth || '100%',
                      maxWidth: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Fine 1px Champagne Hairline Divider */}
              <div
                className="absolute top-0 bottom-0 w-[1px] bg-[#B8975A] z-30"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-[2px] bg-[#0C0B0A] border border-[#B8975A] flex items-center justify-center text-[#F4EFE6]">
                  <MoveHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco 2: Galeria Editorial (Fundo Marfim Escuro #EAE3D6) */}
      <section className="relative w-full bg-[#EAE3D6] text-[#1A1816] py-32 sm:py-40 border-t border-[#1A1816]/10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8975A] block mb-2">
                Galeria Editorial
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1816] font-normal">
                Ecopos nos melhores palcos
              </h3>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6B655C]">
              Acabamentos em Alta Definição
            </span>
          </div>

          {/* Desktop: Grade Editorial Assimétrica Estática */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-6 items-stretch">
            {GALLERY_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                className={`${photo.span} rounded-[2px] overflow-hidden bg-[#F4EFE6] border border-[#1A1816]/10 group relative flex flex-col justify-end`}
              >
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                      photo.cropClass || 'object-center'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/80 via-transparent to-transparent opacity-60" />
                </div>

                <div className="relative z-10 p-5 flex items-center justify-between text-[#F4EFE6]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] bg-[#0C0B0A]/90 px-3 py-1 border border-white/[0.08] rounded-[2px]">
                    {photo.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Carrossel Horizontal Snap */}
          <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-5 px-5">
            {GALLERY_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                className="snap-center flex-shrink-0 w-[270px] aspect-[4/5] rounded-[2px] overflow-hidden bg-[#F4EFE6] border border-[#1A1816]/10 relative flex flex-col justify-end"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`absolute inset-0 w-full h-full object-cover ${
                    photo.cropClass || 'object-center'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/80 via-transparent to-transparent opacity-60" />
                <div className="relative z-10 p-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F4EFE6] bg-[#0C0B0A]/90 px-2.5 py-1 border border-white/[0.08] rounded-[2px]">
                    {photo.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
