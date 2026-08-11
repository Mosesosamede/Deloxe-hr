'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Users, Briefcase, ChevronDown, Calendar, Clock, Gift, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import TypewriterHeadline from '@/components/TypewriterHeadline';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Badge, Card, CardContent } from '@/components/UI-Components';

import Image from 'next/image';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFloatingReminderVisible, setIsFloatingReminderVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('deloxe_ambassador_dismissed_at', Date.now().toString());
    }
    
    // Check if permanently dismissed has not been set for 24h, then show floating reminder
    const permanentlyDismissedAtStr = localStorage.getItem('deloxe_ambassador_reminder_dismissed_at');
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    let isReminderPermanentlyDismissed = false;
    if (permanentlyDismissedAtStr) {
      const permDismissTime = parseInt(permanentlyDismissedAtStr, 10);
      if (now - permDismissTime < twentyFourHours) {
        isReminderPermanentlyDismissed = true;
      }
    }

    if (!isReminderPermanentlyDismissed) {
      setIsFloatingReminderVisible(true);
    }
  };

  const handleOpenFromReminder = () => {
    setIsPopupOpen(true);
    setIsFloatingReminderVisible(false);
  };

  const handleDismissReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFloatingReminderVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('deloxe_ambassador_reminder_dismissed_at', Date.now().toString());
    }
  };

  useEffect(() => {
    async function fetchLatestPosts() {
      const supabase = createClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('site_id', 'deloxehr')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setLatestPosts(data);
      }
    }
    fetchLatestPosts();
  }, []);

  useEffect(() => {
    // Check if we can display the popup
    const checkPopupTrigger = () => {
      if (typeof window === 'undefined') return;
      
      // Prevent showing if somehow on "/dashboard/incentives"
      if (window.location.pathname.includes('/dashboard/incentives')) return;

      const dismissedAtStr = localStorage.getItem('deloxe_ambassador_dismissed_at');
      const permanentlyDismissedAtStr = localStorage.getItem('deloxe_ambassador_reminder_dismissed_at');
      
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      // If reminder was permanently dismissed for 24h, do not show popup or floating pill
      if (permanentlyDismissedAtStr) {
        const permDismissTime = parseInt(permanentlyDismissedAtStr, 10);
        if (now - permDismissTime < twentyFourHours) {
          return;
        }
      }

      // Check last general popup dismissal
      let shouldShowPopup = true;
      if (dismissedAtStr) {
        const dismissTime = parseInt(dismissedAtStr, 10);
        if (now - dismissTime < twentyFourHours) {
          shouldShowPopup = false;
          // If popup was dismissed but reminder was NOT permanently dismissed, show floating reminder
          setIsFloatingReminderVisible(true);
        }
      }

      if (shouldShowPopup) {
        const timer = setTimeout(() => {
          setIsPopupOpen(true);
        }, 6000); // 6 seconds delay

        const handleMouseLeave = (e: MouseEvent) => {
          if (e.clientY <= 10) {
            setIsPopupOpen(true);
          }
        };

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          clearTimeout(timer);
          document.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    };

    checkPopupTrigger();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPopupOpen) {
        handleClosePopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPopupOpen]);

  useEffect(() => {
    if (!isPopupOpen) return;

    // Simple focus trap
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (!focusableElements.length) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    // Focus the modal when opened
    setTimeout(() => {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href]'
      );
      if (focusableElements && focusableElements.length > 1) {
        (focusableElements[1] as HTMLElement).focus(); // Primary action button
      } else if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }, 100);

    window.addEventListener('keydown', handleFocusTrap);
    return () => window.removeEventListener('keydown', handleFocusTrap);
  }, [isPopupOpen]);

  return (
    <SmoothScroll>
      <main className="relative min-h-screen overflow-hidden">
        <Navbar isDark={true} isHome={true} />

        {/* Hero Section: Dual Portal */}
        <section className="relative min-h-screen md:h-[90vh] flex flex-col md:flex-row overflow-hidden">
          {/* Left Portal: Organizations */}
          <motion.div 
            className="group relative flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-6 md:pt-32 md:pb-16 md:px-12 overflow-hidden bg-[#0F1419] cursor-pointer border-b md:border-b-0 md:border-r border-white/5"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ambient Background for Left */}
            <div className="absolute inset-0 pointer-events-none">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
                alt="Organizations" 
                fill
                className="object-cover opacity-60 group-hover:opacity-75 brightness-110 contrast-105 group-hover:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1419]/85 via-[#0F1419]/35 to-[#0F1419]/50" />
            </div>

            <div className="relative z-10 text-center max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-caribbean text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8"
              >
                <Users size={14} />
                Enterprise Solutions
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Scale Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-caribbean to-lemon">Global Team</span>
              </motion.h2>
              
              <motion.p 
                className="text-gray-400 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Comprehensive HR, payroll, and compliance solutions designed for the modern enterprise.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Link href="/services#organizations">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group/btn flex items-center gap-3 bg-white text-charleston px-10 py-4.5 rounded-2xl font-bold text-base md:text-lg hover:bg-lemon transition-all shadow-2xl shadow-white/5"
                  >
                    Explore B2B Solutions
                    <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Portal: Individuals */}
          <motion.div 
            className="group relative flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-6 md:pt-32 md:pb-16 md:px-12 overflow-hidden bg-white cursor-pointer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ambient Background for Right */}
            <div className="absolute inset-0 pointer-events-none">
              <Image 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80" 
                alt="Individuals" 
                fill
                className="object-cover opacity-50 group-hover:opacity-70 brightness-105 contrast-105 group-hover:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/35 to-white/50" />
            </div>

            <div className="relative z-10 text-center max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-charleston/5 border border-charleston/10 text-charleston text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8"
              >
                <Briefcase size={14} />
                Career Growth
              </motion.div>

              <motion.h2 
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-charleston mb-6 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                Launch Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-charleston to-caribbean">Elite Career</span>
              </motion.h2>

              <motion.p 
                className="text-gray-500 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                Access world-class career training, internships, and global placement opportunities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <Link href="/talent">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group/btn flex items-center gap-3 bg-charleston text-white px-10 py-4.5 rounded-2xl font-bold text-base md:text-lg hover:bg-caribbean transition-all shadow-2xl shadow-charleston/5"
                  >
                    Start Your Journey
                    <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

