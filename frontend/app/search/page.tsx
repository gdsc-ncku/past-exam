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
  Search,
} from 'lucide-react';
import { courseAPI, Course } from '@/module/api/course';
import { getDepartmentInfo, ACADEMIES } from '@/module/data/departments';
import { Loader2 } from 'lucide-react';
import { CourseCard } from '@/app/components/CourseCard';
import { DepartmentSelector } from '@/app/components/DepartmentSelector';

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

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState<'quick' | 'department'>('quick');
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
          <div title="第一頁">
            <ChevronFirst 
              className={`h-6 w-6 cursor-pointer transition-colors ${
                currentOffset === 0 || disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => !disabled && currentOffset !== 0 && handlePageClick(1)}
            />
          </div>
          <div title="上一頁">
            <ChevronLeft 
              className={`h-6 w-6 cursor-pointer transition-colors ${
                currentOffset === 0 || disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => !disabled && currentOffset !== 0 && handlePageClick(currentPage - 1)}
            />
          </div>

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
              className="h-8 w-12 rounded-md border border-gray-300 text-center text-sm text-gray-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            />
            <span className="text-sm text-gray-600">
              頁，共 {totalPages} 頁
            </span>
          </form>

          <div title="下一頁">
            <ChevronRightIcon 
              className={`h-6 w-6 cursor-pointer transition-colors ${
                currentOffset + ITEMS_PER_PAGE >= totalItems || disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => !disabled && currentOffset + ITEMS_PER_PAGE < totalItems && handlePageClick(currentPage + 1)}
            />
          </div>
          <div title="最後一頁">
            <ChevronLast 
              className={`h-6 w-6 cursor-pointer transition-colors ${
                currentOffset + ITEMS_PER_PAGE >= totalItems || disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => !disabled && currentOffset + ITEMS_PER_PAGE < totalItems && handlePageClick(totalPages)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title and Subtitle */}
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">成大知識共享平台</h1>
        <p className="text-lg text-gray-600">檢索知識，從這裡開始！</p>
      </div>

      {/* Search Interface */}
      <div className="mb-8">
        {/* Search Tabs */}
        <div className="mb-6 flex space-x-8">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2 text-lg font-medium transition-colors ${
              activeTab === 'quick'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            快速搜尋
          </button>
          <button
            onClick={() => setActiveTab('department')}
            className={`pb-2 text-lg font-medium transition-colors ${
              activeTab === 'department'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            依系所
          </button>
        </div>

        {/* Search Content */}
        <div className="space-y-6">
          {activeTab === 'quick' ? (
            /* Quick Search */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams();
                if (localFilters.search_text) {
                  params.set('search_text', localFilters.search_text);
                }
                params.set('limit', ITEMS_PER_PAGE.toString());
                params.set('offset', '0');
                router.replace(`/search?${params.toString()}`, { scroll: false });
                handleSearch(e, 0);
              }}
              className="relative"
            >
              <div className="relative">
                <input
                  type="text"
                  value={localFilters.search_text}
                  onChange={(e) => handleFilterChange('search_text', e.target.value)}
                  placeholder="輸入課程關鍵字/教授名/課程代碼......"
                  className="w-full rounded-full border-2 border-gray-200 bg-gray-50 py-4 pl-6 pr-16 text-lg placeholder-gray-400 transition-colors focus:border-gray-300 focus:bg-white focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#C3F53C] text-gray-800 transition-colors hover:bg-[#B8ED2F]"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          ) : (
            /* Department Search */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams();
                Object.entries(localFilters).forEach(([key, value]) => {
                  if (value && value !== 'all') {
                    params.set(key, value);
                  }
                });
                params.set('limit', ITEMS_PER_PAGE.toString());
                params.set('offset', '0');
                router.replace(`/search?${params.toString()}`, { scroll: false });
                handleSearch(e, 0);
              }}
              className="relative"
            >
              <div className="relative rounded-full border-2 border-gray-200 bg-gray-50 transition-colors focus-within:border-gray-300 focus-within:bg-white">
                <div className="flex items-center py-2 pl-6 pr-16">
                  {/* Course Name Input */}
                  <input
                    type="text"
                    value={localFilters.search_text}
                    onChange={(e) =>
                      handleFilterChange('search_text', e.target.value)
                    }
                    placeholder="課程名稱"
                    disabled={loading}
                    className="flex-1 border-0 bg-transparent text-lg placeholder-gray-400 focus:outline-none focus:ring-0"
                  />
                  
                  {/* Separator */}
                  <div className="mx-4 h-8 w-px bg-gray-300"></div>
                  
                  {/* Department Selector */}
                  <div className="w-48">
                    <DepartmentSelector
                      value={localFilters.departmentId}
                      onChange={(value) => handleFilterChange('departmentId', value)}
                      disabled={loading}
                      className="border-0 text-lg focus:ring-0"
                    />
                  </div>
                </div>
                
                {/* Search Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#C3F53C] text-gray-800 transition-colors hover:bg-[#B8ED2F]"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Clear Filter Button */}
              <div className="mt-4 flex justify-end">
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
                  className="text-sm"
                >
                  清除篩選
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

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
