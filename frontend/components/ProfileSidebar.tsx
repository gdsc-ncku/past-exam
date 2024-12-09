import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileSidebar() {
  const pathname = usePathname();

  // Function to determine the active class based on the current path
  const getLinkClassName = (path: string) => `
    block rounded px-4 py-2 
    ${pathname === path ? 'bg-gray-700' : 'hover:bg-gray-700'}
  `;

  return (
    <aside className="w-64 bg-gray-800 p-4 text-white">
      <nav className="space-y-2">
        <Link href="/profile" className={getLinkClassName('/profile')}>
          編輯個人資料
        </Link>
        <Link
          href="/profile/uploaded-exams"
          className={getLinkClassName('/profile/uploaded-exams')}
        >
          上傳的考題清單
        </Link>
        <Link
          href="/profile/starred-exams"
          className={getLinkClassName('/profile/starred-exams')}
        >
          收藏的考題清單
        </Link>
      </nav>
    </aside>
  );
}
