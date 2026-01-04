import { forwardRef, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectConstructorItems } from '../../services/slices/burgerConstructorSlice';

import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector(selectConstructorItems);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Булка (всегда 2 штуки)
    if (burgerConstructor.bun) {
      counters[burgerConstructor.bun._id] = 2;
    }

    // Подсчёт ингредиентов из массива
    burgerConstructor.ingredients.forEach((ingredient) => {
      if (ingredient._id) {
        counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
      }
    });

    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
