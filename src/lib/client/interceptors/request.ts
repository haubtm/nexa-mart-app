import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  // const token = await AsyncStorage.getItem('token');
  const token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDVVNUT01FUjpoYXVidG02OTlAZ21haWwuY29tIiwiaWF0IjoxNzYyODcyMDYwLCJleHAiOjE3NjI5NTg0NjB9.Z_Pk4GHeajNJRsDOXA4ndWZHRr49JmO1aL5zoO4hFPzURWSdtDs70-wwLyb1JimZ2xFbaR3055qC9tN1f7RZtQ';
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
};
