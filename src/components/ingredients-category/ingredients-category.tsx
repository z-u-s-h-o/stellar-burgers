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
    const { bun, ingredientsCount } = burgerConstructor;
    const counters: { [key: string]: number } = { ...ingredientsCount };

    if (bun) counters[bun._id] = 2;
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
