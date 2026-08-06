'use client';

import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, UserCheck, Scale, Zap } from 'lucide-react';

const timeline = [
  {
    icon: Eye,
    title: 'Data Collection',
    desc: 'We collect information you provide directly to us, such as when you create an account, subscribe to a plan, or contact us for support.',
    details: ['Name and contact data', 'Payment information', 'Professional background', 'Usage data'],
  },
  {
    icon: Zap,
    title: 'Data Usage',
    desc: 'Your data is used to provide, maintain, and improve our services, including processing transactions and sending technical notices.',
    details: ['Service delivery', 'Communication', 'Personalization', 'Security & Fraud prevention'],
  },
  {
    icon: Lock,
    title: 'Data Storage',
    desc: 'We use industry-standard security measures to protect your information from unauthorized access, disclosure, or destruction.',
    details: ['Encryption at rest', 'Secure data centers', 'Access controls', 'Regular audits'],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    desc: 'You have the right to access, correct, or delete your personal data at any time. We provide tools for you to manage your privacy settings.',
    details: ['Access & Portability', 'Correction & Deletion', 'Opt-out of marketing', 'Data processing restriction'],
  },
  {
    icon: Scale,
    title: 'Legal Compliance',
    desc: 'We comply with global data protection regulations, including GDPR and local Nigerian data protection laws.',
    details: ['Regulatory adherence', 'Policy updates', 'Legal requests', 'Transparency reports'],
  },
];

export default function PrivacyPolicy() {
  return (
    <SmoothScroll>
      <main className="bg-soft-grey min-h-screen">
        <Navbar isDark={true} />
        
        {/* Header */}
        <section className="pt-40 pb-20 px-6 bg-charleston text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-bold mb-8"
            >
              Privacy <span className="text-caribbean">Policy</span>
            </motion.h1>
            <p className="text-xl text-gray-400">
              Clear, transparent, and chronological. We value your trust as much as your data.
            </p>
          </div>
        </section>

        {/* Chronological Timeline */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 hidden md:block" />

            <div className="space-y-24">
              {timeline.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Icon Node */}
                  <div className="absolute left-0 md:left-1/2 top-0 w-12 h-12 bg-caribbean text-charleston rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-xl border-4 border-soft-grey">
                    <item.icon size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 md:w-1/2" />
                  <div className="flex-1 md:w-1/2 p-10 rounded-[32px] bg-white shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-display font-bold text-charleston mb-4">{item.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.details.map(detail => (
                        <span key={detail} className="px-3 py-1 bg-soft-grey rounded-full text-[10px] font-bold uppercase tracking-widest text-charleston/60">
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScroll>
  );
}
