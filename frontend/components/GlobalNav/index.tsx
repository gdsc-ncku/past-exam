import Link from 'next/link';
import { navLinks } from './Link';
import Image from 'next/image';
export const GlobalNav = () => {
  return (
    <div className="fixed top-0 z-10 w-full border-b border-gray-800 bg-gray-300 lg:w-full lg:border-b-0 lg:border-r lg:border-gray-800">
      <div className="flex w-full items-center space-x-8 px-4 py-4">
        {/* Left Section - Logo and Search */}
        <div className="flex items-center space-x-4">
          <Image
            src="/nextjs-icon-light-background.png"
            className="h-10 rounded-full shadow-md"
            alt="Logo"
            width={40}
            height={40}
          />
          <input
            type="text"
            placeholder="Search"
            className="rounded-full border border-gray-600 bg-gray-200 px-4 py-2 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Right Section - Links */}
        <div className="flex items-center space-x-5 text-gray-700">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors duration-200 hover:text-blue-400 focus:text-zinc-500 focus:outline-none"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
