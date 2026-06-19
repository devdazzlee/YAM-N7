'use client';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { CONTACT } from '../../config/storeInfo';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-surface-elevated to-primary text-foreground py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl text-foreground/90">YAM-N7 | Terms & Conditions</p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 md:p-12 space-y-8"
          >
            <div className="space-y-8 text-muted leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing and using the YAM-N7 website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and YAM-N7. If you do not agree to these terms, please discontinue use of our services immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
                <p>
                  Permission is granted to temporarily access the materials on this website for personal, non-commercial transitory viewing only. This is a grant of a license, not a transfer of title. Under this license, you may not modify the materials, use them for commercial purposes, or attempt to decompile any software contained on the site.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Product Information & Accuracy</h2>
                <p>
                  We strive for absolute accuracy in our descriptions of 1400+ perfumes, attars, and fragrances. However, YAM-N7 does not warrant that product descriptions, images, or other content are entirely error-free. We reserve the right to correct any errors and update information without prior notice.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Pricing & Currency</h2>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>All prices are listed in Pakistani Rupees (PKR).</li>
                  <li>Prices are subject to change without notice due to market fluctuations in premium fragrance imports.</li>
                  <li>We reserve the right to modify or discontinue products at any time.</li>
                  <li>Prices do not include shipping charges unless the order qualifies for our Complimentary Shipping (over Rs. 5,000).</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Payment Terms</h2>
                <p className="mb-3">Payment must be secured at the time of order placement. We accept:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Cash on Delivery (COD)</li>
                  <li>Credit/Debit Cards & Bank Transfers</li>
                </ul>
                <p className="mt-3">
                  All digital payments are processed via licensed, secure gateways to ensure the protection of your financial data.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Shipping & Delivery</h2>
                <p>
                  Estimated delivery times are provided at checkout. While we ensure timely dispatch of all orders, YAM-N7 is not liable for delays caused by external shipping carriers or unforeseen logistics issues. Title and risk of loss pass to the customer upon successful delivery to the provided address.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Returns & Refunds</h2>
                <p className="mb-3">In accordance with Sindh Consumer Rights, we stand behind the quality of our goods:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Eligibility:</strong> Returns are accepted within 7 days of delivery for unopened items in original packaging.</li>
                  <li><strong>Faulty Goods:</strong> If a product is found to be defective or misrepresented, consumers are entitled to a full refund as per the Sindh Consumer Protection Act.</li>
                  <li><strong>Processing:</strong> Approved refunds will be processed within 5–7 business days to the original payment method.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                <p>
                  YAM-N7, its directors, and employees shall not be held liable for any indirect, incidental, or consequential damages resulting from the use of our website or our products beyond the purchase price of the items.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Governing Law</h2>
                <p>
                  These terms are governed by the laws of Pakistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the Consumer Courts in Karachi.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Information</h2>
                <p>
                  For inquiries regarding these Terms, please contact us:
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
