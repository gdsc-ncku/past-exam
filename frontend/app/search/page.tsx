'use client';

import { CourseTitle } from '@/components/CoursePage';

export default function SearchPage() {
  // You would typically fetch this data from your API
  const courseData = {
    title: '微積分 (一)',
    courseId: 'CS302',
    professor: '數學系-舒宇辰',
    date: '2',
    section: '3-4',
  };

  return (
    <div className="mx-auto mt-8">
      <CourseTitle
        title={courseData.title}
        courseId={courseData.courseId}
        professor={courseData.professor}
        date={courseData.date}
        section={courseData.section}
      />

      <div className="space-y-8 px-6 md:px-8 lg:px-12"></div>
    </div>
  );
}
