'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Gem, HeartHandshake } from 'lucide-react';
import { SectionHeader, Reveal } from './motion/reveal';

const benefits = [
  { icon: ShieldCheck, title: 'Authentic Fragrances', description: 'Every perfume is carefully sourced and verified for quality, longevity, and authenticity.' },
  { icon: Truck, title: 'Nationwide Delivery', description: 'Enjoy complimentary shipping on all orders over Rs. 5,000 across Pakistan.' },
  { icon: Gem, title: 'Exclusive Collections', description: 'Join the YAM-N7 community for seasonal launches, limited editions, and member-only offers.' },
  { icon: HeartHandshake, title: 'Expert Guidance', description: 'Our fragrance specialists are here to help you find the perfect scent for every occasion.' },
];

export default function BenefitsSection() {
  return (
    <section className="luxury-section bg-gradient-to-b from-background to-surface/30">
      <div className="luxury-container">
        <SectionHeader
          accent="Our Promise"
          title="The YAM-N7 Standard"
          subtitle="Experience twenty-five years of fragrance excellence with curated luxury scents and dedicated customer care."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                  whileHover={{ y: -6 }}
                  className="luxury-card luxury-card-hover p-5 sm:p-6 text-center h-full"
                >
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2 font-normal">{benefit.title}</h3>
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