{/* Center Headline Overlay */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-full px-4 flex justify-center">
  <TypewriterHeadline />
</div>
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-emerald-950 dark:text-white/80 group-hover:text-caribbean transition-colors">
              Explore
            </span>
            <motion.div
              animate={{ 
                y: [0, 6, 0],
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut" 
              }}
              className="text-emerald-950 dark:text-caribbean"
            >
              <ChevronDown size={24} strokeWidth={3} />
            </motion.div>
          </motion.div>
        </section>

        {/* Internship Ambassador Promotional Section */}
        <section className="py-12 md:py-20 px-6 bg-gradient-to-b from-white to-tea/30 dark:from-charleston dark:to-charleston/95">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl md:rounded-[40px] overflow-hidden bg-[#10161b] border border-white/10 p-6 md:p-12 shadow-2xl group"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-caribbean/10 rounded-full blur-3xl pointer-events-none -translate-y-12 translate-x-12 transition-transform group-hover:scale-110 duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-lemon/5 rounded-full blur-3xl pointer-events-none translate-y-12 -translate-x-12" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left side: Info */}
                <div className="lg:col-span-7 text-center lg:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lemon/10 border border-lemon/20 text-lemon text-[10px] font-bold uppercase tracking-widest mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-lemon animate-pulse" />
                    🆕 NEW PROGRAM
                  </div>

                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
                    Become an <br className="md:hidden" /> <span className="text-lemon">Internship Ambassador</span>
                  </h2>

                  <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Help students and graduates discover career training opportunities and earn rewards for every successful referral.
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-8 text-left max-w-lg mx-auto lg:mx-0">
                    {[
                      { text: "Earn rewards for referrals", icon: "💰" },
                      { text: "Help others launch careers", icon: "🎓" },
                      { text: "Track referrals in real time", icon: "📈" },
                      { text: "Withdraw earnings easily", icon: "💳" }
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-base shrink-0">{benefit.icon}</span>
                        <span className="text-xs md:text-sm font-medium text-gray-300">
                          {benefit.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <a
                      href="https://referral.deloxehr.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-lemon hover:bg-lemon/95 text-charleston px-6 py-3.5 rounded-xl font-bold text-sm md:text-base shadow-lg shadow-lemon/10 transition-all active:scale-95"
                    >
                      Become an Ambassador
                      <ArrowRight size={18} />
                    </a>
                    <a
                      href="https://referral.deloxehr.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-6 py-3.5 rounded-xl font-bold text-sm md:text-base transition-all"
                    >
                      Learn More
                    </a>
                  </div>
                </div>

                {/* Right side: Illustration/Graphic */}
                <div className="lg:col-span-5 relative flex justify-center items-center py-6 lg:py-0">
                  <div className="relative w-full max-w-[260px] md:max-w-[300px] aspect-square rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center">
                    {/* Concentric rings */}
                    <div className="absolute inset-4 rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite]" />
                    
                    {/* Core icon */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gradient-to-tr from-lemon to-caribbean flex items-center justify-center shadow-2xl relative z-10"
                    >
                      <Gift size={36} className="text-charleston md:hidden" />
                      <Gift size={44} className="text-charleston hidden md:block animate-pulse" />
                    </motion.div>

                    {/* Floating mini badges */}
                    <motion.div
                      animate={{ y: [0, 6, 0], x: [0, -3, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute top-4 left-4 bg-charleston border border-white/10 shadow-lg px-2.5 py-1.5 rounded-lg flex items-center gap-2"
                    >
                      <span className="text-sm">🤝</span>
                      <span className="text-[10px] font-bold text-gray-200">Share</span>
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, -6, 0], x: [0, 5, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-6 right-0 bg-charleston border border-white/10 shadow-lg px-2.5 py-1.5 rounded-lg flex items-center gap-2"
                    >
                      <span className="text-sm">💵</span>
                      <span className="text-[10px] font-bold text-lemon">Earn</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* B2B Section: FlexiForce & Remotely */}
        <section className="relative py-20 md:py-24 px-6 bg-charleston text-white overflow-hidden">
          {/* Background Image Blended with Charleston section color - Bright & Luminous */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80" 
              alt="City highway traffic at dusk" 
              fill 
              className="object-cover opacity-55 md:opacity-65 brightness-110 contrast-105 scale-105" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charleston/80 via-charleston/45 to-charleston/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-charleston/70 via-transparent to-charleston/70" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6 md:gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-caribbean font-bold uppercase tracking-widest text-[10px] md:text-sm mb-3">B2B Solutions</h3>
                <h2 className="text-3xl md:text-5xl font-display font-bold">The Future of <br />Workforce</h2>
              </div>
              <p className="text-gray-300 max-w-md text-sm md:text-base text-center md:text-left">
                Tailored subscription plans designed to streamline your HR operations and remote team management.
              </p>
            </div>

            {/* Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory">
              {[
                { title: 'FlexiForce', desc: 'On-demand HR support for growing teams.', features: ['Payroll', 'Compliance', 'Onboarding'] },
                { title: 'Remotely', desc: 'Global talent management made simple.', features: ['Global Payroll', 'Local Compliance', 'Benefits'] },
                { title: 'Resourcing', desc: 'Strategic talent acquisition & headhunting.', features: ['Executive Search', 'Volume Hiring', 'Vetting'] },
                { title: 'DocuMate', desc: 'Your digital HR document repository.', features: ['Policies', 'Handbooks', 'Templates'] },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[280px] md:min-w-0 snap-center group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all duration-500 cursor-pointer shadow-xl"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-caribbean/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 text-caribbean group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                  <h4 className="text-xl md:text-2xl font-display font-bold mb-3 md:mb-4">{item.title}</h4>
                  <p className="text-gray-300 mb-5 md:mb-6 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                  
                  <div className="space-y-2 md:space-y-3">
                    {item.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-[10px] md:text-xs text-caribbean font-medium">
                        <div className="w-1 h-1 bg-caribbean rounded-full" />
                        {f}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/10 flex items-center justify-between text-xs md:text-sm font-bold">
                    <span>Learn More</span>
                    <ArrowRight size={14} className="-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* B2C Section: Career Launchpad */}
        <section className="py-24 px-6 bg-tea">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-caribbean font-bold uppercase tracking-widest text-sm mb-4">Career Launchpad</h3>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-charleston mb-8">
                  From University <br />to Your <span className="text-gradient">Dream Placement.</span>
                </h2>
                <div className="space-y-8">
                  {[
                    { step: '01', title: 'Internship Prep', desc: 'Master the art of interviewing and professional etiquette.' },
                    { step: '02', title: 'Readiness Training', desc: 'Industry-specific skills to hit the ground running.' },
                    { step: '03', title: 'Company Matching', desc: 'We connect you with organizations that align with your ambition.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6">
                      <span className="text-4xl font-display font-black text-caribbean/20">{item.step}</span>
                      <div>
                        <h4 className="text-xl font-bold text-charleston mb-2">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" 
                  alt="Career Growth" 
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charleston/80 to-transparent flex items-end p-12">
                  <div className="text-white">
                    <p className="text-2xl font-display font-medium italic mb-2">&quot;Deloxe changed my trajectory. I went from lost graduate to lead developer in 6 months.&quot;</p>
                    <p className="font-bold text-caribbean">— Sarah J., Alumna</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Latest Insights Section */}
        {latestPosts.length > 0 && (
          <section className="py-20 md:py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6 md:gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-caribbean font-bold uppercase tracking-widest text-[10px] md:text-sm mb-3">Latest Insights</h3>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-charleston">Thought Leadership</h2>
                </div>
                <Link href="/blog" className="hidden md:flex items-center gap-2 text-charleston font-bold hover:text-caribbean transition-colors">
                  View All Articles
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Horizontal Scroll on Mobile */}
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory">
                {latestPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="min-w-[300px] md:min-w-0 snap-center"
                  >
                    <Link href={`/blog/${post.slug}`} className="group">
                      <Card className="h-full group-hover:-translate-y-1.5 transition-transform shadow-lg hover:shadow-xl rounded-2xl md:rounded-3xl border-gray-100">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl md:rounded-t-[24px]">
                          {post.image_url ? (
                            <Image 
                              src={post.image_url} 
                              alt={post.title} 
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-soft-grey flex items-center justify-center text-gray-300">
                              No Image Available
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/95 backdrop-blur-md border-0 text-[10px] py-0.5">{post.category}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-5 md:p-7">
                          <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <span className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(post.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Clock size={10} /> {post.read_time || '5 min'}</span>
                          </div>
                          <h3 className="text-lg md:text-xl font-display font-bold text-charleston mb-3 group-hover:text-caribbean transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                            {post.excerpt || post.content.substring(0, 100) + '...'}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Link href="/blog" className="md:hidden flex items-center justify-center gap-2 text-charleston font-bold hover:text-caribbean transition-colors mt-4">
                View All Articles
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        )}

        <Footer />

        {/* Promotional Popup Modal */}
        <AnimatePresence>
          {isPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Overlay with soft dark blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClosePopup}
                className="fixed inset-0 bg-[#090C10]/80 backdrop-blur-md transition-opacity"
              />
              
              {/* Premium Luxury Modal Card */}
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={{ type: 'spring', damping: 28, stiffness: 360 }}
                className="relative w-full max-w-lg bg-[#0F141A]/95 border border-white/15 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_32px_90px_rgba(0,0,0,0.85),0_0_60px_rgba(0,204,136,0.12)] z-10 font-sans my-auto max-h-[92vh] flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                {/* Visual Header Banner with Gradient & Glow */}
                <div className="relative h-28 sm:h-32 bg-gradient-to-br from-[#121B24] via-[#0D181D] to-[#082218] p-6 flex items-center justify-between border-b border-white/10 overflow-hidden flex-shrink-0">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-caribbean/20 rounded-full blur-[60px] pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-lemon/15 rounded-full blur-[50px] pointer-events-none" />
                  
                  {/* Header Badge & Icon */}
                  <div className="relative z-10 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-caribbean/15 border border-caribbean/30 text-caribbean flex items-center justify-center shadow-inner">
                      <Gift size={24} />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-caribbean/15 border border-caribbean/30 text-caribbean text-[10px] font-black uppercase tracking-widest mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-caribbean animate-ping" />
                        <span>Exclusive Program</span>
                      </div>
                      <h4 className="text-white font-display font-bold text-base sm:text-lg leading-tight">
                        Ambassador Network
                      </h4>
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleClosePopup}
                    className="relative z-10 text-gray-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-full p-2.5 transition-all duration-200 hover:rotate-90 cursor-pointer shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                {/* Modal Body Container */}
                <div className="p-6 sm:p-8 relative z-10 overflow-y-auto scrollbar-hide">
                  {/* Title */}
                  <h3 id="modal-title" className="text-2xl sm:text-3xl font-display font-bold text-white mb-2.5 tracking-tight leading-snug">
                    Become an <span className="text-transparent bg-clip-text bg-gradient-to-r from-lemon via-caribbean to-white">Internship Ambassador</span>
                  </h3>
                  
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6 font-normal">
                    Empower students and fresh graduates to access career training while unlocking high-yield referral rewards for every successful enrollment.
                  </p>
                  
                  {/* Feature Highlights Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3 sm:p-3.5 mb-6 backdrop-blur-sm">
                    <div className="flex sm:flex-col items-center sm:text-center p-2.5 sm:p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-caribbean/30 transition-all group gap-3 sm:gap-0">
                      <div className="w-8 h-8 rounded-lg bg-lemon/10 text-lemon flex items-center justify-center sm:mb-1.5 group-hover:scale-110 transition-transform flex-shrink-0">
                        <Gift size={16} />
                      </div>
                      <div className="flex flex-col sm:items-center text-left sm:text-center">
                        <span className="text-xs font-bold text-gray-200">Earn Rewards</span>
                        <span className="text-[10px] text-gray-400">Per referral</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:text-center p-2.5 sm:p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-caribbean/30 transition-all group gap-3 sm:gap-0">
                      <div className="w-8 h-8 rounded-lg bg-caribbean/10 text-caribbean flex items-center justify-center sm:mb-1.5 group-hover:scale-110 transition-transform flex-shrink-0">
                        <Users size={16} />
                      </div>
                      <div className="flex flex-col sm:items-center text-left sm:text-center">
                        <span className="text-xs font-bold text-gray-200">Empower Peers</span>
                        <span className="text-[10px] text-gray-400">Launch careers</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:text-center p-2.5 sm:p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-caribbean/30 transition-all group gap-3 sm:gap-0">
                      <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center sm:mb-1.5 group-hover:scale-110 transition-transform flex-shrink-0">
                        <ArrowRight size={16} />
                      </div>
                      <div className="flex flex-col sm:items-center text-left sm:text-center">
                        <span className="text-xs font-bold text-gray-200">Live Dashboard</span>
                        <span className="text-[10px] text-gray-400">Track earnings</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                    <a
                      href="https://referral.deloxehr.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex-1 inline-flex items-center justify-center gap-2 bg-lemon hover:bg-lemon/95 text-charleston font-bold py-3.5 px-5 rounded-2xl shadow-[0_10px_25px_-4px_rgba(247,241,103,0.35)] hover:shadow-[0_12px_30px_-4px_rgba(247,241,103,0.5)] transition-all text-center text-sm active:scale-[0.98] min-h-[48px]"
                    >
                      <span>Join Ambassador Program</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </a>
                    
                    <button
                      onClick={handleClosePopup}
                      className="bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/10 font-bold py-3.5 px-5 rounded-2xl transition-all cursor-pointer text-sm active:scale-[0.98] min-h-[48px]"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating Reminder Pill */}
        <AnimatePresence>
          {isFloatingReminderVisible && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 flex items-center justify-between sm:justify-start gap-3 bg-[#0F141A]/95 backdrop-blur-xl border border-white/15 hover:border-caribbean/50 text-white rounded-2xl sm:rounded-full px-4.5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(0,204,136,0.15)] cursor-pointer group hover:scale-[1.02] transition-all"
              onClick={handleOpenFromReminder}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-lemon animate-ping flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-wide truncate text-gray-100 select-none">
                  Become an Ambassador & Earn Rewards
                </span>
              </div>
              <button
                onClick={handleDismissReminder}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors cursor-pointer flex-shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center"
                title="Dismiss for 24h"
                aria-label="Dismiss reminder for 24 hours"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </SmoothScroll>
  );
}
