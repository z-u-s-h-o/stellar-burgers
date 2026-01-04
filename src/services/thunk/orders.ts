import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../../utils/burger-api';

export const getFeedOrders = createAsyncThunk(
  'orders/getFeedOrders',
  getFeedsApi
);
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  getOrdersApi
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  getOrderByNumberApi
);
