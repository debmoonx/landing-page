import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { COMPANIES } from '../data/companiesData';

export const FloatingLogos: React.FC = () => {
  return (
    <section id="companies" className="py-10 md:py-14 bg-[#FBFBF9] border-t border-[#ECECE8] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        {/* Minimal Section Header */}
        <div className="mb-6 space-y-1">
          <div className="text-xs tracking-[0.2em] uppercase text-[#666666] font-medium">
            Companies &amp; Protocols
          </div>
          <h2 className="text-xl sm:text-2xl text-[#111111] font-medium leading-tight">
            Companies and protocols I have worked with.
          </h2>
        </div>

        {/* Floating Bubble Logo Cluster: Minimal, Compact, Fast to Scroll */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-2">
          {COMPANIES.map((company, index) => {
            const floatClass =
              index % 3 === 0
                ? 'animate-float-1'
                : index % 3 === 1
                ? 'animate-float-2'
                : 'animate-float-3';

            return (
              <a
                key={company.id}
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`${floatClass} group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white border border-[#EAEAE6] hover:border-[#111111]/40 shadow-2xs hover:shadow-sm hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                style={{ animationDelay: `${index * 0.2}s` }}
                title={`Visit ${company.name}`}
              >
                {/* Logo Icon Bubble */}
                <div className="w-6 h-6 rounded-lg p-0.5 flex items-center justify-center bg-[#F9F9F7] shrink-0">
                  <img
                    src={company.svgMark}
                    alt={`${company.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Company Name */}
                <span className="text-xs font-medium text-[#111111] whitespace-nowrap">
                  {company.name}
                </span>

                <ArrowUpRight className="w-3 h-3 text-[#AAAAAA] group-hover:text-[#111111] transition-colors shrink-0" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
