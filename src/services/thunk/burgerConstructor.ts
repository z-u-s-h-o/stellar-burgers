import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

export const sendOrder = createAsyncThunk(
  'burgerConstructor/sendOrder',
  orderBurgerApi
);
