'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import ProductBrowser from '../components/ProductBrowser';
import LuxuryCollectionsSection from '../components/LuxuryCollectionsSection';
import PageHero from '../components/pages/PageHero';
import TrustStrip from '../components/pages/TrustStrip';
import FeatureShowcase from '../components/pages/FeatureShowcase';
import PageFAQ from '../components/pages/PageFAQ';
import PageCTA from '../components/pages/PageCTA';
import { SectionHeader, SectionShell, Reveal } from '../components/motion/reveal';
import {
  Award,
  Truck,
  ShieldCheck,
  Sparkles,
  Search,
  Heart,
  Gift,
  Clock,
  Layers,
} from 'lucide-react';

const SHOP_BUCKET = 'shop';

const SHOP_FAQ = [
  {
    q: 'Are all fragrances authentic?',
    a: 'Yes. YAM-N7 sources exclusively from verified suppliers. Every product in our catalog meets our Zero Compromise standard for authenticity and longevity.',
  },
  {
    q: 'How do I choose the right scent?',
    a: 'Start with a collection that matches your style — woody oud for evening, fresh citrus for daytime, or floral attars for special occasions. Our team is available via WhatsApp for personalised recommendations.',
  },
  {
    q: 'Do you offer gift packaging?',
    a: 'Many items include premium packaging. Explore our Gift Sets/Duo/Trio collection for ready-to-gift options with elegant presentation.',
  },
  {
    q: 'What is your delivery timeline?',
    a: 'Orders across Pakistan typically arrive within 3–7 business days depending on your city. Free shipping applies on orders above Rs. 5,000.',
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageHero
        label="The Collection"
        title="Shop Fragrances"
        subtitle="Over 1,400 curated perfumes, attars, and oud blends — each selected for authenticity, projection, and lasting impression."
        image="/banners/New-Banner.jpg"
        imageAlt="YAM-N7 fragrance collection"
      >
        <Link href="#products" className="luxury-btn-primary">
          Browse All Products
        </Link>
      </PageHero>

      <TrustStrip
        items={[
          { icon: Award, label: 'Years of Craft', value: '25+' },
          { icon: Layers, label: 'Fragrances', value: '1400+' },
          { icon: Truck, label: 'Delivery', value: 'Nationwide' },
          { icon: ShieldCheck, label: 'Authentic', value: '100%' },
        ]}
      />

      {/* Main product grid */}
      <div id="products">
        <ProductBrowser bucketKey={SHOP_BUCKET} />
      </div>

      <LuxuryCollectionsSection />

      {/* How to choose */}
      <SectionShell className="bg-surface-muted/30">
        <SectionHeader
          accent="Guide"
          title="How to Choose Your Signature Scent"
          subtitle="A simple framework used by our fragrance consultants."
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              icon: Search,
              title: 'Identify the Occasion',
              desc: 'Daytime calls for fresh, light compositions. Evenings suit deeper oud, amber, and musk profiles.',
            },
            {
              step: '02',
              icon: Heart,
              title: 'Know Your Notes',
              desc: 'Prefer florals, woods, or spices? Filter by collection — Elite, Premium, Zodiac, or Signature.',
            },
            {
              step: '03',
              icon: Gift,
              title: 'Try & Discover',
              desc: 'Start with smaller bottles or gift sets. Build your wardrobe of scents for every season.',
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
        title="Why Shop With Us"
        subtitle="Twenty-five years of fragrance expertise, delivered to your door."
        items={[
          {
            icon: ShieldCheck,
            title: 'Zero Compromise Quality',
            description: 'Every fragrance tested for longevity, projection, and authenticity before it reaches our shelves.',
          },
          {
            icon: Sparkles,
            title: 'Curated Collections',
            description: 'From rare oud to designer-inspired scents — organised into lines that make discovery effortless.',
          },
          {
            icon: Truck,
            title: 'Secure Delivery',
            description: 'Expertly packaged to preserve every note. Free shipping on orders over Rs. 5,000.',
          },
          {
            icon: Clock,
            title: 'Expert Support',
            description: 'Reach us via phone, email, or WhatsApp for personalised fragrance recommendations.',
          },
        ]}
        columns={4}
      />

      <PageFAQ accent="Shop FAQ" title="Shopping Questions" items={SHOP_FAQ} />

      <PageCTA
        title="Not Sure Where to Start?"
        subtitle="Speak with our fragrance team — we'll help you find a scent that matches your personality and occasion."
        primaryHref="/contact"
        primaryLabel="Get Expert Advice"
        secondaryHref="/about"
        secondaryLabel="Our Story"
      />

      <Newsletter />
      <Footer />
    </div>
  );
}
