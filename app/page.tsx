'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import PerfumeStoryExperience from './components/PerfumeStoryExperience';
import IdentitySection from './components/IdentitySection';
import GenderProductCollections from './components/GenderProductCollections';
import StatsSection from './components/StatsSection';
import LuxuryCollectionsSection from './components/LuxuryCollectionsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import TrendingProductsSection from './components/TrendingProductsSection';
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
  const fetch = useWebHomeStore((s) => s.fetch);

  useEffect(() => {
    fetch().catch(() => {});
  }, [fetch]);

  const featured = data?.featuredProducts ?? [];
  const bestSellers = data?.bestSellingProducts ?? [];
  const featuredTotal = data?.featured_total ?? featured.length;

  return (
    <div className="min-h-screen bg-[#12040b]">
      <Header />
      <PerfumeStoryExperience />
      <IdentitySection />
      <GenderProductCollections />
      <StatsSection />
      <LuxuryCollectionsSection />
      <TrendingProductsSection
        initialProducts={featured}
        initialTotal={featuredTotal}
        initialLoading={loading && !data}
      />
      <BestSellersSection products={bestSellers} loading={loading && !data} />
      <WhyChooseYAMSection />
      <SignatureBannerSection />
      <NewArrivalsSection />
      <BrandStorySection />
      <SocialShowcaseSection />
      <WhyChooseUsSection />
      <FragranceNotesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <Newsletter />
      <Footer />
    </div>
  );
}
