import React from 'react';
import txFailed from 'assets/images/failed-tx.svg';
import txConfirm from 'assets/images/confirm-tx.svg';
import txPending from 'assets/images/pending-tx.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import styles from './dialog.module.scss';

const getStatusImage = (tx: TxStatus) => {
  if (tx === TxStatus.FAILED) return txFailed;
  if (tx === TxStatus.CONFIRMED) return txConfirm;
  return txPending;
};

const getStatus = (tx: TxStatus) => {
  if (tx === TxStatus.FAILED)
    return <Trans i18nKey={translations.common.failed} />;
  if (tx === TxStatus.CONFIRMED)
    return <Trans i18nKey={translations.common.confirmed} />;
  return <Trans i18nKey={translations.common.pending} />;
};

interface IStatusComponentProps {
  status: TxStatus;
}

export const StatusComponent: React.FC<IStatusComponentProps> = ({
  status,
}) => (
  <div className="tw-text-center tw-mx-auto tw-my-4">
    <img
      src={getStatusImage(status)}
      className={classNames(
        styles.statusImage,
        status === TxStatus.PENDING && 'tw-animate-spin',
      )}
      alt="Status"
    />

    <div className="tw-text-2xl tw-font-medium tw-tracking-normal tw-mx-auto tw-mt-14 tw-uppercase tw-font-rowdies">
      <Trans i18nKey={translations.buySovPage.txDialog.txStatus.title} />
    </div>

    <p className="tw-text-base tw-uppercase tw-tracking-normal tw-mt-12">
      {getStatus(status)}
    </p>
  </div>
);
