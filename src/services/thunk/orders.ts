import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';

export const getFeedOrders = createAsyncThunk(
  'orders/getFeedOrders',
  getFeedsApi
);
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  getOrdersApi
);
