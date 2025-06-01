'use client';

import { useState } from 'react';
import { Button } from '@/ui/Button';
import {
  Download,
  FileText,
  Calendar,
  User,
  Tag,
  BookOpen,
  Eye,
  Clock,
} from 'lucide-react';
import { FileResponse } from '@/module/api/upload';

interface ExtendedFileResponse extends FileResponse {
  year?: string;
  examScope?: string;
  courseName?: string;
  courseCode?: string;
  instructor?: string;
}

interface FileCardProps {
  file: ExtendedFileResponse;
  onDownload: (file: ExtendedFileResponse) => Promise<void>;
  showCourseInfo?: boolean;
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
    month: 'short',
    day: 'numeric',
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

export const FileCard = ({
  file,
  onDownload,
  showCourseInfo = false,
}: FileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-md">
      {/* Main file info */}
      <div className="p-3 sm:p-4">
        <div className="flex flex-col items-start justify-between space-y-3 sm:flex-row sm:space-y-0">
          <div className="flex min-w-0 flex-1 items-start space-x-3">
            {getFileIcon(file.filename)}

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium text-gray-900 sm:text-base">
                {file.filename}
              </h3>

              <div className="mt-1 flex flex-col space-y-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 sm:text-sm">
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formatDate(file.timestamp)}</span>
                </span>
                {file.exam_type && (
                  <span className="flex items-center space-x-1">
                    <Tag className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {examTypeMap[file.exam_type] || file.exam_type}
                    </span>
                  </span>
                )}
              </div>

              {/* Show course info if enabled */}
              {showCourseInfo && file.courseName && (
                <div className="mt-2 flex flex-col space-y-1 text-xs text-gray-600 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 sm:text-sm">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{file.courseName}</span>
                  </span>
                  {file.instructor && (
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{file.instructor}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full items-center space-x-2 sm:ml-4 sm:w-auto">
            {/* Expand button if there's additional info */}
            {(file.year || file.examScope) && (
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-shrink-0 p-2"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => onDownload(file)}
              className="flex flex-1 items-center justify-center space-x-2 sm:flex-initial"
            >
              <Download className="h-4 w-4" />
              <span>下載</span>
            </Button>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (file.year || file.examScope) && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 gap-3 text-sm sm:gap-4 md:grid-cols-2">
              {file.year && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-500">年份：</span>
                  <span className="font-medium">{file.year}</span>
                </div>
              )}

              {file.examScope && (
                <div className="flex items-start space-x-2">
                  <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span className="text-gray-500">範圍：</span>
                  <span className="break-words font-medium">
                    {file.examScope}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
