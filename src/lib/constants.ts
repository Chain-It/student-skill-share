export const GIG_CATEGORIES = [
  { value: 'graphics_and_design', label: 'Graphics & Design', emoji: '🎨' },
  { value: 'video_and_animation', label: 'Video & Animation', emoji: '🎬' },
  { value: 'writing_and_translation', label: 'Writing & Translation', emoji: '✍️' },
  { value: 'website_development', label: 'Website Development', emoji: '🌐' },
  { value: 'social_media_marketing', label: 'Social Media Marketing', emoji: '📱' },
  { value: 'programming_and_tech', label: 'Programming & Tech', emoji: '💻' },
  { value: 'consultations', label: 'Consultations', emoji: '💬' },
  { value: 'mathematics_and_physics', label: 'Mathematics & Physics', emoji: '🔢' },
  { value: 'online_tutoring', label: 'Online Tutoring', emoji: '👨‍🏫' },
  { value: 'packaging_and_label_design', label: 'Packaging & Label Design', emoji: '📦' },
  { value: 'app_design', label: 'App Design', emoji: '📲' },
  { value: 't_shirts_and_merchandise', label: 'T-Shirts & Merchandise', emoji: '👕' },
  { value: 'book_design_and_illustration', label: 'Book Design & Illustration', emoji: '📚' },
  { value: 'music_and_audio', label: 'Music & Audio', emoji: '🎵' },
  { value: 'video_ads_and_commercials', label: 'Video Ads & Commercials', emoji: '📺' },
  { value: 'video_editing', label: 'Video Editing', emoji: '🎞️' },
  { value: 'ui_ux_design', label: 'UI/UX Design', emoji: '🖌️' },
  { value: 'image_editing', label: 'Image Editing', emoji: '🖼️' },
  { value: 'presentation_design', label: 'Presentation Design', emoji: '📊' },
  { value: 'blockchain_smart_contract_development', label: 'Blockchain & Smart Contracts', emoji: '⛓️' },
  { value: 'study_guides', label: 'Study Guides', emoji: '📖' },
  { value: 'proofreading', label: 'Proofreading', emoji: '🔍' },
  { value: 'cv_resume_design', label: 'CV & Resume Design', emoji: '📄' },
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
