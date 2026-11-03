import React from 'react';
import { ArrowDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const scrollToForm = () => {
    const el = document.getElementById('work-with-me');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBFBF9]/90 backdrop-blur-md border-b border-[#ECECE8] transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-base font-semibold tracking-tight text-[#111111] hover:text-[#555555] transition-colors cursor-pointer"
        >
          Deb Ifegwu
        </button>

        {/* Straight CTA to the form */}
        <button
          onClick={scrollToForm}
          className="group inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wide uppercase bg-[#111111] text-white hover:bg-[#2B2B2B] transition-all shadow-xs cursor-pointer"
        >
          <span>Work With Me</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </header>
  );
};
