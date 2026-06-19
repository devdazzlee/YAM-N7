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
    { icon: Users, number: '10K+', label: 'Happy Customers', iconClass: 'bg-primary' },
    { icon: Award, number: '25+', label: 'Years Experience', iconClass: 'bg-primary-dark' },
    { icon: ShoppingBag, number: productCount, label: 'Products Available', iconClass: 'bg-surface-elevated border border-primary/20' },
    { icon: TrendingUp, number: '98%', label: 'Satisfaction Rate', iconClass: 'bg-primary' },
  ];

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerChild key={stat.label}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="text-center p-5 sm:p-7 bg-gradient-to-br from-surface-muted/50 to-background rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-primary/20"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm ${stat.iconClass}`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.number}
                  </h3>
                  <p className="text-muted font-medium text-xs sm:text-sm">{stat.label}</p>
                </motion.div>
              </StaggerChild>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
