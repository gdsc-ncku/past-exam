import { axiosInstance } from './axios';

interface CourseSearchParams {
  search_text?: string;
  semester?: string;
  departmentId?: string;
  serialNumber?: string;
  attributeCode?: string;
  systemCode?: string;
  forGrade?: string;
  forClass?: string;
  category?: string;
  courseName?: string;
  courseNameSearch?: string;
  tags?: string;
  credits?: string;
  instructors?: string;
  course_id?: string;
  offset?: number;
  limit?: number;
}

export interface Course {
  course_id: string;
  courseName: string;
  departmentId: string;
  semester: string;
  serialNumber: string;
  attributeCode: string;
  systemCode: string;
  forGrade: string;
  forClass: string;
  category: string;
  courseNote: string;
  tags: string;
  credits: string;
  instructors: string;
}

export interface SearchResponse {
  status: 'success' | 'error';
  data: Course[];
  total: number;
  message: string | null;
  timestamp: string;
}

export const courseAPI = {
  searchCourses: (params: CourseSearchParams) => {
    return axiosInstance.get<SearchResponse>('/v1/course/search', { params });
  },

  getCourse: (courseId: string) => {
    return axiosInstance.get<SearchResponse>(`/v1/course/${courseId}`);
  },
};
