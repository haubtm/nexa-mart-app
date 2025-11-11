import { apiService } from '@/api';
import type { IResponse } from '@/dtos';
import { ECustomerType, EUserType } from '@/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IProfileAccount {
  userType?: string;
  customerId?: number;
  employeeId?: number;
  name?: string;
  email?: string;
  userRole?: EUserType;
  customerType?: ECustomerType;
}

export interface UserState {
  profile?: IProfileAccount;
  isLoading?: boolean;
}

const initialState: UserState = {
  profile: undefined,
  isLoading: false,
};

const GET_PROFILE = 'auth/me';

const requestGetUserInfo = () => apiService.get(GET_PROFILE);

export const getUserInfo = createAsyncThunk('user/info', async () => {
  const response: IResponse<IProfileAccount> = await requestGetUserInfo();
  console.log(response);
  console.log('hello');
  return response?.data;
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
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
        // window.location.href = ROUTE_PATH.AUTH.LOGIN.PATH();
      }
      state.isLoading = false;
    });
  },
});

export const { resetProfile, changeProfile } = userSlice.actions;

export default userSlice.reducer;
