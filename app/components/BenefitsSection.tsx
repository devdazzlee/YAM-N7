'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Sparkles, HeartHandshake } from 'lucide-react';
import { SectionHeader, Reveal } from './motion/reveal';

const benefits = [
  { icon: ShieldCheck, title: 'Authentic Fragrances', description: 'Every perfume is carefully sourced and verified for quality, longevity, and authenticity.' },
  { icon: Truck, title: 'Nationwide Delivery', description: 'Enjoy complimentary shipping on all orders over Rs. 5,000 across Pakistan.' },
  { icon: Sparkles, title: 'Exclusive Collections', description: 'Join the YAM-N7 community for seasonal launches, limited editions, and member-only offers.' },
  { icon: HeartHandshake, title: 'Expert Guidance', description: 'Our fragrance specialists are here to help you find the perfect scent for every occasion.' },
];

export default function BenefitsSection() {
  return (
    <section className="py-10 sm:py-12 md:py-14 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="The YAM-N7 Standard"
          subtitle="Experience 25 years of fragrance excellence with our curated luxury scents and dedicated customer care."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const fromLeft = index % 2 === 0;
            return (
              <Reveal
                key={benefit.title}
                variant={fromLeft ? 'slideLeft' : 'slideRight'}
                delay={index * 0.08}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="bg-gradient-to-br from-surface/40 to-card p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 text-center border border-transparent hover:border-primary/15 h-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-surface-elevated)))' }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  </motion.div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5">{benefit.title}</h3>
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
