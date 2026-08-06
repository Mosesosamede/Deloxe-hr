import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-caribbean/10 text-caribbean border border-caribbean/20", className)}>
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-8", className)}>
      {children}
    </div>
  );
}

export function CTAButton({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) {
  const Component = href ? 'a' : 'button';
  return (
    <Component 
      href={href}
      className={cn("px-8 py-4 bg-[#1B4332] text-white rounded-2xl font-bold hover:bg-[#D4AF37] transition-all duration-300 shadow-lg text-center inline-block", className)}
    >
      {children}
    </Component>
  );
}

export function TopBar() {
  return (
    <div className="bg-[#1B4332] text-white/60 text-[10px] py-3 text-center uppercase tracking-[0.3em] font-black border-b border-white/5">
      Deloxe HR Consulting — Elevating Your Work Experience
    </div>
  );
}
