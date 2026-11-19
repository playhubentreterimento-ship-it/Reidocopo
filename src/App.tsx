import React from 'react';
import { QuoteProvider } from './context/QuoteContext';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ScrollStorytelling } from './components/ScrollStorytelling';
import { BrandImpact } from './components/BrandImpact';
import { Differentials } from './components/Differentials';
import { Catalog } from './components/Catalog';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { QuoteDrawer } from './components/QuoteDrawer';
import { FloatingQuoteButton } from './components/FloatingQuoteButton';

export const App: React.FC = () => {
  return (
    <QuoteProvider>
      {/* Film grain cinematic texture overlay (3.5% opacity) */}
      <div className="film-grain" />

      {/* Top 2px scroll progress bar */}
      <ScrollProgressBar />

      {/* Custom desktop gold cursor */}
      <CustomCursor />

      {/* Floating minimal header */}
      <Header />

      {/* Main landing flow */}
      <main className="w-full relative z-10">
        <Hero />
        <ScrollStorytelling />
        <BrandImpact />
        <Differentials />
        <Catalog />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>

      {/* Minimal luxury footer */}
      <Footer />

      {/* Floating quote trigger & mobile bar */}
      <FloatingQuoteButton />

      {/* Interactive quote drawer / bottom sheet */}
      <QuoteDrawer />
    </QuoteProvider>
  );
};

export default App;
