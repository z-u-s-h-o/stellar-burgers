import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { TOrder } from '@utils-types';

import { useDispatch } from '../../services/store';
import {
  selectFeedOrders,
  selectOrdersLoading
} from '../../services/slices/ordersSlice';
import { getFeedOrders } from '../../services/thunk/orders';

import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedOrders());
  }, []);

  const handleGetFeeds = () => {
    dispatch(getFeedOrders());
  };

  const orders: TOrder[] = useSelector(selectFeedOrders);
  const loading = useSelector(selectOrdersLoading).feedOrders;

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
      )}
    </>
  );
};
