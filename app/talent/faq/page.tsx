'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: 'How do I apply?',
    answer: 'Applying is simple. Click on the "Application Portal" in our navigation bar or select "Apply Now" on any of our program pages. Fill out the application form with your personal details, select your preferred program track (such as Web Development or Runway Training), and upload a link to your current portfolio or social handle (optional). Our admissions board reviews submissions on a rolling basis, and you will receive an evaluation response within 3 to 5 business days.',
  },
  {
    question: 'Is certification provided?',
    answer: 'Yes, absolutely. Upon successful completion of all core syllabus requirements, projects, and learning reviews, you will be issued a digital certificate of achievement from Deloxe. This credential is fully verifiable on our platform, letting employers securely authenticate your skills. You can download the high-resolution certificate as a PDF file, or share it directly to your LinkedIn achievements section with a single click.',
  },
  {
    question: 'Are programs online?',
    answer: 'We offer flexible hybrid learning options. The ICT Hub programs are completely digital, incorporating pre-recorded video lessons, interactive coding assignments, and weekly live classes with senior engineering leads. The NEXTGEN program features both remote and on-site placements depending on your assigned corporate workspace. The Model debut program relies on physical, high-intensity training, which takes place on-site at our studio runway and photography stages.',
  },
  {
    question: 'What are the requirements?',
    answer: 'Requirements depend on your chosen program. For the ICT Hub, no prior coding or design experience is required—only a computer, a stable internet connection, and a passionate willingness to learn. For the NEXTGEN program, we welcome students, fresh graduates, and career changers who have a basic foundation in their chosen track. For the Model debut program, we seek aspiring talents with high motivation, commitment to training, and a professional attitude, regardless of height or size.',
  },
  {
    question: 'How long do programs last?',
    answer: 'Schedules are tailored to fit your learning depth. Our ICT Hub courses last between 8 to 16 weeks depending on the curriculum (e.g., Graphic Design is 8 weeks; Software Programming is 16 weeks). The Model debut program is structured as a 12-week development course. The NEXTGEN program offers flexible terms of 3 months (fast-track), 6 months (standard), or 12 months (extended, with full-time corporate placement guarantee).',
  },
  {
    question: 'Are there job opportunities after completion?',
    answer: 'Yes, connecting talent with real career growth is our ultimate goal. Top-performing ICT Hub and NEXTGEN graduates are recommended directly to our aligned corporate partners and enterprises for full-time hires. Model debut graduates participate in a live runway showcase attended by elite modeling agency scouts, lookbook editors, and casting directors, offering direct channels to agency signings and campaign bookings.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-soft-grey text-charleston font-sans">
      
      {/* HERO / HEADER SECTION */}
      <section className="bg-charleston text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-caribbean rounded-full blur-[140px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-caribbean/10 border border-caribbean/20 rounded-full px-4 py-1.5 mb-6 text-xs font-bold text-caribbean tracking-wider uppercase font-mono shadow-sm"
          >
            <HelpCircle size={12} />
            <span>Support & Guidance</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-black tracking-tight mb-6"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Find answer guides on our admissions, certification details, learning tracks, and placement processes.
          </motion.p>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="border border-gray-150 rounded-2xl overflow-hidden bg-soft-grey hover:border-caribbean/20 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="font-display font-black text-sm sm:text-base text-charleston leading-tight select-none">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-charleston/60 border border-gray-100 flex-shrink-0"
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-gray-600 text-xs sm:text-sm leading-relaxed font-sans border-t border-gray-100/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Dynamic Contact CTA */}
          <div className="mt-20 p-8 rounded-[32px] bg-charleston text-white border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-caribbean/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex gap-4 items-center relative z-10">
              <div className="w-12 h-12 bg-caribbean/15 text-caribbean rounded-2xl flex items-center justify-center flex-shrink-0">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base leading-none mb-1.5">Have other questions?</h3>
                <p className="text-gray-400 text-xs font-sans">Our admissions team is here to guide your unique pathway.</p>
              </div>
            </div>

            <Link
              href="/talent/apply"
              className="w-full sm:w-auto text-center shrink-0 bg-caribbean hover:bg-lemon text-charleston px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative z-10"
            >
              <span>Speak to Admissions</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
