'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Upload,
  Trash2,
  Eye,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { uploadAPI, FileResponse } from '@/module/api/upload';
import { courseAPI } from '@/module/api/course';
import { bookmarkAPI } from '@/module/api/bookmark';
import { downloadFile } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Extended file interface with course info
interface ExtendedFileResponse extends FileResponse {
  courseName?: string;
  courseCode?: string;
  departmentName?: string;
  isBookmarked?: boolean;
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

export default function UserUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<ExtendedFileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch files uploaded by current user
        const filesResponse = await uploadAPI.getFilesByUser();

        if (filesResponse.data.status === 'success') {
          const filesData = filesResponse.data.data || [];

          // Enhance files with course information and bookmark status
          const enhancedFiles = await Promise.all(
            filesData.map(async (file) => {
              try {
                // Fetch course info
                const courseResponse = await courseAPI.getCourse(
                  file.course_id,
                );
                let courseInfo = {};
                if (
                  courseResponse.data.status === 'success' &&
                  courseResponse.data.data
                ) {
                  const course = courseResponse.data.data;
                  courseInfo = {
                    courseName: course.courseName,
                    courseCode: `${course.departmentId}-${course.serialNumber}`,
                    departmentName: course.departmentId,
                  };
                }

                // Fetch bookmark status
                let isBookmarked = false;
                try {
                  const bookmarkResponse =
                    await bookmarkAPI.checkBookmarkStatus(file.file_id);
                  if (
                    bookmarkResponse.data.status === 'success' &&
                    bookmarkResponse.data.data
                  ) {
                    isBookmarked = bookmarkResponse.data.data.is_bookmarked;
                  }
                } catch (bookmarkError) {
                  console.error(
                    'Error fetching bookmark status:',
                    bookmarkError,
                  );
                }

                return {
                  ...file,
                  ...courseInfo,
                  isBookmarked,
                };
              } catch (err) {
                console.error('Error fetching course info:', err);
                return {
                  ...file,
                  isBookmarked: false,
                };
              }
            }),
          );

          setFiles(enhancedFiles);
        } else {
          setError('無法載入檔案列表');
        }
      } catch (err) {
        console.error('Error fetching user files:', err);
        setError('載入檔案時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchUserFiles();
  }, []);

  const handleDownload = async (file: ExtendedFileResponse) => {
    await downloadFile(file.file_location, file.filename);
  };

  const handleViewCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
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
      // You could add a toast notification here
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

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between space-y-4 sm:mb-8 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-sm sm:text-base"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>返回</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
              我的上傳
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              管理您上傳的考古題檔案
            </p>
          </div>
        </div>

        <Button
          onClick={() => router.push('/upload')}
          className="flex w-full items-center justify-center space-x-2 text-sm sm:w-auto sm:text-base"
        >
          <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>上傳新檔案</span>
        </Button>
      </div>

      {/* Statistics Card */}
      <Card className="mb-6 p-4 sm:mb-8 sm:p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600 sm:text-2xl lg:text-3xl">
              {files.length}
            </div>
            <div className="text-xs text-gray-500 sm:text-sm">總上傳數</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600 sm:text-2xl lg:text-3xl">
              {new Set(files.map((f) => f.course_id)).size}
            </div>
            <div className="text-xs text-gray-500 sm:text-sm">課程數</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600 sm:text-2xl lg:text-3xl">
              {
                files.filter(
                  (f) => f.exam_type === 'midterm' || f.exam_type === 'final',
                ).length
              }
            </div>
            <div className="text-xs text-gray-500 sm:text-sm">期中/期末考</div>
          </div>
        </div>
      </Card>

      {/* Files List */}
      <Card className="p-4 sm:p-6 lg:p-8">
        <div className="mb-4 flex flex-col items-start justify-between space-y-2 sm:mb-6 sm:flex-row sm:items-center sm:space-y-0">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
            上傳的檔案
          </h2>
          <div className="text-xs text-gray-500 sm:text-sm">
            {files.length} 個檔案
          </div>
        </div>

        {error ? (
          <div className="py-8 text-center sm:py-12">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
            <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">
              載入失敗
            </h3>
            <p className="mb-4 px-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="text-sm sm:text-base"
            >
              重新載入
            </Button>
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center sm:py-12">
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
            <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">
              尚未上傳任何檔案
            </h3>
            <p className="mb-4 px-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              開始上傳您的第一個考古題檔案，幫助其他同學學習！
            </p>
            <Button
              onClick={() => router.push('/upload')}
              className="text-sm sm:text-base"
            >
              <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              上傳檔案
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {files.map((file) => (
              <div
                key={file.file_id}
                className="flex cursor-pointer flex-col justify-between space-y-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:space-y-0 sm:p-4 lg:p-6"
                onClick={() => router.push(`/file/${file.file_id}`)}
              >
                <div className="flex min-w-0 flex-1 items-start space-x-3 sm:items-center sm:space-x-4">
                  <div className="mt-1 flex-shrink-0 sm:mt-0">
                    {getFileIcon(file.filename)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
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

                        {/* Course Info */}
                        {file.courseName && (
                          <div className="mt-2 text-xs text-gray-600 sm:text-sm">
                            <span className="font-medium">
                              {file.courseCode}
                            </span>{' '}
                            <span className="truncate">{file.courseName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-shrink-0 items-center justify-end space-x-2">
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCourse(file.course_id);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <Eye className="h-3 w-3" />
                    <span className="hidden sm:inline">查看課程</span>
                    <span className="sm:hidden">課程</span>
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <Download className="h-3 w-3" />
                    <span className="hidden sm:inline">下載</span>
                    <span className="sm:hidden">下載</span>
                  </Button>

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
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
