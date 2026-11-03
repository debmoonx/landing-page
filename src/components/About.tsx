import React from 'react';
import { useCustomization } from '../context/CustomizationContext';

export const About: React.FC = () => {
  const { siteCopy } = useCustomization();

  return (
    <section id="about" className="py-10 md:py-14 border-t border-[#ECECE8] bg-[#F7F7F4]/60">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        {/* Section Header */}
        <div className="space-y-1.5">
          <div className="text-xs tracking-[0.2em] uppercase text-[#666666] font-medium">
            {siteCopy.aboutTagline}
          </div>
          <h2 className="text-2xl sm:text-3xl text-[#111111] font-medium leading-tight [text-wrap:balance]">
            {siteCopy.aboutHeading}
          </h2>
        </div>

        {/* Grounded narrative */}
        <div className="space-y-3 text-[#444444] text-sm sm:text-base leading-relaxed font-normal">
          <p>
            {siteCopy.aboutParagraph1}
          </p>
          <p>
            {siteCopy.aboutParagraph2}
          </p>
        </div>
      </div>
    </section>
  );
};
