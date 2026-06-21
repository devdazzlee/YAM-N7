'use client';

import { motion } from 'framer-motion';
import { Flower2, Leaf, Droplets, Flame } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerChild, SectionShell } from './motion/reveal';

const NOTES = [
  {
    icon: Flower2,
    layer: 'Top Notes',
    examples: 'Bergamot · Rose · Saffron · Citrus',
    description: 'The first impression — bright, inviting, and instantly captivating.',
  },
  {
    icon: Leaf,
    layer: 'Heart Notes',
    examples: 'Jasmine · Oud · Amber · Iris',
    description: 'The soul of the fragrance — where character and depth emerge.',
  },
  {
    icon: Droplets,
    layer: 'Base Notes',
    examples: 'Musk · Sandalwood · Vanilla · Patchouli',
    description: 'The lasting memory — warm, rich, and unforgettable on skin.',
  },
  {
    icon: Flame,
    layer: 'Oud & Attars',
    examples: 'Dehn Al Oud · Rose Attar · Musk Attar',
    description: 'Traditional concentrated oils — pure, potent, and deeply personal.',
  },
];

export default function FragranceNotesSection() {
  return (
    <SectionShell dark className="bg-surface-muted relative overflow-hidden">

      <SectionHeader
        light
        accent="The Composition"
        title="Understanding Fragrance Notes"
        subtitle="Every great perfume unfolds in layers — a journey from first spray to final whisper."
      />

      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {NOTES.map((note, i) => {
          const Icon = note.icon;
          return (
            <StaggerChild key={note.layer}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative p-6 sm:p-7 border border-border/50 bg-card/40 backdrop-blur-sm h-full group hover:border-primary/30 transition-colors duration-500"
              >
                <span className="absolute top-4 right-4 font-heading text-4xl text-primary/10 group-hover:text-primary/20 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="font-heading text-xl text-foreground mb-1">{note.layer}</h3>
                <p className="text-[11px] uppercase tracking-editorial text-primary/80 mb-3">
                  {note.examples}
                </p>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">{note.description}</p>
              </motion.div>
            </StaggerChild>
          );
        })}
      </Stagger>

      <Reveal className="mt-12 sm:mt-16 text-center max-w-2xl mx-auto" delay={0.15}>
        <p className="font-heading text-lg sm:text-xl text-foreground/90 italic leading-relaxed">
          &ldquo;Fragrance is the most intense form of memory.&rdquo;
        </p>
        <p className="text-muted-subtle text-xs uppercase tracking-luxury mt-3">— YAM-N7 Philosophy</p>
      </Reveal>
    </SectionShell>
  );
}
