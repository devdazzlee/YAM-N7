'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import HeroSection from './components/HeroSection';
import IdentitySection from './components/IdentitySection';
import GenderProductCollections from './components/GenderProductCollections';
import StatsSection from './components/StatsSection';
import LuxuryCollectionsSection from './components/LuxuryCollectionsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import TrendingProductsSection from './components/TrendingProductsSection';
import ProductShowcaseSection from './components/ProductShowcaseSection';
import BestSellersSection from './components/BestSellersSection';
import WhyChooseYAMSection from './components/WhyChooseYAMSection';
import SignatureBannerSection from './components/SignatureBannerSection';
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
      <IdentitySection />
      <GenderProductCollections />
      <StatsSection />
      <LuxuryCollectionsSection />
      <TrendingProductsSection
        initialProducts={featured}
        initialTotal={featuredTotal}
        initialLoading={loading && !data}
      />
      <BestSellersSection
        products={bestSellers}
        loading={loading && !data}
      />
      <WhyChooseYAMSection />
      <SignatureBannerSection />
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
