'use client';

import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run this if we have a container and we haven't already injected the script
    if (containerRef.current && !containerRef.current.querySelector('script[src="https://quge5.com/88/tag.min.js"]')) {
      try {
        const script = document.createElement('script');
        script.dataset.zone = '267435';
        script.src = 'https://quge5.com/88/tag.min.js';
        //<script src="https://quge5.com/88/tag.min.js" data-zone="267435" async data-cfasync="false"></script>
        // Instead of document.body, we append to our local container 
        // in case it's an in-place banner.
        containerRef.current.appendChild(script);
      } catch (err) {
        console.error('Ad injection failed:', err);
      }
    }
  }, []);

  return (
    <div ref={containerRef} className="my-16 p-12 rounded-[40px] bg-soft-grey/50 border border-gray-100 text-center relative overflow-hidden group min-h-[250px] flex flex-col items-center justify-center">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] mb-6 block">Sponsored Space</span>
      
      {/* Fallback content while ad loads */}
      <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-2 w-24 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
