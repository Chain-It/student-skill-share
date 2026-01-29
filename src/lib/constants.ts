import {
  Palette,
  Video,
  PenTool,
  Globe,
  Share2,
  Code,
  MessageCircle,
  Calculator,
  GraduationCap,
  Package,
  Smartphone,
  Shirt,
  BookOpen,
  Music,
  Tv,
  Film,
  Layout,
  Image,
  Presentation,
  Link,
  FileText,
  Search,
  FileUser,
  type LucideIcon,
} from 'lucide-react';

export const GIG_CATEGORIES: readonly { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'graphics_and_design', label: 'Graphics & Design', icon: Palette },
  { value: 'video_and_animation', label: 'Video & Animation', icon: Video },
  { value: 'writing_and_translation', label: 'Writing & Translation', icon: PenTool },
  { value: 'website_development', label: 'Website Development', icon: Globe },
  { value: 'social_media_marketing', label: 'Social Media Marketing', icon: Share2 },
  { value: 'programming_and_tech', label: 'Programming & Tech', icon: Code },
  { value: 'consultations', label: 'Consultations', icon: MessageCircle },
  { value: 'mathematics_and_physics', label: 'Mathematics & Physics', icon: Calculator },
  { value: 'online_tutoring', label: 'Online Tutoring', icon: GraduationCap },
  { value: 'packaging_and_label_design', label: 'Packaging & Label Design', icon: Package },
  { value: 'app_design', label: 'App Design', icon: Smartphone },
  { value: 't_shirts_and_merchandise', label: 'T-Shirts & Merchandise', icon: Shirt },
  { value: 'book_design_and_illustration', label: 'Book Design & Illustration', icon: BookOpen },
  { value: 'music_and_audio', label: 'Music & Audio', icon: Music },
  { value: 'video_ads_and_commercials', label: 'Video Ads & Commercials', icon: Tv },
  { value: 'video_editing', label: 'Video Editing', icon: Film },
  { value: 'ui_ux_design', label: 'UI/UX Design', icon: Layout },
  { value: 'image_editing', label: 'Image Editing', icon: Image },
  { value: 'presentation_design', label: 'Presentation Design', icon: Presentation },
  { value: 'blockchain_smart_contract_development', label: 'Blockchain & Smart Contracts', icon: Link },
  { value: 'study_guides', label: 'Study Guides', icon: FileText },
  { value: 'proofreading', label: 'Proofreading', icon: Search },
  { value: 'cv_resume_design', label: 'CV & Resume Design', icon: FileUser },
] as const;

export const DELIVERY_DAYS_OPTIONS = [
  { value: 1, label: '1 Day - Express' },
  { value: 2, label: '2 Days' },
  { value: 3, label: '3 Days' },
  { value: 5, label: '5 Days' },
  { value: 7, label: '7 Days' },
] as const;

export const ORDER_STATUS_LABELS = {
  pending: { label: 'Pending Payment', color: 'warning' },
  paid: { label: 'Paid', color: 'primary' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'destructive' },
} as const;

export type GigCategory = typeof GIG_CATEGORIES[number]['value'];
export type OrderStatus = keyof typeof ORDER_STATUS_LABELS;
