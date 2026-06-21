'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import PageHero from '../components/pages/PageHero';
import TrustStrip from '../components/pages/TrustStrip';
import PageFAQ from '../components/pages/PageFAQ';
import PageCTA from '../components/pages/PageCTA';
import FeatureShowcase from '../components/pages/FeatureShowcase';
import { Reveal, SectionShell } from '../components/motion/reveal';
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  MapPin,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { CONTACT, BRAND } from '../../config/storeInfo';

const CONTACT_FAQ = [
  {
    q: 'How quickly will I receive a response?',
    a: 'We aim to respond to all enquiries within 24 hours on business days. WhatsApp messages are typically answered faster during store hours.',
  },
  {
    q: 'Can you help me choose a fragrance?',
    a: 'Absolutely. Tell us about the occasion, your preferred notes (woody, floral, fresh, oud), and budget — our team will recommend options from our 1,400+ collection.',
  },
  {
    q: 'Do you accept bulk or corporate orders?',
    a: 'Yes. Contact us with your requirements for gift sets, wedding favours, or corporate gifting. We offer tailored packages for large orders.',
  },
  {
    q: 'What are your business hours?',
    a: 'Monday – Saturday: 9:00 AM – 9:00 PM. Sunday: 10:00 AM – 6:00 PM (PKT).',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      info: CONTACT.phoneDisplay,
      href: `tel:${CONTACT.phoneTel}`,
      desc: 'Speak directly with our team',
    },
    {
      icon: Mail,
      title: 'Email',
      info: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      desc: 'Detailed enquiries welcome',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      info: 'Chat instantly',
      href: CONTACT.whatsappUrl,
      desc: 'Fastest way to reach us',
      highlight: true,
    },
    {
      icon: MapPin,
      title: 'Online Store',
      info: 'Karachi, Pakistan',
      href: '/shop',
      desc: 'Nationwide delivery available',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageHero
        label="Get in Touch"
        title="Contact YAM-N7"
        subtitle="Whether you need fragrance advice, order support, or partnership enquiries — our team is here to help you find your perfect scent."
      >
        <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="luxury-btn-primary">
          <MessageCircle className="w-4 h-4" />
          Chat on WhatsApp
        </a>
      </PageHero>

      <TrustStrip
        items={[
          { icon: Clock, label: 'Response Time', value: '<24h' },
          { icon: Headphones, label: 'Support', value: 'Expert' },
          { icon: Sparkles, label: 'Consultations', value: 'Free' },
          { icon: MapPin, label: 'Delivery', value: 'Pakistan' },
        ]}
      />

      {/* Contact channels */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="luxury-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const Wrapper = method.href ? motion.a : motion.div;
              return (
                <Wrapper
                  key={method.title}
                  href={method.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`luxury-card luxury-card-hover p-6 block ${method.highlight ? 'ring-1 ring-primary/20' : ''}`}
                >
                  <div className="w-11 h-11 border border-primary/25 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl text-foreground mb-1">{method.title}</h3>
                  <p className="text-primary text-sm font-medium mb-1">{method.info}</p>
                  <p className="text-muted text-xs">{method.desc}</p>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + info */}
      <SectionShell className="bg-surface-muted/30">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">
          <Reveal variant="slideLeft">
            <p className="luxury-label mb-3">Write to Us</p>
            <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-6 font-light">
              Send a Message
            </h2>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                      Name *
                    </label>
                    <input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
                  />
                </div>
                <button type="submit" className="luxury-btn-primary w-full sm:w-auto">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="luxury-card p-10 text-center"
              >
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-foreground mb-2">Thank You</h3>
                <p className="text-muted text-sm">We&apos;ll respond within 24 hours.</p>
              </motion.div>
            )}
          </Reveal>

          <Reveal variant="slideRight" delay={0.1}>
            <p className="luxury-label mb-3">Visit & Hours</p>
            <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-6 font-light">
              {BRAND.fullName}
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed mb-8">
              {BRAND.fullName} is Pakistan&apos;s trusted online perfume destination. Reach out for
              fragrance recommendations, order support, wholesale enquiries, or gift consultations.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="luxury-card p-5 flex items-center gap-4 hover:border-primary/30 transition-colors block"
              >
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-luxury text-muted-subtle">Phone</p>
                  <p className="font-medium text-foreground">{CONTACT.phoneDisplay}</p>
                </div>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="luxury-card p-5 flex items-center gap-4 hover:border-primary/30 transition-colors block"
              >
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-luxury text-muted-subtle">Email</p>
                  <p className="font-medium text-foreground break-all">{CONTACT.email}</p>
                </div>
              </a>
            </div>

            <div className="luxury-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg text-foreground">Business Hours</h3>
              </div>
              <div className="space-y-1.5 text-muted text-sm">
                <p>Monday – Saturday: 9:00 AM – 9:00 PM</p>
                <p>Sunday: 10:00 AM – 6:00 PM</p>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <FeatureShowcase
        accent="Why Reach Out"
        title="How We Can Help"
        items={[
          {
            icon: Sparkles,
            title: 'Fragrance Consultation',
            description: 'Not sure which scent suits you? Our experts recommend based on occasion, season, and personal preference.',
          },
          {
            icon: Headphones,
            title: 'Order Support',
            description: 'Track orders, modify requests, or resolve delivery questions with our dedicated support team.',
          },
          {
            icon: MessageCircle,
            title: 'Gift Guidance',
            description: 'Planning a gift? We help you choose the perfect set from our Duo, Trio, and Elite collections.',
          },
        ]}
      />

      <PageFAQ accent="Support FAQ" title="Common Questions" items={CONTACT_FAQ} />

      <PageCTA
        title="Ready to Find Your Scent?"
        subtitle="Browse our full collection of 1,400+ fragrances — or message us for a personalised recommendation."
        primaryHref="/shop"
        primaryLabel="Shop Now"
        secondaryHref={CONTACT.whatsappUrl}
        secondaryLabel="WhatsApp Us"
      />

      <Newsletter />
      <Footer />
    </div>
  );
}
