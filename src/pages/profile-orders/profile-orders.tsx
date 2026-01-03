import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../services/hooks';
import { selectUserOrders } from '../../services/slices/ordersSlice';
import { getUserOrders } from '../../services/thunk/orders';

import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getUserOrders())
      .unwrap()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const orders: TOrder[] = useSelector(selectUserOrders);

  return <>{loading ? <Preloader /> : <ProfileOrdersUI orders={orders} />}</>;
};
