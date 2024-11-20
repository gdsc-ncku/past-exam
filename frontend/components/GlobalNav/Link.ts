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
  { href: ROUTES.UPLOAD, label: 'Upload' },
  { href: ROUTES.SEARCH, label: 'Search' },
];