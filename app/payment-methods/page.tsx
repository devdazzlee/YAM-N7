'use client';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

const paymentMethods = [
  {
    icon: Banknote,
    title: 'Cash on Delivery',
    description: 'Pay when you receive your order. Available for all locations.',
  },
  {
    icon: CreditCard,
    title: 'Credit/Debit Cards',
    description: 'Secure online payment using Visa, MasterCard, or other major cards.',
  },
  {
    icon: Wallet,
    title: 'Bank Transfer',
    description: 'Direct bank transfer for your convenience.',
  },
];

export default function PaymentMethodsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Payment Methods</h1>
            <p className="text-xl text-white/90">Secure and convenient payment options</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#FBF6EC] rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 bg-[#F5EDD8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{method.title}</h3>
                  <p className="text-[#6B7280]">{method.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}

