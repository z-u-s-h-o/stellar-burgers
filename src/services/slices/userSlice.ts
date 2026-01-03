import { createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../thunk/user';

export type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state) => {});
  },
  selectors: {
    selectUserData: (state) => state.user,
    selectUserIsAuthChecked: (state) => state.isAuthChecked
  }
});

export const { selectUserData, selectUserIsAuthChecked } = userSlice.selectors;
