import React from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props extends BtnProps {
  text: React.ReactNode;
  className?: string;
}

export function BuyButton(props: Props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={classNames(styles.buyBtn, props.disabled)}
    >
      {props.text}
    </button>
  );
}
