'use client';

import { CourseTitle } from '@/components/CoursePage';
import { Button } from '@/ui/Button';

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
      <div className="flex items-center justify-center space-x-1">
        <div className="flex items-center space-x-5">
          <Button className="bg-secondary-100">所有年份</Button>
          <Button className="bg-secondary-100">所有考試</Button>
          <Button className="bg-secondary-100">評分:由高到低</Button>
          <Button className="bg-secondary-100">下載量:由高到低</Button>
        </div>
      </div>
      <div className="space-y-8 px-6 md:px-8 lg:px-12"></div>
    </div>
  );
}
