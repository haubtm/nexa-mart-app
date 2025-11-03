import { Client } from '@/lib';

export const client = new Client({
  baseURL: process.env.EXPO_PUBLIC_API_BACKEND_URL,
});
