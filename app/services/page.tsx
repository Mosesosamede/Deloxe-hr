'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Lock, FileText, Shield, Zap, Users, ChevronLeft, ChevronRight, Laptop, Camera, Loader2, Coins, Sliders } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

import Image from 'next/image';

const b2bServices = [
  {
    id: 'flexiforce',
    title: 'FlexiForce',
    tagline: 'On-Demand HR Excellence',
    desc: 'Perfect for startups and SMEs needing high-level HR expertise without the full-time overhead.',
    features: ['Payroll Management', 'Compliance Audits', 'Employee Onboarding', 'Performance Reviews'],
    color: 'bg-charleston',
  },
  {
    id: 'remotely',
    title: 'Remotely',
    tagline: 'Global Talent, Local Ease',
    desc: 'Manage your distributed workforce with confidence. We handle the complexities of global employment.',
    features: ['Global Payroll', 'International Compliance', 'Remote Benefits', 'Cultural Integration'],
    color: 'bg-caribbean',
  },
  {
    id: 'resourcing',
    title: 'Resourcing',
    tagline: 'Strategic Talent Acquisition',
    desc: 'Finding the right fit is an art. We combine data-driven vetting with human intuition.',
    features: ['Executive Search', 'Volume Hiring', 'Technical Vetting', 'Employer Branding'],
    color: 'bg-charleston',
  },
  {
    id: 'documate',
    title: 'DocuMate',
    tagline: 'Your Digital HR Vault',
    desc: 'Access a library of legally-vetted HR documents, policies, and templates instantly.',
    features: ['Custom Handbooks', 'Employment Contracts', 'Safety Policies', 'Template Library'],
    color: 'bg-caribbean',
  },
];

const individualCards = [
  {
    icon: Zap,
    title: 'NEXTGEN',
    subtitle: 'Graduate internship prep',
    desc: 'Designed to bridge the gap between academic environments and target career trajectories.',
    featuresLabel: 'We support fresh graduates by:',
    features: [
      'Preparing them for internship roles',
      'Providing career readiness training',
      'Matching them with suitable companies',
    ],
    buttonText: 'Get Prepared',
  },
  {
    icon: Laptop,
    title: 'ICT Hub',
    desc: 'Master in-demand digital and technology skills through structured training programs.',
    featuresLabel: 'Features Included:',
    features: [
      'Web Development',
      'Software Programming',
      'Data Analysis',
      'Graphic Design',
      'UI/UX Design',
      'Digital Marketing',
    ],
    buttonText: 'Learn More',
  },
  {
    icon: Camera,
    title: 'Model debut',
    desc: 'Launch your modeling career through professional coaching, portfolio creation, and industry exposure.',
    featuresLabel: 'Features Included:',
    features: [
      'Photoshoots',
      'Runway Training',
      'Personal Branding',
      'Talent Showcase',
      'Industry Networking',
    ],
    buttonText: 'Learn More',
  },
];

