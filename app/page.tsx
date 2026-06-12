'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import CategoriesSection from './components/CategoriesSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import BenefitsSection from './components/BenefitsSection';
import HerbsSection from './components/HerbsSection';
import TestimonialsSection from './components/TestimonialsSection';
import { useWebHomeStore } from '../lib/store/webHomeStore';

export default function Home() {
  const data = useWebHomeStore((s) => s.data);
  const loading = useWebHomeStore((s) => s.loading);
  const error = useWebHomeStore((s) => s.error);
  const fetch = useWebHomeStore((s) => s.fetch);

  // Single bundled request for everything the homepage needs.
  // Cached for 5 min via the store; cached for 5 min via Redis on the backend.
  useEffect(() => {
    fetch().catch(() => {});
  }, [fetch]);

  const featured = data?.featuredProducts ?? [];
  const categories = data?.categories ?? [];
  const categoriesTotal = data?.categories_total ?? categories.length;
  const featuredTotal = data?.featured_total ?? featured.length;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <StatsSection />
      <CategoriesSection
        initialCategories={categories}
        initialTotal={categoriesTotal}
        initialLoading={loading && !data}
        error={error}
      />
      <WhyChooseUsSection />
      <FeaturedProductsSection
        initialProducts={featured}
        initialTotal={featuredTotal}
        initialLoading={loading && !data}
      />
      <BenefitsSection />
      <HerbsSection categories={categories} />
      <TestimonialsSection />
      <Newsletter />
      <Footer />

      {/* The initial loading skeleton is intentionally inside CategoriesSection /
          FeaturedProductsSection so the rest of the page (hero, banners, footer)
          renders immediately without waiting on data. */}
      {loading && !data && null}
    </div>
  );
}
