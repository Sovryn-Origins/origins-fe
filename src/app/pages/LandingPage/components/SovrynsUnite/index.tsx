import React from 'react';

import imgBackground from 'assets/images/home/bottom-image.png';
import styles from './index.module.scss';

export const SovrynsUnite: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <img className={styles.image} src={imgBackground} alt="Sovryns Unite" />
    </div>
  );
};
