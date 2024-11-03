import Link from 'next/link';

export const GlobalNav = () => {
  return (
    <div className="fixed top-0 z-10 flex w-full border-b border-gray-800 bg-gray-300 lg:w-full lg:border-b-0 lg:border-r lg:border-gray-800">
      <div className="flex items-center w-full px-4 py-4">
        {/* Left Section - Logo and Search */}
        <div className="flex items-center space-x-4">
            <img 
              src="frontend/public/nextjs-icon-light-background.png" 
              className="h-10 w-auto rounded-full shadow-md" 
              alt="Logo" 
            />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full max-w-xs px-4 py-2 text-sm bg-gray-400 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Right Section - Links */}
        <div className="flex items-center space-x-8 text-white">
          <Link href="/Files" className="hover:text-blue-400 transition-colors duration-200">
            Files
          </Link>
          <Link href="/upload" className="hover:text-blue-400 transition-colors duration-200">
            Upload
          </Link>
          <Link href="/Search" className="hover:text-blue-400 transition-colors duration-200">
            Search
          </Link>
        </div>
      </div>
    </div>
  );
};

// What you need to do:
// 1. Add a random logo
// 2. Add a search input
// 3. link to these pages:
// - /
// - /files
// - /upload
// - /search
// 4. Style the global nav whatever you want with tailwind
