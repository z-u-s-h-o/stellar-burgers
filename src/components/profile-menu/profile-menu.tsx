import { FC } from 'react';
import { useLocation } from 'react-router-dom';

import { logoutUser } from '../../services/thunk/user';
import { useAppDispatch } from '../../services/hooks';

import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
