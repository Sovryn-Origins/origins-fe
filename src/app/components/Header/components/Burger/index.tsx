import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const Burger = ({ open, setOpen }) => {
  return (
    <button
      className={classNames(styles.button, {
        // [styles.open]: open,
        isOpen: open,
        // [styles.close]: !open,
      })}
      onClick={() => setOpen(!open)}
    >
      <div />
      <div />
      <div />
    </button>
  );
};
