
# Freelancer Profile Redesign - Implementation Plan

## Overview

This plan transforms the current basic profile page into a comprehensive, professional freelancer profile similar to Fiverr and Upwork. The new profile will build trust, showcase skills, and help freelancers get discovered by clients.

---

## What You'll Get

### Profile Header Section
- Large profile photo with professional display
- Display name and professional headline (e.g., "UI/UX Designer | Figma, Web & Mobile")
- Location and weekly availability indicator

### About Me Section
- Expanded bio area with guidance for writing compelling summaries
- Character counter for optimal length

### Skills & Tools
- Tag-based skill selection (up to 10 skills)
- Separate section for tools/technologies used

### Services Offered
- List of services linked from your active gigs
- Shows price range and delivery times

### Portfolio Section
- Upload work samples (images, PDFs)
- Add titles and descriptions to each piece
- Link to external work (GitHub, Behance, etc.)

### Education & Certifications
- Add your school/program
- Optional certifications (Google, Coursera, etc.)

### Working Style
- Response time preference
- Weekly availability hours
- Preferred communication methods

### Trust Indicators
- Email verified badge
- Identity verification status
- Member since date

### Reviews & Stats
- Average rating across all gigs
- Total completed orders
- Client testimonials (pulled from your gig reviews)

### Ethical Guidelines
- Clear acknowledgment of CampusGigs ethical standards

---

## How It Will Look

The profile will be organized into clear, scannable sections:

```text
+--------------------------------------------------+
|  HEADER                                          |
|  [Photo]  Display Name                           |
|           Professional Title                     |
|           Location | Availability | Member Since |
+--------------------------------------------------+
|                                                  |
|  ABOUT ME                                        |
|  Bio text with value proposition...              |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  SKILLS & TOOLS                                  |
|  [React] [Figma] [TypeScript] [Tailwind] ...     |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  MY SERVICES (linked from gigs)                  |
|  - Landing Page Design   |   N15,000   |  3 days |
|  - UI/UX Consultation    |   N8,000    |  1 day  |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  PORTFOLIO                                       |
|  [Image 1]  [Image 2]  [Image 3]  [+ Add]        |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  EDUCATION                                       |
|  Computer Science - University Name - 2024      |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  REVIEWS (from completed orders)                 |
|  [Star] 4.8 average | 12 reviews                 |
|  "Great work, fast delivery..." - Client A      |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  [Contact Freelancer]  [View All Gigs]           |
|                                                  |
+--------------------------------------------------+
```

---

## Database Changes Required

New columns will be added to the `profiles` table:

| Field | Description |
|-------|-------------|
| `professional_title` | Keyword-rich headline (80 chars) |
| `location` | City/Campus/Hostel |
| `availability_hours` | Weekly hours (e.g., "10-20") |
| `skills` | Array of skills (up to 10) |
| `tools` | Array of tools/technologies |
| `response_time` | Preferred response time |
| `preferred_communication` | Array of methods |
| `education_program` | Degree/Program name |
| `education_institution` | School name |
| `education_year` | Graduation year |
| `certifications` | Array of certification objects |
| `portfolio_items` | Array of portfolio entries |
| `is_identity_verified` | Boolean for verification status |

---

## New Pages & Components

### Pages
- **`/profile`** - Enhanced edit profile page (redesigned)
- **`/freelancer/:id`** - Public freelancer profile view (new)

### Components
- `ProfileHeader` - Photo, name, title, badges
- `SkillsSection` - Skill tags with add/remove
- `PortfolioGrid` - Portfolio items with upload
- `EducationSection` - Education & certifications
- `WorkingStyleSection` - Availability & communication
- `FreelancerReviews` - Reviews pulled from orders
- `TrustBadges` - Verification indicators
- `FreelancerServices` - Services from active gigs

---

## Storage Changes

A new storage bucket `portfolio` will be created for:
- Portfolio images
- PDF work samples
- Certificate images

---

## Implementation Steps

### Step 1: Database Migration
Add new columns to the `profiles` table with appropriate defaults

### Step 2: Update Profile Hooks
Extend `useProfile` and `useUpdateProfile` to handle new fields

### Step 3: Create Profile Components
Build modular, reusable components for each section

### Step 4: Redesign Edit Profile Page
Replace current form with sectioned, tabbed interface

### Step 5: Create Public Profile Page
Build a read-only view for other users to see freelancer profiles

### Step 6: Add Portfolio Upload
Implement image/PDF upload for portfolio section

### Step 7: Connect Reviews & Gigs
Pull in ratings and services from existing tables

### Step 8: Add Navigation
Link to profiles from gig cards and gig detail pages

---

## Technical Details

### Database Migration SQL

```sql
ALTER TABLE public.profiles
ADD COLUMN professional_title TEXT,
ADD COLUMN location TEXT,
ADD COLUMN availability_hours TEXT,
ADD COLUMN skills TEXT[] DEFAULT '{}',
ADD COLUMN tools TEXT[] DEFAULT '{}',
ADD COLUMN response_time TEXT,
ADD COLUMN preferred_communication TEXT[] DEFAULT '{}',
ADD COLUMN education_program TEXT,
ADD COLUMN education_institution TEXT,
ADD COLUMN education_year INTEGER,
ADD COLUMN certifications JSONB DEFAULT '[]',
ADD COLUMN portfolio_items JSONB DEFAULT '[]',
ADD COLUMN is_identity_verified BOOLEAN DEFAULT FALSE;
```

### Updated Profile Interface

```typescript
interface Profile {
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
```

### Skills Suggestions List
Pre-populated suggestions based on gig categories:
- React, JavaScript, TypeScript, Python
- Figma, Adobe XD, Photoshop, Illustrator
- Video Editing, Motion Graphics
- Academic Writing, Tutoring, Proofreading
- And more...

### Portfolio Item Structure

```typescript
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: 'image' | 'pdf' | 'link';
  external_link?: string;
  created_at: string;
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/FreelancerProfile.tsx` | Public profile view page |
| `src/components/profile/ProfileHeader.tsx` | Header section component |
| `src/components/profile/SkillsInput.tsx` | Skills tag input |
| `src/components/profile/PortfolioSection.tsx` | Portfolio grid |
| `src/components/profile/EducationSection.tsx` | Education form |
| `src/components/profile/WorkingStyleSection.tsx` | Availability |
| `src/components/profile/TrustBadges.tsx` | Verification badges |
| `src/components/profile/FreelancerReviews.tsx` | Reviews display |
| `src/hooks/useFreelancerProfile.ts` | Public profile data hook |
| `src/hooks/usePortfolioUpload.ts` | Portfolio file upload |
| `src/lib/skills-constants.ts` | Predefined skill suggestions |

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Profile.tsx` | Complete redesign with sections |
| `src/hooks/useProfile.ts` | Add new fields to interface |
| `src/hooks/useUpdateProfile.ts` | Support new fields |
| `src/pages/GigDetail.tsx` | Link to freelancer profile |
| `src/components/gigs/GigCard.tsx` | Link to freelancer profile |
| `src/App.tsx` | Add `/freelancer/:id` route |

---

## Notes

- All new profile fields are optional to avoid breaking existing profiles
- Portfolio uploads use the same pattern as avatar uploads
- Reviews are read-only and pulled from the existing ratings system
- The public profile page is viewable by anyone (follows existing RLS for profiles)
- Skills and tools use a tag-based UI for easy add/remove
