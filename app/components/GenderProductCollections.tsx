'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionHeader, Reveal, Stagger, StaggerChild, ease } from './motion/reveal';

interface CollectionCard {
  title: string;
  href: string;
  bottleImageUrl: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
}

const COLLECTIONS: CollectionCard[] = [
  {
    title: "Men's Collection",
    href: '/categories/men-s-fragrances',
    bottleImageUrl: '/categories-images/Men.png',
    gradientFrom: '#0A0A0A',
    gradientTo: '#16161A',
    accentColor: 'rgba(200, 164, 107, 0.4)',
  },
  {
    title: "Women's Collection",
    href: '/categories/women',
    bottleImageUrl: '/categories-images/Women.png',
    gradientFrom: '#0A0A0A',
    gradientTo: '#1C1518',
    accentColor: 'rgba(216, 196, 160, 0.4)',
  },
  {
    title: 'Unisex Collection',
    href: '/shop',
    bottleImageUrl: '/categories-images/Premium.png',
    gradientFrom: '#0A0A0A',
    gradientTo: '#1A1713',
    accentColor: 'rgba(200, 164, 107, 0.4)',
  },
  {
    title: 'Attars',
    href: '/categories/attars',
    bottleImageUrl: '/categories-images/Attars.png',
    gradientFrom: '#0A0A0A',
    gradientTo: '#121815',
    accentColor: 'rgba(216, 196, 160, 0.4)',
  },
  {
    title: 'Oud Collection',
    href: '/categories/oud',
    bottleImageUrl: '/categories-images/Oud.png',
    gradientFrom: '#0A0A0A',
    gradientTo: '#1E1611',
    accentColor: 'rgba(200, 164, 107, 0.5)',
  },
  {
    title: 'Limited Editions',
    href: '/search?q=Elite',
    bottleImageUrl: '/categories-images/Elite.png',
    gradientFrom: '#0A0A0A',
    gradientTo: '#17131D',
    accentColor: 'rgba(200, 164, 107, 0.5)',
  },
];

export default function GenderProductCollections() {
  return (
    <section className="luxury-section bg-[#0A0A0A] border-b border-border/20 py-24 relative overflow-hidden">
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="luxury-container relative z-10">
        <SectionHeader
          accent="Signature Series"
          title="Shop by Collection"
          subtitle="Refined gender narratives and exceptional product extractions, designed for the modern connoisseur."
          light
        />

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-12 md:mt-16">
          {COLLECTIONS.map((card) => (
            <StaggerChild key={card.title} className="h-full">
              <Link href={card.href} className="block h-full group">
                <div className="relative h-[400px] w-full flex flex-col justify-end p-8 overflow-hidden rounded-md border border-border/30 bg-[#0E0E0E] transition-all duration-500">
                  
                  {/* Background Zooming Layer */}
                  <motion.div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, ${card.gradientFrom}, ${card.gradientTo})`,
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: ease }}
                  >
                    {/* Dark luxury card overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
                    
                    {/* Soft gradient light ray behind the bottle */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 transition-all duration-500 group-hover:opacity-45"
                      style={{ backgroundColor: card.accentColor }}
                    />
                  </motion.div>

                  {/* Centered Floating Bottle Image with Hover Glow */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center p-12">
                    <motion.div
                      className="relative w-full h-full max-w-[200px] max-h-[200px] flex items-center justify-center"
                      whileHover={{ y: -10, scale: 1.08 }}
                      transition={{ duration: 0.4, ease: ease }}
                    >
                      <img
                        src={card.bottleImageUrl}
                        alt={card.title}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(200,164,107,0.7)]"
                        style={{
                          filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))',
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Gold Border Outline on Hover */}
                  <div className="absolute inset-0 z-20 border border-transparent group-hover:border-[#C8A46B]/80 rounded-md transition-all duration-500 pointer-events-none" />

                  {/* Title and Action */}
                  <div className="relative z-30 flex flex-col items-center text-center mt-auto w-full">
                    {/* Collection Title */}
                    <h3 className="font-display text-xl sm:text-2xl text-white mb-2 tracking-wide group-hover:text-[#C8A46B] transition-colors duration-300">
                      {card.title}
                    </h3>
                    
                    {/* Minimalist Explore Tag */}
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors duration-300">
                      Explore Collection →
                    </span>
                  </div>

                </div>
              </Link>
            </StaggerChild>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
