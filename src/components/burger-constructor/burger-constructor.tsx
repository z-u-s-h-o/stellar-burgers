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
      navigate('/login');
      return;
    }

    // Проверяем, что есть булка и хотя бы один ингредиент
    if (constructorItems.bun && constructorItems.ingredients.length > 0) {
      const bunId = constructorItems.bun._id;

      // Собираем массив ID всех ингредиентов (каждый элемент массива — отдельный ID)
      const ingredientsIds = constructorItems.ingredients.map(
        (ingredient) => ingredient._id
      );

      // Формируем итоговый заказ: [булка, ингредиенты..., булка]
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
    // Цена булки (всегда 2 штуки)
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;

    // Подсчёт цены всех ингредиентов
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
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
