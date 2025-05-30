'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { courseAPI, Course } from '@/module/api/course';
import { getDepartmentInfo } from '@/module/data/departments';
import { Input } from '@/ui/Input';

interface CourseSearchSelectorProps {
  value: string; // course_id
  courseName: string;
  onSelect: (course: {
    courseId: string;
    courseName: string;
    courseCode: string;
    instructor: string;
  }) => void;
  disabled?: boolean;
  className?: string;
}

export const CourseSearchSelector = ({
  value,
  courseName,
  onSelect,
  disabled,
  className = '',
}: CourseSearchSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when search query changes
  useEffect(() => {
    setSearchResults([]);
    setCurrentOffset(0);
    setHasMoreResults(true);
    setHasSearched(false);
  }, [searchQuery]);

  const handleSearch = async (
    query: string,
    offset: number = 0,
    append: boolean = false,
  ) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setCurrentOffset(0);
      setHasMoreResults(true);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setHasSearched(true);
    }

    try {
      const response = await courseAPI.searchCourses({
        search_text: query,
        limit: 10,
        offset: offset,
      });

      if (response.data.status === 'success') {
        const newResults = response.data.data || [];
        const totalResults = response.data.total || 0;

        if (append) {
          setSearchResults((prev) => [...prev, ...newResults]);
        } else {
          setSearchResults(newResults);
        }

        // Check if there are more results to load
        setHasMoreResults(offset + newResults.length < totalResults);
        setCurrentOffset(offset + newResults.length);
      } else {
        if (!append) {
          setSearchResults([]);
        }
        setHasMoreResults(false);
      }
    } catch (error) {
      console.error('Course search error:', error);
      if (!append) {
        setSearchResults([]);
      }
      setHasMoreResults(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Debounce search for new queries
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery, 0, false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle scroll for lazy loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrolledToBottom = scrollHeight - scrollTop <= clientHeight + 100; // 100px threshold

    if (
      scrolledToBottom &&
      hasMoreResults &&
      !loadingMore &&
      !loading &&
      searchQuery.trim()
    ) {
      handleSearch(searchQuery, currentOffset, true);
    }
  };

  const handleCourseSelect = (course: Course) => {
    const deptInfo = getDepartmentInfo(course.departmentId);

    onSelect({
      courseId: course.course_id,
      courseName: course.courseName,
      courseCode: `${course.departmentId}-${course.serialNumber}`,
      instructor: course.instructors,
    });

    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setCurrentOffset(0);
    setHasMoreResults(true);
  };

  const clearSelection = () => {
    onSelect({
      courseId: '',
      courseName: '',
      courseCode: '',
      instructor: '',
    });
  };

  const displayText = courseName || '搜尋並選擇課程';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left text-sm
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}
          ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}
          ${!courseName ? 'text-gray-500' : 'text-gray-900'}`}
      >
        <span className="flex-1 truncate">{displayText}</span>
        <div className="flex items-center space-x-1">
          {courseName && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="rounded p-1 hover:bg-gray-200"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="搜尋課程名稱、課程代碼或教師..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="max-h-64 overflow-y-auto"
            onScroll={handleScroll}
          >
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                搜尋中...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-1">
                {searchResults.map((course, index) => {
                  const deptInfo = getDepartmentInfo(course.departmentId);
                  const isSelected = course.course_id === value;

                  return (
                    <button
                      key={`${course.course_id}-${index}`}
                      type="button"
                      onClick={() => handleCourseSelect(course)}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                        isSelected ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="truncate font-medium">
                              {course.courseName}
                            </span>
                            {isSelected && (
                              <Check className="h-4 w-4 text-blue-700" />
                            )}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            <span>
                              {course.departmentId}-{course.serialNumber}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{deptInfo.name}</span>
                            <span className="mx-2">•</span>
                            <span>{course.instructors}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {loadingMore && (
                  <div className="p-2 text-center text-sm text-gray-500">
                    載入更多結果...
                  </div>
                )}
                {!hasMoreResults && searchResults.length > 0 && (
                  <div className="p-2 text-center text-sm text-gray-400">
                    已顯示所有結果
                  </div>
                )}
              </div>
            ) : hasSearched ? (
              <div className="p-4 text-center text-sm text-gray-500">
                找不到符合的課程
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                請輸入關鍵字搜尋課程
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
