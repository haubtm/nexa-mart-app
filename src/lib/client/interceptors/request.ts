import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  // const token = await AsyncStorage.getItem('token');
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDVVNUT01FUjpoYXVidG02OTlAZ21haWwuY29tIiwiaWF0IjoxNzYyMTY4MzQzLCJleHAiOjE3NjIyNTQ3NDN9.ncAA_YRpAdqwMOJHUx-W5jFTtJy_WrEI5UZ-fc8ykfjFOBFMXwdxPhJPXcdm__4mrXlDcLAHXDcIuOCXtQqMfw';
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
};
