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
    <section className="luxury-section bg-background">
      <div className="luxury-container">
        <SectionHeader
          accent="The Heritage Choice"
          title="Why Choose YAM-N7?"
        />
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerChild key={feature.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  className="luxury-card luxury-card-hover p-5 sm:p-6 text-center h-full"
                >
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2 font-normal">{feature.title}</h3>
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
