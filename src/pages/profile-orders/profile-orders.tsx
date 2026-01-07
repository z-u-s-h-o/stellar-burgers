import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../services/hooks';
import {
  selectOrdersLoading,
  selectUserOrders
} from '../../services/slices/ordersSlice';
import { getUserOrders } from '../../services/thunk/orders';

import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  const orders: TOrder[] = useSelector(selectUserOrders);
  const loading = useSelector(selectOrdersLoading).userOrders;

  return <>{loading ? <Preloader /> : <ProfileOrdersUI orders={orders} />}</>;
};
