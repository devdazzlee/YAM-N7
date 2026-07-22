'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductBrowser from '../components/ProductBrowser';
import PageHero from '../components/pages/PageHero';
import TrustStrip from '../components/pages/TrustStrip';
import FeatureShowcase from '../components/pages/FeatureShowcase';
import PageFAQ from '../components/pages/PageFAQ';
import PageCTA from '../components/pages/PageCTA';
import { SectionHeader, SectionShell, Reveal } from '../components/motion/reveal';
import {
  Award, Gem, ShieldCheck, Sparkles, User, Layers, Crown,
} from 'lucide-react';

const IDENTITY_FAQ = [
  {
    q: 'What makes The Identity Series unique?',
    a: 'Each fragrance in the Identity Series is crafted to express a distinct personality archetype. The collection draws on rare oud blends, saffron accords, and aged musks to create scents that become truly personal signatures.',
  },
  {
    q: 'Are these attars or alcohol-based perfumes?',
    a: 'The Identity Series includes both concentrated attar oils and EDP formulations. Product details specify the format so you can choose based on your preference and lifestyle.',
  },
  {
    q: 'How long do Identity Series fragrances last?',
    a: 'Longevity varies by formulation — our attar concentrates typically last 8–12 hours on skin. EDP variants project for 6–8 hours with a noticeable trail.',
  },
  {
    q: 'Can I layer scents from the Identity Series?',
    a: 'Absolutely. The collection is designed with complementary base notes so pairing an Identity attar with a lighter EDT creates a completely personal, layered signature.',
  },
];

export default function IdentitySeriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageHero
        label="The Identity Series"
        title="Find Your Signature"
        subtitle="A collection of rare, concentrated fragrances — each crafted to become an extension of your identity. Bold. Quiet. Unmistakable."
      >
        <Link href="#products" className="luxury-btn-primary">
          Explore the Collection
        </Link>
      </PageHero>

      <TrustStrip
        items={[
          { icon: Crown, label: 'Exclusive Blends', value: 'Rare' },
          { icon: Layers, label: 'Longevity', value: '8–12 hrs' },
          { icon: ShieldCheck, label: 'Authentic', value: '100%' },
          { icon: Award, label: 'Craft', value: '25+ Years' },
        ]}
      />

      {/* Product Grid */}
      <div id="products">
        <ProductBrowser bucketKey="identity-series" />
      </div>

      {/* Philosophy Section */}
      <SectionShell className="bg-surface-muted/30">
        <SectionHeader
          accent="Philosophy"
          title="Crafted for the Individual"
          subtitle="Each fragrance in the series is built around a core identity archetype — worn by those who know who they are."
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              icon: User,
              title: 'Personal Expression',
              desc: 'Scent is the most invisible yet most powerful extension of character. The Identity Series makes that expression intentional.',
            },
            {
              step: '02',
              icon: Gem,
              title: 'Rare Ingredients',
              desc: 'Aged Cambodian oud, Mysore sandalwood, Bulgarian rose — sourced responsibly from the world\'s finest origins.',
            },
            {
              step: '03',
              icon: Sparkles,
              title: 'Lasting Impression',
              desc: 'Concentrated formulations designed to evolve beautifully through the day, leaving a trail that is distinctly yours.',
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
        accent="The Series Promise"
        title="Why Choose Identity Series"
        subtitle="A collection unlike any other in our catalog — intentional, rare, and deeply personal."
        items={[
          {
            icon: Crown,
            title: 'Curated by Experts',
            description: 'Every blend approved by our master perfumers with 25+ years of attar craftsmanship experience.',
          },
          {
            icon: Gem,
            title: 'Rare Raw Materials',
            description: 'We source only the finest natural ingredients — oud, musk, saffron, and ambergris from verified origins.',
          },
          {
            icon: ShieldCheck,
            title: 'Zero Compromise',
            description: 'No fillers, no shortcuts. Concentrated oil formulations that deliver maximum projection and longevity.',
          },
          {
            icon: Sparkles,
            title: 'Unique to You',
            description: 'Scents that evolve with your body chemistry — no two wearers experience the same Identity fragrance alike.',
          },
        ]}
        columns={4}
      />

      <PageFAQ accent="Identity Series FAQ" title="Your Questions Answered" items={IDENTITY_FAQ} />

      <PageCTA
        title="Need Help Choosing?"
        subtitle="Our fragrance consultants are available to guide you to the Identity fragrance that matches your personality and lifestyle."
        primaryHref="/contact"
        primaryLabel="Speak to an Expert"
        secondaryHref="/shop"
        secondaryLabel="Browse All Fragrances"
      />
      <Footer />
    </div>
  );
}
