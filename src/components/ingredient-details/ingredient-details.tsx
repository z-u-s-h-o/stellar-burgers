import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { TIngredient } from '@utils-types';
import { ErrorsInfo } from '@ui';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === id) || null;

  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError) || 'Ингредиент не найден';

  if (ingredientData) {
    return <IngredientDetailsUI ingredientData={ingredientData} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return <ErrorsInfo errorText={error} />;
};
