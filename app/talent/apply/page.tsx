'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Code, Camera, Sparkles, Send, CheckCircle2, AlertCircle, 
  ArrowLeft, ArrowRight, User, Mail, Phone, Globe, Edit3, Clock
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';

// Program data configuration
const programsConfig = {
  internship: {
    title: 'NEXTGEN',
    subtitle: 'Graduate internship prep',
    icon: Briefcase,
    color: 'text-caribbean border-caribbean/20 bg-caribbean/5',
    tracks: [
      'Software Development',
      'Web Development',
      'Graphic Design',
      'Data Analysis',
      'Digital Marketing',
      'UI/UX Design',
    ],
    durations: ['3 Months', '6 Months', '12 Months'],
  },
  ict: {
    title: 'ICT Hub',
    subtitle: '',
    icon: Code,
    color: 'text-lemon border-lemon/20 bg-lemon/5',
    tracks: [
      'Web Development (React/Next.js)',
      'Software Programming (Python/Java)',
      'Data Analysis (SQL/Tableau)',
      'Graphic Design (Photoshop/Illustrator)',
      'UI/UX Design (Figma Wireframing)',
    ],
    durations: ['8 Weeks', '10 Weeks', '12 Weeks', '16 Weeks'],
  },
  model: {
    title: 'Model debut',
    subtitle: '',
    icon: Camera,
    color: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    tracks: [
      'High-Fashion Runway Track',
      'Commercial Portfolio Track',
      'Print & Editorial Posing',
      'Influencer & Personal Branding',
    ],
    durations: ['12 Weeks Core Track'],
  },
};

type ProgramKey = 'internship' | 'ict' | 'model';

function ApplyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial values from URL query params
  const initialProgram = (searchParams.get('program') as ProgramKey) || 'internship';
  const initialTrack = searchParams.get('track') || '';

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: initialProgram as ProgramKey,
    track: '',
    duration: '',
    portfolio: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);

  // Monitor Auth State to pre-populate name & email if logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          name: currentUser.displayName || prev.name,
          email: currentUser.email || prev.email,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Update track and duration options when program selection changes
  useEffect(() => {
    const currentProg = programsConfig[formData.program];
    if (currentProg) {
      setFormData((prev) => ({
        ...prev,
        track: initialTrack && currentProg.tracks.includes(initialTrack) ? initialTrack : currentProg.tracks[0],
        duration: currentProg.durations[0],
      }));
    }
  }, [formData.program, initialTrack]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProgramSelect = (progKey: ProgramKey) => {
    setFormData((prev) => ({ ...prev, program: progKey }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.bio) {
      setError('Please fill in all the required fields.');
      setLoading(false);
      return;
    }

    try {
      // Save Application to Firestore
      const docRef = await addDoc(collection(db, 'talent_applications'), {
        userId: user ? user.uid : 'anonymous',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        programTitle: programsConfig[formData.program].title,
        track: formData.track,
        duration: formData.duration,
        portfolio: formData.portfolio || 'N/A',
        bio: formData.bio,
        status: 'pending', // default status
        currentLesson: 0, // dynamic LMS progress tracking
        completedLessons: [], // dynamic LMS progress tracking
        createdAt: serverTimestamp(),
      });

      setAppId(docRef.id);
      setSuccess(true);
    } catch (err: any) {
      console.error('Submission Error: ', err);
      setError(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="apply-form-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <div className="bg-white border border-gray-150 rounded-[32px] p-8 md:p-12 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-caribbean/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="mb-10 text-center md:text-left">
                <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-3 block">
                  Application Gate
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-black text-charleston mb-3">
                  Submit Your Application
                </h2>
                <p className="text-gray-500 text-sm max-w-xl font-sans leading-relaxed">
                  Provide your details and pathway selection below. Once submitted, your profile and portfolio are instantly logged and queued for review.
                </p>
              </div>

              {/* Error Callout */}
              {error && (
                <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs sm:text-sm font-semibold flex items-center gap-3">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 font-sans">
                {/* 1. Program Category Selection */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-3 font-mono">
                    1. Select Program Pathway
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.keys(programsConfig) as ProgramKey[]).map((key) => {
                      const config = programsConfig[key];
                      const Icon = config.icon;
                      const isSelected = formData.program === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleProgramSelect(key)}
                          className={`p-6 rounded-2xl border text-left flex items-start gap-4 transition-all focus:outline-none ${
                            isSelected 
                              ? `bg-charleston text-white border-charleston shadow-md` 
                              : `bg-soft-grey border-gray-150 text-charleston hover:border-caribbean/35`
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-caribbean text-charleston' : 'bg-white text-charleston border border-gray-100'
                          }`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm font-display mb-0.5">{config.title}</h4>
                            {config.subtitle && (
                              <p className={`text-[11px] font-medium leading-tight mb-1.5 transition-colors ${
                                isSelected ? 'text-gray-300' : 'text-gray-500'
                              }`}>
                                {config.subtitle}
                              </p>
                            )}
                            <span className={`text-[9px] font-bold block ${isSelected ? 'text-caribbean' : 'text-gray-400'}`}>
                              {config.tracks.length} Specialized tracks
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Personal Information */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-4 font-mono">
                    2. Personal Details
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-400">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name *"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-soft-grey border border-gray-150 rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold focus:outline-none focus:border-caribbean focus:bg-white transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-400">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-soft-grey border border-gray-150 rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold focus:outline-none focus:border-caribbean focus:bg-white transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number *"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-soft-grey border border-gray-150 rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold focus:outline-none focus:border-caribbean focus:bg-white transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Track and Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2 font-mono">
                      Specialized Program Track *
                    </label>
                    <select
                      name="track"
                      value={formData.track}
                      onChange={handleChange}
                      className="w-full bg-soft-grey border border-gray-150 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-caribbean focus:bg-white transition-all cursor-pointer"
                    >
                      {programsConfig[formData.program].tracks.map((track) => (
                        <option key={track} value={track}>{track}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2 font-mono">
                      Preferred Duration Option
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full bg-soft-grey border border-gray-150 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-caribbean focus:bg-white transition-all cursor-pointer"
                    >
                      {programsConfig[formData.program].durations.map((dur) => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Portfolio / Social handles */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2 font-mono">
                    Portfolio Website, Github, or Social Link (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400">
                      <Globe size={16} />
                    </span>
                    <input
                      type="url"
                      name="portfolio"
                      placeholder="https://yourportfolio.com or instagram.com/username"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full bg-soft-grey border border-gray-150 rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold focus:outline-none focus:border-caribbean focus:bg-white transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* 5. Cover Bio / Pitch */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2 font-mono">
                    Personal Statement / Ambition Bio *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-4.5 text-gray-400">
                      <Edit3 size={16} />
                    </span>
                    <textarea
                      name="bio"
                      placeholder="Tell us about yourself, why you want to join this program, and what you expect to achieve..."
                      required
                      rows={5}
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full bg-soft-grey border border-gray-150 rounded-xl pl-11 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-caribbean focus:bg-white transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400 max-w-sm text-center sm:text-left leading-relaxed">
                    {!user && (
                      <span className="text-caribbean font-bold">Tip: </span>
                    )}
                    {!user ? 'Logging in with Google first is recommended to automatically sync tracking to your Student Dashboard, but anonymous applications are fully accepted!' : 'You are logged in. This application will link automatically to your Student Dashboard.'}
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-charleston text-white hover:bg-caribbean hover:text-charleston px-10 py-4.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="apply-success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-gray-150 rounded-[32px] p-10 md:p-16 text-center shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-caribbean rounded-full blur-3xl" />
            </div>

            <div className="w-16 h-16 bg-caribbean/15 text-caribbean rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-3 block">
              Application Logged Successfully
            </span>
            <h2 className="text-3xl font-display font-black text-charleston mb-4">
              Thank you, {formData.name}!
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed mb-10 font-sans">
              Your application for the <strong className="text-charleston font-bold">{programsConfig[formData.program].title}{programsConfig[formData.program].subtitle ? ` (${programsConfig[formData.program].subtitle})` : ''} ({formData.track})</strong> has been logged to our Admissions collection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/talent"
                className="w-full sm:w-auto bg-caribbean hover:bg-charleston hover:text-white text-charleston px-8 py-4.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Return to Talent Hub</span>
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => setSuccess(false)}
                className="w-full sm:w-auto bg-soft-grey hover:bg-gray-200 text-charleston px-8 py-4.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
              >
                Submit another application
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ApplicationPortal() {
  return (
    <div className="py-16 px-6 bg-soft-grey min-h-[80vh]">
      <Suspense fallback={
        <div className="max-w-4xl mx-auto text-center py-20 bg-white border border-gray-150 rounded-[32px] shadow-md">
          <div className="w-10 h-10 border-4 border-caribbean border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-sans">Loading application gate parameters...</p>
        </div>
      }>
        <ApplyFormContent />
      </Suspense>
    </div>
  );
}
