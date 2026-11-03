import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  FileUp,
  Send,
  UploadCloud,
  X,
  ArrowUpRight,
  Mail,
  Table,
  Check,
} from 'lucide-react';
import { WorkInquiry } from '../types';
import { useCustomization } from '../context/CustomizationContext';

const TIMELINE_OPTIONS = [
  'Immediate (Within 2 weeks)',
  'Within 1 month',
  '1 to 3 months',
  'Exploratory and planning phase',
];

export const WorkWithMeSection: React.FC = () => {
  const { calendlyUrl, updateCalendlyUrl, siteCopy, isOwnerMode } = useCustomization();

  const [formData, setFormData] = useState<Partial<WorkInquiry>>({
    fullName: '',
    email: '',
    companyName: '',
    website: '',
    role: '',
    businessDescription: '',
    supportAreas: [],
    mainChallenge: '',
    desiredOutcome: '',
    timeline: TIMELINE_OPTIONS[0],
    fileName: '',
    fileSize: '',
  });

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Quick Calendly Link Editor
  const [isEditingCalendly, setIsEditingCalendly] = useState(false);
  const [customCalendlyInput, setCustomCalendlyInput] = useState(calendlyUrl);
  const [savedCalendlySuccess, setSavedCalendlySuccess] = useState(false);

  // Google Sheet Webhook Sync
  const [googleSheetWebhook, setGoogleSheetWebhook] = useState(() => {
    return localStorage.getItem('deb_google_sheet_webhook') || import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK || '';
  });
  const [showConfig, setShowConfig] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      }));
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    setFormData((prev) => ({
      ...prev,
      fileName: '',
      fileSize: '',
    }));
  };

  const handleSaveCalendly = () => {
    if (customCalendlyInput.trim()) {
      updateCalendlyUrl(customCalendlyInput.trim());
      setSavedCalendlySuccess(true);
      setTimeout(() => {
        setSavedCalendlySuccess(false);
        setIsEditingCalendly(false);
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const webhook = googleSheetWebhook.trim();
    if (!webhook) {
      alert('The inquiry form is not connected yet. Please try again later or email ezinneifegwu@gmail.com directly.');
      return;
    }

    setIsSubmitting(true);

    const submission: WorkInquiry = {
      fullName: formData.fullName || 'Anonymous',
      email: formData.email || '',
      companyName: formData.companyName || '',
      website: formData.website || '',
      role: formData.role || '',
      businessDescription: formData.businessDescription || '',
      supportAreas: formData.supportAreas || [],
      mainChallenge: formData.mainChallenge || '',
      desiredOutcome: formData.desiredOutcome || '',
      timeline: formData.timeline || TIMELINE_OPTIONS[0],
      fileName: formData.fileName,
      fileSize: formData.fileSize,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch(webhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(submission),
      });

      // Keep a local copy only in the owner's browser as a convenience.
      try {
        const existing = JSON.parse(localStorage.getItem('deb_inquiries') || '[]');
        existing.unshift(submission);
        localStorage.setItem('deb_inquiries', JSON.stringify(existing));
      } catch {
        // The server submission has already been sent.
      }

      setSubmitted(true);
      document.getElementById('work-with-me')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Inquiry submission failed:', error);
      alert('Your inquiry could not be sent. Please try again or email ezinneifegwu@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToCsv = () => {
    try {
      const existing: WorkInquiry[] = JSON.parse(localStorage.getItem('deb_inquiries') || '[]');
      if (existing.length === 0) {
        alert('No submissions recorded yet.');
        return;
      }
      const headers = ['Submitted At', 'Name', 'Email', 'Company', 'Website', 'Role', 'Support Areas', 'Goals', 'Outcome', 'Timeline'];
      const rows = existing.map((item) => [
        `"${item.submittedAt}"`,
        `"${item.fullName}"`,
        `"${item.email}"`,
        `"${item.companyName}"`,
        `"${item.website}"`,
        `"${item.role}"`,
        `"${(item.supportAreas || []).join(', ')}"`,
        `"${(item.mainChallenge || '').replace(/"/g, '""')}"`,
        `"${(item.desiredOutcome || '').replace(/"/g, '""')}"`,
        `"${item.timeline}"`,
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `deb_inquiries_google_sheet_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // ignore
    }
  };

  return (
    <section id="work-with-me" className="py-14 md:py-18 bg-[#FBFBF9] border-t border-[#ECECE8] scroll-mt-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-8 text-center md:text-left">
          <div className="text-xs tracking-[0.2em] uppercase text-[#666666] font-medium">
            {siteCopy.workTagline}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#111111] font-medium leading-tight">
            {siteCopy.workHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#555555] font-normal leading-relaxed">
            {siteCopy.workSubtext}
          </p>

          {/* Calendly & Delivery Notification Toolbar - ONLY visible in Owner Mode */}
          {isOwnerMode && (
            <div className="p-3.5 rounded-2xl bg-[#F4F4F0] border border-[#E8E8E2] space-y-2 text-xs text-[#555555]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#111111]" />
                <span>
                  Delivered to: <strong className="text-[#111111]">ezinneifegwu@gmail.com</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingCalendly(!isEditingCalendly)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#111111] underline cursor-pointer"
                >
                  <Calendar className="w-3 h-3" />
                  <span>{isEditingCalendly ? 'Close Link Editor' : 'Edit Calendly Link'}</span>
                </button>
                <span className="text-[#CCCCCC]">·</span>
                <button
                  type="button"
                  onClick={exportToCsv}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#111111] hover:underline cursor-pointer"
                >
                  <Table className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Inline Quick Calendly URL Updater */}
            {isEditingCalendly && (
              <div className="pt-2 border-t border-[#E4E4DE] space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-[11px] font-medium text-[#222222]">
                  Paste your Calendly Discovery Call URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customCalendlyInput}
                    onChange={(e) => setCustomCalendlyInput(e.target.value)}
                    placeholder="https://calendly.com/your-username/30min"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#D5D5CF] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCalendly}
                    className="px-3 py-1.5 rounded-lg bg-[#111111] text-white text-xs font-medium hover:bg-[#2C2C2C] flex items-center gap-1 cursor-pointer"
                  >
                    {savedCalendlySuccess ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <span>Save Link</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Google Sheet Sync Drawer */}
          {isOwnerMode && showConfig && (
            <div className="p-4 rounded-xl bg-white border border-[#E0E0DA] space-y-3 text-xs">
              <span className="font-semibold text-[#111111] block">
                Google Sheets Live Webhook Sync:
              </span>
              <p className="text-[#666666] text-[11px]">
                Paste your Google Apps Script Webhook URL below to automatically sync every new response in real time to your Google Sheet:
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={googleSheetWebhook}
                  onChange={(e) => {
                    setGoogleSheetWebhook(e.target.value);
                    localStorage.setItem('deb_google_sheet_webhook', e.target.value);
                  }}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#D5D5CF] text-xs text-[#111111]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#EAEAE6] text-[#111111] hover:bg-[#DDDDD8]"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Post-Submission View (Calendly Direct Access) */}
        {submitted ? (
          <div className="bg-white rounded-3xl border border-[#E0E0DC] p-6 sm:p-10 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-[#111111]" />
              <div>
                <h3 className="text-xl font-semibold text-[#111111]">
                  Inquiry Submitted Successfully
                </h3>
                <p className="text-xs text-[#666666]">
                  Your responses are saved and delivered to ezinneifegwu@gmail.com.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F7F4] border border-[#E8E8E2] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold text-[#111111]">
                    Schedule Your Discovery Call
                  </h4>
                  <p className="text-xs text-[#666666] mt-0.5">
                    Click below to open your Calendly booking window directly:
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#EAEAE4] flex items-center justify-center text-[#111111]">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-1">
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] text-white text-xs font-medium uppercase tracking-wide hover:bg-[#2C2C2C] transition-all shadow-sm"
                >
                  <span>Open Calendly Discovery Call</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#777777] hover:text-[#111111] transition-colors cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          </div>
        ) : (
          /* Neutral, Open Application Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-[#E6E6E0] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6"
          >
            {/* Step: Contact */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                Your Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#333333] mb-1">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#333333] mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. maya@venture.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
              </div>
            </div>

            {/* Step: Venture & Role */}
            <div className="space-y-3 pt-3 border-t border-[#F0F0EB]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                Project &amp; Role
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#333333] mb-1">
                    Company, Project, or Venture Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Horizon Labs"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#333333] mb-1">
                    Website or Deck Link
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#333333] mb-1">
                  Your Role *
                </label>
                <input
                  required
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Founder, CEO, Partner, Head of Growth"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#333333] mb-1">
                  Brief description of what you are working on *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  placeholder="Tell me briefly about what you are building or working on..."
                  className="w-full p-3 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                />
              </div>
            </div>

            {/* Step: Goals & Priorities */}
            <div className="space-y-3 pt-3 border-t border-[#F0F0EB]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                Primary Focus and Objectives
              </div>
              <div>
                <label className="block text-xs font-medium text-[#333333] mb-1">
                  What is your primary priority or goal right now? *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.mainChallenge}
                  onChange={(e) => setFormData({ ...formData, mainChallenge: e.target.value })}
                  placeholder="e.g. Scaling growth, building partnerships, expanding to new markets, refining our narrative..."
                  className="w-full p-3 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#333333] mb-1">
                  Desired outcome from this engagement *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.desiredOutcome}
                  onChange={(e) => setFormData({ ...formData, desiredOutcome: e.target.value })}
                  placeholder="What would success look like over the next 60 to 90 days?"
                  className="w-full p-3 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#333333] mb-1">
                  Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F9F7] border border-[#E0E0DC] text-xs text-[#111111]"
                >
                  {TIMELINE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 5: Optional File Upload */}
            <div className="space-y-2 pt-3 border-t border-[#F0F0EB]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                  Optional File Attachment
                </span>
                <span className="text-[11px] text-[#888888]">Pitch deck or memo (PDF, PPT)</span>
              </div>

              {attachedFile ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F1] border border-[#E2E2DC]">
                  <div className="flex items-center gap-2.5">
                    <FileUp className="w-4 h-4 text-[#333333]" />
                    <div>
                      <p className="text-xs font-medium text-[#111111]">
                        {attachedFile.name}
                      </p>
                      <p className="text-[10px] text-[#777777]">
                        {(attachedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 rounded-lg hover:bg-[#EAEAE4] text-[#555555] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-[#DDDDD8] hover:border-[#111111]/40 bg-[#FAF9F6]/50 transition-colors cursor-pointer">
                  <UploadCloud className="w-5 h-5 text-[#777777] mb-1" />
                  <span className="text-xs font-medium text-[#222222]">
                    Click or drag file to attach
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#F0F0EB] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[#888888]">
                * Submitting directly opens your Calendly discovery call booking window.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#111111] text-white text-xs font-medium uppercase tracking-wide hover:bg-[#2C2C2C] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit &amp; Schedule Discovery Call</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
