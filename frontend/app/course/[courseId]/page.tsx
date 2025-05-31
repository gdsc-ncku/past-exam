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
        if (courseResponse.data.status === 'success' && courseResponse.data.data) {
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
                const bookmarkResponse = await bookmarkAPI.checkBookmarkStatus(file.file_id);
                if (bookmarkResponse.data.status === 'success' && bookmarkResponse.data.data) {
                  isBookmarked = bookmarkResponse.data.data.is_bookmarked;
                }
              } catch (bookmarkError) {
                console.error('Error fetching bookmark status:', bookmarkError);
              }
              
              return {
                ...file,
                isBookmarked,
              };
            })
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
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.file_id === file.file_id 
            ? { ...f, isBookmarked: !f.isBookmarked }
            : f
        )
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
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="mb-6 flex items-center space-x-4">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回</span>
        </Button>
      </div>

      {/* Course Information Card */}
      <Card className="mb-8 p-8">
        <div className="flex items-start space-x-6">
          {/* Course Icon */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-slate-700">
            <span className="text-2xl font-bold text-white">
              {deptInfo.name.charAt(0)}
            </span>
          </div>

          {/* Course Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {course.courseName}
                </h1>
                <div className="mb-4 flex items-center space-x-4 text-lg text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Hash className="h-4 w-4" />
                    <span>
                      {course.departmentId}-{course.serialNumber}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span>{deptInfo.name}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Course Metadata Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">授課教師</p>
                  <p className="font-medium">{course.instructors}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">學分數</p>
                  <p className="font-medium">{course.credits} 學分</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">適用年級</p>
                  <p className="font-medium">{course.forGrade} 年級</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">學期</p>
                  <p className="font-medium">{course.semester}</p>
                </div>
              </div>
            </div>

            {/* Course Notes */}
            {course.courseNote && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-medium text-gray-900">課程備註</h3>
                <p className="text-gray-700">{course.courseNote}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Files Section */}
      <Card className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">考古題檔案</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">{files.length} 個檔案</div>
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
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>上傳檔案</span>
            </Button>
          </div>
        </div>

        {filesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : files.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">尚無檔案</h3>
            <p className="mb-6 text-gray-600">
              此課程目前還沒有上傳的考古題檔案。
            </p>
            <Button onClick={() => {
              const params = new URLSearchParams({
                courseId: course.course_id,
                courseName: course.courseName,
                courseCode: `${course.departmentId}-${course.serialNumber}`,
                instructor: course.instructors,
              });
              router.push(`/upload?${params.toString()}`);
            }}>
              上傳第一個檔案
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.file_id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/file/${file.file_id}`)}
              >
                <div className="flex items-center space-x-4">
                  {getFileIcon(file.filename)}

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {file.filename}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(file.timestamp)}</span>
                      </span>
                      {file.exam_type && (
                        <span className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>
                            {examTypeMap[file.exam_type] || file.exam_type}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkToggle(file);
                    }}
                    className="p-2 text-gray-400 transition-colors hover:text-yellow-500"
                  >
                    {file.isBookmarked ? (
                      <Bookmark className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>

                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
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
