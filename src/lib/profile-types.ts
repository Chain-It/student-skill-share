// Type definitions for freelancer profiles

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  url?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: 'image' | 'pdf' | 'link';
  external_link?: string;
  created_at: string;
}

export interface ExtendedProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  professional_title: string | null;
  location: string | null;
  availability_hours: string | null;
  skills: string[];
  tools: string[];
  response_time: string | null;
  preferred_communication: string[];
  education_program: string | null;
  education_institution: string | null;
  education_year: number | null;
  certifications: Certification[];
  portfolio_items: PortfolioItem[];
  is_identity_verified: boolean;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface FreelancerStats {
  averageRating: number;
  totalReviews: number;
  completedOrders: number;
}
