import { FC, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
  selectIngredientsCount
} from '../../services/slices/burgerConstructorSlice';

import { BurgerConstructorElementProps } from './type';

import { BurgerConstructorElementUI } from '@ui';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    // const count = useSelector(selectIngredientsCount)[ingredient._id];

    const handleMoveDown = () => {
      dispatch(moveIngredientDown(index));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredientUp(index));
    };

    const handleClose = () => {
      dispatch(removeIngredient(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
