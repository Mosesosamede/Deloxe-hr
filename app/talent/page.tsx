'use client';

import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Check, Award, BookOpen, Users, Briefcase, FileCheck, 
  Sparkles, Code, Camera, ChevronRight, Star, Quote, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Counting Hook for Stats
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalDuration = 2000;
    const incrementTime = Math.max(Math.floor(totalDuration / end), 20);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

const programs = [
  {
    id: 'internship',
    title: 'NEXTGEN',
    subtitle: 'Graduate internship prep',
    desc: 'Designed to bridge the gap between academic environments and target career trajectories.',
    href: '/talent/internship',
    icon: Briefcase,
    color: 'from-caribbean/20 to-deep-sea/10',
    iconColor: 'text-caribbean',
    features: [
      'Preparing for internship roles',
      'Providing career readiness training',
      'Matching with suitable companies',
      'Professional Mentorship',
      'Certification',
    ],
  },
  {
    id: 'ict',
    title: 'ICT Hub',
    desc: 'Master in-demand digital and technology skills through structured training programs.',
    href: '/talent/ict-training',
    icon: Code,
    color: 'from-lemon/20 to-rifle/10',
    iconColor: 'text-lemon',
    features: [
      'Web Development',
      'Software Programming',
      'Data Analysis',
      'Graphic Design',
      'UI/UX Design',
      'Digital Marketing',
    ],
  },
  {
    id: 'model',
    title: 'Model debut',
    desc: 'Launch your modeling career through professional coaching, portfolio creation, and industry exposure.',
    href: '/talent/model-debut',
    icon: Camera,
    color: 'from-purple-500/10 to-pink-500/10',
    iconColor: 'text-purple-400',
    features: [
      'Photoshoots',
      'Runway Training',
      'Personal Branding',
      'Talent Showcase',
      'Industry Networking',
    ],
  },
];

const whyChooseUs = [
  {
    icon: Users,
    title: 'Industry Experts',
    desc: 'Learn directly from seasoned professionals who bring real-world insights, practices, and active networks to your path.',
  },
  {
    icon: BookOpen,
    title: 'Practical Learning',
    desc: 'No dry theory. Build concrete projects, run actual campaigns, participate in live shoots, and execute client briefs.',
  },
  {
    icon: Award,
    title: 'Certifications',
    desc: 'Earn industry-respected credentials and digital achievements verified securely on our platform for employers globally.',
  },
  {
    icon: Briefcase,
    title: 'Career Opportunities',
    desc: 'Unlock exclusive placements, internships, agency signings, and recruiting events through Deloxe’s employer alliances.',
  },
];

const stats = [
  { label: 'Active Students', value: 1420, suffix: '+' },
  { label: 'Programs Offered', value: 15, suffix: '' },
  { label: 'Graduates', value: 3800, suffix: '+' },
  { label: 'Internship Placements', value: 92, suffix: '%' },
  { label: 'Certificates Issued', value: 4500, suffix: '+' },
];

