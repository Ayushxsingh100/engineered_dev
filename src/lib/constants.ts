export const SITE_NAME = 'engineered.dev';

export const SITE_DESCRIPTION =
  'Engineering notes on cloud computing, backend systems, and scalable architecture';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://engineered.dev';

export const AUTHOR_NAME = 'Ayush Singh';

export const SOCIAL_LINKS = {
  github: 'https://github.com/ayushsingh',
  twitter: 'https://twitter.com/ayushsingh_dev',
  linkedin: 'https://linkedin.com/in/ayushsingh-dev',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
] as const;
