import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { sendOrder } from '../thunk/burgerConstructor';

type ConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderModalData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderModalData: null,
  orderRequest: false,
  error: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const payload: TConstructorIngredient = {
          ...ingredient,
          id: nanoid()
        };
        return { payload };
      }
    },
    setBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.bun = action.payload;
      },
      prepare: (bun: TIngredient) => {
        const payload: TConstructorIngredient = {
          ...bun,
          id: nanoid()
        };
        return { payload };
      }
    },
    moveIngredientUp: (state, action) => {
      const index = action.payload;
      if (index <= 0 || index >= state.constructorItems.ingredients.length)
        return;
      const ingredients = state.constructorItems.ingredients;
      [ingredients[index - 1], ingredients[index]] = [
        ingredients[index],
        ingredients[index - 1]
      ];
    },
    moveIngredientDown: (state, action) => {
      const index = action.payload;
      const maxIndex = state.constructorItems.ingredients.length - 1;
      if (index >= maxIndex || index < 0) return;
      const ingredients = state.constructorItems.ingredients;
      [ingredients[index], ingredients[index + 1]] = [
        ingredients[index + 1],
        ingredients[index]
      ];
    },
    removeIngredient: (state, action) => {
      const index = action.payload;

      // Проверяем, что индекс в допустимых пределах
      if (index < 0 || index >= state.constructorItems.ingredients.length) {
        return;
      }

      // Удаляем элемент по указанному индексу
      state.constructorItems.ingredients.splice(index, 1);
    },
    removeAllIngredients: (state) => {
      state.constructorItems.ingredients = [];
    },
    clearOrderState: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка отправки заказа';
      });
  },
  selectors: {
    selectConstructorItems: (state: ConstructorState) => state.constructorItems,
    selectOrderRequest: (state: ConstructorState) => state.orderRequest,
    selectOrderModalData: (state: ConstructorState) => state.orderModalData
  }
});

export const {
  addIngredient,
  setBun,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  removeAllIngredients,
  clearOrderState
} = burgerConstructorSlice.actions;

export const {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} = burgerConstructorSlice.selectors;
