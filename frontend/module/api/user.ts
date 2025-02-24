import { axiosInstance } from './axios';

interface UserUpdateData {
  username?: string;
  email?: string;
  avatar?: string;
}

interface GoogleLoginResponse {
  authorization_url: string;
}

export const userAPI = {
  getProfile: () => {
    return axiosInstance.get('/v1/user/profile');
  },

  updateProfile: (data: UserUpdateData) => {
    return axiosInstance.patch('/v1/user/profile', data);
  },

  googleLogin: async () => {
    const response = await axiosInstance.get<GoogleLoginResponse>(
      '/v1/user/google/login',
    );
    // Redirect to the authorization URL
    window.location.href = response.data.authorization_url;
  },

  googleCallback: (code: string) => {
    return axiosInstance.get('/v1/user/google/login/callback', {
      params: { code },
    });
  },

  googleLogout: () => {
    return axiosInstance.post('/v1/user/google/logout');
  },
};
