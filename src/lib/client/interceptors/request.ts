import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  // const token = await AsyncStorage.getItem('token');
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBzdXBlcm1hcmtldC5jb20iLCJpYXQiOjE3NjIwOTM0NTYsImV4cCI6MTc2MjE3OTg1Nn0.jrLkqMalz7NJIu3CZINzW6yF_4k7f2S_ZGtsoTwjv-tybov0-mAmh78tFFD9gNIntGGTeNfN72nSawp7Oo9B2g';
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
};
