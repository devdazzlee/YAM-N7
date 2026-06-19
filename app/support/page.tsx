'use client';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import { CONTACT } from '../../config/storeInfo';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-r from-surface-elevated to-primary text-foreground py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Support</h1>
            <p className="text-xl text-foreground/90">We're here to help you 24/7</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface-muted rounded-2xl p-8 text-center"
            >
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Phone Support</h3>
              <p className="text-muted mb-4">Call us anytime</p>
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="text-primary hover:text-foreground font-semibold"
              >
                {CONTACT.phoneDisplay}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-surface-muted rounded-2xl p-8 text-center"
            >
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Email Support</h3>
              <p className="text-muted mb-4">Send us an email</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-primary hover:text-foreground font-semibold"
              >
                {CONTACT.email}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-surface-muted rounded-2xl p-8 text-center"
            >
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Business Hours</h3>
              <p className="text-muted">Mon - Sat: 9 AM - 9 PM</p>
              <p className="text-muted">Sunday: 10 AM - 6 PM</p>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-surface-elevated text-foreground px-8 py-4 rounded-full font-semibold transition-colors"
              >
                Contact Us
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}

