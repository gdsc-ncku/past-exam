import { axiosInstance } from './axios';

export const fileAPI = {
  getAllFiles: () => {
    return axiosInstance.get('/v1/file');
  },

  createFile: async (
    formData: FormData,
    onProgress: (progress: number) => void,
  ) => {
    return axiosInstance.post('/v1/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  getFile: (fileId: string) => {
    return axiosInstance.get(`/v1/file/${fileId}`);
  },

  deleteFile: (fileId: string) => {
    return axiosInstance.delete(`/v1/file/${fileId}`);
  },
};