const testimonials = [
  {
    name: 'Sarah Adebayo',
    role: 'Full Stack Engineer @ FinTech Corp',
    program: 'ICT Training Hub Alumna',
    review: 'The structured Next.js curriculum and the continuous guidance during the capstone project completely changed my trajectory. I landed my software engineering job two weeks after graduation!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'David Jenkins',
    role: 'UI Designer & Web Intern',
    program: 'Graduate Internship Prep Graduate',
    review: 'Working alongside senior developers on real production clients during my Deloxe internship gave me more portfolio material than years of self-study. The mentorship is top-notch.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Elena Rostova',
    role: 'Signed High-Fashion Model',
    program: 'Model Debut Program Alumna',
    review: 'From runway posture classes to personal branding coaching and high-end test shoots, Model Debut gave me the portfolio and agency connections that helped me debut in Paris Fashion Week.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  },
];

export default function TalentHome() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="relative overflow-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 bg-charleston text-white overflow-hidden">
        {/* Abstract Tech/Creative Background Visuals */}
        <div className="absolute inset-0 z-0 opacity-15">
          <Image 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
            alt="Workspace Collaboration"
            fill
            className="object-cover object-center grayscale contrast-125"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charleston via-charleston/90 to-charleston" />
        </div>

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-caribbean/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-lemon/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 pt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-caribbean/10 border border-caribbean/20 rounded-full px-4.5 py-1.5 mb-8 text-xs font-bold text-caribbean tracking-wider uppercase font-mono shadow-sm"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>Empowering High-Potential Talents</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight leading-[1.1] mb-8"
          >
            Discover, Develop, and <br />
            <span className="text-gradient">Showcase Your Talent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-sans"
          >
            Join industry-focused programs designed to equip you with practical skills, real-world experience, mentorship, and career opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4.5"
          >
            <Link
              href="#programs"
              className="w-full sm:w-auto bg-caribbean hover:bg-lemon text-charleston px-8 py-4.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_15px_30px_rgba(0,204,136,0.15)] group"
            >
              <span>Explore Programs</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/talent/apply"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 px-8 py-4.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Apply Now</span>
              <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. PROGRAM CATEGORIES SECTION */}
      <section id="programs" className="py-28 px-6 bg-white relative scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
              Core Pathways
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-charleston mb-6">
              Our Professional Programs
            </h2>
            <div className="h-1.5 w-24 bg-caribbean rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {programs.map((prog, idx) => {
              const IconComp = prog.icon;
              return (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="rounded-[32px] bg-soft-grey border border-gray-150 p-8 md:p-10 flex flex-col justify-between hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl opacity-10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div>
                    {/* Header Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-charleston text-white flex items-center justify-center mb-8 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <IconComp size={24} className={prog.iconColor} />
                    </div>

                    <h3 className={`text-2xl font-display font-black text-charleston ${prog.subtitle ? 'mb-1' : 'mb-4'}`}>
                      {prog.title}
                    </h3>
                    {prog.subtitle && (
                      <p className="text-xs font-bold text-gray-500 mb-4 font-sans uppercase tracking-wider">
                        {prog.subtitle}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed mb-8 font-sans">
                      {prog.desc}
                    </p>

                    <div className="h-[1px] bg-gray-200 w-full mb-8" />

                    <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-5 font-mono">
                      Features Included:
                    </h4>
                    <ul className="space-y-4 mb-10">
                      {prog.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-caribbean/15 text-caribbean flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={11} />
                          </div>
                          <span className="text-sm font-sans text-gray-700 font-medium">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={prog.href}
                    className="w-full bg-charleston text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-caribbean hover:text-charleston transition-all duration-300 shadow-md mt-auto"
                  >
                    <span>Learn More</span>
                    <ChevronRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-28 px-6 bg-charleston text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-radial-gradient from-caribbean/5 to-transparent opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
                The Deloxe Advantage
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-sans">
                We combine industry expertise with cutting-edge learning modules, active workspace internships, and global certifications to form a premier launching pad for creative and tech professionals.
              </p>
              <div className="h-1.5 w-20 bg-caribbean rounded-full" />
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseUs.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors relative group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-caribbean/15 text-caribbean flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <IconComp size={20} />
                    </div>
                    <h3 className="text-lg font-display font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="py-20 px-6 bg-caribbean text-charleston relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-display font-black mb-3 select-none">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-charleston/70 font-mono">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-28 px-6 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
              Success Highlights
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-charleston mb-6">
              What Our Students Say
            </h2>
            <div className="h-1.5 w-24 bg-caribbean rounded-full mx-auto" />
          </div>

          <div className="relative bg-soft-grey border border-gray-150 rounded-[32px] p-8 md:p-14 shadow-md overflow-hidden min-h-[340px] flex flex-col justify-between">
            <div className="absolute top-8 right-8 text-caribbean/10 pointer-events-none">
              <Quote size={120} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex gap-1.5 mb-6 text-lemon bg-charleston/5 w-fit px-3 py-1 rounded-full border border-charleston/5">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                    ))}
                  </div>
                  
                  <p className="text-base sm:text-lg text-charleston leading-relaxed mb-8 italic font-sans font-medium">
                    &ldquo;{testimonials[activeTestimonial].review}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-display font-bold text-charleston text-sm leading-tight">
                      {testimonials[activeTestimonial].name}
                    </h4>
                    <p className="text-xs text-caribbean font-bold font-sans">
                      {testimonials[activeTestimonial].role}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">
                      {testimonials[activeTestimonial].program}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Pagination Controls */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx ? 'bg-caribbean w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
