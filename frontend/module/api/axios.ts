import axios from 'axios';

const baseURL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
