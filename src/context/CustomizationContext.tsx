import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultHeroImage from '../assets/images/Facetune_24-06-2025-10-23-27 3.jpeg';
import defaultWtrImage from '../assets/images/IMG_6999.jpeg';

export interface SiteCopy {
  heroHeadline: string;
  heroSubtext: string;
  aboutTagline: string;
  aboutHeading: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  communityTagline: string;
  communityTitle: string;
  communityDescription: string;
  workTagline: string;
  workHeading: string;
  workSubtext: string;
}

interface CustomizationState {
  isOwnerMode: boolean;
  setIsOwnerMode: (active: boolean) => void;
  unlockOwnerMode: (passcode?: string) => boolean;
  lockOwnerMode: () => void;
  showTextEditorModal: boolean;
  setShowTextEditorModal: (show: boolean) => void;
  siteCopy: SiteCopy;
  updateSiteCopy: (key: keyof SiteCopy, value: string) => void;
  resetSiteCopy: () => void;
  heroImage: string;
  wholikestherainImage: string;
  substackUrl: string;
  instagramUrl: string;
  calendlyUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  emailAddress: string;
  updateHeroImage: (newUrl: string) => void;
  updateWholikestherainImage: (newUrl: string) => void;
  updateSubstackUrl: (url: string) => void;
  updateInstagramUrl: (url: string) => void;
  updateCalendlyUrl: (url: string) => void;
  resetToDefaults: () => void;
}

export const DEFAULT_SITE_COPY: SiteCopy = {
  heroHeadline: 'Backing ideas, people, and businesses shaping the future.',
  heroSubtext: 'Working across capital markets, venture strategy, and ecosystem growth. Helping teams build, raise, and scale.',
  aboutTagline: 'Background',
  aboutHeading: 'Building across innovation, venture growth, capital, and community.',
  aboutParagraph1: 'Bridging innovation, venture growth, business development, and capital markets, I combine hands on leadership with strategic advisory for fast growing ventures.',
  aboutParagraph2: 'My focus is on fundraising readiness, narrative strategy, go to market execution, and ecosystem partnerships across emerging markets and global stages.',
  communityTagline: 'The Community',
  communityTitle: 'wholikestherain',
  communityDescription: 'Bringing together founders, investors, and builders through meaningful connections, curated experiences, and meetups.',
  workTagline: 'Work With Me',
  workHeading: 'Building something?',
  workSubtext: "Tell me about your project, venture, or goals, and let's explore how we can collaborate.",
};

const DEFAULT_HERO_IMAGE = defaultHeroImage;
const DEFAULT_WTR_IMAGE = defaultWtrImage;
const DEFAULT_SUBSTACK = 'https://wholikestherain.substack.com';
const DEFAULT_INSTAGRAM = 'https://www.instagram.com/wholikestherain?obrf=MnM3dTJ3bGZ4MjM2&utm_source=qr';
const DEFAULT_LINKEDIN = 'https://linkedin.com/in/debbieifeigwu';
const DEFAULT_TWITTER = 'https://x.com/debmoonx';
const DEFAULT_YOUTUBE = 'https://youtube.com/@debmoonx';
const DEFAULT_EMAIL = 'mailto:ezinneifegwu@gmail.com';
const DEFAULT_CALENDLY = 'https://calendly.com/debifegwu/1-1-master-class?month=2026-11';

const STORAGE_KEY_HERO = 'deb_site_hero_portrait_v4';
const STORAGE_KEY_WTR = 'deb_site_wtr_image_v3';
const STORAGE_KEY_SUBSTACK = 'deb_site_substack_url';
const STORAGE_KEY_INSTA = 'deb_site_insta_url';
const STORAGE_KEY_CALENDLY = 'deb_site_calendly_url';
const STORAGE_KEY_COPY = 'deb_site_copy_v2';
const STORAGE_KEY_AUTH = 'deb_site_owner_authenticated_v1';

