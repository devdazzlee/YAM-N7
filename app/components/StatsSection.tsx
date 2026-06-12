'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, ShoppingBag } from 'lucide-react';
import { useProductMetaStore } from '../../lib/store/productMetaStore';

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
    { icon: Users, number: '10K+', label: 'Happy Customers', color: '#C5A059' },
    { icon: Award, number: '25+', label: 'Years Experience', color: '#8E6D31' },
    { icon: ShoppingBag, number: productCount, label: 'Products Available', color: '#1A1A1A' },
    { icon: TrendingUp, number: '98%', label: 'Satisfaction Rate', color: '#C5A059' },
  ];

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="text-center p-5 sm:p-7 bg-gradient-to-br from-[#FBF6EC]/50 to-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm" style={{ background: stat.color }}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-1">{stat.number}</h3>
                <p className="text-[#6B7280] font-medium text-xs sm:text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
