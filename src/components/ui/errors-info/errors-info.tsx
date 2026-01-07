import React, { FC } from 'react';
import styles from './errors-info.module.css';

export const ErrorsInfo: FC<{ errorText: string }> = ({ errorText }) => (
  <div className={styles.error}>
    <p>{errorText}</p>
  </div>
);
