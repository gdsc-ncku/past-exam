import Link from 'next/link';

export const GlobalNav = () => {
  return (
    <div className="fixed top-0 z-10 flex w-full border-b border-gray-800 bg-gray-300 lg:w-full lg:border-b-0 lg:border-r lg:border-gray-800">
      <div className="flex items-center px-4 py-4">Do something here</div>
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
