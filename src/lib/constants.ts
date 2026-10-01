import type { PricingPlan } from './types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'drop-in',
    name: 'Drop-In',
    price: 25,
    period: 'per class',
    description: 'Perfect for trying out a single session',
    features: [
      'Any single class',
      'All skill levels welcome',
      'Mats & props included',
      'No commitment',
    ],
    popular: false,
  },
  {
    id: 'monthly',
    name: 'Monthly Unlimited',
    price: 120,
    period: 'per month',
    description: 'Unlimited access to all weekly classes',
    features: [
      'Unlimited classes',
      'All class types included',
      'Priority booking',
      'Guest pass once a month',
      '10% off workshops',
    ],
    popular: true,
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 300,
    period: 'per 3 months',
    description: 'Best value for committed practitioners',
    features: [
      'Unlimited classes',
      'All class types included',
      'Priority booking',
      '2 guest passes per month',
      '15% off workshops',
      'Free private session',
    ],
    popular: false,
  },
];

export const STUDIO_ADDRESS = '128 Willow Creek Lane, Asheville, NC 28801';
export const STUDIO_PHONE = '(828) 555-0142';
export const STUDIO_EMAIL = 'hello@willowcreekyoga.com';
export const STUDIO_HOURS: { day: string; hours: string }[] = [
  { day: 'Monday — Friday', hours: '6:00 AM — 9:00 PM' },
  { day: 'Saturday', hours: '7:00 AM — 6:00 PM' },
  { day: 'Sunday', hours: '8:00 AM — 2:00 PM' },
];

export const HERO_VIDEO_URL =
  'https://videos.pexels.com/video-files/3760884/3760884-hd_1920_1080_25fps.mp4';
export const HERO_POSTER =
  'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080';

export const DAYS: { value: string; label: string; short: string }[] = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all: 'All Levels',
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-forest-100 text-forest-700',
  intermediate: 'bg-sand-100 text-sand-700',
  advanced: 'bg-clay-100 text-clay-700',
  all: 'bg-sage-100 text-sage-700',
};
