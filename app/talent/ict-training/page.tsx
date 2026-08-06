'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Laptop, Code, BarChart, Palette, Compass, ArrowRight, Play, Users, 
  FileText, CheckSquare, Award, ExternalLink, Download, Share2, ShieldCheck, Check
} from 'lucide-react';
import Link from 'next/link';

const programs = [
  {
    icon: Code,
    title: 'Web Development',
    duration: '12 Weeks',
    curriculum: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'APIs', 'Databases'],
    desc: 'Master the arts of creating stunning frontends and fully functioning database-driven web services.',
    bg: 'from-blue-500/10 to-indigo-500/10',
    border: 'hover:border-blue-500/30',
    accent: 'text-blue-400',
  },
  {
    icon: Laptop,
    title: 'Software Programming',
    duration: '16 Weeks',
    curriculum: ['Python', 'Java', 'C#', 'Data Structures', 'Algorithms', 'Software Engineering'],
    desc: 'Dive deep into logic programming, application engines, software lifecycle, and optimized system architectures.',
    bg: 'from-emerald-500/10 to-teal-500/10',
    border: 'hover:border-emerald-500/30',
    accent: 'text-caribbean',
  },
  {
    icon: BarChart,
    title: 'Data Analysis',
    duration: '10 Weeks',
    curriculum: ['Excel', 'SQL', 'Power BI', 'Tableau', 'Python Data Analysis'],
    desc: 'Unearth stories within raw information. Formulate reports, build metrics dashboards, and predict commercial outcomes.',
    bg: 'from-amber-500/10 to-orange-500/10',
    border: 'hover:border-amber-500/30',
    accent: 'text-amber-400',
  },
  {
    icon: Palette,
    title: 'Graphic Design',
    duration: '8 Weeks',
    curriculum: ['Photoshop', 'Illustrator', 'Branding', 'Social Media Design', 'Print Design'],
    desc: 'Sculpt visual assets and campaign branding elements that communicate with professional clarity and visual charm.',
    bg: 'from-pink-500/10 to-rose-500/10',
    border: 'hover:border-pink-500/30',
    accent: 'text-pink-400',
  },
  {
    icon: Compass,
    title: 'UI/UX Design',
    duration: '10 Weeks',
    curriculum: ['User Research', 'Wireframing', 'Figma', 'Prototyping', 'Design Systems'],
    desc: 'Map user journeys, wireframe elegant digital assets, and assemble scalable layouts and interactive animations in Figma.',
    bg: 'from-purple-500/10 to-violet-500/10',
    border: 'hover:border-purple-500/30',
    accent: 'text-purple-400',
  },
];

const learningFeatures = [
  { icon: Play, title: 'Video Lessons', desc: 'Sleek, high-production pre-recorded modules accessible at any time.' },
  { icon: Users, title: 'Live Classes', desc: 'Weekly interactive sessions and debugging Q&A led by corporate engineers.' },
  { icon: FileText, title: 'Assignments', desc: 'Hands-on practical tests matching modern software sprint scopes.' },
  { icon: CheckSquare, title: 'Assessments', desc: 'Automated quizzes and comprehensive reviews evaluating your metrics.' },
  { icon: Award, title: 'Projects', desc: 'Solve actual customer-scale code briefs to include directly in your portfolio.' },
  { icon: ShieldCheck, title: 'Certificates', desc: 'Receive digitally verifiable, secure milestones accepted globally.' },
];

