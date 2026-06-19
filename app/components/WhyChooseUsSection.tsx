'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Landmark, PackageCheck } from 'lucide-react';
import { useProductMetaStore } from '../../lib/store/productMetaStore';
import { SectionHeader, Stagger, StaggerChild } from './motion/reveal';

export default function WhyChooseUsSection() {
  const [productCount, setProductCount] = useState<string>('1400+');
  const { getProductCount } = useProductMetaStore();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getProductCount();
        if (count > 0) setProductCount(`${count}+`);
      } catch {
        // keep default
      }
    };
    fetchCount();
  }, [getProductCount]);

  const features = [
    { icon: Layers, title: 'Unmatched Variety', description: `Explore a curated collection of ${productCount} premium perfumes, attars, oud, and luxury body mists.` },
    { icon: ShieldCheck, title: 'Lasting Quality', description: 'We uphold a "Zero Compromise" policy on fragrance quality. Every scent is tested for longevity, depth, and authenticity.' },
    { icon: Landmark, title: 'Heritage of Elegance', description: 'Proudly crafting memorable fragrances for 25+ years with the same commitment to excellence we started with.' },
    { icon: PackageCheck, title: 'Delivered with Care', description: 'Expertly packaged to preserve every note, delivered straight from our perfume store to your doorstep across Pakistan.' },
  ];

  return (
    <section className="py-10 sm:py-12 md:py-14 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Why Choose YAM-N7?"
          accent="The Heritage Choice"
        />
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerChild key={feature.title}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="bg-gradient-to-br from-surface-muted/50 to-background p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 text-center border border-transparent hover:border-primary/15 h-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-surface-elevated)))' }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  </motion.div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5">{feature.title}</h3>
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              </StaggerChild>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
