export interface FloatingCompany {
  id: string;
  name: string;
  category: string;
  role: string;
  tagline: string;
  svgMark: string;
  brandColor: string;
  website: string;
}

export interface WorkInquiry {
  fullName: string;
  email: string;
  companyName: string;
  website: string;
  role: string;
  businessDescription: string;
  supportAreas: string[];
  mainChallenge: string;
  desiredOutcome: string;
  timeline: string;
  fileName?: string;
  fileSize?: string;
  submittedAt: string;
}
