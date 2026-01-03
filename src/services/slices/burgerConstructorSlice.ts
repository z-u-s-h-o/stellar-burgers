import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { sendOrder } from '../thunk/burgerConstructor';

type ConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
    ingredientsCount: { [id: string]: number };
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: [],
    ingredientsCount: {}
  },
  orderRequest: false,
  orderModalData: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      const ingredientId = action.payload._id;

      // Если ингредиент уже есть — увеличиваем счётчик
      if (state.constructorItems.ingredientsCount[ingredientId]) {
        state.constructorItems.ingredientsCount[ingredientId]++;
      } else {
        // Иначе добавляем в массив и инициализируем счётчик
        state.constructorItems.ingredients.push(action.payload);
        state.constructorItems.ingredientsCount[ingredientId] = 1;
      }
    },
    setBun: (state, action) => {
      state.constructorItems.bun = action.payload;
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
      const ingredientId = state.constructorItems.ingredients[index]._id;

      if (state.constructorItems.ingredientsCount[ingredientId] > 1) {
        state.constructorItems.ingredientsCount[ingredientId]--;
      } else {
        state.constructorItems.ingredients.splice(index, 1);
        delete state.constructorItems.ingredientsCount[ingredientId];
      }
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
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.constructorItems = {
          bun: null,
          ingredients: [],
          ingredientsCount: {}
        };
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(sendOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  },
  selectors: {
    selectConstructorItems: (state: ConstructorState) => state.constructorItems,
    selectOrderRequest: (state: ConstructorState) => state.orderRequest,
    selectOrderModalData: (state: ConstructorState) => state.orderModalData,
    selectIngredientsCount: (state: ConstructorState) =>
      state.constructorItems.ingredientsCount
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
  selectOrderModalData,
  selectIngredientsCount
} = burgerConstructorSlice.selectors;
