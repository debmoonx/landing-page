import React, { useRef, useState } from 'react';
import { ArrowUpRight, Camera, Crop, BookOpen, Users } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';
import { ImageCropperModal } from './ImageCropperModal';

export const BuildingSection: React.FC = () => {
  const {
    wholikestherainImage,
    updateWholikestherainImage,
    instagramUrl,
    substackUrl,
    siteCopy,
    isOwnerMode,
  } = useCustomization();
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
    e.target.value = '';
  };

  return (
    <section id="community" className="py-10 md:py-14 bg-[#F6F6F2] border-t border-[#ECECE8]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl border border-[#E8E8E2] p-6 sm:p-8 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Visual Container with Instant Photo Upload */}
            <div className="sm:col-span-5 relative group">
              <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-[#EAEAE4] border border-[#E2E2DC]">
                <img
                  src={wholikestherainImage}
                  alt="Wholikestherain community experiences"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />

                {/* Upload & framing buttons - strictly reserved for Owner mode */}
                {isOwnerMode && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCropSrc(wholikestherainImage)}
                      title="Adjust crop or framing"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#111111] text-[11px] font-medium border border-white/60 opacity-90 group-hover:opacity-100 hover:bg-white transition-all shadow-xs cursor-pointer"
                    >
                      <Crop className="w-3 h-3 text-[#333333]" />
                      <span className="hidden sm:inline">Frame</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload community picture"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#111111] text-[11px] font-medium border border-white/60 opacity-90 group-hover:opacity-100 hover:bg-white transition-all shadow-xs cursor-pointer"
                    >
                      <Camera className="w-3 h-3 text-[#333333]" />
                      <span>Upload</span>
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

            {/* Narrative & Links: Exact 'Wholikestherain' capitalization */}
            <div className="sm:col-span-7 space-y-3">
              <div className="flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-[#666666] font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>The Community</span>
              </div>

              <h2 className="text-xl sm:text-2xl text-[#111111] font-medium leading-tight">
                {siteCopy.communityTitle}
              </h2>

              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-normal">
                {siteCopy.communityDescription}
              </p>

              {/* Action buttons */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#111111] text-white text-xs font-medium tracking-wide hover:bg-[#2C2C2C] transition-all shadow-xs group cursor-pointer"
                >
                  <span>Join</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href={substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D5D5CF] text-[#222222] text-xs font-medium tracking-wide hover:border-[#111111] hover:bg-white transition-all group cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-[#555555]" />
                  <span>Read on Substack</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Crop & Position Modal */}
      {cropSrc && (
        <ImageCropperModal
          isOpen={!!cropSrc}
          imageSrc={cropSrc}
          defaultAspectRatio={16 / 11}
          title="Frame & Position Community Photo"
          onCropComplete={(croppedUrl) => {
            updateWholikestherainImage(croppedUrl);
            setCropSrc(null);
          }}
          onClose={() => setCropSrc(null)}
        />
      )}
    </section>
  );
};
