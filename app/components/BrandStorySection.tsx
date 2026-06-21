'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionHeader, SectionShell } from './motion/reveal';

export default function BrandStorySection() {
  return (
    <SectionShell className="bg-surface relative">

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal variant="slideLeft">
          <div className="relative">
            <div className="absolute -inset-4 border border-primary/15 hidden sm:block" />
            <div className="relative overflow-hidden shadow-luxury bg-surface-muted">
              <img
                src="/banners/New-Banner.jpg"
                alt="YAM-N7 brand heritage"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </Reveal>

        <Reveal variant="slideRight" delay={0.1}>
          <SectionHeader
            align="left"
            accent="Our Heritage"
            title="Twenty-Five Years of Fragrance Excellence"
            subtitle="What began as a passion for authentic attars in Karachi has evolved into one of Pakistan's most trusted luxury perfume destinations."
            className="mb-8 !text-left"
          />

          <div className="space-y-5 text-muted text-sm sm:text-base leading-relaxed mb-8">
            <p>
              At YAM-N7, every bottle tells a story — of rare ingredients sourced from the
              finest suppliers, of masterful blending, and of a relentless commitment to
              authenticity we call our Zero Compromise standard.
            </p>
            <p>
              From traditional attars cherished for generations to contemporary designer-inspired
              fragrances, our collection spans over 1,400 scents — each selected for longevity,
              depth, and the power to leave a lasting impression.
            </p>
          </div>

          <Link href="/about" className="luxury-btn-primary group inline-flex">
            Discover Our Story
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </SectionShell>
  );
}
