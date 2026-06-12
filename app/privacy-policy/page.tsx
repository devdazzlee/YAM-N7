'use client';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { CONTACT } from '../../config/storeInfo';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-white/90">YAM-N7 | Privacy Policy</p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 md:p-12 space-y-8"
          >
            <div className="space-y-8 text-[#6B7280] leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">1. Introduction</h2>
                <p>
                  At YAM-N7, protecting the privacy of our customers is a cornerstone of our 25-year legacy of trust. This policy outlines how we collect, safeguard, and utilize your information when you shop for our premium perfumes, attars, and fragrances. By using our services, you consent to the practices described in this policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">2. Information We Collect</h2>
                <p className="mb-3">We collect only the essential data required to provide you with a seamless shopping experience:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Personal Identification:</strong> Name, email address, phone number, and physical shipping address.</li>
                  <li><strong>Payment Data:</strong> Credit/debit card details or bank information, which are processed exclusively through secure, licensed payment partners.</li>
                  <li><strong>Purchase History:</strong> Records of your fragrance selections and preferences to better serve your future needs.</li>
                  <li><strong>Technical Data:</strong> IP addresses and browser types to enhance site security and performance.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">3. How We Use Your Information</h2>
                <p className="mb-3">Your data is used to ensure the quality and delivery of our products:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Order Fulfillment:</strong> To process transactions, manage shipping, and send order updates.</li>
                  <li><strong>Customer Excellence:</strong> To respond to your inquiries and provide personalized fragrance recommendations.</li>
                  <li><strong>Service Optimization:</strong> To analyze website traffic and improve our digital storefront.</li>
                  <li><strong>Marketing:</strong> To send exclusive offers and new fragrance launches, only if you have explicitly opted-in to receive them.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">4. Data Security & Retention</h2>
                <p>
                  We implement advanced encryption and auditing measures to protect your personal information from unauthorized access. In accordance with PECA 2016, we retain transaction and traffic data for a minimum of one year to comply with local regulatory requirements. While we strive for absolute security, please note that no digital transmission is 100% immune to risks.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">5. Your Rights</h2>
                <p className="mb-3">As a YAM-N7 customer, you hold the following rights regarding your digital identity:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Access & Portability:</strong> You may request a copy of the personal data we hold about you.</li>
                  <li><strong>Correction:</strong> You have the right to update any inaccurate or incomplete information.</li>
                  <li><strong>Erasure:</strong> You may request the deletion of your data when it is no longer necessary for transaction or legal purposes.</li>
                  <li><strong>Withdrawal of Consent:</strong> You can opt-out of promotional communications at any time via the &quot;unsubscribe&quot; link or by contacting us.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">6. Third-Party Disclosures</h2>
                <p>
                  We do not sell, rent, or trade your personal information to third-party marketing firms. We only share data with trusted logistics partners to facilitate delivery or when required by Pakistani law enforcement through valid legal processes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">7. Contact Us</h2>
                <p>
                  For any questions regarding your privacy or to exercise your data rights, please contact us:
                </p>
                <div className="mt-3 space-y-1">
                  <p><strong>Email:</strong> {CONTACT.email}</p>
                  <p><strong>Phone:</strong> {CONTACT.phoneDisplay}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
