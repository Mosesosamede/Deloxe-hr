'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, ChevronDown, BookOpen, Info } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/lib/CurrencyContext';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Talent Management', href: '/talent' },
  { name: 'Pricing', href: '/pricing' },
];

const resourceLinks = [
  {
    name: 'Blog',
    href: '/blog',
    description: 'Articles, insights, and industry news',
    icon: BookOpen,
  },
  {
    name: 'About Us',
    href: '/about',
    description: 'Our mission, team, and company story',
    icon: Info,
  },
];

export default function Navbar({ isDark = false, isHome = false }: { isDark?: boolean; isHome?: boolean }) {
  const { currency, setCurrency } = useCurrency();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(true);
  const resourcesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const textColor = isScrolled ? 'text-white' : (isDark ? 'text-white' : 'text-charleston');
  const linkColor = isScrolled ? 'text-gray-300' : (isDark ? 'text-white/80' : 'text-charleston/80');
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6 ${
        isScrolled ? 'pt-4 md:pt-6' : 'pt-5 md:pt-6'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 220, damping: 25 }}
        className={`max-w-5xl mx-auto rounded-[32px] md:rounded-full border transition-all duration-500 relative overflow-visible ${
          isScrolled 
            ? 'bg-charleston/90 backdrop-blur-2xl border-white/10 shadow-[0_24px_50px_-15px_rgba(0,0,0,0.5)] py-2 px-5' 
            : (isHome 
                ? 'bg-[#0F1419]/80 backdrop-blur-xl border-white/10 shadow-2xl py-3 px-6' 
                : 'bg-white/5 backdrop-blur-sm border-white/5 md:bg-transparent md:backdrop-blur-none md:border-transparent py-3 px-6')
        }`}
      >
        <div className="flex items-center justify-between w-full h-11 md:h-12">
          {/* Logo with micro-spring scaling feedback */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 bg-lemon rounded-[12px] flex items-center justify-center shadow-md border border-white/20 select-none"
            >
              <span className="text-charleston font-black text-xl leading-none">D</span>
            </motion.div>
            <span className={`font-display font-bold text-lg md:text-xl tracking-tight transition-colors duration-500 ${textColor}`}>
              DELOXE
            </span>
          </Link>

          {/* Desktop Nav Items with physical underline interaction */}
          <div className="hidden md:flex items-center gap-7">
            <select
               value={currency}
               onChange={(e) => setCurrency(e.target.value as any)}
               className={`bg-transparent text-sm font-semibold tracking-wide ${textColor} cursor-pointer`}
            >
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-all duration-300 relative py-1.5 hover:text-caribbean ${linkColor} group/link`}
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-caribbean rounded-full transition-all duration-300 group-hover/link:w-2/3" />
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div 
              ref={resourcesRef}
              className="relative"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`text-sm font-semibold tracking-wide transition-all duration-300 relative py-1.5 hover:text-caribbean ${linkColor} flex items-center gap-1 group/link cursor-pointer`}
                aria-expanded={isResourcesOpen}
              >
                <span>Resources</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isResourcesOpen ? 'rotate-180 text-caribbean' : ''}`} />
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-caribbean rounded-full transition-all duration-300 ${isResourcesOpen ? 'w-2/3' : 'w-0 group-hover/link:w-2/3'}`} />
              </button>

              <AnimatePresence>
                {isResourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-3 w-64 bg-[#0F1419]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
                  >
                    {resourceLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsResourcesOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-caribbean/15 border border-caribbean/30 text-caribbean flex items-center justify-center shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover/item:text-caribbean transition-colors flex items-center gap-1">
                              <span>{item.name}</span>
                              <ChevronRight size={12} className="opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-caribbean" />
                            </div>
                            <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Custom Action Button (Liquid Metal Titanium Feel) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Link
                href="/contact"
                className="relative bg-lemon hover:bg-caribbean text-charleston px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-[0_10px_20px_-5px_rgba(247,241,103,0.3)] transition-all duration-300 inline-block text-center border border-white/20"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* iOS Smooth Dynamic Island Toggle Menu Button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center border transition-colors text-caribbean ${
              isScrolled 
                ? 'bg-white/10 hover:bg-white/15 border-white/15' 
                : 'bg-black/10 hover:bg-black/15 border-black/10'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-caribbean"
                >
                  <X size={20} className="text-caribbean" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-caribbean"
                >
                  <Menu size={20} className="text-caribbean" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* 
          BUBBLE OPTIMIZED DROPDOWN (Morph inside the Dynamic Island container itself!)
        */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className="md:hidden overflow-hidden w-full border-t border-white/5 pt-4 pb-2"
            >
              <div className="flex flex-col gap-3 font-sans">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, type: 'spring', stiffness: 150, damping: 15 }}
                  >
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3.5 px-4.5 rounded-[18px] text-base font-bold bg-white/5 active:bg-white/10 border border-white/[0.04] transition-all duration-200 text-white select-none`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="text-caribbean opacity-60" size={16} />
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Resources Sub-menu */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05, type: 'spring', stiffness: 150, damping: 15 }}
                  className="flex flex-col gap-2"
                >
                  <button
                    onClick={() => setIsMobileResourcesOpen(!isMobileResourcesOpen)}
                    className="flex items-center justify-between py-3.5 px-4.5 rounded-[18px] text-base font-bold bg-white/5 active:bg-white/10 border border-white/[0.04] transition-all duration-200 text-white select-none w-full cursor-pointer"
                  >
                    <span>Resources</span>
                    <ChevronDown className={`text-caribbean transition-transform duration-300 ${isMobileResourcesOpen ? 'rotate-180' : ''}`} size={18} />
                  </button>

                  <AnimatePresence>
                    {isMobileResourcesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-2 pr-1 flex flex-col gap-2"
                      >
                        {resourceLinks.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                              }}
                              className="flex items-center justify-between py-3 px-4 rounded-[14px] text-sm font-semibold bg-white/[0.03] active:bg-white/10 text-gray-200 hover:text-white border border-white/[0.04] transition-all"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-caribbean/15 text-caribbean flex items-center justify-center">
                                  <Icon size={14} />
                                </div>
                                <span>{item.name}</span>
                              </div>
                              <ChevronRight className="text-caribbean opacity-60" size={14} />
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.05, type: 'spring', stiffness: 150, damping: 15 }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center bg-lemon active:scale-[0.98] text-charleston text-center py-4 rounded-[20px] font-black uppercase text-xs tracking-wider border border-white/20 shadow-lg mt-2 w-full transition-transform select-none"
                  >
                    <span>Get Started</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
