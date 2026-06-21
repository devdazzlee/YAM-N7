'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Gem, Award, Star } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerChild, SectionShell } from './motion/reveal';

const COLLECTIONS = [
  {
    icon: Crown,
    title: 'YAM N-7 Signature',
    description: 'Our house creations — bold, distinctive, unmistakably YAM-N7.',
    href: '/categories/yam-n7-signature',
    accent: 'from-primary/20 to-transparent',
  },
  {
    icon: Gem,
    title: 'Elite Collection',
    description: 'Rare oud blends and limited editions for the true connoisseur.',
    href: '/categories/elite',
    accent: 'from-champagne/15 to-transparent',
  },
  {
    icon: Award,
    title: 'Premium Series',
    description: 'Elevated everyday luxury with exceptional longevity and projection.',
    href: '/categories/premium',
    accent: 'from-primary-light/10 to-transparent',
  },
  {
    icon: Star,
    title: 'Zodiac Collection',
    description: 'Scents aligned with your sign — personal, mystical, unforgettable.',
    href: '/categories/zodiac',
    accent: 'from-primary/15 to-transparent',
  },
];

export default function LuxuryCollectionsSection() {
  return (
    <SectionShell className="bg-gradient-to-b from-background via-surface/50 to-background">
      <SectionHeader
        accent="Curated for You"
        title="Luxury Collections"
        subtitle="Explore our signature lines — each crafted with a distinct character and purpose."
      />

      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {COLLECTIONS.map((col) => {
          const Icon = col.icon;
          return (
            <StaggerChild key={col.title}>
              <Link href={col.href} className="block h-full group">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  className="luxury-card luxury-card-hover h-full p-6 sm:p-7 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${col.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="w-11 h-11 border border-primary/30 flex items-center justify-center mb-5 group-hover:border-primary/60 transition-colors">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl text-foreground mb-2 group-hover:text-primary-light transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-muted text-xs sm:text-sm leading-relaxed">
                      {col.description}
                    </p>
                    <p className="mt-5 text-[10px] uppercase tracking-luxury text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore →
                    </p>
                  </div>
                </motion.div>
              </Link>
            </StaggerChild>
          );
        })}
      </Stagger>

      <Reveal className="text-center mt-10">
        <Link href="/shop" className="text-sm text-primary hover:text-primary-light transition-colors tracking-editorial uppercase">
          View All Collections
        </Link>
      </Reveal>
    </SectionShell>
  );
}
