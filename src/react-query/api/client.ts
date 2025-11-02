import { Client } from '@/lib';

export const client = new Client({
  baseURL: process.env.API_BACKEND_URL,
});
