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
  Flame, TrendingUp, Zap, Star, ShieldCheck, Layers, Clock, Sparkles,
} from 'lucide-react';

const WHATS_HOT_FAQ = [
  {
    q: 'How is "What\'s Hot" different from Best Sellers?',
    a: 'Best Sellers reflect cumulative long-term demand. What\'s Hot captures what is trending right now — recent launches, seasonal picks, and community buzz that is gaining rapid momentum this week.',
  },
  {
    q: 'How often is this section updated?',
    a: 'What\'s Hot is refreshed regularly based on real-time order trends, social media buzz, and customer interest signals. Come back often — the list changes quickly.',
  },
  {
    q: 'Can I trust the quality of trending products?',
    a: 'Every product on YAM-N7 undergoes the same authenticity verification regardless of its popularity level. Trending simply means more people are discovering it — not that quality standards are different.',
  },
  {
    q: 'Are limited edition releases featured here?',
    a: 'Yes. Limited runs and new arrivals that generate immediate excitement are featured in What\'s Hot first. Subscribe to our newsletter to be notified before stock runs out.',
  },
];

export default function WhatsHotPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageHero
        label="What's Hot"
        title="Trending Right Now"
        subtitle="The fragrances the community is talking about — new releases, viral picks, and rising stars gaining momentum across Pakistan this season."
      >
        <Link href="#products" className="luxury-btn-primary">
          See What's Trending
        </Link>
      </PageHero>

      <TrustStrip
        items={[
          { icon: Flame,      label: 'Trending Now',   value: 'Live' },
          { icon: TrendingUp, label: 'Rising Fast',    value: 'Weekly' },
          { icon: Layers,     label: 'Fragrances',     value: '1400+' },
          { icon: ShieldCheck,label: 'Authentic',      value: '100%' },
        ]}
      />

      {/* Product Grid */}
      <div id="products">
        <ProductBrowser bucketKey="whats-hot" />
      </div>

      {/* What Makes It Hot */}
      <SectionShell className="bg-surface-muted/30">
        <SectionHeader
          accent="Trending Signals"
          title="What Makes It Hot?"
          subtitle="We track real momentum — not paid promotions. Here's what drives a fragrance into our trending section."
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              icon: TrendingUp,
              title: 'Order Velocity',
              desc: 'Products seeing a sharp spike in orders over the past 7 days automatically surface here — real demand, not editorial picks.',
            },
            {
              step: '02',
              icon: Sparkles,
              title: 'New Arrivals',
              desc: 'Freshly stocked fragrances that generate immediate excitement from the YAM-N7 community within their first weeks.',
            },
            {
              step: '03',
              icon: Zap,
              title: 'Social Buzz',
              desc: 'Scents trending on Instagram, TikTok, and WhatsApp communities get elevated — because real enthusiasm counts.',
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
        accent="Stay Ahead"
        title="Never Miss a Trend"
        subtitle="The fragrance world moves fast — here is how to stay ahead of it with YAM-N7."
        items={[
          {
            icon: Flame,
            title: 'Real-Time Trends',
            description: 'What\'s Hot is driven by live order data — you see exactly what the community is buying right now.',
          },
          {
            icon: Clock,
            title: 'Updated Regularly',
            description: 'The list refreshes frequently so every visit gives you a fresh perspective on what\'s gaining momentum.',
          },
          {
            icon: Star,
            title: 'Community Driven',
            description: 'Real customers, real enthusiasm. Trends here are organic — not influenced by advertising or paid placements.',
          },
          {
            icon: ShieldCheck,
            title: 'Always Authentic',
            description: 'Trending status never compromises our quality bar. Every hot product still meets the full YAM-N7 authenticity standard.',
          },
        ]}
        columns={4}
      />

      <PageFAQ accent="What's Hot FAQ" title="Trending Questions" items={WHATS_HOT_FAQ} />

      <PageCTA
        title="Want to Know What's Next?"
        subtitle="Subscribe to our newsletter for early access to new arrivals and trending drops before they sell out."
        primaryHref="/newsletter-signup"
        primaryLabel="Get Early Access"
        secondaryHref="/shop"
        secondaryLabel="Browse Full Shop"
      />
      <Footer />
    </div>
  );
}
