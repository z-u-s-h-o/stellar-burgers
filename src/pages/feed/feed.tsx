import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { TOrder } from '@utils-types';

import { useDispatch } from '../../services/store';
import { selectFeedOrders } from '../../services/slices/ordersSlice';
import { getFeedOrders } from '../../services/thunk/orders';

import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getFeedOrders())
      .unwrap()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleGetFeeds = () => {
    dispatch(getFeedOrders());
  };

  const orders: TOrder[] = useSelector(selectFeedOrders);

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
