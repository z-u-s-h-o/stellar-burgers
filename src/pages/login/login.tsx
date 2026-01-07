import { FC, SyntheticEvent, useState } from 'react';

import { useAppDispatch } from '../../services/hooks';
import { loginUser } from '../../services/thunk/user';

import { LoginUI } from '@ui-pages';
import { TLoginData } from '@api';
import { useSelector } from 'react-redux';
import { selectUserError } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const loginData: TLoginData = {
      email: email,
      password: password
    };

    dispatch(loginUser(loginData));
  };

  const error = useSelector(selectUserError).login || undefined;

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
