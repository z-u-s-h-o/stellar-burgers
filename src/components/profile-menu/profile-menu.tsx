import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../services/thunk/user';
import { useAppDispatch } from '../../services/hooks';
import { deleteCookie } from '../../utils/cookie';

import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        navigate(location.state?.from || '/login');
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
