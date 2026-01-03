import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { updateUser } from '../../services/thunk/user';
import { selectUserData } from '../../services/slices/userSlice';
import { useAppDispatch } from '../../services/hooks';

import { Preloader } from '@ui';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const user = useSelector(selectUserData);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [formValue, setFormValue] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(updateUser(formValue))
      .unwrap()
      .catch((error) => {
        setErrorText(error.message);
      })
      .finally(() => {
        setLoading(false);
        setFormValue((prevState) => ({
          ...prevState,
          password: ''
        }));
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user ? user.name : '',
      email: user ? user.email : '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <ProfileUI
          formValue={formValue}
          isFormChanged={isFormChanged}
          updateUserError={errorText}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
};
