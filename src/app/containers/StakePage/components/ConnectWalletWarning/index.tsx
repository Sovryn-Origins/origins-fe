import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import imgAlertTriangle from 'assets/images/wallet/alert-triangle.svg';
import styles from './index.module.scss';

interface IProps {
  className?: string;
}

export const ConnectWalletWarning: React.FC<IProps> = ({ className }) => {
  const { t } = useTranslation();

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
      <p className={styles.title}>
        {t(translations.stake.connectWalletWarning.title)}
      </p>
      <p className={styles.alert}>
        {t(translations.stake.connectWalletWarning.alert)}
      </p>
    </div>
  );
};
