import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Edit3,
  Eye,
  Check,
  RotateCcw,
  X,
  Sliders,
  Type,
  Link as LinkIcon,
} from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

export const OwnerControls: React.FC = () => {
  const {
    isOwnerMode,
    lockOwnerMode,
    unlockOwnerMode,
    siteCopy,
    updateSiteCopy,
    resetSiteCopy,
    showTextEditorModal,
    setShowTextEditorModal,
    calendlyUrl,
    updateCalendlyUrl,
    substackUrl,
    updateSubstackUrl,
    instagramUrl,
    updateInstagramUrl,
  } = useCustomization();

  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [unlockError, setUnlockError] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'links'>('text');
  const [saveToast, setSaveToast] = useState(false);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockOwnerMode(passcodeInput);
    if (success) {
      setShowUnlockModal(false);
      setPasscodeInput('');
      setUnlockError(false);
    } else {
      setUnlockError(true);
    }
  };

  const handleSaveText = () => {
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setShowTextEditorModal(false);
    }, 800);
  };

  return (
    <>
      {/* 1. Public Visitor View: Discreet Footer Unlock Option */}
      {!isOwnerMode && (
        <div className="py-6 bg-[#FBFBF9] border-t border-[#EAEAE6] text-center text-xs text-[#888888]">
          <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[#888888]">
              &copy; {new Date().getFullYear()} Deb Ifegwu. All rights reserved.
            </p>
            <button
              onClick={() => {
                setUnlockError(false);
                setShowUnlockModal(true);
              }}
              title="Owner access to edit text, photos, and settings"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-[#777777] hover:text-[#111111] hover:bg-[#EFEFEA] transition-all cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#999999]" />
              <span>Owner Access</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Owner Mode Floating Management Bar (Only for Deb) */}
      {isOwnerMode && (
        <aside
          aria-label="Owner Workspace Bar"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl bg-[#111111]/95 text-white backdrop-blur-md px-4 py-2.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-white/15 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 text-xs font-medium pl-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Owner Workspace</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowTextEditorModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#111111] text-xs font-medium hover:bg-[#EEEEEE] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Site Text</span>
            </button>

            <button
              onClick={lockOwnerMode}
              title="Hide all management controls to see the exact public view"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-normal transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock / View As Public</span>
            </button>
          </div>
        </aside>
      )}

      {/* 3. Passcode Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E0E0DC] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center">
                  <Unlock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#111111]">
                  Owner Unlock
                </h3>
              </div>
              <button
                onClick={() => setShowUnlockModal(false)}
                className="p-1 rounded-lg hover:bg-[#F2F2ED] text-[#666666] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#666666] leading-relaxed">
              Enter your passcode to unlock live text editing, photo replacement, and backend controls.
            </p>

            <form onSubmit={handleUnlockSubmit} className="space-y-3">
              <div>
                <input
                  type="password"
                  autoFocus
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    setUnlockError(false);
                  }}
                  placeholder="Enter passcode (e.g. 2026)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                />
                {unlockError && (
                  <p className="text-[11px] text-rose-600 mt-1">
                    Incorrect passcode. Default is 2026.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#666666] hover:bg-[#F2F2ED] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-medium hover:bg-[#2C2C2C] cursor-pointer"
                >
                  Unlock Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Comprehensive Site Text & Content Editor Modal */}
      {showTextEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E0E0DC] max-w-2xl w-full shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#ECECE6] flex items-center justify-between bg-[#FAF9F6]">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-[#111111]" />
                <div>
                  <h3 className="text-base font-semibold text-[#111111]">
                    Edit Website Text &amp; Copy
                  </h3>
                  <p className="text-[11px] text-[#666666]">
                    Changes update live on your website and persist instantly.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTextEditorModal(false)}
                className="p-1.5 rounded-full hover:bg-[#ECECE6] text-[#666666] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-[#ECECE6] bg-[#F4F4F0] px-6 text-xs font-medium">
              <button
                onClick={() => setActiveTab('text')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'text'
                    ? 'border-[#111111] text-[#111111]'
                    : 'border-transparent text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Page Sections &amp; Copy</span>
              </button>
              <button
                onClick={() => setActiveTab('links')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'links'
                    ? 'border-[#111111] text-[#111111]'
                    : 'border-transparent text-[#666666] hover:text-[#111111]'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Links &amp; Calendly</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {activeTab === 'text' && (
                <>
                  {/* Hero Section Copy */}
                  <div className="space-y-3 pb-5 border-b border-[#ECECE6]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                      1. Hero Section
                    </span>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        Main Headline:
                      </label>
                      <input
                        type="text"
                        value={siteCopy.heroHeadline}
                        onChange={(e) => updateSiteCopy('heroHeadline', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        Supporting Text:
                      </label>
                      <textarea
                        rows={2}
                        value={siteCopy.heroSubtext}
                        onChange={(e) => updateSiteCopy('heroSubtext', e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                  </div>

                  {/* Background Section Copy */}
                  <div className="space-y-3 pb-5 border-b border-[#ECECE6]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                      2. Background / About Section
                    </span>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        Section Heading:
                      </label>
                      <input
                        type="text"
                        value={siteCopy.aboutHeading}
                        onChange={(e) => updateSiteCopy('aboutHeading', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        First Paragraph (Bridging innovation...):
                      </label>
                      <textarea
                        rows={2}
                        value={siteCopy.aboutParagraph1}
                        onChange={(e) => updateSiteCopy('aboutParagraph1', e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        Second Paragraph:
                      </label>
                      <textarea
                        rows={2}
                        value={siteCopy.aboutParagraph2}
                        onChange={(e) => updateSiteCopy('aboutParagraph2', e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                  </div>

                  {/* Wholikestherain Community Copy */}
                  <div className="space-y-3 pb-5 border-b border-[#ECECE6]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                      3. Wholikestherain Community Section
                    </span>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        Community Name:
                      </label>
                      <input
                        type="text"
                        value={siteCopy.communityTitle}
                        onChange={(e) => updateSiteCopy('communityTitle', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        Community Description:
                      </label>
                      <textarea
                        rows={2}
                        value={siteCopy.communityDescription}
                        onChange={(e) => updateSiteCopy('communityDescription', e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                  </div>

                  {/* Work With Me Section */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                      4. Work With Me Form Header
                    </span>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        Headline:
                      </label>
                      <input
                        type="text"
                        value={siteCopy.workHeading}
                        onChange={(e) => updateSiteCopy('workHeading', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#222222] mb-1">
                        Intro Subtext:
                      </label>
                      <textarea
                        rows={2}
                        value={siteCopy.workSubtext}
                        onChange={(e) => updateSiteCopy('workSubtext', e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-[#222222] mb-1">
                      Calendly Discovery Call Link:
                    </label>
                    <input
                      type="url"
                      value={calendlyUrl}
                      onChange={(e) => updateCalendlyUrl(e.target.value)}
                      placeholder="https://calendly.com/your-username/30min"
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#222222] mb-1">
                      Wholikestherain Instagram Link:
                    </label>
                    <input
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => updateInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#222222] mb-1">
                      Wholikestherain Substack Link:
                    </label>
                    <input
                      type="url"
                      value={substackUrl}
                      onChange={(e) => updateSubstackUrl(e.target.value)}
                      placeholder="https://wholikestherain.substack.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F9F7] border border-[#D5D5CF] text-xs text-[#111111]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Reset and Save */}
            <div className="px-6 py-4 border-t border-[#ECECE6] bg-[#FAF9F6] flex items-center justify-between">
              <button
                type="button"
                onClick={resetSiteCopy}
                className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#111111] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTextEditorModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#666666] hover:bg-[#ECECE6] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveText}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#111111] text-white text-xs font-medium hover:bg-[#2C2C2C] shadow-sm cursor-pointer"
                >
                  {saveToast ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Done &amp; Keep Changes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
