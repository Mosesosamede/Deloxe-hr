'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, LogIn, Award, CheckCircle, ShieldCheck, Download, 
  Share2, Plus, Trash2, ExternalLink, Briefcase, Code, Camera, BookOpen,
  ArrowRight, FileCheck, Check, Clock, UserCheck, Play, ListTodo
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Demo datasets
const demoApplications = [
  {
    id: 'demo-app-1',
    programTitle: 'ICT Hub',
    track: 'Web Development (React/Next.js)',
    duration: '12 Weeks',
    status: 'accepted',
    createdAt: new Date(),
  }
];

const demoLessons = [
  { id: 'l1', title: 'HTML5 & CSS3 Semantics & Layouts', duration: '2 hours' },
  { id: 'l2', title: 'JavaScript Essentials, ES6 & Event Handling', duration: '3 hours' },
  { id: 'l3', title: 'React Hooks, State Management & Event Handling', duration: '4 hours' },
  { id: 'l4', title: 'Next.js App Router, SSR, Server Actions & APIs', duration: '5 hours' },
  { id: 'l5', title: 'Database Integration, Firestore & Tailwind Styling', duration: '4 hours' },
  { id: 'l6', title: 'Capstone Web Deployment & Optimization', duration: '6 hours' },
];

const demoPortfolios = [
  {
    id: 'demo-port-1',
    title: 'Acme E-Commerce Platform',
    desc: 'A full-stack Next.js and Firebase store featuring dynamic listings, real-time checkout, and secure Stripe payment integration.',
    link: 'https://acme-ecommerce.dev',
    category: 'Web Development',
  },
  {
    id: 'demo-port-2',
    title: 'Brand Identity Redesign',
    desc: 'A comprehensive branding system and style guide complete with corporate logos, vectors, and typography variables.',
    link: 'https://behance.net/branding-redesign',
    category: 'Graphic Design',
  }
];

