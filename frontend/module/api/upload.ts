import { axiosInstance } from './axios';

export interface FileResponse {
  file_id: string;
  filename: string;
  file_location: string;
  user_id: string;
  course_id: string;
  exam_type: string;
  info: string | null;
  anonymous: boolean;
  timestamp: string;
}

export interface UploadResponse {
  status: 'success' | 'error';
  data: FileResponse | null;
  message: string | null;
  timestamp: string;
}

export interface UploadFileData {
  year: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  instructor: string;
  examType: string;
  examScope?: string;
  isAnonymous: boolean;
  file: File;
}

export const uploadAPI = {
  uploadFile: (uploadData: UploadFileData) => {
    // Create FormData for multipart/form-data upload
    const formData = new FormData();

    // Add all form fields with backend-expected field names
    formData.append('year', uploadData.year);
    formData.append('course_id', uploadData.courseId);
    formData.append('course_name', uploadData.courseName);
    formData.append('course_code', uploadData.courseCode);
    formData.append('instructor', uploadData.instructor);
    formData.append('exam_type', uploadData.examType);
    if (uploadData.examScope) {
      formData.append('exam_scope', uploadData.examScope);
    }
    formData.append('anonymous', uploadData.isAnonymous.toString());

    // Add the file with correct field names expected by API
    formData.append('upload_file', uploadData.file);
    formData.append('file_name', uploadData.file.name);

    return axiosInstance.post<UploadResponse>('/v1/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getAllFiles: () => {
    return axiosInstance.get<{
      status: string;
      data: FileResponse[];
      message: string | null;
      timestamp: string;
    }>('/v1/file');
  },

  getFilesByCourse: (courseId: string) => {
    return axiosInstance.get<{
      status: string;
      data: FileResponse[];
      message: string | null;
      timestamp: string;
    }>(`/v1/file/course/${courseId}`);
  },

  getFilesByUser: () => {
    return axiosInstance.get<{
      status: string;
      data: FileResponse[];
      message: string | null;
      timestamp: string;
    }>('/v1/file');
  },
};
