import { axiosInstance } from './axios';

export const fileAPI = {
  getAllFiles: () => {
    return axiosInstance.get('/v1/file');
  },

  createFile: (formData: FormData) => {
    return axiosInstance.post('/v1/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
