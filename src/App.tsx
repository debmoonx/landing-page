/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CustomizationProvider } from './context/CustomizationContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { FloatingLogos } from './components/FloatingLogos';
import { BuildingSection } from './components/BuildingSection';
import { WorkWithMeSection } from './components/WorkWithMeSection';
import { OwnerControls } from './components/OwnerControls';

export default function App() {
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  return (
    <CustomizationProvider>
      <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#121110] selection:bg-[#111111] selection:text-white">
        {/* Navigation Bar */}
        <Navbar />

        {/* Single Page Flow */}
        <main className="flex-1">
          {/* Hero */}
          <Hero />

          {/* About */}
          <About />

          {/* Floating Logos Showcase */}
          <FloatingLogos />

          {/* The Community — Wholikestherain */}
          <BuildingSection />

          {/* Work With Me Form */}
          <WorkWithMeSection />
        </main>

        {/* Owner Controls & Public Footer */}
        <OwnerControls />
      </div>
    </CustomizationProvider>
  );
}
