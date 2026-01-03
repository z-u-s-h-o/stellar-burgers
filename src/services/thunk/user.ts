import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  registerUserApi
);

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

export const loginUser = createAsyncThunk('user/loginUser', loginUserApi);

export const logoutUser = createAsyncThunk('user/logoutUser', logoutApi);
