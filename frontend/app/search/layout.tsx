'use client';
import React from 'react';
import { Icon } from '@/ui/icons';

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const courseData = { title: 'B3-101 微積分（一）' };

  const CourseBar = () => {
    return (
      <div className="bg-white shadow-sm">
        <div className="relative flex h-2 w-full items-center">
          <p className="text-small">{courseData.title}</p>
          <Icon name="chevron-right" size={24} />
          <Icon name="chevron-right" size={24} />
        </div>
      </div>
    );
  };
  return (
    <div className="flex">
      <CourseBar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
