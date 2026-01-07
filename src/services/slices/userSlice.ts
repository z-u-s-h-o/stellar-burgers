import { createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../thunk/user';
import { deleteCookie, setCookie } from '../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  loading: {
    get: boolean;
    login: boolean;
    update: boolean;
    logout: boolean;
    register: boolean;
  };
  error: {
    get: string | null;
    login: string | null;
    update: string | null;
    logout: string | null;
    register: string | null;
  };
};

const initialState: TUserState = {
  user: null,
  loading: {
    get: true,
    login: true,
    update: true,
    logout: true,
    register: true
  },
  error: {
    get: null,
    login: null,
    update: null,
    logout: null,
    register: null
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get
      .addCase(getUser.pending, (state) => {
        state.loading.get = true;
        state.error.get = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading.get = false;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading.get = false;
        state.user = null;
        state.error.get =
          action.error.message || 'Ошибка получения пользователя';
      })
      //login
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading.login = false;
        state.error.login = null;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.loading.login = false;
        state.error.login = action.error.message || 'Ошибка входа пользователя';
      })
      //update
      .addCase(updateUser.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.user = null;
        state.loading.update = false;
        state.error.update =
          action.error.message || 'Ошибка обновления данных пользователя';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading.update = false;
      })
      //logout
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
        state.error.logout = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading.logout = false;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.error.login =
          action.error.message || 'Ошибка выхода пользователя';
      })
      //register
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
        state.error.register = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading.register = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.error.register =
          action.error.message || 'Ошибка регистрации пользователя';
      });
  },
  selectors: {
    selectUserData: (state) => state.user,
    selectUserLoading: (state) => state.loading,
    selectUserError: (state) => state.error
  }
});

export const { selectUserData, selectUserLoading, selectUserError } =
  userSlice.selectors;
