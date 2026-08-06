'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowUpRight, Star, Quote, Award, Heart, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const filters = [
  { id: 'all', label: 'All Pathways' },
  { id: 'tech', label: 'Tech & Engineering' },
  { id: 'creative', label: 'Creative & UI/UX' },
  { id: 'model', label: 'Modeling & Runway' },
];

const successStories = [
  {
    id: 'story-1',
    name: 'Sarah Adebayo',
    category: 'tech',
    program: 'ICT Hub Alumna',
    track: 'Web Development (React & Next.js)',
    placedAt: 'FinTech Corp',
    role: 'Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    background: 'Sarah was self-studying basic HTML for months but felt stuck building cohesive apps. She joined our 12-week Next.js Web Development syllabus.',
    leap: 'During her capstone project, Sarah built a secure transaction pipeline under the supervision of Deloxe engineering mentors. She was recommended directly to FinTech Corp during graduation week.',
    quote: 'The direct feedback from developers who manage enterprise databases is something no static tutorial can offer. I transitioned into a full-stack engineer role in weeks!',
  },
  {
    id: 'story-2',
    name: 'David Jenkins',
    category: 'creative',
    program: 'NEXTGEN Alumnus',
    track: 'UI/UX Design & Frontend Hub',
    placedAt: 'Apex Digital Agency',
    role: 'Lead UI Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    background: 'An industrial design graduate, David struggled to transition into software design, lacking deep wireframing portfolio examples.',
    leap: 'David completed a 6-month Deloxe internship where he designed active mobile applications and responsive portals for global logistics enterprises.',
    quote: 'My portfolio went from simple mockups to client-validated interactive systems. When Apex digital saw my case studies, they skipped the test assignments and made an offer.',
  },
  {
    id: 'story-3',
    name: 'Elena Rostova',
    category: 'model',
    program: 'Model debut Alumna',
    track: 'Haute Couture Runway & Branding',
    placedAt: 'Milan & Paris Castings',
    role: 'Professional Runway Model',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    background: 'Elena had a passionate dream of fashion but lacked modeling exposure, posing techniques, and high-quality portfolio images.',
    leap: 'Through Runway Training and test shoots with elite fashion photographers in our Model debut program, she created a high-concept composite portfolio card.',
    quote: 'The Deloxe showcase runaway was attended by international scouts. I was scouted on-site and debuted on runways in Milan within the same calendar year!',
  },
  {
    id: 'story-4',
    name: 'Marcus Chen',
    category: 'tech',
    program: 'ICT Hub Alumnus',
    track: 'Software Programming (Python & Algorithms)',
    placedAt: 'CloudScale Services',
    role: 'Backend Services Developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    background: 'Coming from a traditional civil engineering background, Marcus wanted to transition into data systems and software algorithms.',
    leap: 'Marcus excelled in our 16-week software engineering track, mastering complex data pipelines, SQL optimizations, and automated system scripts.',
    quote: 'The coding challenges and strict logic drills matched the actual technical interviews. It built my backend reasoning, landing my career change at CloudScale.',
  },
  {
    id: 'story-5',
    name: 'Sophia Vance',
    category: 'creative',
    program: 'Internship Alumna',
    track: 'Digital Marketing & Growth Campaigns',
    placedAt: 'Deloxe Corporate Partners',
    role: 'Senior Growth Specialist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    background: 'Sophia completed basic marketing classes but lacked experience managing actual budget allocations or metrics-driven acquisition plans.',
    leap: 'Sophia took over ad allocation, analytics tracking, and content audits for active client pipelines during her 6-month internship term.',
    quote: 'Handling real budgets and measuring customer conversions gave me true commercial confidence. I was hired by our client team immediately upon program completion!',
  },
];

export default function SuccessStories() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredStories = activeFilter === 'all'
    ? successStories
    : successStories.filter((story) => story.category === activeFilter);

  return (
    <div className="bg-soft-grey text-charleston font-sans">
      
      {/* HERO SECTION */}
      <section className="bg-charleston text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-caribbean rounded-full blur-[140px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-caribbean/10 border border-caribbean/20 rounded-full px-4 py-1.5 mb-6 text-xs font-bold text-caribbean tracking-wider uppercase font-mono shadow-sm"
          >
            <Award size={12} className="animate-pulse" />
            <span>Graduate Achievements</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-black tracking-tight mb-6"
          >
            Student <span className="text-gradient">Success Stories</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Explore how our graduates leveraged our syllabus training and active internships to scale their careers.
          </motion.p>
        </div>
      </section>

      {/* GRADUATE DIRECTORY SECTION */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeFilter === f.id
                    ? 'bg-charleston text-white border-charleston shadow-sm'
                    : 'bg-soft-grey border-gray-150 text-charleston hover:border-caribbean/25'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Stories Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story) => (
                <motion.div
                  layout
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-soft-grey border border-gray-150 p-8 md:p-10 rounded-[32px] flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-caribbean/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div>
                    {/* Alum Profile Card */}
                    <div className="flex items-center gap-4 border-b border-gray-200 pb-6 mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="font-display font-black text-charleston text-base sm:text-lg leading-tight">
                          {story.name}
                        </h3>
                        <p className="text-caribbean text-xs font-bold font-sans mt-0.5">
                          {story.role} @ <span className="text-charleston font-black">{story.placedAt}</span>
                        </p>
                        <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-1 block">
                          {story.program} &bull; {story.track}
                        </span>
                      </div>
                    </div>

                    {/* Background vs Leap Case details */}
                    <div className="space-y-4 font-sans mb-8">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 block font-mono">
                          Where they started:
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-1">
                          {story.background}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 block font-mono">
                          Their Career Leap:
                        </h4>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-semibold mt-1">
                          {story.leap}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pull-quote block */}
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl relative pt-8 mt-4">
                    <Quote size={28} className="text-caribbean/10 absolute top-4 left-4 pointer-events-none" />
                    <p className="text-charleston text-xs leading-relaxed italic font-medium font-sans relative z-10">
                      &ldquo;{story.quote}&rdquo;
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* APPLICATION DIRECT CTA */}
          <div className="mt-24 text-center">
            <span className="text-xs text-gray-400 block mb-4 font-sans">
              Ready to write your own career-accelerator success story?
            </span>
            <Link 
              href="/talent/apply"
              className="inline-flex items-center gap-3 bg-charleston text-white hover:bg-caribbean hover:text-charleston px-10 py-5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl group font-sans"
            >
              <span>Apply & Enroll Today</span>
              <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
