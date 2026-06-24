'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionHeader, Reveal, Stagger, StaggerChild, ease } from './motion/reveal';

interface IdentityCard {
  title: string;
  slug: string;
  description: string;
  notes: string[];
  imageUrl: string;
  accent: string;
}

const IDENTITY_CARDS: IdentityCard[] = [
  {
    title: 'The Visionary',
    slug: 'the-visionary',
    description: 'For the forward-thinking and pioneer. A profound, complex statement that shapes the future.',
    notes: ['Royal Oud', 'Smoked Cedar', 'Saffron'],
    imageUrl: '/categories-images/Oud.png',
    accent: 'Intellectual & Deep',
  },
  {
    title: 'The Bold',
    slug: 'the-bold',
    description: 'For the daring and fearless. A powerful, striking trail that demands recognition.',
    notes: ['Black Oud', 'Rich Leather', 'Dark Spices'],
    imageUrl: "/categories-images/Men's Fragrances.png",
    accent: 'Striking & Intense',
  },
  {
    title: 'The Elegant',
    slug: 'the-elegant',
    description: 'For the refined and graceful. Classic sophistication, quiet confidence, and pure poise.',
    notes: ['Jasmine Attar', 'Damask Rose', 'White Musk'],
    imageUrl: '/categories-images/Premium.png',
    accent: 'Graceful & Timeless',
  },
  {
    title: 'The Magnetic',
    slug: 'the-magnetic',
    description: 'For the captivating and alluring. A hypnotic, warm presence that pulls others closer.',
    notes: ['Midnight Musk', 'Warm Amber', 'Madagascar Vanilla'],
    imageUrl: '/categories-images/Elite.png',
    accent: 'Alluring & Warm',
  },
  {
    title: 'The Untamed',
    slug: 'the-untamed',
    description: 'For the wild, raw, and expressive. An escaping energy of woody, untamed freedom.',
    notes: ['Rich Patchouli', 'Vetiver', 'Incense Smoke'],
    imageUrl: '/categories-images/YAM N-7 Signature.jpg',
    accent: 'Wild & Expressive',
  },
  {
    title: 'The Infinite',
    slug: 'the-infinite',
    description: 'For the limitless and eternal. Celestial airiness and clean freshness beyond time.',
    notes: ['Sea Salt', 'Bergamot', 'White Tea'],
    imageUrl: '/categories-images/Zodiac.png',
    accent: 'Limitless & Airy',
  },
];

export default function IdentitySection() {
  return (
    <section className="luxury-section bg-[#0A0A0A] border-b border-border/20 py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,164,107,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="luxury-container relative z-10">
        <SectionHeader
          accent="The Identity Series"
          title="Discover Your Identity"
          subtitle="We reject traditional gender categories. Discover fragrances curated to match your core persona, character, and presence."
          light
        />

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-12 md:mt-16">
          {IDENTITY_CARDS.map((card) => (
            <StaggerChild key={card.title} className="h-full">
              <Link href={`/search?q=${encodeURIComponent(card.title)}`} className="block h-full group">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35, ease: ease }}
                  className="relative h-[480px] w-full flex flex-col justify-end p-8 overflow-hidden rounded-md border border-border/30 bg-[#0E0E0E] transition-all duration-500 hover:border-[#C8A46B]"
                >
                  {/* Background Image Container */}
                  <div className="absolute inset-0 z-0">
                    <motion.div
                      style={{ backgroundImage: `url("${encodeURI(card.imageUrl)}")` }}
                      className="h-full w-full bg-cover bg-center bg-no-repeat"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: ease }}
                    />
                    {/* Premium Dark Gradients Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30 opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
                  </div>

                  {/* Gold Top Border on Hover (Accent Border) */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C8A46B] to-transparent scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

                  {/* Content Container */}
                  <div className="relative z-10 flex flex-col h-full justify-end">
                    {/* Accent Persona Attribute */}
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A46B] font-semibold mb-2 block">
                      {card.accent}
                    </span>

                    {/* Title */}
                    <h3 className="font-display text-2xl text-white mb-3 tracking-wide group-hover:text-[#C8A46B] transition-colors duration-300">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 font-heading text-sm leading-relaxed mb-5 font-normal">
                      {card.description}
                    </p>

                    {/* Notes Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {card.notes.map((note) => (
                        <span
                          key={note}
                          className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-sm font-sans tracking-wider uppercase font-medium"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* CTA link indicator */}
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white group-hover:text-[#C8A46B] transition-colors duration-300">
                      <span>Explore Aura</span>
                      <motion.svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ display: 'inline-block' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerChild>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
