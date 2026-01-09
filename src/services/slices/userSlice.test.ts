import { TUser } from '@utils-types';
import { userSlice } from './userSlice';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../thunk/user';
import { deleteCookie, setCookie } from '../../utils/cookie';

// Mock-данные для тестов
const mockUser: TUser = {
  name: 'Иван Иванов',
  email: 'ivan@example.com'
};

const mockPayload = {
  user: mockUser,
  accessToken: 'mockAccessToken',
  refreshToken: 'mockRefreshToken'
};

const mockError = {
  error: { message: 'Произошла ошибка' }
};

// Моки для localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

// Заменяем global localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('userSlice reducers', () => {
  let initialState: ReturnType<typeof userSlice.reducer>;

  beforeEach(() => {
    initialState = userSlice.getInitialState();
    jest.clearAllMocks();
  });

  describe('extraReducers (обработка getUser)', () => {
    test('getUser.pending должен установить loading.get = true и очистить error.get', () => {
      const action = { type: getUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.loading.get).toBe(true);
      expect(state.error.get).toBeNull();
    });

    test('getUser.fulfilled должен сохранить user и установить loading.get = false', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockPayload
      };
      const state = userSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.loading.get).toBe(false);
    });

    test('getUser.rejected должен сбросить user, установить loading.get = false и error.get', () => {
      const action = {
        type: getUser.rejected.type,
        ...mockError
      };
      const state = userSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.loading.get).toBe(false);
      expect(state.error.get).toBe('Произошла ошибка');
    });
  });

  describe('extraReducers (обработка loginUser)', () => {
    test('loginUser.pending должен установить loading.login = true и очистить error.login', () => {
      const action = { type: loginUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.loading.login).toBe(true);
      expect(state.error.login).toBeNull();
    });

    test('loginUser.fulfilled должен сохранить user, сбросить loading.login и error.login, установить токены', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockPayload
      };
      const state = userSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.loading.login).toBe(false);
      expect(state.error.login).toBeNull();

      // Проверка вызова setCookie и localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        mockPayload.refreshToken
      );

      expect(setCookie).toHaveBeenCalledTimes(1);
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        mockPayload.accessToken
      );
    });

    test('loginUser.rejected должен сбросить user, установить loading.login = false и error.login', () => {
      const action = {
        type: loginUser.rejected.type,
        ...mockError
      };
      const state = userSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.loading.login).toBe(false);
      expect(state.error.login).toBe('Произошла ошибка');
    });
  });

  describe('extraReducers (обработка updateUser)', () => {
    test('updateUser.pending должен установить loading.update = true и очистить error.update', () => {
      const action = { type: updateUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.loading.update).toBe(true);
      expect(state.error.update).toBeNull();
    });

    test('updateUser.fulfilled должен обновить user и сбросить loading.update', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockPayload
      };
      const state = userSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.loading.update).toBe(false);
    });

    test('updateUser.rejected должен сбросить user, установить loading.update = false и error.update', () => {
      const action = {
        type: updateUser.rejected.type,
        ...mockError
      };
      const state = userSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.loading.update).toBe(false);
      expect(state.error.update).toBe('Произошла ошибка');
    });
  });

  describe('extraReducers (обработка logoutUser)', () => {
    test('logoutUser.pending должен установить loading.logout = true и очистить error.logout', () => {
      const action = { type: logoutUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.loading.logout).toBe(true);
      expect(state.error.logout).toBeNull();
    });

    test('logoutUser.fulfilled должен сбросить user, loading.logout, удалить токены', () => {
      const action = { type: logoutUser.fulfilled.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.loading.logout).toBe(false);

      // Проверка удаления из localStorage и cookie
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');

      expect(deleteCookie).toHaveBeenCalledTimes(1);
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
    });

    test('logoutUser.rejected должен сбросить loading.logout и установить error.login', () => {
      const action = {
        type: logoutUser.rejected.type,
        ...mockError
      };
      const state = userSlice.reducer(initialState, action);

      expect(state.loading.logout).toBe(false);
      expect(state.error.login).toBe('Произошла ошибка');
    });
  });

  describe('extraReducers (обработка registerUser)', () => {
    test('registerUser.pending должен установить loading.register = true и очистить error.register', () => {
      const action = { type: registerUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.loading.register).toBe(true);
      expect(state.error.register).toBeNull();
    });

    test('registerUser.fulfilled должен сбросить loading.register', () => {
      const action = { type: registerUser.fulfilled.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.loading.register).toBe(false);
    });

    test('registerUser.rejected должен сбросить loading.register и установить error.register', () => {
      const action = {
        type: registerUser.rejected.type,
        ...mockError
      };
      const state = userSlice.reducer(initialState, action);

      expect(state.loading.register).toBe(false);
      expect(state.error.register).toBe('Произошла ошибка');
    });
  });
});
