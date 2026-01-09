import { TOrder } from '@utils-types';
import { ordersSlice } from './ordersSlice';
import {
  getFeedOrders,
  getOrderByNumber,
  getUserOrders
} from '../thunk/orders';
import { TFeedsResponse } from '@api';

// Данные для тестов
const mockOrder: TOrder = {
  _id: '695f6d66a64177001b326881',
  status: 'done',
  name: 'Space флюоресцентный астероидный бургер',
  createdAt: '2026-01-08T08:40:06.705Z',
  updatedAt: '2026-01-08T08:40:06.705Z',
  number: 98609,
  ingredients: [
    '643d69a5c3f7b9001cfa0942',
    '643d69a5c3f7b9001cfa093f',
    '643d69a5c3f7b9001cfa093c'
  ]
};

const mockFeedResponse: TFeedsResponse = {
  success: true,
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

const mockUserOrdersResponse: TOrder[] = [mockOrder];

const mockOrderByNumberResponse = {
  orders: [mockOrder],
  success: true
};

describe('ordersSlice reducers', () => {
  let initialState: ReturnType<typeof ordersSlice.reducer>;

  beforeEach(() => {
    initialState = ordersSlice.getInitialState();
  });

  describe('extraReducers (обработка getFeedOrders)', () => {
    test('getFeedOrders.pending должен установить loading=true и error=null', () => {
      const state = ordersSlice.reducer(
        initialState,
        getFeedOrders.pending('', undefined)
      );
      expect(state.loading.feedOrders).toBe(true);
      expect(state.error.feedOrders).toBeNull();
    });

    test('getFeedOrders.fulfilled должен сохранить данные из ответа и установить loading=false', () => {
      const state = ordersSlice.reducer(
        initialState,
        getFeedOrders.fulfilled(mockFeedResponse, '', undefined)
      );
      expect(state.feedOrders).toEqual([mockOrder]);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.loading.feedOrders).toBe(false);
    });

    test('getFeedOrders.rejected должен установить error и loading=false', () => {
      const errorMessage = 'Ошибка загрузки feed orders';
      const action = getFeedOrders.rejected(
        new Error(errorMessage),
        '',
        undefined,
        { message: errorMessage }
      );

      const state = ordersSlice.reducer(initialState, action);
      expect(state.loading.feedOrders).toBe(false);
      expect(state.error.feedOrders).toBe(errorMessage);
    });
  });

  describe('extraReducers (обработка getUserOrders)', () => {
    test('getUserOrders.pending должен установить loading=true и error=null', () => {
      const state = ordersSlice.reducer(
        initialState,
        getUserOrders.pending('', undefined)
      );
      expect(state.loading.userOrders).toBe(true);
      expect(state.error.userOrders).toBeNull();
    });

    test('getUserOrders.fulfilled должен сохранить данные из ответа и установить loading=false', () => {
      const state = ordersSlice.reducer(
        initialState,
        getUserOrders.fulfilled(mockUserOrdersResponse, '', undefined)
      );
      expect(state.userOrders).toEqual([mockOrder]);
      expect(state.loading.userOrders).toBe(false);
    });

    test('getUserOrders.rejected должен установить error и loading=false', () => {
      const errorMessage = 'Ошибка загрузки user orders';
      const action = getUserOrders.rejected(
        new Error(errorMessage),
        '',
        undefined,
        { message: errorMessage }
      );
      const state = ordersSlice.reducer(initialState, action);
      expect(state.loading.userOrders).toBe(false);
      expect(state.error.userOrders).toBe(errorMessage);
    });
  });

  describe('extraReducers (обработка getOrderByNumber)', () => {
    test('getOrderByNumber.pending должен установить loading=true и error=null', () => {
      const state = ordersSlice.reducer(
        initialState,
        getOrderByNumber.pending('', 98609)
      );
      expect(state.loading.orderByNumber).toBe(true);
      expect(state.error.orderByNumber).toBeNull();
    });

    test('getOrderByNumber.fulfilled должен сохранить данные из ответа и установить loading=false', () => {
      const state = ordersSlice.reducer(
        initialState,
        getOrderByNumber.fulfilled(mockOrderByNumberResponse, '', 98609)
      );
      expect(state.selectedOrder).toEqual(mockOrder);
      expect(state.loading.orderByNumber).toBe(false);
    });

    test('getOrderByNumber.fulfilled ответ получен, но заказов по запросу не найдено', () => {
      const emptyResponse = { orders: [], success: true };
      const state = ordersSlice.reducer(
        initialState,
        getOrderByNumber.fulfilled(emptyResponse, '', 98609)
      );
      expect(state.selectedOrder).toBeNull();
      expect(state.loading.orderByNumber).toBe(false);
    });

    it('getOrderByNumber.rejected должен установить error и loading=false, сбросить выбранный элемент', () => {
      const errorMessage = 'Ошибка загрузки заказа по номеру';
      const action = getOrderByNumber.rejected(
        new Error(errorMessage),
        '',
        98609,
        { message: errorMessage }
      );
      const state = ordersSlice.reducer(initialState, action);
      expect(state.selectedOrder).toBeNull();
      expect(state.loading.orderByNumber).toBe(false);
      expect(state.error.orderByNumber).toBe(errorMessage);
    });
  });
});
