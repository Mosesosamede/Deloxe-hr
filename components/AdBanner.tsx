'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';

export default function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run this if we have a container and we haven't already injected the script
    if (containerRef.current && !containerRef.current.querySelector('script[src="https://quge5.com/88/tag.min.js"]')) {
      try {
        const script = document.createElement('script');
        script.src = 'https://quge5.com/88/tag.min.js';
        script.dataset.zone = '267435';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        
        containerRef.current.appendChild(script);
      } catch (err) {
        console.error('Ad injection failed:', err);
      }
    }
  }, []);

  return (
    <div ref={containerRef} className="my-12 px-6 py-8 md:p-10 rounded-3xl bg-[#0F141A] border border-white/10 text-white relative overflow-hidden group shadow-xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-caribbean/15 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-lemon/10 rounded-full blur-[70px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-lemon/15 text-lemon flex items-center justify-center flex-shrink-0 border border-lemon/30">
            <Gift size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-lemon tracking-[0.3em] mb-1 block">Refer & Earn</span>
            <h4 className="font-display font-bold text-lg md:text-xl text-white">Become an Intern Referral Ambassador</h4>
            <p className="text-gray-300 text-xs md:text-sm mt-1">Refer interns and earn rewards for every successful placement.</p>
          </div>
        </div>

        <Link
          href="https://referral.deloxehr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-lemon hover:bg-lemon/90 text-charleston font-bold py-3 px-6 rounded-xl transition-all shadow-md text-sm whitespace-nowrap active:scale-95 cursor-pointer flex-shrink-0"
        >
          <span>Refer Intern & Earn</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

