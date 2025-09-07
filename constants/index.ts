// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://krishok-bondhu-backend-1.onrender.com';

// NAVIGATION
export const NAV_LINKS = [
  { href: '/', key: 'home', label: 'হোম' },
  { href: '/about', key: 'about', label: 'আমাদের সম্পর্কে' },
  { href: '/services', key: 'services', label: 'সেবা' },
  {
    href: '/expert-consultation',
    key: 'expert_consultation',
    label: 'বিশেষজ্ঞ পরামর্শ',
  },
];
