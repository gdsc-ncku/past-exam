import axios from 'axios';

const baseURL =
  (process.env.NEXT_PUBLIC_API_URL || 'https://api.ncku-pastexam.ccns.io') + '/api';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
