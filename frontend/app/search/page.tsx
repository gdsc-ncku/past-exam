'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { Label } from '@/ui/Label';
import {
  ChevronDown,
  ChevronRight,
  Check,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react';
import { courseAPI, Course } from '@/module/api/course';
import { getDepartmentInfo, ACADEMIES } from '@/module/data/departments';
import { Loader2 } from 'lucide-react';
import { CourseCard } from '@/app/components/CourseCard';

// Loading spinner component
const LoadingSpinner = ({
  size = 'default',
  className = '',
}: {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-500`} />
    </div>
  );
};

// Loading skeleton for course rows
const CourseRowSkeleton = () => (
  <div className="animate-pulse border-b border-gray-200 py-4">
    <div className="flex items-center justify-between">
      <div className="flex-1 space-y-2">
        <div className="h-5 w-1/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
      </div>
      <div className="w-1/4 space-y-2">
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
);

// Utility functions for formatting
const formatCredits = (credits: string) => {
  const num = parseFloat(credits);
  return Number.isInteger(num) ? num.toString() : credits;
};

const formatGrade = (grade: string) => {
  const gradeMap: { [key: string]: string } = {
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '1.0': '一',
    '2.0': '二',
    '3.0': '三',
    '4.0': '四',
  };
  return gradeMap[grade] || grade;
};

// Custom collapsible department selector component
const DepartmentSelector = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedAcademies, setExpandedAcademies] = useState<Set<string>>(
    new Set(),
  );

  const toggleAcademy = (code: string) => {
    setExpandedAcademies((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const selectedDept =
    value === 'all'
      ? '全部'
      : ACADEMIES.flatMap((a) => a.departments).find((d) => d.code === value)
          ?.name || '選擇系所';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}
          ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}`}
      >
        <span className="truncate">{selectedDept}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-[300px] w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-1">
            <button
              onClick={() => {
                onChange('all');
                setIsOpen(false);
              }}
              className={`flex w-full items-center rounded-md px-2 py-1.5 text-sm
                ${value === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              <span className="flex-1 text-left">全部</span>
              {value === 'all' && <Check className="h-4 w-4" />}
            </button>

            {ACADEMIES.map((academy) => (
              <div key={academy.code} className="mt-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAcademy(academy.code);
                  }}
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {expandedAcademies.has(academy.code) ? (
                    <ChevronDown className="mr-1 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-1 h-4 w-4" />
                  )}
                  {academy.name}
                </button>

                {expandedAcademies.has(academy.code) && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {academy.departments.map((dept) => (
                      <button
                        key={dept.code}
                        onClick={() => {
                          onChange(dept.code);
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-center rounded-md px-2 py-1.5 text-sm
                          ${value === dept.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                      >
                        <span className="flex-1 text-left">
                          {dept.name} ({dept.code})
                        </span>
                        {value === dept.code && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [localFilters, setLocalFilters] = useState({
    search_text: searchParams.get('search_text') || '',
    departmentId: searchParams.get('departmentId') || 'all',
  });

  // Initial search when page loads with URL parameters
  useEffect(() => {
    const hasSearchParams = Array.from(searchParams.entries()).length > 0;
    if (hasSearchParams) {
      const offset = parseInt(searchParams.get('offset') || '0');
      setCurrentOffset(offset);
      handleSearch(undefined, offset);
      setHasSearched(true);
    }
  }, []); // Only run on mount

  const handleSearch = async (e?: React.FormEvent, offset: number = 0) => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentOffset(offset);

    try {
      // Convert 'all' to empty string for API call
      const apiFilters = {
        ...localFilters,
        departmentId:
          localFilters.departmentId === 'all' ? '' : localFilters.departmentId,
        offset,
        limit: ITEMS_PER_PAGE,
      };
      const response = await courseAPI.searchCourses(apiFilters);
      const { data, total } = response.data;

      if (response.data.status === 'success' && data) {
        setSearchResults(data);
        setTotalItems(total);
        // Remove URL update from here since it's handled in form submission and handleOffsetChange
      } else {
        setError(response.data.message || '搜尋失敗');
      }
    } catch (err) {
      setError('搜尋時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleOffsetChange = (offset: number) => {
    // Update URL with all current search params plus new offset
    const params = new URLSearchParams();
    // Preserve all current search parameters
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });
    // Add the new offset and limit
    params.set('offset', offset.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());
    // Update URL without navigation
    router.replace(`/search?${params.toString()}`, { scroll: false });

    // Then perform search
    handleSearch(undefined, offset);
  };

  // Calculate total pages for display
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPage = Math.floor(currentOffset / ITEMS_PER_PAGE) + 1;

  // Pagination component
  const Pagination = ({
    currentOffset,
    totalItems,
    onOffsetChange,
    disabled,
  }: {
    currentOffset: number;
    totalItems: number;
    onOffsetChange: (offset: number) => void;
    disabled?: boolean;
  }) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const currentPage = Math.floor(currentOffset / ITEMS_PER_PAGE) + 1;
    const [inputPage, setInputPage] = useState(currentPage.toString());

    // Update input page when current page changes
    useEffect(() => {
      setInputPage(currentPage.toString());
    }, [currentPage]);

    const handlePageClick = (page: number) => {
      const newOffset = (page - 1) * ITEMS_PER_PAGE;
      onOffsetChange(newOffset);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        setInputPage(value);
      }
    };

    const handleInputSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const page = parseInt(inputPage);
      if (page && page >= 1 && page <= totalPages) {
        handlePageClick(page);
      } else {
        setInputPage(currentPage.toString());
      }
    };

    const handleInputBlur = () => {
      setInputPage(currentPage.toString());
    };

    return (
      <div className="mt-4 flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => handlePageClick(1)}
            disabled={currentOffset === 0 || disabled}
            className="h-8 px-2"
            title="第一頁"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentOffset === 0 || disabled}
            className="h-8 px-2"
            title="上一頁"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <form
            onSubmit={handleInputSubmit}
            className="flex items-center space-x-2"
          >
            <span className="text-sm text-gray-600">第</span>
            <input
              type="text"
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="h-8 w-12 rounded-md border border-gray-300 text-center focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            />
            <span className="text-sm text-gray-600">
              頁，共 {totalPages} 頁
            </span>
          </form>

          <Button
            variant="secondary"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentOffset + ITEMS_PER_PAGE >= totalItems || disabled}
            className="h-8 px-2"
            title="下一頁"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => handlePageClick(totalPages)}
            disabled={currentOffset + ITEMS_PER_PAGE >= totalItems || disabled}
            className="h-8 px-2"
            title="最後一頁"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">課程搜尋</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Update URL first with search parameters
          const params = new URLSearchParams();
          Object.entries(localFilters).forEach(([key, value]) => {
            if (value && value !== 'all') {
              params.set(key, value);
            }
          });
          params.set('limit', ITEMS_PER_PAGE.toString());
          params.set('offset', '0');
          router.replace(`/search?${params.toString()}`, { scroll: false });
          // Then perform search
          handleSearch(e, 0);
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search_text">搜尋文字</Label>
              <Input
                id="search_text"
                value={localFilters.search_text}
                onChange={(e) =>
                  handleFilterChange('search_text', e.target.value)
                }
                placeholder="搜尋所有欄位..."
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">系所</Label>
              <DepartmentSelector
                value={localFilters.departmentId}
                onChange={(value) => handleFilterChange('departmentId', value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setLocalFilters({
                search_text: '',
                departmentId: 'all',
              });
              setSearchResults([]);
              router.push('/search');
            }}
            disabled={loading}
          >
            清除篩選
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>搜尋中...</span>
              </div>
            ) : (
              '搜尋'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8">
          <LoadingSpinner size="lg" className="mb-8" />
          <div className="divide-y divide-gray-200">
            {[...Array(6)].map((_, index) => (
              <CourseRowSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {searchResults.length > 0 ? (
            <div className="mt-8 space-y-4">
              {searchResults.map((course) => (
                <CourseCard key={course.course_id} course={course} />
              ))}
              <Pagination
                currentOffset={currentOffset}
                totalItems={totalItems}
                onOffsetChange={handleOffsetChange}
                disabled={loading}
              />
            </div>
          ) : hasSearched ? (
            <div className="mt-8 text-center text-gray-500">
              找不到符合的課程。請調整搜尋條件。
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-lg text-gray-600">載入中...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
