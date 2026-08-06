'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, LogIn, LogOut, User, LayoutDashboard, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const SHOW_DASHBOARD = false;

const talentLinks = [
  { name: 'Home', href: '/talent' },
  { name: 'NEXTGEN', href: '/talent/internship' },
  { name: 'ICT Hub', href: '/talent/ict-training' },
  { name: 'Model debut', href: '/talent/model-debut' },
  { name: 'Application Portal', href: '/talent/apply' },
  ...(SHOW_DASHBOARD ? [{ name: 'Student Dashboard', href: '/talent/dashboard' }] : []),
  { name: 'Success Stories', href: '/talent/success-stories' },
  { name: 'FAQ', href: '/talent/faq' },
];

export default function TalentNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const isLinkActive = (href: string) => {
    if (href === '/talent') {
      return pathname === '/talent';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-5 transition-all duration-300">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 220, damping: 25 }}
        className={`max-w-7xl mx-auto rounded-[24px] border transition-all duration-500 relative ${
          isScrolled
            ? 'bg-charleston/95 backdrop-blur-2xl border-white/10 shadow-[0_24px_50px_-15px_rgba(0,0,0,0.5)] py-2.5 px-6'
            : 'bg-charleston/90 backdrop-blur-md border-white/5 py-4 px-8'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo with micro-spring scaling feedback */}
          <Link href="/talent" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-caribbean rounded-[12px] flex items-center justify-center shadow-md border border-white/20 select-none"
            >
              <span className="text-charleston font-black text-xl leading-none">T</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display font-black text-sm md:text-base text-white tracking-tight leading-none">
                DELOXE TALENT
              </span>
              <span className="text-[9px] text-caribbean font-mono tracking-widest mt-0.5">
                ACADEMY & CAREERS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {talentLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 relative py-1 hover:text-caribbean ${
                  isLinkActive(link.href) ? 'text-caribbean' : 'text-gray-300/90'
                } group/link`}
              >
                {link.name}
                {isLinkActive(link.href) && (
                  <motion.span
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-caribbean rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Authentication & Back to Main Buttons */}
          <div className="flex items-center gap-4">
            {/* User Login state */}
            {SHOW_DASHBOARD && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 p-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all duration-300"
                  >
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-caribbean text-charleston rounded-full flex items-center justify-center font-bold">
                        {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl bg-charleston border border-white/10 p-2 shadow-2xl text-white z-50"
                      >
                        <div className="p-3 border-b border-white/5">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="font-bold text-sm truncate">{user.displayName || user.email}</p>
                        </div>
                        <div className="p-1 mt-1 space-y-1">
                          <Link
                            href="/talent/dashboard"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2 w-full p-2.5 rounded-xl hover:bg-white/5 text-xs font-bold text-gray-200 hover:text-caribbean transition-colors"
                          >
                            <LayoutDashboard size={14} />
                            <span>Student Dashboard</span>
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 w-full p-2.5 rounded-xl hover:bg-red-500/10 text-xs font-bold text-red-400 transition-colors"
                          >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white hover:text-caribbean transition-colors px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5"
                >
                  <LogIn size={13} />
                  <span>Student Login</span>
                </button>
              )
            )}

            {/* Back to Main Website Button */}
            <Link
              href="/"
              className="flex items-center gap-1.5 bg-caribbean hover:bg-lemon text-charleston px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md border border-white/10 shrink-0"
            >
              <Globe size={13} />
              <span>Main Site</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/5 pt-4 pb-2"
            >
              <div className="flex flex-col gap-2">
                {talentLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3 px-4 rounded-[16px] text-xs uppercase tracking-wider font-bold transition-all duration-200 border select-none ${
                      isLinkActive(link.href)
                        ? 'bg-caribbean/10 text-caribbean border-caribbean/20'
                        : 'bg-white/5 hover:bg-white/10 text-gray-200 border-transparent'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={14} className={isLinkActive(link.href) ? 'text-caribbean' : 'text-gray-500'} />
                  </Link>
                ))}

                {/* Mobile Auth Button */}
                {SHOW_DASHBOARD && !user && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignIn();
                    }}
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-[16px] font-bold text-xs uppercase tracking-wider border border-white/10 mt-2"
                  >
                    <LogIn size={14} />
                    <span>Student Login</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
