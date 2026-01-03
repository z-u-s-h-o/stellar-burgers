import { createSlice } from '@reduxjs/toolkit';
import { getFeedOrders, getUserOrders } from '../thunk/orders';
import { TOrder } from '@utils-types';

type OrdersState = {
  feedOrders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: OrdersState = {
  feedOrders: [],
  userOrders: [],
  total: 0,
  totalToday: 0
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedOrders.fulfilled, (state, action) => {
        const { orders, total, totalToday } = action.payload;
        state.feedOrders = orders;
        state.total = total;
        state.totalToday = totalToday;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.feedOrders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectUserOrders: (state) => state.userOrders
  }
});

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectUserOrders
} = ordersSlice.selectors;
