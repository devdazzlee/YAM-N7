'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionShell } from '../motion/reveal';

interface PageCTAProps {
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function PageCTA({
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PageCTAProps) {
  return (
    <SectionShell tone="primary" className="!py-16 sm:!py-20">
      <Reveal className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-light mb-4 text-primary-foreground">{title}</h2>
        <p className="text-primary-foreground/90 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-surface text-foreground font-semibold text-sm hover:bg-cream transition-colors group shadow-sm"
          >
            {primaryLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary-foreground/40 text-primary-foreground font-medium text-sm hover:bg-primary-foreground/15 transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </Reveal>
    </SectionShell>
  );
}