const CustomizationContext = createContext<CustomizationState | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(false);
  const [showTextEditorModal, setShowTextEditorModal] = useState(false);

  const [siteCopy, setSiteCopy] = useState<SiteCopy>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COPY);
      if (stored) {
        const savedCopy = JSON.parse(stored);
        savedCopy.communityDescription = DEFAULT_SITE_COPY.communityDescription;
        if (savedCopy.communityTitle === 'Wholikestherain') savedCopy.communityTitle = 'wholikestherain';
        return { ...DEFAULT_SITE_COPY, ...savedCopy };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SITE_COPY;
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    try { return localStorage.getItem(STORAGE_KEY_HERO) || DEFAULT_HERO_IMAGE; }
    catch { return DEFAULT_HERO_IMAGE; }
  });

  const [wholikestherainImage, setWholikestherainImage] = useState<string>(DEFAULT_WTR_IMAGE);

  const [substackUrl, setSubstackUrl] = useState<string>(() => {
    try { return localStorage.getItem(STORAGE_KEY_SUBSTACK) || DEFAULT_SUBSTACK; }
    catch { return DEFAULT_SUBSTACK; }
  });

  const [instagramUrl, setInstagramUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INSTA);
      return !saved || saved.includes('wholikestherain?obrf=') ? DEFAULT_INSTAGRAM : saved;
    } catch { return DEFAULT_INSTAGRAM; }
  });

  const [calendlyUrl, setCalendlyUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CALENDLY);
      return !saved || saved === 'https://calendly.com/debifegwu/' || saved === 'https://calendly.com/debifegwu' ? DEFAULT_CALENDLY : saved;
    } catch { return DEFAULT_CALENDLY; }
  });

  const linkedinUrl = DEFAULT_LINKEDIN;
  const twitterUrl = DEFAULT_TWITTER;
  const youtubeUrl = DEFAULT_YOUTUBE;
  const emailAddress = DEFAULT_EMAIL;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_COPY, JSON.stringify(siteCopy)); }
    catch (e) { console.warn('Copy save error', e); }
  }, [siteCopy]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_HERO, heroImage); }
    catch (e) { console.warn('Hero image save error', e); }
  }, [heroImage]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_WTR, wholikestherainImage); }
    catch (e) { console.warn('WTR image save error', e); }
  }, [wholikestherainImage]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_SUBSTACK, substackUrl); }
    catch { /* ignore */ }
  }, [substackUrl]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_INSTA, instagramUrl); }
    catch { /* ignore */ }
  }, [instagramUrl]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_CALENDLY, calendlyUrl); }
    catch { /* ignore */ }
  }, [calendlyUrl]);

  useEffect(() => {
    try {
      if (isOwnerMode) localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      else localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch { /* ignore */ }
  }, [isOwnerMode]);

  const updateSiteCopy = (key: keyof SiteCopy, value: string) => {
    setSiteCopy((prev) => ({ ...prev, [key]: value }));
  };

  const resetSiteCopy = () => {
    setSiteCopy(DEFAULT_SITE_COPY);
    try { localStorage.removeItem(STORAGE_KEY_COPY); }
    catch { /* ignore */ }
  };

  const updateHeroImage = (newUrl: string) => setHeroImage(newUrl);
  const updateWholikestherainImage = (newUrl: string) => setWholikestherainImage(newUrl);
  const updateSubstackUrl = (url: string) => setSubstackUrl(url);
  const updateInstagramUrl = (url: string) => setInstagramUrl(url);
  const updateCalendlyUrl = (url: string) => setCalendlyUrl(url);

  const unlockOwnerMode = (_passcode?: string): boolean => false;

  const lockOwnerMode = () => {
    setIsOwnerMode(false);
    setShowTextEditorModal(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      if (typeof window !== 'undefined' && window.history) {
        const url = new URL(window.location.href);
        url.searchParams.delete('admin');
        url.searchParams.delete('edit');
        url.searchParams.delete('owner');
        window.history.replaceState({}, '', url.pathname);
      }
    } catch { /* ignore */ }
  };

  const resetToDefaults = () => {
    setHeroImage(DEFAULT_HERO_IMAGE);
    setWholikestherainImage(DEFAULT_WTR_IMAGE);
    setSubstackUrl(DEFAULT_SUBSTACK);
    setInstagramUrl(DEFAULT_INSTAGRAM);
    setCalendlyUrl(DEFAULT_CALENDLY);
    setSiteCopy(DEFAULT_SITE_COPY);
    try {
      localStorage.removeItem(STORAGE_KEY_HERO);
      localStorage.removeItem(STORAGE_KEY_WTR);
      localStorage.removeItem(STORAGE_KEY_SUBSTACK);
      localStorage.removeItem(STORAGE_KEY_INSTA);
      localStorage.removeItem(STORAGE_KEY_CALENDLY);
      localStorage.removeItem(STORAGE_KEY_COPY);
    } catch { /* ignore */ }
  };

  return (
    <CustomizationContext.Provider value={{
      isOwnerMode, setIsOwnerMode, unlockOwnerMode, lockOwnerMode,
      showTextEditorModal, setShowTextEditorModal,
      siteCopy, updateSiteCopy, resetSiteCopy,
      heroImage, wholikestherainImage, substackUrl, instagramUrl, calendlyUrl,
      linkedinUrl, twitterUrl, youtubeUrl, emailAddress,
      updateHeroImage, updateWholikestherainImage, updateSubstackUrl,
      updateInstagramUrl, updateCalendlyUrl, resetToDefaults,
    }}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) throw new Error('useCustomization must be used within a CustomizationProvider');
  return context;
};
