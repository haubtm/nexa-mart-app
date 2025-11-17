import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  const token = await AsyncStorage.getItem('token');
  console.log(
    '[Interceptor] Token from AsyncStorage:',
    token ? 'EXISTS' : 'NULL',
  );
  console.log('[Interceptor] Request URL:', config.url);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Interceptor] Authorization header set');
  } else {
    console.log('[Interceptor] No token found, skipping auth header');
  }
  return config;
};