export default function StudentDashboard() {
  redirect('/talent');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(false);

  // Firestore & local states
  const [applications, setApplications] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>(demoLessons);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['l1', 'l2']);
  
  // New Portfolio Form States
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortLink, setNewPortLink] = useState('');
  const [newPortCategory, setNewPortCategory] = useState('Web Development');
  const [dbLoading, setDbLoading] = useState(false);

  // Auth monitoring
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setUseDemo(false);
        fetchUserData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error: ', error);
    }
  };

  const fetchUserData = async (uid: string) => {
    setDbLoading(true);
    try {
      // 1. Fetch Applications
      const appsRef = collection(db, 'talent_applications');
      const qApps = query(appsRef, where('userId', '==', uid));
      const snapshotApps = await getDocs(qApps);
      const appsList = snapshotApps.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setApplications(appsList);

      // 2. Fetch Portfolios
      const portRef = collection(db, 'talent_portfolios');
      const qPorts = query(portRef, where('userId', '==', uid));
      const snapshotPorts = await getDocs(qPorts);
      const portsList = snapshotPorts.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPortfolios(portsList);
    } catch (error) {
      console.error('Error fetching dashboard database records: ', error);
    } finally {
      setDbLoading(false);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle || !newPortDesc) return;

    const newItem = {
      title: newPortTitle,
      desc: newPortDesc,
      link: newPortLink || '#',
      category: newPortCategory,
    };

    if (user && !useDemo) {
      try {
        setDbLoading(true);
        const docRef = await addDoc(collection(db, 'talent_portfolios'), {
          userId: user.uid,
          ...newItem,
          createdAt: serverTimestamp(),
        });
        setPortfolios((prev) => [...prev, { id: docRef.id, ...newItem }]);
      } catch (error) {
        console.error('Error adding portfolio item: ', error);
      } finally {
        setDbLoading(false);
      }
    } else {
      // Demo mode appending
      setPortfolios((prev) => [
        ...prev,
        { id: `demo-port-${Date.now()}`, ...newItem },
      ]);
    }

    // Reset inputs
    setNewPortTitle('');
    setNewPortDesc('');
    setNewPortLink('');
  };

  const handleDeletePortfolio = async (portId: string) => {
    if (user && !useDemo) {
      try {
        setDbLoading(true);
        await deleteDoc(doc(db, 'talent_portfolios', portId));
        setPortfolios((prev) => prev.filter((p) => p.id !== portId));
      } catch (error) {
        console.error('Error deleting portfolio record: ', error);
      } finally {
        setDbLoading(false);
      }
    } else {
      // Demo mode deleting
      setPortfolios((prev) => prev.filter((p) => p.id !== portId));
    }
  };

  const toggleLesson = (id: string) => {
    if (completedLessonIds.includes(id)) {
      setCompletedLessonIds((prev) => prev.filter((item) => item !== id));
    } else {
      setCompletedLessonIds((prev) => [...prev, id]);
    }
  };

  // Calculations
  const activeApps = useDemo ? demoApplications : applications;
  const activePorts = useDemo ? portfolios : (user ? portfolios : []);
  const progressPercent = Math.round((completedLessonIds.length / lessons.length) * 100);
  const isEnrolled = activeApps.some((app) => app.status === 'accepted');

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-soft-grey">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-caribbean border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-sans">Connecting to Deloxe Talent Services...</p>
        </div>
      </div>
    );
  }

  // Render Locked State if NOT Logged-In and NOT Demo
  if (!user && !useDemo) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-soft-grey px-6 py-20">
        <div className="max-w-xl w-full bg-white border border-gray-150 rounded-[32px] p-8 md:p-14 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-caribbean/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-16 h-16 bg-charleston text-caribbean rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md">
            <LayoutDashboard size={28} />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-caribbean font-mono mb-3 block">
            Student Gateway
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black text-charleston mb-4">
            Student Dashboard Locked
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 font-sans max-w-sm mx-auto">
            Log in with Google to persistent-track your submitted applications, build your custom portfolio, manage lessons, and print certified digital achievements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleSignIn}
              className="w-full sm:w-auto bg-caribbean hover:bg-charleston hover:text-white text-charleston px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn size={14} />
              <span>Sign In with Google</span>
            </button>
            
            <button
              onClick={() => {
                setUseDemo(true);
                setPortfolios(demoPortfolios);
              }}
              className="w-full sm:w-auto bg-soft-grey hover:bg-gray-200 text-charleston px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
            >
              Try Demo Mode (Instant)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-soft-grey min-h-screen py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-charleston text-white p-8 rounded-[32px] mb-12 border border-white/5 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-caribbean/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 text-center md:text-left">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt={user.displayName || 'Student'}
                className="w-16 h-16 rounded-full border border-caribbean/30 object-cover hidden sm:block shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 bg-caribbean/10 border border-caribbean/30 text-caribbean rounded-full flex items-center justify-center font-bold text-2xl hidden sm:flex">
                S
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight">
                  Welcome back, {user?.displayName ? user.displayName.split(' ')[0] : 'Talent Student'}!
                </h1>
                {useDemo && (
                  <span className="bg-lemon text-charleston text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full font-mono">
                    Demo Mode Active
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-1.5 font-sans">
                Manage your active career paths, track lessons, and structure your showcase portfolio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 md:mt-0 relative z-10 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center min-w-32">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block font-mono">Syllabus Progress</span>
              <span className="text-xl font-bold text-caribbean mt-0.5 block">{progressPercent}%</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center min-w-32">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block font-mono">Portfolio Items</span>
              <span className="text-xl font-bold text-lemon mt-0.5 block">{activePorts.length} Added</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER: Applications & Portfolio Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. APPLICATION TRACKER */}
            <div className="bg-white border border-gray-150 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-lg font-display font-black text-charleston mb-6 flex items-center gap-2">
                <Briefcase size={18} className="text-caribbean" />
                <span>My Submitted Applications</span>
              </h2>

              {activeApps.length === 0 ? (
                <div className="text-center py-10 bg-soft-grey rounded-2xl border border-gray-150">
                  <FileCheck size={32} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-xs font-sans">No submitted applications found.</p>
                  <Link
                    href="/talent/apply"
                    className="inline-flex items-center gap-1 text-caribbean text-xs font-bold mt-2 hover:underline"
                  >
                    <span>Visit the Application Portal</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeApps.map((app) => (
                    <div 
                      key={app.id}
                      className="bg-soft-grey border border-gray-150 p-5 rounded-2xl flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-display font-bold text-charleston text-sm leading-tight">
                          {app.programTitle}
                        </h4>
                        <p className="text-gray-500 text-xs font-semibold mt-1 font-sans">
                          Track: {app.track}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-1">
                          Duration: {app.duration}
                        </p>
                      </div>

                      <div>
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest font-mono ${
                          app.status === 'accepted' 
                            ? 'bg-caribbean/15 text-caribbean' 
                            : app.status === 'under_review' 
                              ? 'bg-amber-500/15 text-amber-500' 
                              : 'bg-orange-500/15 text-orange-400'
                        }`}>
                          {app.status === 'accepted' ? 'Accepted' : app.status === 'under_review' ? 'Under Review' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. PORTFOLIO SHOWCASE & BUILDER */}
            <div className="bg-white border border-gray-150 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-lg font-display font-black text-charleston mb-6 flex items-center gap-2">
                <Code size={18} className="text-caribbean" />
                <span>My Talent Portfolio</span>
              </h2>

              {/* Add New Portfolio Item Form */}
              <form onSubmit={handleAddPortfolio} className="bg-soft-grey border border-gray-150 p-6 rounded-2xl mb-8 space-y-4 font-sans">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 font-mono mb-2">
                  Add New Portfolio Item
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Project Title *"
                    value={newPortTitle}
                    onChange={(e) => setNewPortTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-caribbean placeholder:text-gray-400"
                  />
                  
                  <select
                    value={newPortCategory}
                    onChange={(e) => setNewPortCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-caribbean cursor-pointer"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Model Runway/Photoshoot">Model Runway/Photoshoot</option>
                  </select>
                </div>

                <textarea
                  required
                  placeholder="Short Project Description *"
                  rows={2}
                  value={newPortDesc}
                  onChange={(e) => setNewPortDesc(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-caribbean placeholder:text-gray-400"
                />

                <div className="flex gap-4">
                  <input
                    type="url"
                    placeholder="Project / Link URL (Optional)"
                    value={newPortLink}
                    onChange={(e) => setNewPortLink(e.target.value)}
                    className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-caribbean placeholder:text-gray-400"
                  />
                  
                  <button
                    type="submit"
                    className="bg-charleston hover:bg-caribbean hover:text-charleston text-white px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Portfolio Grid list */}
              {activePorts.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6 font-sans">No portfolio items added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activePorts.map((port) => (
                    <div 
                      key={port.id}
                      className="bg-soft-grey/40 border border-gray-150 p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all relative group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="bg-caribbean/10 text-caribbean px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider font-mono">
                            {port.category}
                          </span>
                          <button
                            onClick={() => handleDeletePortfolio(port.id)}
                            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <h4 className="font-display font-bold text-charleston text-xs sm:text-sm leading-tight mb-2">
                          {port.title}
                        </h4>
                        <p className="text-gray-500 text-[11px] leading-relaxed mb-4 font-sans line-clamp-3">
                          {port.desc}
                        </p>
                      </div>

                      {port.link && port.link !== '#' && (
                        <a
                          href={port.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-charleston hover:text-caribbean mt-2 transition-colors font-mono"
                        >
                          <span>Explore Project</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONTAINER: Interactive LMS Progress & Certificates */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. INTERACTIVE LMS LESSON PLANNER */}
            <div className="bg-white border border-gray-150 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-lg font-display font-black text-charleston mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-caribbean" />
                <span>Active Syllabus & Learning Hub</span>
              </h2>
              <p className="text-gray-400 text-[11px] font-sans leading-relaxed mb-6">
                {!isEnrolled ? (
                  <span className="text-caribbean font-bold">LMS Note: </span>
                ) : null}
                {!isEnrolled ? 'Mocking Course Syllabus of Web Development' : 'Accepted to Web Development Course! Complete lessons below.'}
              </p>

              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {lessons.map((lesson) => {
                  const isDone = completedLessonIds.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => toggleLesson(lesson.id)}
                      className={`w-full text-left p-4.5 rounded-2xl border transition-all flex items-start gap-3.5 focus:outline-none ${
                        isDone 
                          ? 'bg-caribbean/5 border-caribbean/25 text-charleston' 
                          : 'bg-soft-grey border-gray-150 text-charleston hover:border-caribbean/15'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                        isDone ? 'bg-caribbean border-caribbean text-charleston' : 'bg-white border-gray-300'
                      }`}>
                        {isDone && <Check size={11} className="stroke-[3]" />}
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-bold leading-tight ${isDone ? 'line-through text-gray-500' : 'text-charleston'}`}>
                          {lesson.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                          Syllabus weight: {lesson.duration}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. DYNAMIC DIGITAL CERTIFICATE EMITTER */}
            <div className="bg-white border border-gray-150 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
              <h2 className="text-lg font-display font-black text-charleston mb-6 flex items-center gap-2">
                <Award size={18} className="text-caribbean" />
                <span>Digital Credentials</span>
              </h2>

              {progressPercent < 100 ? (
                <div className="text-center py-8 bg-soft-grey rounded-2xl border border-gray-150 p-6 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-charleston/5 border border-charleston/10 text-gray-400 flex items-center justify-center mb-4">
                    <Award size={20} />
                  </div>
                  <h4 className="font-display font-bold text-charleston text-xs leading-none mb-1.5">
                    Certificate Locked
                  </h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed font-sans max-w-xs mx-auto mb-4">
                    Complete all {lessons.length} syllabus courses to unlock your verifiable digital completion credential!
                  </p>
                  
                  {/* Miniature progress bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-caribbean h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="text-[10px] text-caribbean font-mono font-bold">{progressPercent}% Completed</span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-charleston text-white p-6 rounded-2xl border border-white/10 relative overflow-hidden text-center"
                >
                  <div className="absolute top-2 right-2 bg-caribbean/15 text-caribbean border border-caribbean/20 rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-widest font-mono flex items-center gap-1">
                    <ShieldCheck size={10} />
                    <span>Verified</span>
                  </div>

                  <Award size={36} className="text-lemon mx-auto mb-4 animate-pulse" />
                  
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 font-mono block mb-1">
                    DELOXE COMPLETION CREDENTIAL
                  </span>
                  <h3 className="text-gradient font-display font-black text-sm mb-3">
                    {user?.displayName || 'Alexander Mercer'}
                  </h3>
                  
                  <p className="text-gray-400 text-[10px] leading-relaxed font-sans mb-6">
                    Verified for mastering Next.js Web Development syllabus modules and launching real portfolio products.
                  </p>

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => alert('PDF Certificate compiled and downloaded!')}
                      className="bg-caribbean text-charleston px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-lemon transition-colors"
                    >
                      <Download size={11} />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => alert('LinkedIn Share link copied to your clipboard!')}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Share2 size={11} />
                      <span>Share</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
