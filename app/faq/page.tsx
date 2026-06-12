'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { ChevronDown } from 'lucide-react';
import { CONTACT } from '../../config/storeInfo';

const faqs = [
  {
    question: 'How do I return a product?',
    answer:
      'If you are not satisfied with your purchase, you can initiate a return within 7 days of delivery. To be eligible, perfumes must be unopened, sealed, in their original packaging, and accompanied by the original receipt. For hygiene reasons, we cannot accept returns on opened or tested fragrances.',
  },
  {
    question: 'What if my order is damaged or incorrect?',
    answer:
      `We take great care in packaging, but if you receive a damaged, defective, or incorrect item, you are entitled to a full refund or exchange without any deductions. Please contact us at ${CONTACT.phoneDisplay} within 24 hours of delivery with a photo of the issue.`,
  },
  {
    question: 'How long does the refund process take?',
    answer:
      'Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. Approved refunds are processed within 5–7 business days to your original payment method.',
  },
  {
    question: 'Are there any items that cannot be returned?',
    answer:
      'For hygiene reasons, we cannot accept returns on: Fragrances where the seal has been broken or the product has been sprayed/tested; Custom-made gift sets or bespoke hampers; Limited-edition items marked as final sale.',
  },
  {
    question: 'Who pays for return shipping?',
    answer:
      'If the item is faulty: YAM-N7 will cover all shipping costs for the return and replacement. If you changed your mind: For "change of mind" returns, the customer is responsible for the return shipping charges.',
  },
  {
    question: 'Can I exchange an item instead of a refund?',
    answer:
      'Yes! If you would prefer a different fragrance, concentration, or size from our 1400+ collection, we can process an exchange. Any price difference will be settled before the new item is dispatched.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Returns & Refunds</h1>
            <p className="text-xl text-white/90">
              Your Questions Answered
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#FBF6EC] transition-colors"
                >
                  <span className="font-semibold text-[#1A1A1A] pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A059] flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-[#6B7280] leading-relaxed">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#FBF6EC]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Still have questions?</h2>
            <p className="text-lg text-[#6B7280] mb-8">
              Can&apos;t find the answer you&apos;re looking for? Contact our friendly team at {CONTACT.phoneDisplay} or email us at {CONTACT.email}
            </p>
            <a
              href="/contact"
              className="inline-block bg-[#C5A059] hover:bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
