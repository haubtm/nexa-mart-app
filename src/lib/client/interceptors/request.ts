import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  // const token = await AsyncStorage.getItem('token');
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDVVNUT01FUjpoYXVidG02OTlAZ21haWwuY29tIiwiaWF0IjoxNzYyOTI1ODM2LCJleHAiOjE3NjMwMTIyMzZ9.tB5FXjvRkdWsfV2ru1H6S7iLkhdJXBTeCfyATPrzRaBJ97fID7vgHpUYxj8FgmcwTjSB272aJ5glWEgc7V_6fA';
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
};
