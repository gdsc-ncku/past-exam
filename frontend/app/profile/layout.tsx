'use client';
import React from 'react';
import { ReactNode } from 'react';
import ProfileSidebar from '@/components/ProfileSidebar';

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="flex">
      <ProfileSidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
