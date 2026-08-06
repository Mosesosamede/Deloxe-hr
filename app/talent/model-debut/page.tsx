'use client';

import { motion } from 'motion/react';
import { 
  Camera, Star, Sparkles, Image as ImageIcon, Users, Layout, ArrowRight,
  ShieldCheck, Smile, HelpCircle, UserCheck, Eye, Video, Globe
} from 'lucide-react';
import Link from 'next/link';

const trainingModules = [
  {
    icon: Star,
    title: 'Runway Training',
    desc: 'Master the art of posture, alignment, poise, and distinct walks designed for high fashion and pret-a-porter showcases.',
  },
  {
    icon: Camera,
    title: 'Photoshoot Techniques',
    desc: 'Understand camera angles, facial lighting adjustments, shadows, speed poses, and continuous focus loops with commercial directors.',
  },
  {
    icon: Smile,
    title: 'Posing Mastery',
    desc: 'Develop an expansive library of natural, editorial, catalog, and haute couture stances that highlight brand aesthetics with fluid style.',
  },
  {
    icon: Globe,
    title: 'Fashion Industry Basics',
    desc: 'Gain knowledge of contract terms, agency relations, call-times, casting setups, fashion week dynamics, and professional model ethics.',
  },
  {
    icon: UserCheck,
    title: 'Personal Branding',
    desc: 'Build a unique industry niche, design digital composite cards, formulate portfolio statements, and project a cohesive image.',
  },
  {
    icon: Video,
    title: 'Social Media Presence',
    desc: 'Curate a highly engaging Instagram and TikTok profile to catch international casting leads, talent agencies, and direct bookings.',
  },
];

const benefits = [
  {
    title: 'Professional Portfolio',
    desc: 'Graduate with fully edited high-end lookbook, catalog, and editorial test-shoot photos from leading fashion photographers.',
  },
  {
    title: 'Agency Readiness',
    desc: 'Equip yourself with composite cards, digital submissions, video introductions, and resume profiles designed to attract elite agencies.',
  },
  {
    title: 'Industry Exposure',
    desc: 'Get your portfolio shared directly with vetted modeling agency boards, fashion scouts, and commercial casting directors.',
  },
  {
    title: 'Personal Brand Development',
    desc: 'Define your style, digital voice, niche modeling categorization (high-fashion, commercial, fitness, print), and professional character.',
  },
  {
    title: 'Talent Showcase Events',
    desc: 'Participate in live Deloxe Talent Showcase runaways attended by agency leads, magazine editors, designers, and influencers.',
  },
];

export default function ModelDebutProgram() {
  return (
    <div className="bg-soft-grey text-charleston font-sans">
      
      {/* HERO SECTION */}
      <section className="bg-charleston text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10 pt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6 text-xs font-bold text-purple-300 tracking-wider uppercase font-mono shadow-sm"
          >
            <Sparkles size={11} />
            <span>Creative Creative Pathways</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-display font-black tracking-tight mb-6"
          >
            Model <span className="text-purple-400">Debut Program</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Transform your potential into a professional modeling career.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/talent/apply?program=model"
              className="inline-flex items-center gap-2 bg-purple-500 text-white hover:bg-caribbean hover:text-charleston px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg group border border-purple-400/20"
            >
              <span>Apply Now</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PROGRAM OVERVIEW */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-black uppercase tracking-widest text-purple-500 font-mono mb-4 block">
                Professional Coaching
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black text-charleston mb-6">
                Program Overview
              </h2>
              <div className="h-1 bg-purple-500 w-16 mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
                The Model Debut Program is an immersive, high-intensity development course designed specifically for aspiring models looking to enter the professional global fashion landscape. We provide structured training spanning physical runway techniques up to commercial and agency branding.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed font-sans">
                Our board of trainers includes active runway coaches, commercial fashion directors, agency scouts, and professional branding stylists. Every participant is mentored to unlock their physical poise, posture, signature walk, and photogenic confidence.
              </p>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800" 
                  alt="High Fashion Walkway"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute bottom-8 left-8 right-8 bg-charleston/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 z-20">
                  <span className="text-purple-400 text-[10px] font-black uppercase tracking-widest font-mono block mb-1">
                    LIVE PHOTOSHOOTS & RUNWAYS
                  </span>
                  <p className="text-white text-xs leading-relaxed font-medium">
                    Work with elite makeup artists, professional stylists, and award-winning cameras to build a world-class portfolio in under 12 weeks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAINING MODULES INCLUDED */}
      <section className="py-24 px-6 bg-soft-grey border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-purple-500 font-mono mb-4 block">
              Curriculum Map
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-charleston mb-6">
              Our Professional Training Includes
            </h2>
            <div className="h-1 bg-purple-500 w-16 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainingModules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div key={mod.title} className="bg-white p-8 rounded-3xl border border-gray-150 flex flex-col gap-5 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-charleston mb-2">{mod.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">{mod.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROGRAM BENEFITS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 relative order-last lg:order-first">
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800" 
                  alt="Model Portfolio Shooting"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-6 right-6 bg-purple-500 text-white font-mono text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full z-20">
                  Elite Agency Scout Certified
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <span className="text-xs font-black uppercase tracking-widest text-purple-500 font-mono mb-4 block">
                Career Assets
              </span>
              <h2 className="text-3xl font-display font-black text-charleston mb-6">
                Program Participant Benefits
              </h2>
              <div className="h-1 bg-purple-500 w-16 mb-8" />

              <div className="space-y-6">
                {benefits.map((ben, idx) => (
                  <div key={ben.title} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs font-mono">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-charleston mb-1">{ben.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed font-sans">{ben.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* APPLICATION TRIGGER CTA */}
          <div className="mt-24 text-center">
            <Link 
              href="/talent/apply?program=model"
              className="inline-flex items-center gap-3 bg-charleston text-white hover:bg-purple-500 transition-all duration-300 px-10 py-5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xl group font-sans border border-transparent hover:border-purple-400/20"
            >
              <span>Apply Now</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
