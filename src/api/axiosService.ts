import { ApiService } from '@/lib';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { IResponse } from '../dtos';

const API_BACKEND_URL = process.env.API_BACKEND_URL;

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  // const token = await AsyncStorage.getItem('token');
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBzdXBlcm1hcmtldC5jb20iLCJpYXQiOjE3NjIwOTM0NTYsImV4cCI6MTc2MjE3OTg1Nn0.jrLkqMalz7NJIu3CZINzW6yF_4k7f2S_ZGtsoTwjv-tybov0-mAmh78tFFD9gNIntGGTeNfN72nSawp7Oo9B2g';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

export const errorResponseInterceptor = async (
  error: AxiosError<IResponse>,
) => {
  if (error.response?.data) {
    // const currentPath = window.location.pathname;
    // if (
    //   error.response.status === 401 &&
    //   currentPath !== ROUTE_PATH.AUTH.LOGIN.PATH()
    // ) {
    //   window.location.href = ROUTE_PATH.AUTH.LOGIN.PATH();
    //   clearStorage();
    //   return Promise.reject(error.response.data);
    // }

    const message = error.response?.data?.message;

    if (!message) {
      error.response.data.message = 'Unknow server error';
    }

    return Promise.reject(error.response.data);
  }

  return Promise.reject(error);
};

export const apiService = new ApiService({
  baseURL: API_BACKEND_URL,
});

apiService.addRequestInterceptor(requestInterceptor);
apiService.addResponseInterceptor(undefined, errorResponseInterceptor);
