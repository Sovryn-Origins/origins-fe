import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props extends BtnProps {
  text: React.ReactNode;
  className?: string;
  primary?: boolean;
}

export function ConfirmButton(props: Props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={classNames(styles.button, props.className, {
        primary: props.primary,
      })}
    >
      {props.text}
    </button>
  );
}
