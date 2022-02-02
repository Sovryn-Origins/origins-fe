import React from 'react';
import styles from './index.module.scss';
interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props extends BtnProps {
  text: React.ReactNode;
  className?: string;
}

export function CloseButton(props: Props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={styles.closeBtn}
    >
      {props.text}
    </button>
  );
}
