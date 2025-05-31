'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select';
import { Textarea } from '@/ui/Textarea';
import { Card } from '@/ui/Card';
import { toast } from 'sonner';
import { Upload, FileText, X, LogIn, UserCheck } from 'lucide-react';
import { z } from 'zod';
import { CourseSearchSelector } from '@/app/components/CourseSearchSelector';
import { uploadAPI } from '@/module/api/upload';
import { useAuthentication } from '@/hooks/useAuthentication';

// Simple Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 mx-4 w-full max-w-md">{children}</div>
    </div>
  );
};

// Login Modal Component
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="p-6">
        <div className="text-center">
          <LogIn className="mx-auto mb-4 h-12 w-12 text-primary-600" />
          <h2 className="mb-2 text-xl font-bold text-gray-900">需要登入</h2>
          <p className="mb-6 text-gray-600">
            您需要登入後才能上傳考古題檔案。請先登入或註冊帳號以繼續。
          </p>
          <div className="flex space-x-3">
            <Button onClick={onLogin} className="flex-1">
              <LogIn className="mr-2 h-4 w-4" />
              登入
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1">
              稍後再說
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

const uploadSchema = z.object({
  year: z.string().min(1, '年份為必填'),
  courseId: z.string().min(1, '課程為必填'),
  courseName: z.string().min(1, '課程名稱為必填'),
  courseCode: z.string().min(1, '課程代碼為必填'),
  instructor: z.string().min(1, '授課教師為必填'),
  examType: z.string().min(1, '考試類型為必填'),
  examScope: z.string().optional(),
  isAnonymous: z.boolean(),
});

