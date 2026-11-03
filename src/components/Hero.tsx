import React, { useRef, useState } from 'react';
import { ArrowDown, Camera, Crop } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';
import { ImageCropperModal } from './ImageCropperModal';

export const Hero: React.FC = () => {
  const { heroImage, updateHeroImage, siteCopy, isOwnerMode } = useCustomization();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCropSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset file input
    e.target.value = '';
  };

  const scrollToForm = () => {
    const el = document.getElementById('work-with-me');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-6 pb-12 md:pt-10 md:pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Typographic Block */}
        <div className="max-w-4xl mx-auto text-center space-y-5 mb-8 md:mb-10">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-[#111111] font-medium tracking-tight [text-wrap:balance]">
            {siteCopy.heroHeadline}
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-2xl mx-auto font-normal">
            {siteCopy.heroSubtext}
          </p>

          {/* Single direct CTA */}
          <div className="pt-1 flex justify-center">
            <button
              onClick={scrollToForm}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] text-white text-xs sm:text-sm font-medium tracking-wide uppercase hover:bg-[#2C2C2C] transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <span>Work With Me</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        </div>

        {/* Hero Photo (Generous framing, never chops head or shoulders) */}
        <div className="w-full relative group">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/10] max-h-[580px] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#ECECE6] border border-[#E4E4DE] shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <img
              src={heroImage}
              alt="Deb Ifegwu"
              className="w-full h-full object-cover object-[center_top] sm:object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />

            {/* Quick action buttons on photo - strictly reserved for Owner mode */}
            {isOwnerMode && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCropSrc(heroImage)}
                  title="Adjust crop, zoom or position of current photo"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#111111] text-xs font-medium border border-white/60 opacity-90 group-hover:opacity-100 hover:bg-white transition-all shadow-sm cursor-pointer"
                >
                  <Crop className="w-3.5 h-3.5 text-[#333333]" />
                  <span className="hidden sm:inline">Adjust Framing</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload a new photo"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#111111] text-xs font-medium border border-white/60 opacity-90 group-hover:opacity-100 hover:bg-white transition-all shadow-sm cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#333333]" />
                  <span>Change Photo</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Interactive Crop & Position Modal */}
      {cropSrc && (
        <ImageCropperModal
          isOpen={!!cropSrc}
          imageSrc={cropSrc}
          defaultAspectRatio={16 / 10}
          title="Frame & Position Hero Photo"
          onCropComplete={(croppedUrl) => {
            updateHeroImage(croppedUrl);
            setCropSrc(null);
          }}
          onClose={() => setCropSrc(null)}
        />
      )}
    </section>
  );
};


