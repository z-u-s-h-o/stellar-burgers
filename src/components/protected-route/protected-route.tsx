import { Preloader } from '@ui';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectUserData,
  selectUserLoading
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

function ProtectedRoute({ children, onlyUnAuth }: ProtectedRouteProps) {
  const location = useLocation();
  const userData = useSelector(selectUserData);
  const loading = useSelector(selectUserLoading).get;

  if (loading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !userData) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }}
      />
    );
  }

  if (onlyUnAuth && userData) {
    const from = location.state?.from || { pathname: '/' };
    const background = location.state?.from?.background || null;
    return <Navigate replace to={from} state={{ background: background }} />;
  }

  return children;
}

export default ProtectedRoute;
