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
  BookOpen, Feather, Leaf, Gem, ShieldCheck, Layers, Sparkles, Heart,
} from 'lucide-react';

const JOURNAL_FAQ = [
  {
    q: 'What is the YAM-N7 Journal?',
    a: 'The Journal is our curated editorial space — a place to discover fragrances through the lens of culture, occasion, and personal story. Products featured here are chosen for their depth, character, and narrative.',
  },
  {
    q: 'Are Journal fragrances limited or always available?',
    a: 'Most Journal fragrances are part of our permanent catalog. Occasionally we feature limited seasonal editions — subscribe to our newsletter to be the first to know when they drop.',
  },
  {
    q: 'How do I find a scent that tells my story?',
    a: 'Start with the occasion or feeling you want to embody. Our fragrance consultants can help you match a Journal pick to a specific chapter of your life — reach out via WhatsApp or contact form.',
  },
  {
    q: 'Are there gift options for Journal fragrances?',
    a: 'Yes. Many Journal fragrances come in premium packaging suited for gifting. Explore our Gift Sets collection for ready-to-present options.',
  },
];

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageHero
        label="The Journal"
        title="Fragrance as Story"
        subtitle="An editorial lens on scent — exploring fragrances through culture, memory, and the art of personal expression. Discover what we are wearing, and why."
      >
        <Link href="#products" className="luxury-btn-primary">
          Explore the Journal
        </Link>
      </PageHero>

      <TrustStrip
        items={[
          { icon: BookOpen,   label: 'Editorial Picks',  value: 'Curated' },
          { icon: Feather,    label: 'Craftsmanship',    value: 'Artisanal' },
          { icon: Layers,     label: 'Stories',          value: 'Unfolding' },
          { icon: ShieldCheck,label: 'Authentic',        value: '100%' },
        ]}
      />

      {/* Product Grid */}
      <div id="products">
        <ProductBrowser bucketKey="journal" />
      </div>

      {/* About the Journal */}
      <SectionShell className="bg-surface-muted/30">
        <SectionHeader
          accent="Our Philosophy"
          title="Scent Tells a Story"
          subtitle="Every bottle holds a narrative. Here is how we think about fragrance at YAM-N7."
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              icon: Feather,
              title: 'Memory & Emotion',
              desc: 'The right scent can transport you instantly — to a place, a person, a moment. We select Journal fragrances for their emotional resonance as much as their quality.',
            },
            {
              step: '02',
              icon: Leaf,
              title: 'Origins & Craft',
              desc: 'We look beyond the bottle to the ingredients, the regions, and the artisans behind each blend. The journey from raw material to finished fragrance is the story we love to tell.',
            },
            {
              step: '03',
              icon: Heart,
              title: 'Personal Rituals',
              desc: 'Fragrance is deeply personal. The Journal celebrates the rituals of wearing scent — morning routines, evening preparations, special occasions, and quiet moments.',
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
        accent="Journal Standards"
        title="How We Choose Journal Picks"
        subtitle="Not every fragrance earns a Journal feature. Here is what we look for."
        items={[
          {
            icon: BookOpen,
            title: 'Editorial Depth',
            description: 'Journal fragrances have a story worth telling — an origin, an inspiration, or a mood that makes them more than just a scent.',
          },
          {
            icon: Gem,
            title: 'Rare or Distinctive',
            description: 'We favour blends that stand apart — unusual ingredient combinations, traditional formulations, or modern interpretations of classic accords.',
          },
          {
            icon: Sparkles,
            title: 'Seasonally Relevant',
            description: 'Journal picks are often matched to the current season, occasion calendar, or cultural moment — making them feel timely and considered.',
          },
          {
            icon: ShieldCheck,
            title: 'Uncompromised Quality',
            description: 'Every Journal fragrance meets the full YAM-N7 authenticity and longevity standard — editorial choice never sacrifices quality.',
          },
        ]}
        columns={4}
      />

      <PageFAQ accent="Journal FAQ" title="Your Questions" items={JOURNAL_FAQ} />

      <PageCTA
        title="Want a Personalised Recommendation?"
        subtitle="Our fragrance experts read your story and match you to a Journal fragrance that feels like it was made for you."
        primaryHref="/contact"
        primaryLabel="Tell Us Your Story"
        secondaryHref="/shop"
        secondaryLabel="Browse Full Shop"
      />
      <Footer />
    </div>
  );
}
