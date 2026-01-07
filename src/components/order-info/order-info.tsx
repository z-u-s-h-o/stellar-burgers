import { FC, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { useAppDispatch } from '../../services/hooks';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  selectFeedOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectSelectedOrder,
  selectUserOrders
} from '../../services/slices/ordersSlice';
import { getOrderByNumber } from '../../services/thunk/orders';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { ErrorsInfo } from '@ui';

export const OrderInfo: FC = () => {
  const dispatch = useAppDispatch();
  const { number } = useParams<{ number: string }>();
  const location = useLocation();

  const isProfileOrder = location.pathname.startsWith('/profile/orders');

  const userOrders = useSelector(selectUserOrders);
  const feedOrders = useSelector(selectFeedOrders);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Выбираем нужный массив заказов (локальный)
  const orders = isProfileOrder ? userOrders : feedOrders;
  // Ищем заказ в локальных данных
  const localOrderData = orders.find(
    (order) => order.number === Number(number)
  );

  // Эффект для загрузки данных через API при отсутствии локального заказа
  useEffect(() => {
    if (!localOrderData && number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [localOrderData, number]);

  const apiOrderData = useSelector(selectSelectedOrder);

  // Используем локальные данные, если они есть, иначе — из API
  // (Предполагается, что getOrderByNumber обновляет состояние в Redux)
  const orderData = localOrderData || apiOrderData || null;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;
    const date = new Date(orderData.createdAt);
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  const loading = useSelector(selectOrdersLoading).orderByNumber;
  const error =
    useSelector(selectOrdersError).orderByNumber || 'Заказ не найден';

  if (orderInfo) {
    return <OrderInfoUI orderInfo={orderInfo} />;
  }

  if (loading) {
    return <Preloader />;
  }

  return <ErrorsInfo errorText={error} />;
};
