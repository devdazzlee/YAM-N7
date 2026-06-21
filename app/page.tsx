'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import CategoriesSection from './components/CategoriesSection';
import LuxuryCollectionsSection from './components/LuxuryCollectionsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import ProductShowcaseSection from './components/ProductShowcaseSection';
import NewArrivalsSection from './components/NewArrivalsSection';
import BrandStorySection from './components/BrandStorySection';
import BenefitsSection from './components/BenefitsSection';
import FragranceNotesSection from './components/FragranceNotesSection';
import TestimonialsSection from './components/TestimonialsSection';
import SocialShowcaseSection from './components/SocialShowcaseSection';
import { useWebHomeStore } from '../lib/store/webHomeStore';

export default function Home() {
  const data = useWebHomeStore((s) => s.data);
  const loading = useWebHomeStore((s) => s.loading);
  const error = useWebHomeStore((s) => s.error);
  const fetch = useWebHomeStore((s) => s.fetch);

  useEffect(() => {
    fetch().catch(() => {});
  }, [fetch]);

  const featured = data?.featuredProducts ?? [];
  const bestSellers = data?.bestSellingProducts ?? [];
  const categories = data?.categories ?? [];
  const categoriesTotal = data?.categories_total ?? categories.length;
  const featuredTotal = data?.featured_total ?? featured.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <CategoriesSection
        initialCategories={categories}
        initialTotal={categoriesTotal}
        initialLoading={loading && !data}
        error={error}
      />
      <LuxuryCollectionsSection />
      <FeaturedProductsSection
        initialProducts={featured}
        initialTotal={featuredTotal}
        initialLoading={loading && !data}
      />
      <ProductShowcaseSection
        id="best-sellers"
        accent="Client Favourites"
        title="Best Sellers"
        subtitle="The fragrances our community loves most — proven performers with exceptional reviews."
        products={bestSellers}
        loading={loading && !data}
        viewAllHref="/best-sellers"
        viewAllLabel="Shop Best Sellers"
        dark
      />
      <NewArrivalsSection />
      <BrandStorySection />
      <WhyChooseUsSection />
      <FragranceNotesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <SocialShowcaseSection />
      <Newsletter />
      <Footer />
    </div>
  );
}
