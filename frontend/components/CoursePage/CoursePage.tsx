'use client';

import React, { useState, useEffect } from 'react';
import { CourseTitle } from './CourseTitle';
import { CourseNavigation } from './CourseNavigation';
import { FilterBar } from './FilterBar';
import { ExamItem } from './ExamItem';
import { Pagination } from './Pagination';

interface ExamData {
  id: string;
  title: string;
  year: string;
  examType: string;
  downloadCount: number;
  isFavorite: boolean;
}

// Custom hook for managing filters and sorting
const useExamFilters = (initialExams: ExamData[]) => {
  const [yearFilter, setYearFilter] = useState<string>('所有年份');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('所有考試');
  const [sortBy, setSortBy] = useState<string>('評分:由高到低');
  const [filteredExams, setFilteredExams] = useState<ExamData[]>(initialExams);

  useEffect(() => {
    let result = [...initialExams];

    // Apply year filter
    if (yearFilter !== '所有年份') {
      result = result.filter((exam) => exam.year === yearFilter);
    }

    // Apply exam type filter
    if (examTypeFilter !== '所有考試') {
      result = result.filter((exam) => exam.examType === examTypeFilter);
    }

    // Apply sorting
    if (sortBy === '評分:由高到低') {
      // This would need actual rating data
      // For now, just a placeholder sort
      result = [...result];
    } else if (sortBy === '下載量:由高到低') {
      result = result.sort((a, b) => b.downloadCount - a.downloadCount);
    }

    setFilteredExams(result);
  }, [initialExams, yearFilter, examTypeFilter, sortBy]);

  return {
    yearFilter,
    setYearFilter,
    examTypeFilter,
    setExamTypeFilter,
    sortBy,
    setSortBy,
    filteredExams,
  };
};

export default function CoursePage() {
  // Course data
  const courseData = {
    title: '微積分 (一)',
    courseId: 'B3-101',
    professor: '數學系-舒宇辰',
    date: '2',
    section: '3-4',
  };

  // Mock exam data
  const [exams, setExams] = useState<ExamData[]>([
    {
      id: '1',
      title: 'Default',
      year: '2023',
      examType: '期中考',
      downloadCount: 120,
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Default',
      year: '2023',
      examType: '期末考',
      downloadCount: 85,
      isFavorite: true,
    },
    {
      id: '3',
      title: 'Default',
      year: '2022',
      examType: '期中考',
      downloadCount: 210,
      isFavorite: false,
    },
    {
      id: '4',
      title: 'Default',
      year: '2022',
      examType: '期末考',
      downloadCount: 195,
      isFavorite: false,
    },
    {
      id: '5',
      title: 'Default',
      year: '2021',
      examType: '期中考',
      downloadCount: 95,
      isFavorite: true,
    },
    {
      id: '6',
      title: 'Default',
      year: '2021',
      examType: '期末考',
      downloadCount: 88,
      isFavorite: false,
    },
  ]);

  // Use custom hook for filtering
  const {
    yearFilter,
    setYearFilter,
    examTypeFilter,
    setExamTypeFilter,
    sortBy,
    setSortBy,
    filteredExams,
  } = useExamFilters(exams);

  // Pagination state
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExams.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Toggle favorite
  const handleToggleFavorite = (examId: string) => {
    setExams(
      exams.map((exam) =>
        exam.id === examId ? { ...exam, isFavorite: !exam.isFavorite } : exam,
      ),
    );
  };

  // Handle download
  const handleDownload = (examId: string) => {
    console.log(`Downloading exam ${examId}`);
    // Implementation for download functionality would go here
  };

  // Filter options
  const yearOptions = [
    { label: '所有年份', value: '所有年份' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
  ];

  const examTypeOptions = [
    { label: '所有考試', value: '所有考試' },
    { label: '期中考', value: '期中考' },
    { label: '期末考', value: '期末考' },
  ];

  const sortOptions = [
    { label: '評分:由高到低', value: '評分:由高到低' },
    { label: '下載量:由高到低', value: '下載量:由高到低' },
  ];

  return (
    <>
      <CourseNavigation title={courseData.title} />

      <div className="mx-auto mt-8 max-w-6xl px-4">
        {/* Course Title */}
        <CourseTitle
          title={courseData.title}
          courseId={courseData.courseId}
          professor={courseData.professor}
          date={courseData.date}
          section={courseData.section}
        />

        {/* Filter Bar */}
        <FilterBar
          yearOptions={yearOptions}
          examTypeOptions={examTypeOptions}
          sortOptions={sortOptions}
          selectedYear={yearFilter}
          selectedExamType={examTypeFilter}
          selectedSort={sortBy}
          onYearChange={setYearFilter}
          onExamTypeChange={setExamTypeFilter}
          onSortChange={setSortBy}
        />

        {/* Exam List */}
        <div className="space-y-4">
          {getCurrentPageItems().map((exam) => (
            <ExamItem
              key={exam.id}
              title={exam.title}
              year={exam.year}
              examType={exam.examType}
              downloadCount={exam.downloadCount}
              isFavorite={exam.isFavorite}
              onFavoriteToggle={() => handleToggleFavorite(exam.id)}
              onDownload={() => handleDownload(exam.id)}
            />
          ))}
        </div>

        {/* Show message if no exams match filters */}
        {filteredExams.length === 0 && (
          <div className="my-12 flex flex-col items-center justify-center">
            <p className="text-secondary-700 text-large-content">
              沒有符合條件的考古題
            </p>
            <p className="text-body-content mt-2 text-secondary-500">
              請嘗試調整篩選條件
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredExams.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
}