export default function Services() {
  const docs = [
    { name: 'Employee Handbook', type: 'PDF' },
    { name: 'Remote Work Policy', type: 'DOCX' },
    { name: 'NDA Template', type: 'DOCX' },
    { name: 'Performance Review', type: 'XLSX' },
    { name: 'Code of Conduct', type: 'PDF' },
    { name: 'Onboarding Checklist', type: 'PDF' },
    { name: 'Safety Manual', type: 'PDF' },
    { name: 'Exit Interview Form', type: 'DOCX' },
  ];

  const extendedDocs = [...docs, ...docs, ...docs];

  const [isDesktop, setIsDesktop] = useState(false);

  // Dynamic pricing estimator states for Internship Management
  const [internSalary, setInternSalary] = useState(1000);
  const [internCount, setInternCount] = useState(3);
  const [salaryCurrency, setSalaryCurrency] = useState<'USD' | 'NGN'>('USD');
  
  // Interactive internship recruitment form states
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [selectedRecruitmentModel, setSelectedRecruitmentModel] = useState<'Managed' | 'One-Off'>('Managed');
  const [internFormFields, setInternFormFields] = useState({
    companyName: '',
    contactName: '',
    emailAddress: '',
    phoneNumber: '',
    internsCount: '3',
    estimatedSalary: '1000',
    additionalNotes: '',
  });
  const [internFormLoading, setInternFormLoading] = useState(false);
  const [internFormSuccess, setInternFormSuccess] = useState(false);
  const [internFormError, setInternFormError] = useState<string | null>(null);

  const formatInternPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salaryCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleOpenInquiry = (model: 'Managed' | 'One-Off') => {
    setSelectedRecruitmentModel(model);
    setInternFormFields({
      companyName: '',
      contactName: '',
      emailAddress: '',
      phoneNumber: '',
      internsCount: String(internCount),
      estimatedSalary: String(internSalary),
      additionalNotes: '',
    });
    setInternFormSuccess(false);
    setInternFormError(null);
    setIsInternshipModalOpen(true);
  };

  const handleInternshipInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternFormLoading(true);
    setInternFormError(null);

    if (!internFormFields.companyName.trim() || !internFormFields.contactName.trim() || !internFormFields.emailAddress.trim() || !internFormFields.phoneNumber.trim()) {
      setInternFormError('Please fill in all required fields.');
      setInternFormLoading(false);
      return;
    }

    if (!internFormFields.emailAddress.includes('@')) {
      setInternFormError('Please enter a valid work email address.');
      setInternFormLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'internship_inquiries'), {
        companyName: internFormFields.companyName,
        contactName: internFormFields.contactName,
        email: internFormFields.emailAddress,
        phone: internFormFields.phoneNumber,
        selectedModel: selectedRecruitmentModel,
        internsCount: Number(internFormFields.internsCount) || internCount,
        estimatedSalary: Number(internFormFields.estimatedSalary) || internSalary,
        currency: salaryCurrency,
        additionalNotes: internFormFields.additionalNotes,
        createdAt: Date.now(),
        status: 'Pending Review'
      });

      setInternFormSuccess(true);
    } catch (err: any) {
      console.error("Error saving internship inquiry:", err);
      setInternFormError(`Failed to save inquiry: ${err.message || err}`);
    } finally {
      setInternFormLoading(false);
    }
  };
  const [activeIndex, setActiveIndex] = useState(8);
  const [isResetting, setIsResetting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (activeIndex >= 16) {
      const timer = setTimeout(() => {
        setIsResetting(true);
        setActiveIndex(activeIndex - 8);
      }, 600);
      return () => clearTimeout(timer);
    } else if (activeIndex < 8) {
      const timer = setTimeout(() => {
        setIsResetting(true);
        setActiveIndex(activeIndex + 8);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (isResetting) {
      const timer = setTimeout(() => {
        setIsResetting(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isResetting]);

  useEffect(() => {
    if (prefersReducedMotion || isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isHovered, prefersReducedMotion]);

  // Swipe & Touch Gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const activeDot = (activeIndex - 8 + 8) % 8;

  return (
    <SmoothScroll>
      <main className="bg-soft-grey min-h-screen">
        <Navbar isDark={true} />
        
        {/* Header */}
        <section className="pt-40 pb-20 px-6 bg-charleston text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-caribbean rounded-full blur-[150px]" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-bold mb-8"
            >
              Our <span className="text-caribbean">Solutions</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Comprehensive HR strategies designed for the modern era of work.
            </motion.p>
          </div>
        </section>

        {/* Internship Management for Companies Section */}
        <section id="internships" className="py-24 px-6 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <span className="bg-caribbean/13 text-caribbean px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-6 shadow-sm">
                  Strategic Talent Solutions
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-charleston mb-6">
                  Internship Management for Companies
                </h2>
                <div className="h-2 w-24 bg-caribbean rounded-full mb-8" />
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Tap into vibrant pools of fresh perspective without adding operational complexity or overhead. Deloxe HR manages your internship programs end-to-end.
                </p>
                <button 
                  id="btn-scroll-to-pricing"
                  onClick={() => document.getElementById('internship-pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-charleston text-white px-8 py-4 rounded-xl font-bold hover:bg-caribbean hover:text-charleston transition-all flex items-center gap-2 shadow-md font-sans cursor-pointer"
                >
                  <span>Build Program</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-soft-grey p-8 md:p-12 rounded-[32px] border border-gray-150 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-caribbean/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="w-14 h-14 bg-charleston text-caribbean rounded-2xl flex items-center justify-center mb-8">
                    <Users size={24} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-charleston mb-6">
                    How We Empower Your Organization
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-4 block">
                    Our Program Inclusions:
                  </span>
                  <ul className="space-y-4 mb-2">
                    {[
                      'Source qualified interns tailored to your industry and business needs',
                      'Manage internship programs end-to-end including compliance and contracts',
                      'Handle onboarding, continuous supervision, administrative overhead, and evaluations'
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-3.5 text-charleston font-medium text-sm leading-normal">
                        <div className="w-5 h-5 rounded-full bg-caribbean/15 flex items-center justify-center text-caribbean flex-shrink-0 mt-0.5">
                          <Check size={12} />
                        </div>
                        <span className="font-sans text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Internship Pricing Section */}
            <div id="internship-pricing" className="mt-24 pt-20 border-t border-gray-150 scroll-mt-24">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="bg-caribbean/13 text-caribbean px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-6 shadow-sm">
                  Corporate Recruitment Pricing
                </span>
                <h3 className="text-3xl md:text-5xl font-display font-bold text-charleston mb-6">
                  Flexible Recruiting Models
                </h3>
                <div className="h-2 w-24 bg-caribbean rounded-full mb-8 mx-auto" />
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our pricing models are clean and dynamic, featuring two distinct corporate recruitment paths designed to match your specific workforce volume and management needs.
                </p>
              </div>

              {/* Interactive Budget Estimator Component */}
              <div className="max-w-4xl mx-auto bg-soft-grey p-6 md:p-10 rounded-[32px] border border-gray-150 shadow-md mb-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-charleston text-caribbean flex items-center justify-center animate-pulse">
                      <Sliders size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-charleston">Interactive Fee Estimator</h4>
                      <p className="text-xs text-gray-500 font-sans">Slide to match your recruitment target & salary scale</p>
                    </div>
                  </div>
                  
                  {/* Currency Picker Toggle */}
                  <div className="flex bg-white p-1 rounded-xl border border-gray-100 self-start md:self-auto shadow-sm">
                    <button
                      id="currency-usd"
                      type="button"
                      onClick={() => {
                        setSalaryCurrency('USD');
                        setInternSalary(1000);
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        salaryCurrency === 'USD'
                          ? 'bg-charleston text-white'
                          : 'text-gray-500 hover:text-charleston'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      id="currency-ngn"
                      type="button"
                      onClick={() => {
                        setSalaryCurrency('NGN');
                        setInternSalary(500000);
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        salaryCurrency === 'NGN'
                          ? 'bg-charleston text-white'
                          : 'text-gray-500 hover:text-charleston'
                      }`}
                    >
                      NGN (₦)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                  {/* Sliders */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider font-sans">
                          Expected Number of Interns:
                        </label>
                        <span className="text-base font-bold text-charleston px-3 py-1 bg-white rounded-lg border border-gray-100 shadow-sm font-sans">
                          {internCount} {internCount === 1 ? 'Intern' : 'Interns'}
                        </span>
                      </div>
                      <input
                        id="intern-count-slider"
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={internCount}
                        onChange={(e) => setInternCount(Number(e.target.value))}
                        className="w-full accent-caribbean bg-gray-200 h-2 rounded-lg cursor-pointer appearance-none"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1 font-sans">
                        <span>1 Intern</span>
                        <span>15 Interns</span>
                        <span>30 Interns</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider font-sans">
                          Estimated Monthly Salary / Intern:
                        </label>
                        <span className="text-base font-bold text-charleston px-3 py-1 bg-white rounded-lg border border-gray-100 shadow-sm font-sans">
                          {formatInternPrice(internSalary)}/mo
                        </span>
                      </div>
                      <input
                        id="intern-salary-slider"
                        type="range"
                        min={salaryCurrency === 'USD' ? 200 : 100000}
                        max={salaryCurrency === 'USD' ? 5000 : 2000000}
                        step={salaryCurrency === 'USD' ? 100 : 50000}
                        value={internSalary}
                        onChange={(e) => setInternSalary(Number(e.target.value))}
                        className="w-full accent-caribbean bg-gray-200 h-2 rounded-lg cursor-pointer appearance-none"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1 font-sans">
                        <span>{formatInternPrice(salaryCurrency === 'USD' ? 200 : 100000)}</span>
                        <span>{formatInternPrice(salaryCurrency === 'USD' ? 2500 : 1000000)}</span>
                        <span>{formatInternPrice(salaryCurrency === 'USD' ? 5000 : 2000000)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Summary Cards inside the estimator */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-3 font-sans">Estimates Summary ({salaryCurrency})</span>
                      <div className="space-y-3 font-sans">
                        <div className="flex justify-between text-xs font-semibold text-gray-500 font-sans">
                          <span>Total Monthly Salary Pool:</span>
                          <span className="text-charleston font-bold">{formatInternPrice(internSalary * internCount)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-gray-500 font-sans">
                          <span>Total Annual Salary Gross:</span>
                          <span className="text-charleston font-bold">{formatInternPrice(internSalary * 12 * internCount)}</span>
                        </div>
                        <div className="border-t border-dashed border-gray-100 pt-3 flex justify-between text-xs font-semibold text-gray-500 font-sans">
                          <span>Managed Setup Fee (8% annual):</span>
                          <span className="text-caribbean font-bold">{formatInternPrice(0.08 * internSalary * 12 * internCount)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-gray-400 font-medium leading-relaxed font-sans">
                      *These estimates are dynamic guidelines. Use the recruitment option cards below to secure formal contract provisioning.
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruitment Model Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                {/* Model Card 1: Managed Internship Program */}
                <motion.div
                  id="card-managed-program"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-150 shadow-lg relative flex flex-col justify-between overflow-hidden group hover:border-caribbean transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-caribbean/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="bg-caribbean/13 text-caribbean px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm font-sans">
                        Managed Model
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Best For:</span>
                    </div>

                    <h4 className="text-2xl font-display font-black text-charleston mb-2">Managed Internship Program</h4>
                    <p className="text-gray-500 text-xs font-semibold mb-6 leading-relaxed font-sans min-h-[36px]">
                      Companies wanting end-to-end management, training, and ongoing HR support for their interns.
                    </p>

                    <div className="border-t border-b border-gray-100 py-6 mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 font-sans">Pricing Display</span>
                      <p className="text-sm font-bold text-charleston font-sans leading-relaxed">
                        35% / month of the intern’s monthly salary + 8% One-off Setup Fee (of annual gross salary).
                      </p>
                      
                      {/* Dynamic Managed Estimate */}
                      <div className="mt-4 p-3 bg-soft-grey rounded-xl border border-gray-50 space-y-2.5 font-sans">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-medium">Monthly Program Fee ({internCount} {internCount === 1 ? 'intern' : 'interns'}):</span>
                          <span className="font-bold text-charleston">{formatInternPrice(0.35 * internSalary * internCount)}<span className="text-[10px] font-semibold text-gray-400">/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-medium">One-off Setup Fee:</span>
                          <span className="font-bold text-charleston">{formatInternPrice(0.08 * internSalary * 12 * internCount)}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block font-sans">Features Included:</span>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Sourcing & Readiness Training',
                        'Pre-vetting & Matching',
                        'Full-cycle ongoing management throughout the internship duration',
                        'Performance tracking & HR support',
                      ].map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-charleston font-medium text-xs leading-normal">
                          <div className="w-5 h-5 rounded-full bg-caribbean/13 flex items-center justify-center text-caribbean flex-shrink-0 mt-0.5">
                            <Check size={11} />
                          </div>
                          <span className="font-sans text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id="btn-managed-program"
                    onClick={() => handleOpenInquiry('Managed')}
                    className="w-full py-4 bg-charleston text-white rounded-2xl font-bold text-sm hover:bg-caribbean hover:text-charleston transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm font-sans"
                  >
                    <span className="font-sans">Get Started Now</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>

                {/* Model Card 2: One-Off Internship Recruitment */}
                <motion.div
                  id="card-oneoff-recruitment"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-150 shadow-lg relative flex flex-col justify-between overflow-hidden group hover:border-caribbean transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-caribbean/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="bg-caribbean/13 text-caribbean px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm font-sans">
                        Placement Model
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-sans">Best For:</span>
                    </div>

                    <h4 className="text-2xl font-display font-black text-charleston mb-2">One-Off Internship Recruitment</h4>
                    <p className="text-gray-500 text-xs font-semibold mb-6 leading-relaxed font-sans min-h-[36px]">
                      Companies looking exclusively for talent sourcing without ongoing management.
                    </p>

                    <div className="border-t border-b border-gray-100 py-6 mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 font-sans">Pricing Display</span>
                      <p className="text-sm font-bold text-charleston font-sans leading-relaxed">
                        8% – 15% of annual gross salary (Subject to workforce volume).
                      </p>
                      
                      {/* Dynamic One-Off Estimate */}
                      <div className="mt-4 p-3 bg-soft-grey rounded-xl border border-gray-50 space-y-2.5 font-sans">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-medium">Estimated Sourcing Fee ({internCount} {internCount === 1 ? 'intern' : 'interns'}):</span>
                          <span className="font-bold text-caribbean">8% - 15%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-medium">Total Placement Fee Range:</span>
                          <span className="font-bold text-charleston">
                            {formatInternPrice(0.08 * internSalary * 12 * internCount)} - {formatInternPrice(0.15 * internSalary * 12 * internCount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block font-sans">Features Included:</span>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Custom talent sourcing and screening',
                        'Workplace readiness preparation before deployment',
                        'Direct placement/handover to your in-house HR team',
                      ].map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-charleston font-medium text-xs leading-normal">
                          <div className="w-5 h-5 rounded-full bg-caribbean/13 flex items-center justify-center text-caribbean flex-shrink-0 mt-0.5">
                            <Check size={11} />
                          </div>
                          <span className="font-sans text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id="btn-oneoff-recruitment"
                    onClick={() => handleOpenInquiry('One-Off')}
                    className="w-full py-4 bg-charleston text-white rounded-2xl font-bold text-sm hover:bg-caribbean hover:text-charleston transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm font-sans"
                  >
                    <span className="font-sans">Request a Quote / Contact Sales</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* B2B Detailed Breakdown */}
        <section id="organizations" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">

            <div className="space-y-32">
              {b2bServices.map((service, idx) => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
                >
                  <div className="flex-1">
                    <div className={`inline-block px-4 py-2 rounded-lg ${service.color} text-white text-xs font-bold uppercase tracking-widest mb-6`}>
                      {service.tagline}
                    </div>
                    <h3 className="text-4xl font-display font-bold text-charleston mb-6">{service.title}</h3>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {service.desc}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                      {service.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-charleston font-medium">
                          <div className="w-6 h-6 rounded-full bg-caribbean/20 flex items-center justify-center text-caribbean">
                            <Check size={14} />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href={`/pricing?plan=${service.id}`}
                      className="inline-flex items-center gap-3 bg-charleston text-white px-8 py-4 rounded-full font-bold hover:bg-lemon hover:text-charleston transition-all shadow-lg"
                    >
                      <span>Get Started with {service.title}</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className="flex-1 relative">
                    <div className="aspect-video rounded-[32px] overflow-hidden shadow-2xl">
                      <Image 
                        src={`https://images.unsplash.com/photo-${idx === 0 ? '1486312338219-ce68d2c6f44d' : idx === 1 ? '1552664730-d307ca884978' : idx === 2 ? '1573496359142-b8d87734a5a2' : '1586281380349-632531db7ed4'}?auto=format&fit=crop&q=80`} 
                        alt={service.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DocuMate Repository Preview */}
        <section className="py-24 px-6 bg-charleston text-white overflow-hidden">
          <div className="max-w-7xl mx-auto relative group">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">DocuMate Repository</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Instant access to premium HR documentation. Legally vetted and ready to deploy.
              </p>
            </div>

            {/* Carousel Container */}
            <div 
              className="relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-lemon/50 rounded-2xl"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                className="flex mx-[-12px]"
                animate={{ x: `-${activeIndex * (100 / (isDesktop ? 3 : 2))}%` }}
                transition={{
                  duration: isResetting ? 0 : 0.6,
                  ease: 'easeInOut',
                }}
                style={{
                  width: `${(extendedDocs.length * (100 / (isDesktop ? 3 : 2)))}%`,
                }}
              >
                {extendedDocs.map((doc, i) => (
                  <div 
                    key={i} 
                    className="shrink-0 px-3"
                    style={{
                      width: `${100 / extendedDocs.length}%`,
                    }}
                  >
                    <div className="group/card p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-lemon/50 transition-all relative overflow-hidden h-48 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <FileText className="text-caribbean" size={24} />
                          <Lock className="text-gray-600 group-hover/card:text-lemon transition-colors" size={16} />
                        </div>
                        <h4 className="font-bold mb-1">{doc.name}</h4>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{doc.type}</span>
                      
                      <div className="absolute inset-0 bg-charleston/60 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-lemon text-charleston px-4 py-2 rounded-lg text-xs font-bold shadow-lg">Unlock Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Navigation Arrows */}
              <button 
                onClick={handlePrev}
                aria-label="Previous slide"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-lemon hover:text-charleston text-white p-3 rounded-full shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex items-center justify-center z-10"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                aria-label="Next slide"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-lemon hover:text-charleston text-white p-3 rounded-full shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex items-center justify-center z-10"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {docs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (isResetting) return;
                    setActiveIndex(8 + i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeDot === i ? 'bg-lemon w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Custom Internship Inquiry Modal */}
        <AnimatePresence>
          {isInternshipModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsInternshipModalOpen(false)}
                className="absolute inset-0 bg-charleston/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative w-full max-w-2xl bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh]"
              >
                {internFormSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-caribbean/15 rounded-full flex items-center justify-center mx-auto mb-6 text-caribbean">
                      <Check size={36} />
                    </div>
                    <h2 className="text-3xl font-display font-black text-charleston mb-3">Inquiry Submitted!</h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-8 font-sans">
                      Thank you for your interest in our {selectedRecruitmentModel === 'Managed' ? 'Managed Internship Program' : 'One-Off Internship Recruitment'}. Our corporate programs team will contact you within 24 hours with a customized proposal and agreement draft.
                    </p>
                    <button
                      id="btn-close-success"
                      onClick={() => setIsInternshipModalOpen(false)}
                      className="bg-charleston text-white font-bold py-4 px-8 rounded-xl hover:scale-[1.02] transition-all cursor-pointer font-sans"
                    >
                      Return to Solutions
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-charleston mb-2">Corporate Program Setup</h2>
                    <p className="text-gray-500 text-xs md:text-sm mb-6 font-sans">
                      Establish your organization&apos;s custom intern requirements to initiate matching and onboarding setups.
                    </p>

                    {/* Snapshot of chosen parameters */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-soft-grey border border-gray-100 mb-6 font-sans">
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-0.5 font-sans">Selected Path</span>
                        <span className="text-xs font-bold text-charleston font-sans">
                          {selectedRecruitmentModel === 'Managed' ? 'Managed Program' : 'One-Off Placement'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-0.5 font-sans">Volume & Target</span>
                        <span className="text-xs font-bold text-charleston font-sans">
                          {internCount} {internCount === 1 ? 'Intern' : 'Interns'} @ {formatInternPrice(internSalary)}/mo
                        </span>
                      </div>
                      <div className="col-span-2 border-t border-gray-150 pt-2 mt-1">
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-0.5 font-sans">Expected Budget Base</span>
                        <span className="text-xs font-bold text-caribbean font-sans">
                          {selectedRecruitmentModel === 'Managed' 
                            ? `Monthly Managed Fee: ${formatInternPrice(0.35 * internSalary * internCount)} (Setup: ${formatInternPrice(0.08 * internSalary * 12 * internCount)})`
                            : `Estimated Fee (8% - 15%): ${formatInternPrice(0.08 * internSalary * 12 * internCount)} - ${formatInternPrice(0.15 * internSalary * 12 * internCount)} one-off`}
                        </span>
                      </div>
                    </div>

                    {internFormError && (
                      <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100 mb-6 font-sans">
                        {internFormError}
                      </div>
                    )}

                    <form className="space-y-4" onSubmit={handleInternshipInquirySubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Company Name <span className="text-red-500 font-sans">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={internFormFields.companyName}
                            onChange={(e) => setInternFormFields((prev) => ({ ...prev, companyName: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                            placeholder="Acme Corp"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Contact Name <span className="text-red-500 font-sans">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={internFormFields.contactName}
                            onChange={(e) => setInternFormFields((prev) => ({ ...prev, contactName: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Work Email <span className="text-red-500 font-sans">*</span>
                          </label>
                          <input
                            required
                            type="email"
                            value={internFormFields.emailAddress}
                            onChange={(e) => setInternFormFields((prev) => ({ ...prev, emailAddress: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                            placeholder="hr@company.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Phone Number <span className="text-red-500 font-sans">*</span>
                          </label>
                          <input
                            required
                            type="tel"
                            value={internFormFields.phoneNumber}
                            onChange={(e) => setInternFormFields((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Number of Interns
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={internFormFields.internsCount}
                            onChange={(e) => setInternFormFields((prev) => ({ ...prev, internsCount: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                            Estimated Monthly Salary ({salaryCurrency})
                          </label>
                          <input
                            type="number"
                            value={internFormFields.estimatedSalary}
                            onChange={(e) => setInternFormFields((prev) => ({ ...prev, estimatedSalary: e.target.value }))}
                            className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 tracking-wider font-sans">
                          Sourcing Specialties or Requirements
                        </label>
                        <textarea
                          rows={3}
                          value={internFormFields.additionalNotes}
                          onChange={(e) => setInternFormFields((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                          className="w-full bg-soft-grey border border-transparent rounded-xl px-4 py-3 text-sm text-charleston font-semibold focus:bg-white focus:border-caribbean outline-none transition-all resize-none font-sans"
                          placeholder="e.g. Frontend developers with React expertise, model debuts, full-time remote in Lagos..."
                        />
                      </div>

                      <div className="flex flex-col md:flex-row gap-3 pt-4">
                        <button
                          id="btn-modal-cancel"
                          type="button"
                          onClick={() => setIsInternshipModalOpen(false)}
                          className="w-full md:w-1/3 border border-gray-200 text-charleston font-bold py-4 rounded-xl hover:bg-soft-grey transition-all cursor-pointer font-sans"
                        >
                          Cancel
                        </button>
                        <button
                          id="btn-modal-submit"
                          type="submit"
                          disabled={internFormLoading}
                          className="w-full md:w-2/3 bg-caribbean text-charleston font-bold py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                        >
                          {internFormLoading ? (
                            <>
                              <Loader2 className="animate-spin" size={18} />
                              <span className="font-sans">Saving Inquiry...</span>
                            </>
                          ) : (
                            <>
                              <span className="font-sans">Submit Inquiry Setup</span>
                              <ArrowRight size={18} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Footer />
      </main>
    </SmoothScroll>
  );
}
