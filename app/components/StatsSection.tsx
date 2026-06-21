'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, ShoppingBag } from 'lucide-react';
import { useProductMetaStore } from '../../lib/store/productMetaStore';
import { Stagger, StaggerChild } from './motion/reveal';

export default function StatsSection() {
  const [productCount, setProductCount] = useState<string>('1400+');
  const { getProductCount } = useProductMetaStore();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getProductCount();
        setProductCount(count > 0 ? `${count}+` : '1400+');
      } catch {
        // keep default
      }
    };
    fetchCount();
  }, [getProductCount]);

  const stats = [
    { icon: Users, number: '10K+', label: 'Happy Clients' },
    { icon: Award, number: '25+', label: 'Years of Craft' },
    { icon: ShoppingBag, number: productCount, label: 'Fragrances' },
    { icon: TrendingUp, number: '98%', label: 'Satisfaction' },
  ];

  return (
    <section className="relative py-8 sm:py-10 border-y border-border/40 bg-surface/50">
      <div className="luxury-container">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerChild key={stat.label}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="text-center group"
                >
                  <Icon className="w-4 h-4 text-primary/60 mx-auto mb-2 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                  <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground font-light">
                    {stat.number}
                  </p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-luxury text-muted-subtle mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              </StaggerChild>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
