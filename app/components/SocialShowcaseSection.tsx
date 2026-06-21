'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerChild, SectionShell } from './motion/reveal';

const POSTS = [
  { id: 1, label: 'Oud Collection', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80' },
  { id: 2, label: 'Rose Attar', image: 'https://images.unsplash.com/photo-1595425970375-c98d843f8a0e?w=600&q=80' },
  { id: 3, label: 'Gift Sets', image: 'https://images.unsplash.com/photo-1615634260167-c8ced89d8f66?w=600&q=80' },
  { id: 4, label: 'Elite Series', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80' },
  { id: 5, label: 'New Arrivals', image: 'https://images.unsplash.com/photo-1587017539504-3ccfaa1c1b4f?w=600&q=80' },
  { id: 6, label: 'Signature Scents', image: 'https://images.unsplash.com/photo-1523293182086-7651a89965937?w=600&q=80' },
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
              className="group relative aspect-square overflow-hidden block"
            >
              <img
                src={post.image}
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

      <Reveal className="text-center mt-10">
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="luxury-btn-outline inline-flex"
        >
          <Instagram className="w-4 h-4" />
          Follow on Instagram
        </Link>
      </Reveal>
    </SectionShell>
  );
}
