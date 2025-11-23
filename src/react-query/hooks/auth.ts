import { authApi } from '@/api';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: authApi.updateProfile,
  });
};
