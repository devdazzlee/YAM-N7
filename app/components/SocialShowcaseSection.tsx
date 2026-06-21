'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerChild, SectionShell } from './motion/reveal';

const POSTS = [
  { id: 1, label: 'Oud Collection', image: '/categories-images/Oud.png' },
  { id: 2, label: 'Attars', image: '/categories-images/Attars.png' },
  { id: 3, label: 'Gift Sets', image: '/categories-images/Gift Sets.png' },
  { id: 4, label: 'Elite Series', image: '/categories-images/Elite.png' },
  { id: 5, label: 'Premium', image: '/categories-images/Premium.png' },
  { id: 6, label: 'Signature Scents', image: '/categories-images/YAM N-7 Signature.jpg' },
];

export default function SocialShowcaseSection() {
  return (
    <SectionShell className="bg-background">
      <SectionHeader
        accent="@yamn7"
        title="Follow the Journey"
        subtitle="Behind every bottle — craftsmanship, culture, and the art of scent."
      />

      <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {POSTS.map((post) => (
          <StaggerChild key={post.id}>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              className="group relative aspect-square overflow-hidden block border border-border bg-surface-muted"
            >
              <img
                src={encodeURI(post.image)}
                alt={post.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/50 transition-colors duration-400 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] uppercase tracking-editorial text-foreground">{post.label}</p>
              </div>
            </motion.a>
          </StaggerChild>
        ))}
      </Stagger>

      <Reveal className="text-center mt-10 pt-2">
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="luxury-btn-outline inline-flex items-center gap-2 px-6 py-3"
        >
          <Instagram className="w-4 h-4" />
          Follow on Instagram
        </Link>
      </Reveal>
    </SectionShell>
  );
}
