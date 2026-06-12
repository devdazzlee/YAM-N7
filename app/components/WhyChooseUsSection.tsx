'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Landmark, PackageCheck } from 'lucide-react';
import { useProductMetaStore } from '../../lib/store/productMetaStore';

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
    <section className="py-10 sm:py-12 md:py-14 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
            Why Choose YAM-N7?
          </h2>
          <p className="text-[#8E6D31] text-sm sm:text-base font-semibold max-w-2xl mx-auto">
            The &ldquo;Heritage&rdquo; Choice
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-[#FBF6EC]/50 to-white p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #C5A059, #1A1A1A)' }}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A] mb-1.5">{feature.title}</h3>
                <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
