export interface NavLink {
  href: string;
  label: string;
}

export const ROUTES = {
  FILES: '/files',
  UPLOAD: '/upload',
  SEARCH: '/search',
} as const;

export const navLinks: NavLink[] = [
  { href: ROUTES.FILES, label: 'Files' },
  { href: ROUTES.SEARCH, label: 'Upload' },
  { href: ROUTES.UPLOAD, label: 'Search' },
];