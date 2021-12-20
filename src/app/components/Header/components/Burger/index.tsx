import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const Burger = ({ open, setOpen }) => {
  return (
    <button
      className={classNames(styles.button, {
        'is-open': open,
      })}
      onClick={() => setOpen(!open)}
    >
      <div />
      <div />
      <div />
    </button>
  );
};
