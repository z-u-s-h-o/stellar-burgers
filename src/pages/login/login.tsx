import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAppDispatch } from '../../services/hooks';
import { setCookie } from '../../utils/cookie';
import { loginUser } from '../../services/thunk/user';

import { LoginUI } from '@ui-pages';
import { TLoginData } from '@api';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText('');

    const loginData: TLoginData = {
      email: email,
      password: password
    };

    dispatch(loginUser(loginData))
      .unwrap()
      .then((data) => {
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        navigate(location.state?.from || '/');
      })
      .catch((error) => {
        setErrorText(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <LoginUI
          errorText={errorText}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
