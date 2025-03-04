import { axiosInstance } from './axios';

export const basicAPI = {
  getInfo: () => {
    return axiosInstance.get('/v1/info');
  },

  getHealth: () => {
    return axiosInstance.get('/v1/health');
  },
};
