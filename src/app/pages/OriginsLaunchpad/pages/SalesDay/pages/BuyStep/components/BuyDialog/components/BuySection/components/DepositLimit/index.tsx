import React from 'react';
import { useTranslation } from 'react-i18next';

import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { weiToNumberFormat } from 'utils/display-text/format';
import arrowDownInRect from 'assets/images/arrow-down-rect.svg';
import arrowUpInRect from 'assets/images/arrow-up-rect.svg';
import styles from './index.module.scss';

interface IDepositLimitItemProps {
  direction: string;
  label: string;
  amount: string;
  depositToken: Asset;
}

interface IDepositLimitProps {
  depositToken: Asset;
  minAmount: string;
  maxAmount: string;
}

const DepositLimitItem: React.FC<IDepositLimitItemProps> = ({
  direction,
  label,
  amount,
  depositToken,
}) => {
  return (
    <div className="tw-flex tw-justify-between tw-items-center">
      <div className="tw-w-12">
        <img
          src={direction === 'down' ? arrowDownInRect : arrowUpInRect}
          alt={`Deposit Limit: ${label}`}
        />
      </div>
      <div className={styles.depositLimitContentWrapper}>
        <p className="tw-mb-1 tw-text-left tw-font-rowdies tw-text-sm tw-text-black">
          {label}
        </p>
        <div className="tw-flex tw-justify-between">
          <p
            className="tw-mb-0 tw-text-sm tw-font-rowdies tw-text-black tw-overflow-ellipsis"
            title={amount}
          >
            {weiToNumberFormat(amount, 4)}{' '}
          </p>
          <AssetSymbolRenderer
            className="tw-text-black tw-text-sm tw-font-rowdies"
            asset={depositToken}
          />
        </div>
      </div>
    </div>
  );
};

export const DepositLimit: React.FC<IDepositLimitProps> = ({
  depositToken,
  minAmount,
  maxAmount,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="tw-text-base tw-text-left tw-font-rowdies tw-mb-2 tw-text-black tw-uppercase">
        {t(
          translations.originsLaunchpad.saleDay.buyStep.buyDialog.depositLimits,
        )}
      </div>
      <div className="tw-mb-20">
        <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5">
          <DepositLimitItem
            direction="down"
            label="MIN"
            amount={minAmount}
            depositToken={depositToken}
          />
          <DepositLimitItem
            direction="up"
            label="MAX"
            amount={maxAmount}
            depositToken={depositToken}
          />
        </div>
        <div className="tw-border tw-border-black tw-border-solid" />
      </div>
    </div>
  );
};
