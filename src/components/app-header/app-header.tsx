import { FC } from 'react';
import { useSelector } from 'react-redux';

import { selectUserData } from '../../services/slices/userSlice';

import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const userData = useSelector(selectUserData);
  const userName = userData ? userData.name : '';

  return <AppHeaderUI userName={userName} />;
};
