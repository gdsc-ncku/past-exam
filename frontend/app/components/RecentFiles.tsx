'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import {
  FileText,
  Clock,
  Download,
  ArrowRight,
  Upload,
  Loader2,
} from 'lucide-react';
import { uploadAPI, FileResponse } from '@/module/api/upload';
import { courseAPI } from '@/module/api/course';
import { getDepartmentInfo } from '@/module/data/departments';

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
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

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes} 分鐘前`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} 小時前`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} 天前`;
  }
};

export const RecentFiles = () => {
  const router = useRouter();
  const [files, setFiles] = useState<ExtendedFileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent files
        const filesResponse = await uploadAPI.getRecentFiles(8); // Get 8 files for the grid

        if (filesResponse.data.status === 'success') {
          const filesData = filesResponse.data.data || [];

          // Enhance files with course information
          const enhancedFiles = await Promise.all(
            filesData.map(async (file) => {
              try {
                // Only try to fetch course info if course_id exists
                if (file.course_id) {
                  const courseResponse = await courseAPI.getCourse(
                    file.course_id,
                  );
                  if (
                    courseResponse.data.status === 'success' &&
                    courseResponse.data.data
                  ) {
                    const course = courseResponse.data.data;
                    const deptInfo = getDepartmentInfo(course.departmentId);
                    return {
                      ...file,
                      courseName: course.courseName,
                      courseCode: `${course.departmentId}-${course.serialNumber}`,
                      departmentName: deptInfo.name,
                    } as ExtendedFileResponse;
                  }
                }

                // Return file without course info if not available
                return file as ExtendedFileResponse;
              } catch (err) {
                console.error(
                  'Error fetching course info for file:',
                  file.file_id,
                  err,
                );
                // Return the file without course info if there's an error
                return file as ExtendedFileResponse;
              }
            }),
          );

          setFiles(enhancedFiles);
        } else {
          setError('無法載入最新檔案');
        }
      } catch (err) {
        console.error('Error fetching recent files:', err);
        setError('載入檔案時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentFiles();
  }, []);

  const handleFileClick = (fileId: string) => {
    router.push(`/file/${fileId}`);
  };

  const handleViewAll = () => {
    router.push('/search'); // Redirect to search/browse page
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-8 bg-gradient-to-r from-[#1B1B1B] to-[#78B103] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            最新上傳的檔案
          </h2>
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#78B103]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-8 bg-gradient-to-r from-[#1B1B1B] to-[#78B103] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            最新上傳的檔案
          </h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-8 bg-gradient-to-r from-[#1B1B1B] to-[#78B103] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            最新上傳的檔案
          </h2>
          <Upload className="mx-auto h-16 w-16 text-gray-400" />
          <p className="mt-4 text-gray-500">尚無檔案上傳</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div variants={fadeInUp} className="mb-12 text-center">
        <h2 className="mb-4 bg-gradient-to-r from-[#1B1B1B] to-[#78B103] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          最新上傳的檔案
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#595959]">
          查看同學們最新分享的考古題和學習資源
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {files.map((file) => (
          <motion.div
            key={file.file_id}
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Card
              className="group relative cursor-pointer overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:border-[#78B103] hover:shadow-lg"
              onClick={() => handleFileClick(file.file_id)}
            >
              <div className="p-4 sm:p-6">
                {/* File Icon and Type */}
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  {getFileIcon(file.filename)}
                  <span className="rounded-full bg-[#F3FFC7] px-2 py-1 text-xs font-medium text-[#78B103]">
                    {examTypeMap[file.exam_type] || file.exam_type || '檔案'}
                  </span>
                </div>

                {/* File Name */}
                <h3
                  className="mb-2 overflow-hidden text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-[#78B103] sm:text-lg"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    textOverflow: 'ellipsis',
                  }}
                >
                  {file.filename}
                </h3>

                {/* Course Info */}
                {file.courseName && (
                  <div className="mb-2 text-sm text-gray-600 sm:mb-3">
                    <span className="text-xs font-medium sm:text-sm">
                      {file.courseCode}
                    </span>
                    <br />
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm">
                      {file.courseName}
                    </span>
                  </div>
                )}

                {/* Department */}
                {file.departmentName && (
                  <div className="mb-2 text-xs text-gray-500 sm:mb-3">
                    {file.departmentName}
                  </div>
                )}

                {/* Time Ago */}
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {formatTimeAgo(file.timestamp)}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <motion.div variants={fadeInUp} className="mt-12 text-center">
        <Button
          onClick={handleViewAll}
          className="group bg-[#78B103] px-8 py-3 text-white transition-colors duration-200 hover:bg-[#5A8604]"
        >
          查看更多檔案
          <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
