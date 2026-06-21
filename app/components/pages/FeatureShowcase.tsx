'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { SectionHeader, Stagger, StaggerChild, SectionShell } from '../motion/reveal';

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureShowcaseProps {
  accent?: string;
  title: string;
  subtitle?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export default function FeatureShowcase({
  accent,
  title,
  subtitle,
  items,
  columns = 3,
}: FeatureShowcaseProps) {
  const colClass =
    columns === 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : columns === 2
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <SectionShell>
      <SectionHeader accent={accent} title={title} subtitle={subtitle} />
      <Stagger className={`grid gap-5 md:gap-6 ${colClass}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <StaggerChild key={item.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="luxury-card luxury-card-hover p-6 sm:p-7 h-full"
              >
                <div className="w-11 h-11 border border-primary/25 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl text-foreground mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            </StaggerChild>
          );
        })}
      </Stagger>
    </SectionShell>
  );
}