const examTypes = [
  { value: 'midterm', label: '期中考' },
  { value: 'final', label: '期末考' },
  { value: 'quiz', label: '小考' },
  { value: 'homework', label: '作業' },
  { value: 'other', label: '其他' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

// Separate file validation function
const validateFile = (file: File | null): string | null => {
  if (!file) {
    return '請選擇要上傳的檔案';
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return '檔案大小不得超過 10MB';
  }

  // Get file extension from filename
  const fileName = file.name.toLowerCase();
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const fileExtension = allowedExtensions.find((ext) => fileName.endsWith(ext));

  if (!fileExtension) {
    return '僅支援 PDF、Word 文件(.doc, .docx)或文字檔案(.txt)';
  }

  // Additional MIME type validation for extra security
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/plain', // .txt
  ];

  // Some browsers might not set correct MIME type, so we're more lenient
  // but we'll primarily rely on file extension
  if (file.type && !allowedMimeTypes.includes(file.type) && file.type !== '') {
    return '檔案類型不符合要求，請確認檔案格式正確';
  }

  return null;
};

function UploadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, handleLogin } = useAuthentication();
  const [formData, setFormData] = useState({
    year: '',
    courseId: '',
    courseName: '',
    courseCode: '',
    instructor: '',
    examType: '',
    examScope: '',
    isAnonymous: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Show login modal for non-authenticated users
  useEffect(() => {
    // Small delay to ensure auth state is settled
    const timer = setTimeout(() => {
      setAuthChecked(true);
      if (!currentUser) {
        setShowLoginModal(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleLoginClick = () => {
    setShowLoginModal(false);
    handleLogin(); // Use the Google OAuth login from navigation
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  // Pre-fill form with URL parameters
  useEffect(() => {
    const courseId = searchParams.get('courseId');
    const courseName = searchParams.get('courseName');
    const courseCode = searchParams.get('courseCode');
    const instructor = searchParams.get('instructor');

    if (courseId && courseName && courseCode && instructor) {
      setFormData((prev) => ({
        ...prev,
        courseId,
        courseName,
        courseCode,
        instructor,
      }));
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCourseSelect = (course: {
    courseId: string;
    courseName: string;
    courseCode: string;
    instructor: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      courseId: course.courseId,
      courseName: course.courseName,
      courseCode: course.courseCode,
      instructor: course.instructor,
    }));

    // Clear related errors
    setErrors((prev) => ({
      ...prev,
      courseId: '',
      courseName: '',
      courseCode: '',
      instructor: '',
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileError = validateFile(file);
      if (fileError) {
        toast.error(fileError);
        return;
      }

      setSelectedFile(file);
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: '' }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading) {
      setIsDragOver(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (loading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileError = validateFile(file);
      if (fileError) {
        toast.error(fileError);
        return;
      }

      setSelectedFile(file);
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: '' }));
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const validateForm = () => {
    try {
      uploadSchema.parse(formData);

      // Validate file separately
      const fileError = validateFile(selectedFile);
      if (fileError) {
        setErrors({ file: fileError });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication before allowing submission
    if (!currentUser) {
      setShowLoginModal(true);
      toast.error('請先登入後再上傳檔案');
      return;
    }

    if (!validateForm()) {
      toast.error('請檢查表單內容');
      return;
    }

    setLoading(true);

    try {
      // Validate form data one more time
      uploadSchema.parse(formData);
      const fileError = validateFile(selectedFile);
      if (fileError) {
        toast.error(fileError);
        return;
      }

      // Call the real upload API
      const response = await uploadAPI.uploadFile({
        year: formData.year,
        courseId: formData.courseId,
        courseName: formData.courseName,
        courseCode: formData.courseCode,
        instructor: formData.instructor,
        examType: formData.examType,
        examScope: formData.examScope,
        isAnonymous: formData.isAnonymous,
        file: selectedFile!,
      });

      if (response.data.status === 'success') {
        toast.success('檔案上傳成功！');

        // Reset form
        setFormData({
          year: '',
          courseId: '',
          courseName: '',
          courseCode: '',
          instructor: '',
          examType: '',
          examScope: '',
          isAnonymous: false,
        });
        setSelectedFile(null);

        // Optionally redirect to another page
        // router.push('/');
      } else {
        toast.error(response.data.message || '上傳失敗，請稍後再試');
      }
    } catch (error: unknown) {
      console.error('Upload error:', error);

      // Handle different types of errors
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error('上傳失敗，請稍後再試');
        }
      } else {
        toast.error('上傳失敗，請稍後再試');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        onLogin={handleLoginClick}
      />

      {/* Auth Status Indicator */}
      {authChecked && (
        <div className="mb-4">
          {currentUser ? (
            <div className="flex items-center text-sm text-green-600">
              <UserCheck className="mr-2 h-4 w-4" />
              已登入，可以上傳檔案
            </div>
          ) : (
            <div className="flex items-center text-sm text-amber-600">
              <LogIn className="mr-2 h-4 w-4" />
              未登入，請先登入後再上傳檔案
            </div>
          )}
        </div>
      )}

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">上傳試題檔案</h1>
        <p className="text-gray-600">請填寫以下資訊並上傳您的試題檔案</p>
      </div>

      <Card className={`relative p-8 ${!currentUser ? 'opacity-75' : ''}`}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overlay for non-authenticated users */}
          {authChecked && !currentUser && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white bg-opacity-50">
              <div className="p-6 text-center">
                <LogIn className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <p className="text-lg text-gray-600">請先登入以使用上傳功能</p>
                <Button onClick={handleLoginClick} className="mt-4">
                  <LogIn className="mr-2 h-4 w-4" />
                  登入
                </Button>
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
                課程資訊
              </h2>

              {/* Year and Course Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year">年份 *</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => handleInputChange('year', value)}
                  >
                    <SelectTrigger
                      className={errors.year ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="選擇年份" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && (
                    <span className="text-sm text-red-500">{errors.year}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseCode">課程代碼</Label>
                  <Input
                    id="courseCode"
                    value={formData.courseCode}
                    placeholder="將自動填入"
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Course Search */}
              <div className="space-y-2">
                <Label htmlFor="courseName">課程 *</Label>
                <CourseSearchSelector
                  value={formData.courseId}
                  courseName={formData.courseName}
                  onSelect={handleCourseSelect}
                  className={
                    errors.courseId || errors.courseName ? 'border-red-500' : ''
                  }
                  disabled={loading}
                />
                {(errors.courseId || errors.courseName) && (
                  <span className="text-sm text-red-500">
                    {errors.courseId || errors.courseName}
                  </span>
                )}
              </div>

              {/* Show selected course details */}
              {formData.courseName && (
                <div className="rounded-md bg-gray-50 p-3 text-sm">
                  <div className="font-medium text-gray-900">
                    {formData.courseName}
                  </div>
                  <div className="text-gray-600">
                    課程代碼：{formData.courseCode} | 授課教師：
                    {formData.instructor}
                  </div>
                </div>
              )}

              <h3 className="mt-6 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">
                考試資訊
              </h3>

              {/* Exam Type */}
              <div className="space-y-3">
                <Label>考試類型 *</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {examTypes.map((type) => (
                    <div key={type.value} className="flex items-center">
                      <input
                        id={`examType-${type.value}`}
                        name="examType"
                        type="radio"
                        value={type.value}
                        checked={formData.examType === type.value}
                        onChange={(e) =>
                          handleInputChange('examType', e.target.value)
                        }
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={loading}
                      />
                      <label
                        htmlFor={`examType-${type.value}`}
                        className="ml-3 block cursor-pointer text-sm font-medium text-gray-700"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.examType && (
                  <span className="text-sm text-red-500">
                    {errors.examType}
                  </span>
                )}
              </div>

              {/* Exam Scope */}
              <div className="space-y-2">
                <Label htmlFor="examScope">試題範圍</Label>
                <Textarea
                  id="examScope"
                  value={formData.examScope}
                  onChange={(e) =>
                    handleInputChange('examScope', e.target.value)
                  }
                  placeholder="請描述考試範圍，例：第1-5章、演算法與資料結構（選填）"
                  rows={3}
                  className={errors.examScope ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.examScope && (
                  <span className="text-sm text-red-500">
                    {errors.examScope}
                  </span>
                )}
              </div>

              {/* Anonymous Option */}
              <div className="space-y-3">
                <Label>是否匿名 *</Label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="anonymous-no"
                      name="isAnonymous"
                      type="radio"
                      value="false"
                      checked={!formData.isAnonymous}
                      onChange={(e) => handleInputChange('isAnonymous', false)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <label
                      htmlFor="anonymous-no"
                      className="ml-3 block cursor-pointer text-sm font-medium text-gray-700"
                    >
                      顯示上傳者
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="anonymous-yes"
                      name="isAnonymous"
                      type="radio"
                      value="true"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleInputChange('isAnonymous', true)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <label
                      htmlFor="anonymous-yes"
                      className="ml-3 block cursor-pointer text-sm font-medium text-gray-700"
                    >
                      匿名上傳
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - File Upload */}
            <div className="space-y-6">
              <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
                檔案上傳
              </h2>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">上傳檔案 *</Label>
                <div
                  className={`mt-1 flex min-h-[300px] justify-center rounded-lg border-2 border-dashed px-6 pb-8 pt-8 transition-colors ${
                    isDragOver
                      ? 'border-primary-400 bg-primary-50/50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-2 text-center">
                    {selectedFile ? (
                      <div className="flex flex-col items-center space-y-4">
                        <FileText className="h-16 w-16 text-blue-500" />
                        <div className="text-center">
                          <p className="text-lg font-medium text-gray-900">
                            {selectedFile.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          disabled={loading}
                        >
                          <X className="mr-2 h-4 w-4" />
                          移除檔案
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <Upload
                          className={`h-16 w-16 transition-colors ${isDragOver ? 'text-primary-600' : 'text-gray-400'}`}
                        />
                        <div className="text-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500 hover:text-primary-400"
                          >
                            <span className="text-lg">選擇檔案</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.txt"
                              disabled={loading}
                            />
                          </label>
                          <p
                            className={`mt-2 transition-colors ${isDragOver ? 'font-medium text-primary-600' : 'text-gray-500'}`}
                          >
                            {isDragOver ? '放開以上傳檔案' : '或拖拽檔案到此處'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">
                            支援檔案類型：
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            PDF、Word 文件(.doc, .docx)、文字檔案(.txt)
                          </p>
                          <p className="text-xs text-gray-400">
                            最大檔案大小：10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {errors.file && (
                  <span className="text-sm text-red-500">{errors.file}</span>
                )}
              </div>

              {/* Upload Tips */}
              <div className="rounded-lg border border-gray-200  p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-800">
                  上傳提示
                </h3>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>• 請確保檔案內容清晰可讀</li>
                  <li>• 建議使用 PDF 格式以確保格式不變</li>
                  <li>• 僅接受 PDF、Word 文件(.doc, .docx)及文字檔案(.txt)</li>
                  <li>• 請勿上傳包含個人敏感資訊的檔案</li>
                  <li>• 上傳前請確認檔案內容符合學術規範</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '上傳中...' : '上傳檔案'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadForm />
    </Suspense>
  );
}
