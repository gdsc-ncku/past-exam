export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '/files', label: 'Files' },
  { href: '/upload', label: 'Upload' },
  { href: '/search', label: 'Search' },
];