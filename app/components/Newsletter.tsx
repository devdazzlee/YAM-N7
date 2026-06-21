'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { Reveal, SectionShell } from './motion/reveal';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <SectionShell className="!py-16 sm:!py-20 bg-surface-muted relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface to-surface-muted" />

      <div className="relative max-w-3xl mx-auto text-center">
        <Reveal>
          <motion.div
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex mb-5"
          >
            <Sparkles className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </motion.div>

          <p className="luxury-label mb-3">Exclusive Access</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-4">
            Join the YAM-N7 Circle
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Be first to discover new launches, limited editions, and members-only offers
            from our fragrance house.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="luxury-glass inline-block px-8 py-5"
            >
              <p className="font-heading text-xl text-primary-light">Welcome to the circle.</p>
              <p className="text-muted text-sm mt-1">We&apos;ll be in touch with something exquisite.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-subtle" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-card/80 border border-border/60 text-foreground placeholder:text-muted-subtle text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
              <button type="submit" className="luxury-btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}

          <p className="text-muted-subtle text-[10px] uppercase tracking-luxury mt-6">
            No spam · Unsubscribe anytime
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
