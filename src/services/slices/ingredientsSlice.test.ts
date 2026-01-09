import { TIngredient } from '../../utils/types';
import { getIngredients } from '../thunk/ingredients';
import { ingredientsSlice } from './ingredientsSlice';

// Данные для тестов
const mockIngredients: TIngredient[] = [
  {
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
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  },
  {
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
    image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
  },
  {
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
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

describe('ingredientsSlice reducers', () => {
  let initialState: ReturnType<typeof ingredientsSlice.reducer>;

  beforeEach(() => {
    initialState = ingredientsSlice.getInitialState();
  });

  describe('extraReducers (обработка getIngredients)', () => {
    test('getIngredients.pending должен установить loading=true и error=null', () => {
      const action = { type: getIngredients.pending.type };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('getIngredients.fulfilled должен сохранить данные и установить loading=false', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.data).toEqual(mockIngredients);
      expect(state.loading).toBe(false);
    });

    test('getIngredients.rejected должен установить error и loading=false', () => {
      const errorMessage = 'Не удалось загрузить ингредиенты';
      const action = {
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
