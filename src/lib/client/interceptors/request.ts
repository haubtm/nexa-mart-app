import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  // const token = await AsyncStorage.getItem('token');
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDVVNUT01FUjpoYXVidG02OTlAZ21haWwuY29tIiwiaWF0IjoxNzYzMTk4NjExLCJleHAiOjE3NjMyODUwMTF9.9aqCcv1dDe-YK7qvgNSMqi0Z0ix1NYDzeZVXZ3AbhNaBnsnb6VqzexJ1_umIxXFqR91pwcgrWyQUcLseJyro-g';
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
};
