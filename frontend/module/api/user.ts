import { axiosInstance } from './axios';

interface UserUpdateData {
  username?: string;
  department?: string;
  avatar?: string;
}

interface GoogleLoginResponse {
  authorization_url: string;
}

interface AvatarUploadResponse {
  status: 'success' | 'error';
  data: {
    avatar_url: string;
  } | null;
  message: string | null;
  timestamp: string;
}

export const userAPI = {
  getProfile: () => {
    return axiosInstance.get('/v1/user/profile');
  },

  updateProfile: (data: UserUpdateData) => {
    return axiosInstance.patch('/v1/user/profile', data);
  },

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('upload_file', file);
    formData.append('file_name', file.name);
    
    return axiosInstance.post<AvatarUploadResponse>('/v1/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
