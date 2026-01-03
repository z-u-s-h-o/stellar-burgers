import { FC, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  selectFeedOrders,
  selectUserOrders
} from '../../services/slices/ordersSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();

  const isProfileOrder = location.pathname.startsWith('/profile/orders');
  const userOrders = useSelector(selectUserOrders);
  const feedOrders = useSelector(selectFeedOrders);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Состояние для хранения данных заказа из API
  const [apiOrderData, setApiOrderData] = useState<TOrder | null>(null);
  // Состояние загрузки
  const [loading, setLoading] = useState(false);
  // Выбираем нужный массив заказов (локальный)
  const orders = isProfileOrder ? userOrders : feedOrders;
  // Ищем заказ в локальных данных
  const localOrderData = orders.find(
    (order) => order.number === Number(number)
  );

  // Эффект для загрузки данных через API при отсутствии локального заказа
  useEffect(() => {
    if (!localOrderData && number) {
      setLoading(true);
      getOrderByNumberApi(Number(number))
        .then((response) => {
          if (response.success && response.orders) {
            setApiOrderData(response.orders[0]);
          }
        })
        .catch(() => {
          setApiOrderData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [localOrderData, number]);

  // Используем локальные данные, если они есть, иначе — из API
  const orderData = localOrderData || apiOrderData;
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

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
