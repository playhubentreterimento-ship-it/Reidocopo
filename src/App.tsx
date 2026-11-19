import React from 'react';
import { QuoteProvider } from './context/QuoteContext';
import { ScrollProgressBar } from './components/ScrollProgressBar';
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
      {/* 1px Champagne scroll progress bar */}
      <ScrollProgressBar />

      {/* Clean luxury minimal header */}
      <Header />

      {/* Alternating rhythm flow */}
      <main className="w-full relative">
        <Hero />
        <ScrollStorytelling />
        <BrandImpact />
        <Differentials />
        <Catalog />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>

      {/* Symmetrical luxury footer */}
      <Footer />

      {/* Minimal floating quote trigger */}
      <FloatingQuoteButton />

      {/* Refined quote drawer */}
      <QuoteDrawer />
    </QuoteProvider>
  );
};

export default App;
