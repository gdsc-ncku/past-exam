import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class PastExamApi {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 15000,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`Sending request to ${config.baseURL}${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      },
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> =
        await this.axiosInstance.request(config);
      return response.data;
    } catch (error) {
      console.error(`Error in request to ${config.url}:`, error);
      throw error;
    }
  }

  /**
   * Upload file with `multipart/form-data`.
   * @param formData - FormData containing the file and associated data.
   */
  async uploadFile(formData: FormData): Promise<any> {
    try {
      const response = await this.request<any>({
        url: '/file',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });
      console.log('File uploaded successfully:', response);
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

const pastExamApi = new PastExamApi();
export default pastExamApi;
