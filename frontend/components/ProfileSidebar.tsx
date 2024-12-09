import React from 'react';
import Link from 'next/link';

export default function ProfileSidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-4 text-white">
      <nav className="space-y-2">
        <Link
          href="/profile"
          className="block rounded px-4 py-2 hover:bg-gray-700"
        >
          編輯個人資料
        </Link>
        <Link
          href="/profile/uploaded-exams"
          className="block rounded px-4 py-2 hover:bg-gray-700"
        >
          上傳的考題清單
        </Link>
        <Link
          href="/profile/starred-exams"
          className="block rounded px-4 py-2 hover:bg-gray-700"
        >
          收藏的考題清單
        </Link>
      </nav>
    </aside>
  );
}
