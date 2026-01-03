import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredients } from '../thunk/ingredients';

type IngredientsState = {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  data: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Неизвестная ошибка';
      });
  },
  selectors: {
    selectIngredients: (state) => state.data,
    selectIngredientsLoading: (state) => state.loading,
    selectIngredientsError: (state) => state.error
  }
});

export const {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} = ingredientsSlice.selectors;
