'use client';

import TalentNavbar from './Navbar';
import TalentFooter from './Footer';
import SmoothScroll from '@/components/SmoothScroll';

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <div className="bg-soft-grey text-charleston min-h-screen flex flex-col font-sans antialiased selection:bg-caribbean selection:text-charleston">
        {/* Navigation 2 */}
        <TalentNavbar />

        {/* Page Content */}
        <div className="flex-grow pt-28">
          {children}
        </div>

        {/* Adapted Footer */}
        <TalentFooter />
      </div>
    </SmoothScroll>
  );
}
