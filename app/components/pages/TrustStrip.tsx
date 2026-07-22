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
    <section className="border-y border-foreground/10 bg-surface">
      <div className="luxury-container py-8 sm:py-10">
        <Stagger className="grid grid-cols-2 md:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isOdd = index % 2 === 1;
            const isBottomRow = index >= 2;

            return (
              <StaggerChild key={item.label}>
                <div
                  className={[
                    'flex flex-col items-center text-center gap-3 px-4 py-5 md:py-2',
                    isOdd ? 'border-l border-foreground/10' : '',
                    isBottomRow ? 'border-t border-foreground/10 md:border-t-0' : '',
                    index > 0 ? 'md:border-l md:border-foreground/10' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-heading text-xl sm:text-2xl text-foreground leading-none tracking-wide">
                      {item.value}
                    </p>
                    <p className="mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted">
                      {item.label}
                    </p>
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
