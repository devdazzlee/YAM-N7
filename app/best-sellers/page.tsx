'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import ProductBrowser from '../components/ProductBrowser';
import PageHero from '../components/pages/PageHero';
import TrustStrip from '../components/pages/TrustStrip';
import FeatureShowcase from '../components/pages/FeatureShowcase';
import PageFAQ from '../components/pages/PageFAQ';
import PageCTA from '../components/pages/PageCTA';
import { SectionHeader, SectionShell, Reveal } from '../components/motion/reveal';
import {
  Trophy, Award, Star, ShieldCheck, Layers, TrendingUp, Heart, Gem,
} from 'lucide-react';

const BESTSELLERS_FAQ = [
  {
    q: 'How are Best Sellers determined?',
    a: 'Our Best Sellers are ranked by actual order volume over the past 30 days. Products that maintain consistently high demand across all customer segments make this list.',
  },
  {
    q: 'Do Best Sellers change regularly?',
    a: 'Yes — the list is refreshed frequently. Seasonal trends, new launches, and community buzz all influence the ranking so you always see what\'s genuinely popular right now.',
  },
  {
    q: 'Are these good choices for gifting?',
    a: 'Absolutely. Best Sellers represent proven quality — fragrances loved by thousands of customers. A safe, elegant, and appreciated gift choice every time.',
  },
  {
    q: 'Can I get free shipping on Best Sellers?',
    a: 'Yes. All orders above Rs. 5,000 qualify for free nationwide delivery, whether you\'re buying from Best Sellers or any other collection.',
  },
];

export default function BestSellersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageHero
        label="Best Sellers"
        title="Loved by Thousands"
        subtitle="Our most-ordered fragrances — proven favourites chosen by customers across Pakistan for quality, longevity, and sheer presence."
        image="/banners/New-Banner.jpg"
        imageAlt="YAM-N7 Best Sellers — most popular fragrances"
      >
        <Link href="#products" className="luxury-btn-primary">
          Shop Best Sellers
        </Link>
      </PageHero>

      <TrustStrip
        items={[
          { icon: Trophy, label: 'Customer Favourite', value: '#1 Picks' },
          { icon: Star, label: 'Satisfaction', value: '4.9 / 5' },
          { icon: Layers, label: 'Orders', value: '10,000+' },
          { icon: ShieldCheck, label: 'Authentic', value: '100%' },
        ]}
      />

      {/* Product Grid */}
      <div id="products">
        <ProductBrowser bucketKey="best-sellers" />
      </div>

      {/* Why Our Best Sellers */}
      <SectionShell className="bg-surface-muted/30">
        <SectionHeader
          accent="Proven Quality"
          title="Why These Stand Out"
          subtitle="Not just popular — these are fragrances that have genuinely moved people."
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              icon: TrendingUp,
              title: 'Ranked by Real Orders',
              desc: 'No editorial picks or paid placements. Best Sellers are determined entirely by actual customer purchase volume.',
            },
            {
              step: '02',
              icon: Heart,
              title: 'Repeat Buyers',
              desc: 'Many customers return specifically for the same scent — the true mark of a fragrance worth wearing again and again.',
            },
            {
              step: '03',
              icon: Gem,
              title: 'Across All Collections',
              desc: 'From daily attars to premium oud blends — our Best Sellers span every occasion, budget, and personality type.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.step} delay={i * 0.1}>
                <div className="luxury-card p-6 sm:p-7 h-full relative">
                  <span className="absolute top-4 right-4 font-heading text-3xl text-primary/15">{item.step}</span>
                  <Icon className="w-5 h-5 text-primary mb-4" strokeWidth={1.5} />
                  <h3 className="font-heading text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </SectionShell>

      <FeatureShowcase
        accent="The YAM-N7 Promise"
        title="Quality You Can Trust"
        subtitle="Every product in our Best Sellers list is held to the same uncompromising YAM-N7 standard."
        items={[
          {
            icon: ShieldCheck,
            title: 'Authenticity Guaranteed',
            description: 'Every fragrance is verified for authenticity before it reaches our shelves. No imitations, ever.',
          },
          {
            icon: Award,
            title: '25+ Years of Expertise',
            description: 'Decades of fragrance knowledge guide every curation decision — we only sell what we believe in.',
          },
          {
            icon: Trophy,
            title: 'Customer Approved',
            description: 'These are not just products — they are fragrances that have earned the loyalty of thousands of repeat customers.',
          },
          {
            icon: Star,
            title: 'Highest Rated',
            description: 'Consistently top-rated for projection, longevity, and overall satisfaction across all review channels.',
          },
        ]}
        columns={4}
      />

      <PageFAQ accent="Best Sellers FAQ" title="Common Questions" items={BESTSELLERS_FAQ} />

      <PageCTA
        title="Can't Decide? We'll Help."
        subtitle="Tell us the occasion, your style, and your budget — our fragrance team will match you to the perfect Best Seller."
        primaryHref="/contact"
        primaryLabel="Get a Recommendation"
        secondaryHref="/shop"
        secondaryLabel="Browse Full Shop"
      />

      <Newsletter />
      <Footer />
    </div>
  );
}
