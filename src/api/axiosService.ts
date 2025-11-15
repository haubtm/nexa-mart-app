import { ApiService } from '@/lib';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { IResponse } from '../dtos';

const API_BACKEND_URL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  // const token = await AsyncStorage.getItem('token');
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDVVNUT01FUjpoYXVidG02OTlAZ21haWwuY29tIiwiaWF0IjoxNzYzMTk4NjExLCJleHAiOjE3NjMyODUwMTF9.9aqCcv1dDe-YK7qvgNSMqi0Z0ix1NYDzeZVXZ3AbhNaBnsnb6VqzexJ1_umIxXFqR91pwcgrWyQUcLseJyro-g';
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
apiService.addRequestInterceptor((config) => {
  const data =
    typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
  console.log(
    '[REQ]',
    (config.method || 'GET').toUpperCase(),
    config.baseURL ? `${config.baseURL}${config.url}` : config.url,
    '\nHeaders:',
    config.headers,
    '\nParams:',
    config.params,
    '\nBody:',
    data,
  );
  return config;
});
apiService.addResponseInterceptor(
  (res) => {
    const preview =
      typeof res.data === 'string'
        ? res.data.slice(0, 1000)
        : JSON.stringify(res.data).slice(0, 1000);
    console.log('[RES]', res.status, res.config?.url, '\nData:', preview);
    return res;
  },
  (err) => {
    if (err.response) {
      console.log(
        '[ERR]',
        err.response.status,
        err.config?.url,
        '\nData:',
        JSON.stringify(err.response.data),
      );
    } else {
      console.log('[ERR]', err.message);
    }
    return Promise.reject(err);
  },
);
