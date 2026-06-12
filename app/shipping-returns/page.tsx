'use client';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { Truck, RotateCcw, Shield, Clock, Package, MapPin, CreditCard, AlertTriangle, CheckCircle, XCircle, ArrowLeftRight, Phone, Mail } from 'lucide-react';
import { CONTACT } from '../../config/storeInfo';

export default function ShippingReturnsPage() {
  const shippingHighlights = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary delivery on orders over Rs. 5,000',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Karachi: 1–2 business days',
    },
    {
      icon: Package,
      title: 'Expert Packaging',
      description: 'Securely packaged to preserve every fragrance note',
    },
    {
      icon: RotateCcw,
      title: '7-Day Returns',
      description: 'Easy returns within 7 days of delivery',
    },
  ];

  const deliveryTimelines = [
    { area: 'Karachi', time: '1–2 business days', icon: '🏙️' },
    { area: 'Major Cities (Lahore, Islamabad, etc.)', time: '3–5 business days', icon: '🌆' },
    { area: 'Remote Areas', time: '5–7 business days', icon: '🏔️' },
  ];

  const nonReturnableItems = [
    'Opened, sprayed, or tested fragrances',
    'Bespoke/Customized Gift Sets and Hampers',
    'Items purchased during "Final Clearance" sales',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-[#1A1A1A] via-[#C5A059] to-[#1A1A1A] text-white py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#F5EDD8] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#8E6D31] rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Shipping & Returns</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed px-2 sm:px-0">
              At YAM-N7, we ensure that your premium perfumes and fragrances reach you perfectly sealed and ready to wear.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Highlights */}
      <section className="py-10 sm:py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {shippingHighlights.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-[#FBF6EC] to-white rounded-2xl p-5 sm:p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5A059] to-[#1A1A1A] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] text-sm sm:text-base mb-1 sm:mb-2">{info.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6B7280]">{info.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shipping & Delivery Details */}
      <section className="py-10 sm:py-14 md:py-16 bg-[#FBF6EC]/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">
                Shipping & Delivery Information
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-1 bg-[#C5A059] rounded-full"></div>
                <div className="w-14 h-1 bg-[#8E6D31] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg space-y-6">
              {/* Complimentary Shipping */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mt-0.5">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] text-base sm:text-lg mb-1">Complimentary Shipping</h3>
                  <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                    Enjoy free nationwide delivery on all orders over <span className="font-semibold text-[#1A1A1A]">Rs. 5,000</span>.
                  </p>
                </div>
              </div>

              {/* Standard Charges */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F5EDD8] rounded-xl flex items-center justify-center mt-0.5">
                  <CreditCard className="w-5 h-5 text-[#8E6D31]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] text-base sm:text-lg mb-1">Standard Delivery Charges</h3>
                  <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                    For orders below Rs. 5,000, a flat shipping fee will be calculated and displayed at checkout based on your location.
                  </p>
                </div>
              </div>

              {/* Delivery Timelines */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mt-0.5">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-[#1A1A1A] text-base sm:text-lg mb-3">Delivery Timelines</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {deliveryTimelines.map((item) => (
                      <div
                        key={item.area}
                        className="bg-[#FBF6EC]/60 rounded-xl p-4 text-center border border-[#FBF6EC]"
                      >
                        <span className="text-2xl mb-2 block">{item.icon}</span>
                        <p className="font-semibold text-[#1A1A1A] text-sm mb-0.5">{item.area}</p>
                        <p className="text-xs text-[#8E6D31] font-medium">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Tracking */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mt-0.5">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] text-base sm:text-lg mb-1">Order Tracking</h3>
                  <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                    Once your order is dispatched, you will receive a tracking number via SMS or Email.
                  </p>
                </div>
              </div>

              {/* Handling */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F5EDD8] rounded-xl flex items-center justify-center mt-0.5">
                  <Shield className="w-5 h-5 text-[#8E6D31]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] text-base sm:text-lg mb-1">Handling</h3>
                  <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                    All fragrances are securely sealed and expertly packed to prevent damage during transit.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Return, Exchange & Refund Policy */}
      <section className="py-10 sm:py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">
                Return, Exchange & Refund Policy
              </h2>
              <p className="text-sm sm:text-base text-[#6B7280] max-w-2xl mx-auto px-2">
                We stand by the 25-year legacy of quality at YAM-N7. If you are not entirely satisfied with your purchase, we are here to help.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-10 h-1 bg-[#C5A059] rounded-full"></div>
                <div className="w-14 h-1 bg-[#8E6D31] rounded-full"></div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Returns & Exchanges */}
              <div className="bg-gradient-to-br from-[#FBF6EC] to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md border border-[#FBF6EC]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#1A1A1A] rounded-xl flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Returns & Exchanges</h3>
                </div>
                <div className="space-y-4 text-sm sm:text-base text-[#6B7280] leading-relaxed">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#1A1A1A]">Window:</strong> You have <span className="font-semibold text-[#C5A059]">7 days</span> from the date of delivery to request a return or exchange.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#1A1A1A]">Condition:</strong> Due to the nature of fragrance products, returns are only accepted if the perfume remains <span className="font-semibold">unopened, unused, and in its original packaging</span> with the safety seal intact.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#1A1A1A]">Process:</strong> To initiate a return, please contact our support team at{' '}
                      <a href={`tel:${CONTACT.phoneTel}`} className="text-[#C5A059] font-semibold hover:underline">{CONTACT.phoneDisplay}</a> or email{' '}
                      <a href={`mailto:${CONTACT.email}`} className="text-[#C5A059] font-semibold hover:underline">{CONTACT.email}</a>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Damaged or Incorrect Items */}
              <div className="bg-gradient-to-br from-[#FEF3CD] to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md border border-[#FEF3CD]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8E6D31] to-[#EA580C] rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Damaged or Incorrect Items</h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-[#6B7280] leading-relaxed">
                  <p>
                    If you receive a product that is <strong className="text-[#1A1A1A]">damaged, expired, or differs</strong> from what you ordered, you are entitled to a <span className="font-semibold text-green-600">full replacement or refund</span>.
                  </p>
                  <p>
                    Please report such issues within <span className="font-semibold text-[#8E6D31]">24 hours</span> of delivery with photographic evidence to facilitate a swift resolution.
                  </p>
                </div>
              </div>

              {/* Refunds */}
              <div className="bg-gradient-to-br from-[#F5EDD8] to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md border border-[#F5EDD8]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#059669] to-[#047857] rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Refunds</h3>
                </div>
                <div className="space-y-4 text-sm sm:text-base text-[#6B7280] leading-relaxed">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#1A1A1A]">Approval:</strong> Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#1A1A1A]">Timeline:</strong> Approved refunds are processed within <span className="font-semibold text-[#C5A059]">5–7 business days</span>.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#1A1A1A]">Method:</strong> Refunds will be issued to your original payment method (Bank Transfer/Credit Card) or as store credit for Cash on Delivery orders.
                    </p>
                  </div>
                </div>
              </div>

              {/* Non-Returnable Items */}
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md border border-red-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Non-Returnable Items</h3>
                </div>
                <ul className="space-y-3">
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex gap-3 items-start text-sm sm:text-base text-[#6B7280]">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exchange Option */}
              <div className="bg-gradient-to-br from-[#FBF6EC] to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md border border-[#F5EDD8]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#1A1A1A] rounded-xl flex items-center justify-center flex-shrink-0">
                    <ArrowLeftRight className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Prefer an Exchange?</h3>
                </div>
                <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                  If you would prefer a different fragrance, concentration, or size from our <span className="font-semibold text-[#1A1A1A]">1400+ fragrance collection</span>, we can process an exchange. Any price difference will be settled before the new item is dispatched.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#C5A059] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center text-white"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">Need Help With a Return?</h3>
              <p className="text-sm sm:text-base text-white/80 mb-5 max-w-xl mx-auto">
                Our support team is ready to assist you with any shipping or return queries.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] px-6 py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-[#F5EDD8] transition-colors shadow-lg"
                >
                  <Phone className="w-4 h-4" />
                  {CONTACT.phoneDisplay}
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {CONTACT.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Newsletter />
      <Services />
      <Footer />
    </div>
  );
}
