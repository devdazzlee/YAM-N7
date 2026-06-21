'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flower2, Leaf, Droplets, Wind, Shield, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { Reveal, SectionHeader, SectionShell, Stagger, StaggerChild } from '../motion/reveal';

const NOTES = [
  { icon: Flower2, layer: 'Top Notes', desc: 'First impression — citrus, spice, or floral opening.' },
  { icon: Leaf, layer: 'Heart Notes', desc: 'The character — oud, rose, amber, or jasmine core.' },
  { icon: Droplets, layer: 'Base Notes', desc: 'The lasting trail — musk, sandalwood, vanilla.' },
];

interface ProductPageExtrasProps {
  productName: string;
  categoryName?: string;
}

export default function ProductPageExtras({ productName, categoryName }: ProductPageExtrasProps) {
  return (
    <>
      {/* Fragrance pyramid */}
      <SectionShell className="bg-surface-muted/30">
        <SectionHeader
          accent="The Composition"
          title="Fragrance Profile"
          subtitle={`Understanding the layers of ${productName}${categoryName ? ` — from our ${categoryName} collection` : ''}.`}
        />
        <Stagger className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {NOTES.map((note) => {
            const Icon = note.icon;
            return (
              <StaggerChild key={note.layer}>
                <motion.div whileHover={{ y: -3 }} className="luxury-card p-6 text-center h-full">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="font-heading text-xl text-foreground mb-2">{note.layer}</h3>
                  <p className="text-muted text-sm leading-relaxed">{note.desc}</p>
                </motion.div>
              </StaggerChild>
            );
          })}
        </Stagger>
      </SectionShell>

      {/* Care & application */}
      <SectionShell>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal variant="slideLeft">
            <p className="luxury-label mb-3">Care Guide</p>
            <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-4 font-light">
              How to Wear Your Scent
            </h2>
            <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed">
              <p>
                Apply to pulse points — wrists, neck, and behind the ears — where body heat
                activates the fragrance throughout the day.
              </p>
              <p>
                For attars and oils, a small dab is sufficient. Layer lightly rather than
                over-applying for a refined, lasting impression.
              </p>
              <p>
                Store bottles away from direct sunlight and heat to preserve the integrity
                of every note.
              </p>
            </div>
          </Reveal>
          <Reveal variant="slideRight" delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Wind, title: 'Pulse Points', desc: 'Wrists, neck, chest' },
                { icon: Sparkles, title: 'Less is More', desc: '2–3 sprays max' },
                { icon: Shield, title: 'Store Cool', desc: 'Away from sunlight' },
                { icon: Droplets, title: 'Layer Smart', desc: 'Match your mood' },
              ].map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.title} className="luxury-card p-5">
                    <Icon className="w-5 h-5 text-primary mb-3" strokeWidth={1.5} />
                    <p className="font-heading text-lg text-foreground">{tip.title}</p>
                    <p className="text-muted text-xs mt-1">{tip.desc}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* Purchase confidence */}
      <section className="py-12 sm:py-16 bg-surface border-y border-border">
        <div className="luxury-container">
          <Stagger className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Authentic Guarantee', desc: 'Every bottle verified for genuineness.' },
              { icon: Truck, title: 'Nationwide Delivery', desc: 'Secure packaging, tracked shipping.' },
              { icon: RotateCcw, title: 'Easy Returns', desc: 'Hassle-free policy on eligible items.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <StaggerChild key={item.title}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-border bg-background flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-heading text-lg text-foreground">{item.title}</p>
                      <p className="text-muted text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                </StaggerChild>
              );
            })}
          </Stagger>
          <Reveal className="text-center mt-8">
            <Link href="/shipping-returns" className="text-sm text-primary hover:underline tracking-editorial uppercase">
              Read shipping & returns policy →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
