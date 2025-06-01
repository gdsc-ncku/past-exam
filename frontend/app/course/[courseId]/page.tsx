'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  User,
  BookOpen,
  Building2,
  Hash,
  Users,
  Star,
  Clock,
  Bookmark,
} from 'lucide-react';
import { courseAPI, Course } from '@/module/api/course';
import { uploadAPI, FileResponse } from '@/module/api/upload';
import { bookmarkAPI } from '@/module/api/bookmark';
import { getDepartmentInfo } from '@/module/data/departments';
import { downloadFile } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CoursePageParams {
  courseId: string;
}

// Extended file interface with bookmark status
interface ExtendedFileResponse extends FileResponse {
  isBookmarked?: boolean;
  year?: string;
  examScope?: string;
  courseName?: string;
  courseCode?: string;
  instructor?: string;
}

const examTypeMap: { [key: string]: string } = {
  midterm: '期中考',
  final: '期末考',
  quiz: '小考',
  homework: '作業',
  others: '其他',
  other: '其他',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') {
    return <FileText className="h-5 w-5 text-red-500" />;
  } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
    return <FileText className="h-5 w-5 text-blue-500" />;
  } else if (['doc', 'docx'].includes(extension || '')) {
    return <FileText className="h-5 w-5 text-blue-600" />;
  }
  return <FileText className="h-5 w-5 text-gray-500" />;
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [files, setFiles] = useState<ExtendedFileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const courseResponse = await courseAPI.getCourse(courseId);
        if (
          courseResponse.data.status === 'success' &&
          courseResponse.data.data
        ) {
          setCourse(courseResponse.data.data);
        } else {
          setError('無法載入課程資訊');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('載入課程時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    const fetchFiles = async () => {
      try {
        setFilesLoading(true);

        // Fetch files for this course
        const filesResponse = await uploadAPI.getFilesByCourse(courseId);
        if (filesResponse.data.status === 'success') {
          const filesData = filesResponse.data.data || [];

          // Enhance files with bookmark status
          const enhancedFiles = await Promise.all(
            filesData.map(async (file) => {
              let isBookmarked = false;
              try {
                const bookmarkResponse = await bookmarkAPI.checkBookmarkStatus(
                  file.file_id,
                );
                if (
                  bookmarkResponse.data.status === 'success' &&
                  bookmarkResponse.data.data
                ) {
                  isBookmarked = bookmarkResponse.data.data.is_bookmarked;
                }
              } catch (bookmarkError) {
                console.error('Error fetching bookmark status:', bookmarkError);
              }

              return {
                ...file,
                isBookmarked,
              };
            }),
          );

          setFiles(enhancedFiles);
        }
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        setFilesLoading(false);
      }
    };

    fetchCourseData();
    fetchFiles();
  }, [courseId]);

  const handleDownload = async (file: ExtendedFileResponse) => {
    await downloadFile(file.file_location, file.filename);
  };

  const handleBookmarkToggle = async (file: ExtendedFileResponse) => {
    try {
      if (file.isBookmarked) {
        await bookmarkAPI.removeBookmark(file.file_id);
      } else {
        await bookmarkAPI.addBookmark(file.file_id);
      }

      // Update local state
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file_id === file.file_id
            ? { ...f, isBookmarked: !f.isBookmarked }
            : f,
        ),
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-4">
            <FileText className="mx-auto h-16 w-16 text-gray-400" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            {error || '課程不存在'}
          </h2>
          <p className="mb-6 text-gray-600">
            無法找到您要查看的課程，請檢查網址是否正確。
          </p>
          <Button onClick={() => router.push('/search')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回搜尋
          </Button>
        </div>
      </div>
    );
  }

  const deptInfo = getDepartmentInfo(course.departmentId);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header with back button */}
      <div className="mb-4 flex items-center space-x-4 sm:mb-6">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-sm sm:text-base"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>返回</span>
        </Button>
      </div>

      {/* Course Information Card */}
      <Card className="mb-6 p-4 sm:mb-8 sm:p-6 lg:p-8">
        <div className="flex flex-col items-start space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
          {/* Course Icon */}
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 sm:mx-0 sm:h-16 sm:w-16">
            <span className="text-lg font-bold text-white sm:text-2xl">
              {deptInfo.name.charAt(0)}
            </span>
          </div>

          {/* Course Details */}
          <div className="w-full flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="w-full">
                <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                  {course.courseName}
                </h1>
                <div className="mb-4 flex flex-col items-center justify-center space-y-2 text-sm text-gray-600 sm:flex-row sm:justify-start sm:space-x-4 sm:space-y-0 sm:text-base lg:text-lg">
                  <span className="flex items-center space-x-1">
                    <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {course.departmentId}-{course.serialNumber}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{deptInfo.name}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Course Metadata Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-6 lg:grid-cols-4">
              <div className="flex items-center justify-center space-x-2 p-1 sm:justify-start sm:space-x-3 sm:p-0">
                <User className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 sm:text-sm">授課教師</p>
                  <p className="text-xs font-medium sm:text-sm lg:text-base">
                    {course.instructors}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 p-1 sm:justify-start sm:space-x-3 sm:p-0">
                <BookOpen className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 sm:text-sm">學分數</p>
                  <p className="text-xs font-medium sm:text-sm lg:text-base">
                    {course.credits} 學分
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 p-1 sm:justify-start sm:space-x-3 sm:p-0">
                <Users className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 sm:text-sm">適用年級</p>
                  <p className="text-xs font-medium sm:text-sm lg:text-base">
                    {course.forGrade} 年級
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 p-1 sm:justify-start sm:space-x-3 sm:p-0">
                <Calendar className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 sm:text-sm">學期</p>
                  <p className="text-xs font-medium sm:text-sm lg:text-base">
                    {course.semester}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Notes */}
            {course.courseNote && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3 sm:mt-6 sm:p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-900 sm:text-base">
                  課程備註
                </h3>
                <p className="text-sm text-gray-700 sm:text-base">
                  {course.courseNote}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Files Section */}
      <Card className="p-4 sm:p-6 lg:p-8">
        <div className="mb-4 flex flex-col items-start justify-between space-y-3 sm:mb-6 sm:flex-row sm:items-center sm:space-y-0">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
            考古題檔案
          </h2>
          <div className="flex w-full flex-col items-start space-y-2 sm:w-auto sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="text-xs text-gray-500 sm:text-sm">
              {files.length} 個檔案
            </div>
            <Button
              onClick={() => {
                const params = new URLSearchParams({
                  courseId: course.course_id,
                  courseName: course.courseName,
                  courseCode: `${course.departmentId}-${course.serialNumber}`,
                  instructor: course.instructors,
                });
                router.push(`/upload?${params.toString()}`);
              }}
              className="flex w-full items-center justify-center space-x-2 text-sm sm:w-auto sm:text-base"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>上傳檔案</span>
            </Button>
          </div>
        </div>

        {filesLoading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500 sm:h-8 sm:w-8" />
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center sm:py-12">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
            <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">
              尚無檔案
            </h3>
            <p className="mb-4 px-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              此課程目前還沒有上傳的考古題檔案。
            </p>
            <Button
              onClick={() => {
                const params = new URLSearchParams({
                  courseId: course.course_id,
                  courseName: course.courseName,
                  courseCode: `${course.departmentId}-${course.serialNumber}`,
                  instructor: course.instructors,
                });
                router.push(`/upload?${params.toString()}`);
              }}
              className="text-sm sm:text-base"
            >
              上傳第一個檔案
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {files.map((file) => (
              <div
                key={file.file_id}
                className="flex cursor-pointer flex-col justify-between space-y-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:space-y-0 sm:p-4"
                onClick={() => router.push(`/file/${file.file_id}`)}
              >
                <div className="flex min-w-0 flex-1 items-start space-x-3 sm:items-center sm:space-x-4">
                  <div className="mt-1 flex-shrink-0 sm:mt-0">
                    {getFileIcon(file.filename)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-gray-900 sm:text-base">
                      {file.filename}
                    </h3>
                    <div className="mt-1 flex flex-col space-y-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 sm:text-sm">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(file.timestamp)}
                        </span>
                      </span>
                      {file.exam_type && (
                        <span className="flex items-center space-x-1">
                          <FileText className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {examTypeMap[file.exam_type] || file.exam_type}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkToggle(file);
                    }}
                    className="p-1 text-gray-400 transition-colors hover:text-yellow-500 sm:p-2"
                  >
                    {file.isBookmarked ? (
                      <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500 sm:h-5 sm:w-5" />
                    ) : (
                      <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>

                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 text-xs sm:space-x-2 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>下載</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
