export interface NavLink {
  href: string;
  label: string;
}

export const ROUTES = {
  files: '/files',
  upload: '/upload',
  search: '/search',
} as const;

export const navLinks: NavLink[] = [
  { href: ROUTES.files, label: 'Files' },
  { href: ROUTES.upload, label: 'Upload' },
  { href: ROUTES.search, label: 'Search' },
];
