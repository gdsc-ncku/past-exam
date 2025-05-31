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
  Clock,
  Hash,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { uploadAPI, FileResponse } from '@/module/api/upload';
import { courseAPI } from '@/module/api/course';
import { bookmarkAPI } from '@/module/api/bookmark';
import { getDepartmentInfo } from '@/module/data/departments';
import { downloadFile } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { FilePreview } from '@/app/components/FilePreview';
import { useAuthentication } from '@/hooks/useAuthentication';

// Extended file interface with course info and bookmark status
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

export default function FilePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuthentication();
  const fileId = params.fileId as string;

  const [file, setFile] = useState<ExtendedFileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview'>('preview');

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch file data by ID
        const fileResponse = await uploadAPI.getFileById(fileId);
        
        if (fileResponse.data.status === 'success' && fileResponse.data.data) {
          const fileData = fileResponse.data.data;
          
          // Enhance with course info and bookmark status
          let enhancedFile: ExtendedFileResponse = { ...fileData };
          
          if (fileData.course_id) {
            try {
              const courseResponse = await courseAPI.getCourse(fileData.course_id);
              if (courseResponse.data.status === 'success' && courseResponse.data.data) {
                const course = courseResponse.data.data;
                const deptInfo = getDepartmentInfo(course.departmentId);
                enhancedFile = {
                  ...enhancedFile,
                  courseName: course.courseName,
                  courseCode: `${course.departmentId}-${course.serialNumber}`,
                  departmentName: deptInfo.name,
                };
              }
            } catch (err) {
              console.error('Error fetching course info:', err);
            }
          }

          // Check bookmark status only if user is authenticated
          if (currentUser) {
            try {
              const bookmarkResponse = await bookmarkAPI.checkBookmarkStatus(fileId);
              if (bookmarkResponse.data.status === 'success' && bookmarkResponse.data.data) {
                enhancedFile.isBookmarked = bookmarkResponse.data.data.is_bookmarked;
              }
            } catch (bookmarkError) {
              console.error('Error fetching bookmark status:', bookmarkError);
            }
          }

          setFile(enhancedFile);
        } else {
          setError('無法載入檔案資訊');
        }
        
      } catch (err) {
        console.error('Error fetching file:', err);
        setError('載入檔案時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    if (fileId) {
      fetchFileData();
    }
  }, [fileId, currentUser]);

  const handleDownload = async () => {
    if (file) {
      await downloadFile(file.file_location, file.filename);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!file) return;
    
    // Only allow bookmark toggle if user is authenticated
    if (!currentUser) {
      router.push('/'); // Redirect to home page
      return;
    }
    
    try {
      if (file.isBookmarked) {
        await bookmarkAPI.removeBookmark(file.file_id);
      } else {
        await bookmarkAPI.addBookmark(file.file_id);
      }
      
      setFile(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
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

  if (error || !file) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-4">
            <FileText className="mx-auto h-16 w-16 text-gray-400" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            {error || '檔案不存在'}
          </h2>
          <p className="mb-6 text-gray-600">
            無法找到您要查看的檔案，請檢查網址是否正確。
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
        <button
          onClick={() => router.back()}
          className="hover:text-gray-900"
        >
          {file.departmentName || '課程'}
        </button>
        <ChevronRight className="h-4 w-4" />
        <button
          onClick={() => file.course_id && router.push(`/course/${file.course_id}`)}
          className="hover:text-gray-900"
        >
          {file.courseName || '課程名稱'}
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{file.filename}</span>
      </div>

      {/* File Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {getFileIcon(file.filename)}
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {file.filename}
              </h1>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-[#C3F53C] text-gray-900 hover:bg-[#B8ED2F]"
          >
            <Download className="h-4 w-4" />
            <span>下載檔案</span>
          </Button>
        </div>

        {/* File Metadata */}
        <div className="mt-6 flex items-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>年份</span>
            <span className="font-medium text-gray-900">
              {new Date(file.timestamp).getFullYear()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>考試類型</span>
            <span className="font-medium text-gray-900">
              {examTypeMap[file.exam_type] || file.exam_type || '未指定'}
            </span>
          </div>
          {currentUser && (
            <button
              onClick={handleBookmarkToggle}
              className="flex items-center space-x-2 text-gray-400 transition-colors hover:text-yellow-500"
            >
              {file.isBookmarked ? (
                <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              <span>收藏</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            題目預覽
          </button>
        </nav>
      </div>

      {/* File Preview */}
      <Card className="p-8">
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-300 bg-gray-100 p-8">
              <div className="bg-white p-6 shadow-sm">
                <FilePreview 
                  filename={file.filename}
                  fileLocation={file.file_location}
                  onDownload={handleDownload}
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 