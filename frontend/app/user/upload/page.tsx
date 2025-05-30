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
} from 'lucide-react';
import { uploadAPI, FileResponse } from '@/module/api/upload';
import { courseAPI } from '@/module/api/course';
import { downloadFile } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Extended file interface with course info
interface ExtendedFileResponse extends FileResponse {
  courseName?: string;
  courseCode?: string;
  departmentName?: string;
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

          // Enhance files with course information
          const enhancedFiles = await Promise.all(
            filesData.map(async (file) => {
              try {
                const courseResponse = await courseAPI.getCourse(
                  file.course_id,
                );
                if (
                  courseResponse.data.status === 'success' &&
                  courseResponse.data.data
                ) {
                  const course = courseResponse.data.data;
                  return {
                    ...file,
                    courseName: course.courseName,
                    courseCode: `${course.departmentId}-${course.serialNumber}`,
                    departmentName: course.departmentId,
                  };
                }
              } catch (err) {
                console.error('Error fetching course info:', err);
              }
              return file;
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">我的上傳</h1>
            <p className="mt-1 text-gray-600">管理您上傳的考古題檔案</p>
          </div>
        </div>

        <Button
          onClick={() => router.push('/upload')}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>上傳新檔案</span>
        </Button>
      </div>

      {/* Statistics Card */}
      <Card className="mb-8 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {files.length}
            </div>
            <div className="text-sm text-gray-500">總上傳數</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {files.filter((f) => !f.anonymous).length}
            </div>
            <div className="text-sm text-gray-500">公開檔案</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {files.filter((f) => f.anonymous).length}
            </div>
            <div className="text-sm text-gray-500">匿名檔案</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {new Set(files.map((f) => f.course_id)).size}
            </div>
            <div className="text-sm text-gray-500">涵蓋課程</div>
          </div>
        </div>
      </Card>

      {/* Files List */}
      <Card className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">上傳的檔案</h2>
          <div className="text-sm text-gray-500">{files.length} 個檔案</div>
        </div>

        {error ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">載入失敗</h3>
            <p className="mb-6 text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()}>重新載入</Button>
          </div>
        ) : files.length === 0 ? (
          <div className="py-12 text-center">
            <Upload className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              尚未上傳任何檔案
            </h3>
            <p className="mb-6 text-gray-600">
              開始上傳您的第一個考古題檔案，幫助其他同學學習！
            </p>
            <Button onClick={() => router.push('/upload')}>
              <Upload className="mr-2 h-4 w-4" />
              上傳檔案
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.file_id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-6 transition-colors hover:bg-gray-50"
              >
                <div className="flex flex-1 items-center space-x-4">
                  {getFileIcon(file.filename)}

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
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
                          {file.anonymous ? (
                            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-600">
                              匿名上傳
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">
                              公開上傳
                            </span>
                          )}
                        </div>

                        {/* Course Info */}
                        {file.courseName && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">
                              {file.courseCode}
                            </span>{' '}
                            {file.courseName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="ml-4 flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleViewCourse(file.course_id)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>查看課程</span>
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => handleDownload(file)}
                    className="flex items-center space-x-1"
                  >
                    <Download className="h-3 w-3" />
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
