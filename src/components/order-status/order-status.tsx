import { FC } from 'react';

import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const statusColors: { [key: string]: string } = {
    pending: '#E52B1A',
    done: '#00CCCC',
    created: '#F2F2F3'
  };

  const statusText: { [key: string]: string } = {
    pending: 'Готовится',
    done: 'Выполнен',
    created: 'Создан'
  };

  return (
    <OrderStatusUI textStyle={statusColors[status]} text={statusText[status]} />
  );
};
