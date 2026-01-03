import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  clearOrderState
} from '../../services/slices/burgerConstructorSlice';
import { sendOrder } from '../../services/thunk/burgerConstructor';
import { useAppDispatch } from '../../services/hooks';
import { selectUserData } from '../../services/slices/userSlice';

import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUserData);

  const onOrderClick = () => {
    if (!user) {
      // Если пользователь не авторизован — перенаправляем на страницу входа
      navigate('/login');
      return;
    }

    if (
      constructorItems.bun &&
      Object.keys(constructorItems.ingredientsCount).length > 0
    ) {
      const bunId = constructorItems.bun._id;

      // Явно указываем тип: string[]
      const ingredientsIds = Object.entries(
        constructorItems.ingredientsCount
      ).reduce<string[]>((acc, [ingredientId, count]) => {
        for (let i = 0; i < count; i++) {
          acc.push(ingredientId); // теперь TypeScript знает, что ingredientId — строка
        }
        return acc;
      }, []); // пустой массив теперь имеет тип string[]

      const order = [bunId, ...ingredientsIds, bunId];
      dispatch(sendOrder(order));
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrderState());
    // При закрытии модального окна с оформлением заказа — перенаправляем на страницу заказов
    navigate('/feed', { replace: true });
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;

    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum, ingredient) => {
        const count = constructorItems.ingredientsCount[ingredient._id] || 1;
        return sum + ingredient.price * count;
      },
      0
    );

    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
