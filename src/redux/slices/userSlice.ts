import { apiService, authApi } from '@/api';
import type {
  ICustomerRegisterRequest,
  ILoginRequest,
  IResponse,
} from '@/dtos';
import { ECustomerType, EUserType } from '@/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IProfileAccount {
  userType?: string;
  customerId?: number;
  employeeId?: number;
  name?: string;
  email?: string;
  phone?: string;
  userRole?: EUserType;
  customerType?: ECustomerType;
}

export interface UserState {
  profile?: IProfileAccount;
  isLoading?: boolean;
  error?: string;
}

const initialState: UserState = {
  profile: undefined,
  isLoading: false,
  error: undefined,
};

const GET_PROFILE = 'auth/me';

const requestGetUserInfo = () => apiService.get(GET_PROFILE);

export const getUserInfo = createAsyncThunk('user/info', async () => {
  const response: IResponse<IProfileAccount> = await requestGetUserInfo();
  console.log(response);
  console.log('hello');
  return response?.data;
});

export const login = createAsyncThunk(
  'user/login',
  async (credentials: ILoginRequest, { rejectWithValue }) => {
    try {
      console.log('[Login] Starting login...');
      const response = await authApi.login(credentials);
      console.log('[Login] Login API response received');

      if (response?.data?.accessToken) {
        console.log('[Login] Saving token to AsyncStorage...');
        await AsyncStorage.setItem('token', response.data.accessToken);
        console.log('[Login] Token saved successfully');

        // Verify token was saved
        const savedToken = await AsyncStorage.getItem('token');
        console.log('[Login] Token verification:', savedToken ? 'EXISTS' : 'NULL');
      }

      console.log('[Login] Returning response data');
      return response?.data;
    } catch (error: any) {
      console.log('[Login] Login failed:', error);
      return rejectWithValue(error?.response?.data?.message || 'Login failed');
    }
  },
);

export const register = createAsyncThunk(
  'user/register',
  async (
    userData: ICustomerRegisterRequest,
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await authApi.register(userData);
      // After successful registration, auto-login
      if (response?.data) {
        const loginResponse = await dispatch(
          login({
            emailOrPhone: userData.email,
            password: userData.password,
          }),
        ).unwrap();
        return loginResponse;
      }
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Registration failed',
      );
    }
  },
);

export const logout = createAsyncThunk('user/logout', async () => {
  await AsyncStorage.removeItem('token');
});

export const userSlice = createSlice({
  name: 'user/info',
  initialState,
  reducers: {
    changeProfile: (state, action) => {
      state.profile = action.payload;
    },
    resetProfile: (state) => {
      state.profile = undefined;
      state.error = undefined;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // Get User Info
    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(getUserInfo.rejected, (state) => {
      state.isLoading = false;
      state.profile = undefined;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      const user: IProfileAccount = action.payload;
      if (user?.customerId) {
        state.profile = user;
      } else {
        state.profile = undefined;
        AsyncStorage.removeItem('token');
      }
      state.isLoading = false;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.profile = undefined;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = undefined;
      if (action.payload?.customer) {
        state.profile = {
          customerId: action.payload.customer.customerId,
          name: action.payload.customer.name,
          email: action.payload.customer.email,
          phone: action.payload.customer.phone,
          customerType: action.payload.customer.customerType,
        };
      }
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = undefined;
      // Type guard to check if payload has customer field (from login response)
      if (action.payload && 'customer' in action.payload && action.payload.customer) {
        state.profile = {
          customerId: action.payload.customer.customerId,
          name: action.payload.customer.name,
          email: action.payload.customer.email,
          phone: action.payload.customer.phone,
          customerType: action.payload.customer.customerType,
        };
      }
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.profile = undefined;
      state.error = undefined;
      state.isLoading = false;
    });
  },
});

export const { resetProfile, changeProfile, clearError } = userSlice.actions;

export default userSlice.reducer;
