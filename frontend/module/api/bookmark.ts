import { axiosInstance } from './axios';

export interface BookmarkStatusResponse {
  status: 'success' | 'error';
  data: {
    is_bookmarked: boolean;
  } | null;
  message: string | null;
  timestamp: string;
}

export interface BookmarkResponse {
  status: 'success' | 'error';
  data: null;
  message: string | null;
  timestamp: string;
}

export const bookmarkAPI = {
  // Add a bookmark
  addBookmark: (fileId: string) => {
    return axiosInstance.post<BookmarkResponse>(`/v1/bookmark/${fileId}`);
  },

  // Remove a bookmark
  removeBookmark: (fileId: string) => {
    return axiosInstance.delete<BookmarkResponse>(`/v1/bookmark/${fileId}`);
  },

  // Get all bookmarked files
  getBookmarks: () => {
    return axiosInstance.get<{ status: string; data: any[]; message: string | null; timestamp: string }>('/v1/bookmark');
  },

  // Check bookmark status
  checkBookmarkStatus: (fileId: string) => {
    return axiosInstance.get<BookmarkStatusResponse>(`/v1/bookmark/${fileId}/status`);
  },
}; 