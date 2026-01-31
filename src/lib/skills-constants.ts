// Predefined skill and tool suggestions for freelancer profiles

export const SKILL_SUGGESTIONS = [
  // Programming & Development
  'React', 'JavaScript', 'TypeScript', 'Python', 'Node.js', 'HTML/CSS',
  'Java', 'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  
  // Design
  'UI Design', 'UX Design', 'Graphic Design', 'Logo Design', 'Brand Identity',
  'Illustration', 'Icon Design', 'Typography', 'Print Design', 'Packaging Design',
  
  // Video & Animation
  'Video Editing', 'Motion Graphics', 'Animation', '3D Modeling', 'VFX',
  'Color Grading', 'Sound Design', 'Video Production',
  
  // Writing & Translation
  'Content Writing', 'Copywriting', 'Technical Writing', 'Academic Writing',
  'Blog Writing', 'SEO Writing', 'Proofreading', 'Editing', 'Translation',
  
  // Marketing
  'Social Media Marketing', 'SEO', 'Email Marketing', 'Content Strategy',
  'Digital Marketing', 'Influencer Marketing', 'PPC Advertising',
  
  // Academic
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Statistics',
  'Tutoring', 'Research', 'Data Analysis', 'Essay Editing',
  
  // Business
  'Business Plan Writing', 'Financial Analysis', 'Market Research',
  'Presentation Design', 'Data Entry', 'Virtual Assistant',
  
  // Other Skills
  'Blockchain', 'Smart Contracts', 'Machine Learning', 'AI', 'Data Science',
  'Mobile Development', 'Game Development', 'WordPress', 'Shopify',
] as const;

export const TOOL_SUGGESTIONS = [
  // Design Tools
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
  'Canva', 'Affinity Designer', 'CorelDRAW', 'InVision',
  
  // Development Tools
  'VS Code', 'Git', 'GitHub', 'GitLab', 'Docker', 'AWS', 'Vercel',
  'Netlify', 'Firebase', 'Supabase', 'MongoDB', 'PostgreSQL',
  
  // Video & Audio
  'Premiere Pro', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve',
  'Blender', 'Cinema 4D', 'Audacity', 'Logic Pro',
  
  // Writing & Office
  'Microsoft Word', 'Google Docs', 'Notion', 'Grammarly',
  'Google Sheets', 'Excel', 'PowerPoint', 'Google Slides',
  
  // Communication & Project Management
  'Slack', 'Discord', 'Zoom', 'Trello', 'Asana', 'Jira',
  'Monday.com', 'ClickUp', 'Linear',
  
  // Marketing & Analytics
  'Google Analytics', 'Mailchimp', 'HubSpot', 'Hootsuite',
  'Buffer', 'SEMrush', 'Ahrefs',
  
  // Other
  'Tailwind CSS', 'Bootstrap', 'React Native', 'Flutter',
  'Unity', 'Unreal Engine', 'Webflow', 'Framer',
] as const;

export const RESPONSE_TIME_OPTIONS = [
  'Within 1 hour',
  'Within 12 hours',
  'Within 24 hours',
  'Within 2-3 days',
] as const;

export const COMMUNICATION_METHODS = [
  'Chat',
  'Video Call',
  'Voice Call',
  'Email',
  'WhatsApp',
] as const;

export const AVAILABILITY_OPTIONS = [
  '1-10 hrs/week',
  '10-20 hrs/week',
  '20-30 hrs/week',
  '30-40 hrs/week',
  '40+ hrs/week',
] as const;
