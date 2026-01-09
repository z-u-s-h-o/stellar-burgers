import { rootReducer, RootState } from './store';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { ordersSlice } from './slices/ordersSlice';
import { userSlice } from './slices/userSlice';

// Проверяем правильную инициализацию rootReducer
describe('rootReducer', () => {
  test('должен содержать все ожидаемые редукторы', () => {
    const expectedKeys = ['ingredients', 'burgerConstructor', 'orders', 'user'];
    const reducerKeys = Object.keys(rootReducer({}, {} as any));

    expectedKeys.forEach((key) => {
      expect(reducerKeys).toContain(key);
    });
  });

  test('должен инициализировать состояние каждого редуктора корректно', () => {
    const initialState: RootState = rootReducer(undefined, { type: '' });

    expect(initialState.ingredients).toBeDefined();
    expect(initialState.burgerConstructor).toBeDefined();
    expect(initialState.orders).toBeDefined();
    expect(initialState.user).toBeDefined();

    expect(initialState.ingredients).toEqual(
      ingredientsSlice.getInitialState()
    );
    expect(initialState.burgerConstructor).toEqual(
      burgerConstructorSlice.getInitialState()
    );
    expect(initialState.orders).toEqual(ordersSlice.getInitialState());
    expect(initialState.user).toEqual(userSlice.getInitialState());
  });

  test('должен возвращать начальное состояние при необрабатываемом экшене', () => {
    // Вызываем rootReducer с undefined состоянием и неизвестным экшеном
    const stateAfterUnknownAction = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Получаем начальное состояние напрямую через getInitialState каждого слайса
    const expectedInitialState: RootState = {
      ingredients: ingredientsSlice.getInitialState(),
      burgerConstructor: burgerConstructorSlice.getInitialState(),
      orders: ordersSlice.getInitialState(),
      user: userSlice.getInitialState()
    };

    // Проверяем, что полученное состояние совпадает с ожидаемым начальным
    expect(stateAfterUnknownAction).toEqual(expectedInitialState);
  });
});
