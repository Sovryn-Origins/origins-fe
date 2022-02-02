import React from 'react';
import classNames from 'classnames';

import imgAlertTriangle from 'assets/images/wallet/alert-triangle.svg';
import styles from './index.module.scss';

interface IProps {
  className?: string;
  title: string;
  description: string;
}

export const ConnectWalletWarning: React.FC<IProps> = ({
  className,
  title,
  description,
}) => {
  return (
    <div
      className={classNames(
        className,
        'tw-bg-gray-2 tw-rounded-lg tw-mx-auto tw-max-w-3xl tw-pt-14 tw-pb-28',
      )}
    >
      <div className="tw-flex tw-justify-center">
        <img
          src={imgAlertTriangle}
          width="68"
          height="60"
          alt="Connect Wallet"
        />
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.alert}>{description}</p>
    </div>
  );
};
