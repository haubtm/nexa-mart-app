import Toast from 'react-native-toast-message';

export const showToast = {
  success: (message: string, description?: string) => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: message,
      text2: description,
      visibilityTime: 3000,
      autoHide: true,
    });
  },

  error: (message: string, description?: string) => {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: message,
      text2: description,
      visibilityTime: 3000,
      autoHide: true,
    });
  },

  info: (message: string, description?: string) => {
    Toast.show({
      type: 'info',
      position: 'top',
      text1: message,
      text2: description,
      visibilityTime: 3000,
      autoHide: true,
    });
  },

  warning: (message: string, description?: string) => {
    Toast.show({
      type: 'tomatoToast',
      position: 'top',
      text1: message,
      text2: description,
      visibilityTime: 3000,
      autoHide: true,
    });
  },
};
