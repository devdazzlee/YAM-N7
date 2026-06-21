'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeader, SectionShell, Reveal } from '../motion/reveal';

interface FAQItem {
  q: string;
  a: string;
}

interface PageFAQProps {
  accent?: string;
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

export default function PageFAQ({
  accent = 'Questions',
  title = 'Frequently Asked',
  subtitle = 'Everything you need to know before you shop.',
  items,
}: PageFAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionShell className="bg-surface-muted/40">
      <SectionHeader accent={accent} title={title} subtitle={subtitle} />

      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 0.05}>
              <div className="luxury-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-surface-muted/30 transition-colors"
                >
                  <span className="font-heading text-lg text-foreground pr-4">{item.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-muted text-sm sm:text-base leading-relaxed border-t border-border/60 pt-4">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
