'use client';

import Link from 'next/link';
import { navLinks } from './Link';
import Image from 'next/image';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuthentication } from '@/hooks/useAuthentication';


export const GlobalNav = () => {
  
  const {isDropdownOpen,toggleDropdown} = useNavigation();

  const{currentUser, handleLogout, handleLogin} = useAuthentication();

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
        {/* Conditional rendering for Login / User Avatar */}
        <div className="flex items-center space-x-5">
          {currentUser ? (
            // If logged in, show the user's avatar
            <div className="relative">
              <Image
                src={currentUser.avatar}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                onClick={toggleDropdown} // Toggle dropdown on avatar click
              />
              <span className="text-gray-800 font-semibold">{currentUser.userName}</span>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                  <ul className="space-y-2 p-2">
                    <li>
                      <button
                        onClick={() => {handleLogout();toggleDropdown();}}
                        className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // If not logged in, show the "Login" button
            <button
              onClick={handleLogin}
              className="text-white bg-blue-500 rounded-full px-4 py-2 transition-colors duration-200 hover:bg-blue-400"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
