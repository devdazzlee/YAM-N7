'use client';

import { motion } from 'framer-motion';
import {
  FlaskConical,
  Clock,
  Package,
  Truck,
  Users,
} from 'lucide-react';
import { ease } from './motion/reveal';

/* ─── Feature data ────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: FlaskConical,
    title: 'Authentic Ingredients',
    description: 'Crafted using premium fragrance oils.',
  },
  {
    icon: Clock,
    title: 'Long Lasting Performance',
    description: 'Designed to stay with you throughout the day.',
  },
  {
    icon: Package,
    title: 'Luxury Packaging',
    description: 'Every detail designed to impress.',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'Reliable shipping across Pakistan and internationally.',
  },
  {
    icon: Users,
    title: 'Inclusive Fragrance House',
    description: 'Created for every identity and every expression.',
  },
] as const;

/* ─── Section component ───────────────────────────────────────────────── */
export default function WhyChooseYAMSection() {
  return (
    <section className="relative bg-[#0A0A0A] border-t border-border/20 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(200,164,107,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="luxury-container relative z-10 py-20 sm:py-24">

        {/* ── Heading ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14 sm:mb-16"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.45em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.28em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="luxury-label mb-3"
          >
            Our Promise
          </motion.p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground uppercase tracking-wide font-normal leading-tight">
            Why Choose YAM&#8209;N7
          </h2>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="mt-6 mx-auto h-px w-24 origin-center"
            style={{ background: 'linear-gradient(to right, transparent, #C8A46B, transparent)' }}
          />
        </motion.div>

        {/* ── Feature row ─────────────────────────────────────────────── */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const isLast = index === FEATURES.length - 1;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease }}
                className={`
                  group relative flex flex-col items-center text-center px-6 py-10
                  ${!isLast ? 'lg:border-r border-border/20' : ''}
                  border-b lg:border-b-0 border-border/15
                  hover:bg-white/[0.015] transition-colors duration-400
                `}
              >
                {/* Subtle hover gold top line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#C8A46B] group-hover:w-full transition-all duration-500 ease-out" />

                {/* Gold icon */}
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="mb-5 flex items-center justify-center w-12 h-12 border border-[#C8A46B]/25 group-hover:border-[#C8A46B]/60 transition-colors duration-400"
                  style={{ background: 'rgba(200,164,107,0.06)' }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: '#C8A46B' }}
                    strokeWidth={1.5}
                  />
                </motion.div>

                {/* Title */}
                <h3 className="font-heading text-base sm:text-lg text-foreground font-normal mb-2 leading-snug group-hover:text-[#C8A46B] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed max-w-[180px]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
