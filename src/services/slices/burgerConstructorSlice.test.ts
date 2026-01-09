import { TConstructorIngredient, TOrder } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
import {
  addIngredient,
  burgerConstructorSlice,
  clearOrderState,
  moveIngredientDown,
  moveIngredientUp,
  removeAllIngredients,
  removeIngredient,
  setBun
} from './burgerConstructorSlice';
import { sendOrder } from '../thunk/burgerConstructor';

// Данные для тестов
const mockIngredient_1: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  id: nanoid()
};

const mockIngredient_2: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093f',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
  id: nanoid()
};

const mockBun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: nanoid()
};

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

// Мок для функции nanoid
jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: () => 'test-643d69a5c3f7b9001cfa093c' // фиксированный id для тестов
}));

describe('burgerConstructorSlice reducers', () => {
  const initialState = burgerConstructorSlice.getInitialState();

  // Утилита для установки состояния с ингредиентами
  const getStateWithIngredients = (
    ingredients: TConstructorIngredient[] = []
  ) => ({
    ...initialState,
    constructorItems: {
      ...initialState.constructorItems,
      ingredients
    }
  });

  test('addIngredient добавляет ингредиент в массив ingredients', () => {
    const state = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(mockIngredient_1)
    );
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient_1);
  });

  test('setBun устанавливает булку в state.constructorItems.bun', () => {
    const state = burgerConstructorSlice.reducer(initialState, setBun(mockBun));
    expect(state.constructorItems.bun).toEqual(mockBun);
  });

  describe('moveIngredientUp', () => {
    test('перемещает ингредиент вверх при валидном индексе', () => {
      const state = getStateWithIngredients([
        mockIngredient_1,
        mockIngredient_2
      ]);
      const result = burgerConstructorSlice.reducer(state, moveIngredientUp(1));
      expect(result.constructorItems.ingredients).toEqual([
        mockIngredient_2,
        mockIngredient_1
      ]);
    });

    test('не изменяет массив при индексе <= 0 и > длины - 1', () => {
      const state = getStateWithIngredients([
        mockIngredient_1,
        mockIngredient_2
      ]);
      const result = burgerConstructorSlice.reducer(state, moveIngredientUp(0));
      expect(result.constructorItems.ingredients).toEqual([
        mockIngredient_1,
        mockIngredient_2
      ]);
    });
  });

  describe('moveIngredientDown', () => {
    test('перемещает ингредиент вниз при валидном индексе', () => {
      const state = getStateWithIngredients([
        mockIngredient_1,
        mockIngredient_2
      ]);
      const result = burgerConstructorSlice.reducer(
        state,
        moveIngredientDown(0)
      );
      expect(result.constructorItems.ingredients).toEqual([
        mockIngredient_2,
        mockIngredient_1
      ]);
    });

    test('не изменяет массив при индексе >= длины - 1 и < 0', () => {
      const state = getStateWithIngredients([
        mockIngredient_1,
        mockIngredient_2
      ]);
      const result = burgerConstructorSlice.reducer(
        state,
        moveIngredientDown(1)
      );
      expect(result.constructorItems.ingredients).toEqual([
        mockIngredient_1,
        mockIngredient_2
      ]);
    });
  });

  describe('removeIngredient', () => {
    test('удаляет ингредиент по валидному индексу', () => {
      const state = getStateWithIngredients([
        mockIngredient_1,
        mockIngredient_2
      ]);
      const result = burgerConstructorSlice.reducer(state, removeIngredient(0));
      expect(result.constructorItems.ingredients).toHaveLength(1);
      expect(result.constructorItems.ingredients[0]).toBe(mockIngredient_2);
    });

    test('не изменяет при невалидном индексе', () => {
      const state = getStateWithIngredients([
        mockIngredient_1,
        mockIngredient_2
      ]);
      const result = burgerConstructorSlice.reducer(state, removeIngredient(5));
      expect(result.constructorItems.ingredients).toHaveLength(2);
    });
  });

  test('removeAllIngredients очищает массив ingredients', () => {
    const state = getStateWithIngredients([mockIngredient_1, mockIngredient_2]);
    const result = burgerConstructorSlice.reducer(
      state,
      removeAllIngredients()
    );
    expect(result.constructorItems.ingredients).toHaveLength(0);
  });

  test('clearOrderState сбрасывает orderRequest и orderModalData', () => {
    const stateWithOrder = {
      ...initialState,
      loading: true,
      orderModalData: mockOrder
    };
    const state = burgerConstructorSlice.reducer(
      stateWithOrder,
      clearOrderState()
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
  });

  describe('extraReducers (обработка sendOrder)', () => {
    test('sendOrder.pending устанавливает orderRequest в true и очищает error', () => {
      const state = burgerConstructorSlice.reducer(
        initialState,
        sendOrder.pending('requestId', [])
      );

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('sendOrder.fulfilled сбрасывает constructorItems, устанавливает orderRequest в false и сохраняет orderModalData', () => {
      const action = sendOrder.fulfilled(
        {
          success: true,
          order: mockOrder,
          name: mockOrder.name
        },
        'requestId',
        []
      );
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.bun).toBeNull();
      expect(state.constructorItems.ingredients).toHaveLength(0);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    test('sendOrder.rejected устанавливает orderRequest в false и сохраняет сообщение об ошибке', () => {
      const errorMessage = 'Произошла ошибка при отправке заказа';
      const action = sendOrder.rejected(
        new Error(errorMessage),
        'requestId',
        [],
        { message: errorMessage }
      );
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
