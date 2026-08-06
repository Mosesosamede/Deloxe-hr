'use client';

import { motion } from 'motion/react';
import { 
  Briefcase, CheckCircle2, Users, GraduationCap, Target, ArrowRight,
  Star, Award
} from 'lucide-react';
import Link from 'next/link';

const audiences = [
  { icon: GraduationCap, title: 'Students', desc: 'Seeking university-mandated credit, practical industrial training (IT), or real-world practice.' },
  { icon: Users, title: 'Graduates', desc: 'Fresh out of school looking to bridge the transition gap into professional development and placement.' },
  { icon: Target, title: 'Career Changers', desc: 'Transitioning from non-technical environments into fast-scaling digital and technology pathways.' },
  { icon: Briefcase, title: 'Entry-Level Professionals', desc: 'Looking to acquire high-impact live project experience to solidify and upscale their skills.' },
];

export default function InternshipProgram() {
  return (
    <div className="bg-soft-grey text-charleston font-sans">
      
      {/* HERO SECTION */}
      <section className="bg-charleston text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-caribbean rounded-full blur-[140px]" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10 pt-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-display font-black tracking-tight mb-2"
          >
            Deloxe <span className="text-caribbean">NEXTGEN</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-400 font-mono mb-6 block"
          >
            Graduate internship prep
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Designed to bridge the gap between academic environments and target career trajectories.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="https://ecosystem.deloxehr.com"
              className="inline-flex items-center gap-2 bg-caribbean hover:bg-lemon text-charleston px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg group"
            >
              <span>Apply Now</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PROGRAM OVERVIEW & TARGET AUDIENCE */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
            <div className="lg:col-span-5">
              <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
                Structured Growth
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black text-charleston mb-6">
                Program Overview
              </h2>
              <div className="h-1 bg-caribbean w-16 mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                Designed to bridge the gap between academic environments and target career trajectories.
              </p>
              <div className="mt-8">
                <h4 className="text-sm font-bold text-charleston font-display mb-4">We support fresh graduates by:</h4>
                <ul className="space-y-3">
                  {[
                    'Preparing them for internship roles',
                    'Providing career readiness training',
                    'Matching them with suitable companies'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-caribbean/15 text-caribbean flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={13} />
                      </div>
                      <span className="text-gray-600 text-xs font-medium font-sans">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {audiences.map((aud, idx) => {
                const Icon = aud.icon;
                return (
                  <div key={aud.title} className="p-8 rounded-3xl bg-soft-grey border border-gray-150 flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-charleston text-caribbean flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-lg font-display font-bold text-charleston">{aud.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">{aud.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM STRUCTURE */}
      <section className="py-24 px-6 bg-soft-grey border-t border-gray-150">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
              Program Details
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-charleston mb-6">
              Program Structure
            </h2>
            <div className="h-1 bg-caribbean w-16 mx-auto mb-6" />
            <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed font-medium">
              Our Internship Program is divided into two structured phases to ensure every participant is fully prepared before entering the workplace.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phase 1 Card */}
            <div className="bg-white border border-gray-150 p-8 md:p-10 rounded-[32px] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-caribbean/10 to-transparent opacity-20 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-caribbean block font-mono mb-2">Phase 1 (1 Month)</span>
                <h3 className="text-xl md:text-2xl font-display font-black text-charleston mb-4 leading-tight">
                  Career Readiness & Workplace Preparatory Training
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-6 font-sans">
                  This intensive one-month training prepares participants for professional internship environments.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block font-mono mb-3">Training includes:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Professional Communication',
                        'Workplace Ethics',
                        'CV & Resume Development',
                        'LinkedIn Profile Optimization',
                        'Interview Preparation',
                        'Personal Branding',
                        'Team Collaboration',
                        'Time Management',
                        'Career Planning',
                        'Professional Confidence',
                        'Company Expectations & Workplace Culture'
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-caribbean/15 text-caribbean flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={11} />
                          </div>
                          <span className="text-gray-600 text-xs font-semibold font-sans">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-6">
                <p className="text-charleston text-xs leading-relaxed font-bold font-sans">
                  Upon successful completion of this phase, participants become eligible for internship placement.
                </p>
              </div>
            </div>

            {/* Phase 2 Card */}
            <div className="bg-charleston text-white p-8 md:p-10 rounded-[32px] border border-white/10 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-caribbean/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-caribbean block font-mono mb-2">Phase 2 (12 Months)</span>
                <h3 className="text-xl md:text-2xl font-display font-black text-white mb-4 leading-tight">
                  Internship Placement
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-6 font-sans">
                  Participants are matched with suitable organizations to gain practical industry experience.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block font-mono mb-3">During the internship, participants will:</span>
                    <div className="space-y-3">
                      {[
                        'Apply the skills learned during the preparatory training',
                        'Work within professional teams',
                        'Gain real workplace experience',
                        'Develop industry exposure',
                        'Build professional networks',
                        'Receive ongoing guidance and support throughout the internship period'
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-caribbean/20 text-caribbean flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 size={11} />
                          </div>
                          <span className="text-gray-300 text-xs font-semibold font-sans">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6">
                <p className="text-caribbean text-xs leading-relaxed font-bold font-sans">
                  Gain critical hands-on exposure and support throughout the workspace journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM TIMELINE */}
      <section className="py-24 px-6 bg-white border-b border-gray-150">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
            Program Timeline
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-charleston mb-6">
            Program Timeline
          </h2>
          <div className="h-1 bg-caribbean w-16 mx-auto mb-16" />

          <div className="flex flex-col items-center">
            {/* Month 1 */}
            <div className="bg-soft-grey border border-gray-200 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-caribbean block font-mono mb-1">Month 1</span>
              <h4 className="text-base font-bold text-charleston font-display">
                Career Readiness & Workplace Preparatory Training
              </h4>
            </div>

            {/* Connector */}
            <div className="py-4 flex flex-col items-center">
              <div className="w-0.5 h-10 bg-gray-300" />
              <div className="text-caribbean my-1">
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
              <div className="w-0.5 h-10 bg-gray-300" />
            </div>

            {/* Months 2-13 */}
            <div className="bg-charleston text-white rounded-2xl p-6 md:p-8 w-full max-w-lg border border-white/5 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-caribbean block font-mono mb-1">Months 2–13</span>
              <h4 className="text-base font-bold text-white font-display">
                12-Month Professional Internship Placement
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 px-6 bg-soft-grey text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-black text-charleston mb-4">
            Ready to begin your professional journey?
          </h2>
          <p className="text-gray-500 text-xs mb-8 leading-relaxed font-sans">
            Apply now to join the next cohort of Deloxe NEXTGEN.
          </p>
          <Link 
            href="https://ecosystem.deloxehr.com"
            className="inline-flex items-center gap-3 bg-caribbean hover:bg-lemon text-charleston hover:scale-[1.02] active:scale-[0.98] px-10 py-5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl group font-sans"
          >
            <span>Submit Application</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  );
}
