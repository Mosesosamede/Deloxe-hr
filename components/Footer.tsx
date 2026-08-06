'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-charleston text-white pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-caribbean/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-lemon rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-charleston font-bold text-2xl">D</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">DELOXE</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Innovative Human Resource Consulting. Bridging the gap between ambition and opportunity through technology and expertise.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -5, color: '#F7F167' }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Services', 'Pricing', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-caribbean transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-lg mb-8">Solutions</h4>
            <ul className="space-y-4">
              {['FlexiForce', 'Remotely', 'Resourcing', 'DocuMate', 'Graduate Readiness'].map((link) => (
                <li key={link}>
                  <Link href="/services" className="text-gray-400 hover:text-caribbean transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-8">Get in Touch</h4>
            <ul className="space-y-6">
              <li className="flex gap-4 text-gray-400">
                <Phone className="text-caribbean shrink-0" size={20} />
                <div className="flex flex-col gap-1.5">
                  <span>+234 701 380 0114</span>
                </div>
              </li>
              <li className="flex gap-4 text-gray-400">
                <Mail className="text-caribbean shrink-0" size={20} />
                <span>info@deloxehr.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Deloxe HR Consulting. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: [1, 1.06, 1],
            }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.15, backgroundColor: '#F7F167', color: '#1A2421' }}
            whileTap={{ scale: 0.95 }}
            transition={{
              scale: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              },
              opacity: { duration: 0.25 },
              y: { duration: 0.25 }
            }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-caribbean text-charleston rounded-full flex items-center justify-center shadow-2xl z-50 cursor-pointer border border-white/10"
            aria-label="Back to top"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
