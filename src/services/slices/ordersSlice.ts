import { createSlice } from '@reduxjs/toolkit';
import {
  getFeedOrders,
  getOrderByNumber,
  getUserOrders
} from '../thunk/orders';
import { TOrder } from '@utils-types';

type OrdersState = {
  feedOrders: TOrder[];
  userOrders: TOrder[];
  selectedOrder: TOrder | null;
  total: number;
  totalToday: number;
  loading: {
    feedOrders: boolean;
    userOrders: boolean;
    orderByNumber: boolean;
  };
  error: {
    feedOrders: string | null;
    userOrders: string | null;
    orderByNumber: string | null;
  };
};

const initialState: OrdersState = {
  feedOrders: [],
  userOrders: [],
  selectedOrder: null,
  total: 0,
  totalToday: 0,
  loading: {
    feedOrders: false,
    userOrders: false,
    orderByNumber: false
  },
  error: {
    feedOrders: null,
    userOrders: null,
    orderByNumber: null
  }
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getFeedOrders
      .addCase(getFeedOrders.pending, (state) => {
        state.loading.feedOrders = true;
        state.error.feedOrders = null;
      })
      .addCase(getFeedOrders.fulfilled, (state, action) => {
        const { orders, total, totalToday } = action.payload;
        state.feedOrders = orders;
        state.total = total;
        state.totalToday = totalToday;
        state.loading.feedOrders = false;
      })
      .addCase(getFeedOrders.rejected, (state, action) => {
        state.loading.feedOrders = false;
        state.error.feedOrders =
          action.error.message || 'Ошибка загрузки feed orders';
      })

      // getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.loading.userOrders = true;
        state.error.userOrders = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.loading.userOrders = false;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading.userOrders = false;
        state.error.userOrders =
          action.error.message || 'Ошибка загрузки user orders';
      })

      // getOrderByNumber
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading.orderByNumber = true;
        state.error.orderByNumber = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        if (action.payload?.orders?.length > 0) {
          state.selectedOrder = action.payload.orders[0];
        } else {
          state.selectedOrder = null;
        }
        state.loading.orderByNumber = false;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.selectedOrder = null;
        state.loading.orderByNumber = false;
        state.error.orderByNumber =
          action.error.message || 'Ошибка загрузки заказа по номеру';
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.feedOrders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectUserOrders: (state) => state.userOrders,
    selectOrdersLoading: (state) => state.loading,
    selectOrdersError: (state) => state.error,
    selectSelectedOrder: (state) => state.selectedOrder
  }
});

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectUserOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectSelectedOrder
} = ordersSlice.selectors;
