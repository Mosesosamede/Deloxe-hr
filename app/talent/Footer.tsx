'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, GraduationCap, Github, Linkedin, Twitter, Globe } from 'lucide-react';

export default function TalentFooter() {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { name: 'Home Hub', href: '/talent' },
    { name: 'NEXTGEN', href: '/talent/internship' },
    { name: 'ICT Hub', href: '/talent/ict-training' },
    { name: 'Model debut', href: '/talent/model-debut' },
  ];

  const studentLinks = [
    { name: 'Application Portal', href: '/talent/apply' },
    { name: 'Success Stories', href: '/talent/success-stories' },
    { name: 'Platform FAQs', href: '/talent/faq' },
  ];

  return (
    <footer className="bg-charleston text-white border-t border-white/5 pt-20 pb-10 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-caribbean/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-lemon/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/talent" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-caribbean rounded-xl flex items-center justify-center font-bold text-charleston text-xl">
                  T
                </div>
                <div>
                  <h4 className="font-display font-black text-lg tracking-tight leading-none">DELOXE TALENT</h4>
                  <span className="text-[10px] text-caribbean font-mono tracking-widest block mt-1">
                    DEVELOPING THE NEXT GENERATION
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed font-sans">
                A premium, industry-aligned training and workspace platform dedicated to sourcing, nurturing, and placing digital, tech, and creative talents globally.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-gray-500">
              <a href="#" className="hover:text-caribbean transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-caribbean transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-caribbean transition-colors"><Github size={18} /></a>
            </div>
          </div>

          {/* Quick Links Group 1 */}
          <div className="lg:col-span-3 lg:col-start-6">
            <h5 className="text-xs font-black uppercase tracking-wider text-caribbean mb-6 font-mono">
              PROGRAM TRACKS
            </h5>
            <ul className="space-y-4">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1 group font-sans"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-caribbean" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Group 2 */}
          <div className="lg:col-span-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-caribbean mb-6 font-mono">
              STUDENT PORTAL
            </h5>
            <ul className="space-y-4">
              {studentLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1 group font-sans"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-caribbean" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500 font-sans">
            &copy; {currentYear} Deloxe HR Talent Platform. All rights reserved. Registered LMS & Career Center.
          </p>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-caribbean hover:text-lemon transition-colors group font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-caribbean/30"
          >
            <Globe size={14} />
            <span>RETURN TO CORPORATE MAIN SITE</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
