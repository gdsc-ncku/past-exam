'use client';
import React from 'react';
import { CourseNavigation } from '@/components/CoursePage/CourseNavigation';

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const course_title = '微積分 (一)';
  return (
    <div>
      <CourseNavigation title={course_title} />
      {children}
    </div>
  );
}
