'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { Phone, Mail, MessageCircle, Send, Clock, CheckCircle, Sparkles, Star, Gift, Zap, ShoppingBag } from 'lucide-react';
import { CONTACT, BRAND } from '../../config/storeInfo';

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
    }, 3000);
  };

  const contactMethods = [
    {
      icon: ShoppingBag,
      title: 'Shop Online',
      info: 'Premium perfumes delivered across Pakistan',
      href: '/shop',
      bgColor: 'bg-[#C5A059]',
    },
    {
      icon: Phone,
      title: 'Call Us',
      info: CONTACT.phoneDisplay,
      href: `tel:${CONTACT.phoneTel}`,
      bgColor: 'bg-[#8E6D31]',
    },
    {
      icon: Mail,
      title: 'Email Us',
      info: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      bgColor: 'bg-[#C5A059]',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      info: CONTACT.phoneDisplay,
      href: CONTACT.whatsappUrl,
      bgColor: 'bg-[#25D366]',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1A1A1A] via-[#C5A059] to-[#1A1A1A] text-white py-12 sm:py-14 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5EDD8] rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Contact Us</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90">
              We'd love to hear from you. Get in touch with us today!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-white to-[#FBF6EC]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10"
          >
            <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-[#8E6D31] mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">Get in Touch</h2>
            <p className="text-[#6B7280] text-sm sm:text-base">Choose your preferred way to reach us</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-14">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const Component = method.href ? motion.a : motion.div;
              return (
                <Component
                  key={method.title}
                  href={method.href}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-5 sm:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-14 h-14 ${method.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] mb-1">{method.title}</h3>
                  <p className="text-[#6B7280] text-sm">{method.info}</p>
                </Component>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4 sm:mb-5">Send us a Message</h2>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="name" className="block text-[#1A1A1A] font-semibold mb-1.5 text-sm">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[#1A1A1A] font-semibold mb-1.5 text-sm">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[#1A1A1A] font-semibold mb-1.5 text-sm">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-[#1A1A1A] font-semibold mb-1.5 text-sm">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-[#1A1A1A] font-semibold mb-1.5 text-sm">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all resize-none text-sm"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#C5A059] hover:bg-[#1A1A1A] text-white px-6 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base transition-colors flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Send Message</span>
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#F5EDD8] rounded-2xl p-8 sm:p-10 text-center"
                >
                  <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Thank You!</h3>
                  <p className="text-[#6B7280] text-sm sm:text-base">We'll get back to you soon.</p>
                </motion.div>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">Get in Touch</h2>
                <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed mb-6">
                  {BRAND.fullName} is an online perfume store. Reach out through any of the
                  following channels — we&apos;re here to help you find your perfect scent!
                </p>
              </div>

              <div className="space-y-4">
                <motion.a
                  href={`tel:${CONTACT.phoneTel}`}
                  whileHover={{ x: 3 }}
                  className="flex items-start space-x-3 p-4 sm:p-5 bg-gradient-to-br from-[#FBF6EC] to-white rounded-xl shadow-md hover:shadow-lg transition-all block"
                >
                  <div className="w-11 h-11 bg-[#F5EDD8] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-1 text-sm sm:text-base">Phone</h3>
                    <p className="text-[#C5A059] hover:text-[#1A1A1A] transition-colors font-semibold text-sm">
                      {CONTACT.phoneDisplay}
                    </p>
                  </div>
                </motion.a>

                <motion.a
                  href={`mailto:${CONTACT.email}`}
                  whileHover={{ x: 3 }}
                  className="flex items-start space-x-3 p-4 sm:p-5 bg-gradient-to-br from-[#FBF6EC] to-white rounded-xl shadow-md hover:shadow-lg transition-all block"
                >
                  <div className="w-11 h-11 bg-[#F5EDD8] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-1 text-sm sm:text-base">Email</h3>
                    <p className="text-[#C5A059] hover:text-[#1A1A1A] transition-colors font-semibold break-all text-sm">
                      {CONTACT.email}
                    </p>
                  </div>
                </motion.a>

                <motion.a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 bg-[#C5A059] hover:bg-[#1A1A1A] text-white rounded-xl p-4 sm:p-5 transition-all shadow-lg"
                >
                  <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-0.5 text-sm sm:text-base">WhatsApp Us</h3>
                    <p className="text-white/90 text-sm">{CONTACT.phoneDisplay}</p>
                  </div>
                </motion.a>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-[#FBF6EC] to-white rounded-xl p-4 sm:p-5 shadow-md">
                <div className="flex items-center space-x-2.5 mb-3">
                  <Clock className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-bold text-[#1A1A1A] text-sm sm:text-base">Business Hours</h3>
                </div>
                <div className="space-y-1.5 text-[#6B7280] text-sm">
                  <p>Monday - Saturday: 9:00 AM - 9:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Contact Us Section */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">Why Contact Us?</h2>
            <p className="text-[#6B7280] text-sm sm:text-base max-w-2xl mx-auto">
              We're here to help with any questions or concerns
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: 'Quick Response', desc: 'We respond within 24 hours' },
              { icon: Star, title: 'Expert Advice', desc: 'Get guidance from our experts' },
              { icon: Gift, title: 'Special Offers', desc: 'Learn about exclusive deals' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-[#FBF6EC] to-white p-5 sm:p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059] to-[#1A1A1A] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-xs sm:text-sm">{item.desc}</p>
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
