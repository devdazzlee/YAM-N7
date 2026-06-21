'use client';

import { LucideIcon } from 'lucide-react';
import { Stagger, StaggerChild } from '../motion/reveal';

interface TrustItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface TrustStripProps {
  items: TrustItem[];
}

export default function TrustStrip({ items }: TrustStripProps) {
  return (
    <section className="py-6 sm:py-8 bg-surface-muted/60 border-y border-border">
      <div className="luxury-container">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerChild key={item.label}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-border bg-surface flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-heading text-lg text-foreground leading-none">{item.value}</p>
                    <p className="text-[10px] uppercase tracking-luxury text-muted-subtle mt-1">{item.label}</p>
                  </div>
                </div>
              </StaggerChild>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