export default function IctTrainingHub() {
  const [certName, setCertName] = useState('Alexander Mercer');
  const [certProgram, setCertProgram] = useState('Web Development');
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const triggerDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Your PDF Certificate has been compiled and downloaded!');
    }, 1500);
  };

  const triggerShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-soft-grey text-charleston font-sans">
      
      {/* HERO SECTION */}
      <section className="bg-charleston text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-lemon rounded-full blur-[140px]" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10 pt-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-display font-black tracking-tight mb-6"
          >
            ICT <span className="text-caribbean">Training Hub</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Learn high-demand technology skills designed for modern careers.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/talent/apply?program=ict"
              className="inline-flex items-center gap-2 bg-caribbean hover:bg-lemon text-charleston px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg group"
            >
              <span>Enroll Now</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TRAINING PROGRAMS GRID */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
              Syllabus & Calendars
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-charleston mb-6">
              Our Professional Hub Programs
            </h2>
            <div className="h-1 bg-caribbean w-16 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog, idx) => {
              const Icon = prog.icon;
              return (
                <div 
                  key={prog.title} 
                  className={`bg-soft-grey border border-gray-150 p-8 rounded-[32px] flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${prog.border}`}
                >
                  <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${prog.bg} opacity-25 rounded-full blur-xl`} />
                  
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-12 h-12 rounded-xl bg-charleston text-white flex items-center justify-center">
                        <Icon size={20} className={prog.accent} />
                      </div>
                      <span className="bg-charleston/10 text-charleston px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider font-mono">
                        {prog.duration} Schedule
                      </span>
                    </div>

                    <h3 className="text-2xl font-display font-black text-charleston mb-3">{prog.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6 font-sans">{prog.desc}</p>
                    
                    <div className="h-[1px] bg-gray-200 w-full mb-6" />

                    <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-4 block font-mono">
                      Curriculum Path:
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {prog.curriculum.map((item) => (
                        <span key={item} className="bg-white border border-gray-100 text-charleston px-2.5 py-1 rounded-md text-[10px] font-bold font-sans">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/talent/apply?program=ict&track=${encodeURIComponent(prog.title)}`}
                    className="w-full bg-charleston text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-caribbean hover:text-charleston transition-all duration-300"
                  >
                    <span>Enroll In Course</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEARNING FEATURES */}
      <section className="py-24 px-6 bg-soft-grey border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
              Modern LMS Experience
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-charleston mb-6">
              Our Professional Training Features
            </h2>
            <div className="h-1 bg-caribbean w-16 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="bg-white p-8 rounded-3xl border border-gray-150 flex gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-caribbean/15 text-caribbean flex items-center justify-center flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-charleston mb-2">{feat.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CERTIFICATION PREVIEW & SANDBOX (INTERACTIVE) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-4 block">
              Digital Credentials
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-charleston mb-6">
              Your Professional Certification
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Receive highly secured digital certificates for global access to any company. Fully verified, downloadable, and shareable.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Control Form */}
            <div className="lg:col-span-5 bg-soft-grey p-8 rounded-[32px] border border-gray-150 flex flex-col gap-6">
              <h3 className="text-xl font-display font-black text-charleston leading-none mb-2">
                Certificate Sandbox
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed font-sans">
                Customize your name and syllabus track to see how your verified digital achievement will load for recruiters and clients on your profile.
              </p>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2 font-mono">
                  Recipient Name
                </label>
                <input 
                  type="text" 
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-caribbean transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2 font-mono">
                  Syllabus Track
                </label>
                <select 
                  value={certProgram}
                  onChange={(e) => setCertProgram(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-caribbean transition-colors cursor-pointer"
                >
                  {programs.map((p) => (
                    <option key={p.title} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={triggerDownload}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 bg-charleston hover:bg-caribbean hover:text-charleston text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Download size={13} />
                  <span>{downloading ? 'Compiling...' : 'PDF Download'}</span>
                </button>
                <button 
                  onClick={triggerShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-white/50 border border-gray-200 text-charleston py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Share2 size={13} />
                  <span>{copiedLink ? 'Copied!' : 'LinkedIn Share'}</span>
                </button>
              </div>
            </div>

            {/* Live Certificate Visualizer */}
            <div className="lg:col-span-7">
              <motion.div 
                layout
                className="bg-charleston text-white rounded-[32px] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
              >
                {/* Visual Borders & Watermarks */}
                <div className="absolute inset-4 border border-caribbean/20 rounded-[20px] pointer-events-none" />
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-caribbean/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header */}
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-caribbean text-charleston rounded-lg flex items-center justify-center font-bold text-sm">
                      T
                    </div>
                    <div>
                      <h4 className="font-display font-black text-xs tracking-tight">DELOXE TALENT</h4>
                      <span className="text-[8px] text-caribbean font-mono tracking-widest leading-none block">ACADEMY</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-caribbean/13 text-caribbean border border-caribbean/20 rounded-full px-3 py-1">
                    <ShieldCheck size={12} />
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono">Verified Credential</span>
                  </div>
                </div>

                {/* Body */}
                <div className="text-center mb-10 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-mono mb-4">
                    CERTIFICATE OF ACHIEVEMENT
                  </p>
                  
                  <span className="text-[10px] text-gray-500 font-sans italic block mb-3">
                    This is proudly presented and verified to
                  </span>
                  
                  <motion.h3 
                    layoutId="certNameText"
                    className="text-2xl sm:text-3xl font-display font-black text-gradient mb-4"
                  >
                    {certName || 'Alexander Mercer'}
                  </motion.h3>

                  <p className="text-gray-400 text-xs leading-relaxed max-w-md mx-auto font-sans">
                    for successfully demonstrating mastery and completing the intensive training syllabus of the <strong className="text-white font-bold">{certProgram} Program</strong> conducted under the supervision of the Deloxe ICT Hub board.
                  </p>
                </div>

                {/* Footer Signature */}
                <div className="flex justify-between items-end border-t border-white/5 pt-6 relative z-10">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 block font-mono">DATE ISSUED</span>
                    <span className="text-xs font-bold text-gray-300 font-sans mt-0.5 block">July 7, 2026</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 block font-mono">CREDENTIAL ID</span>
                    <span className="text-xs font-bold text-caribbean font-mono mt-0.5 block">DLX-ICT-884-902-A</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
