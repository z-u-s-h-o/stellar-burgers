import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks';

import { TRegisterData } from '../../utils/burger-api';
import { registerUser } from '../../services/thunk/user';

import { Preloader } from '@ui';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useAppDispatch();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const responseData: TRegisterData = {
      email: email,
      name: userName,
      password: password
    };
    setLoading(true);
    dispatch(registerUser(responseData))
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
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
        <RegisterUI
          errorText={errorText}
          email={email}
          userName={userName}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          setUserName={setUserName}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
