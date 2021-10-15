import React from 'react';
import { useTranslation } from 'react-i18next';

import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import {
  DepositLimitIconWrapper,
  DepositLimitContentWrapper,
  DepositLimitDivider,
} from './styled';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { weiToNumberFormat } from 'utils/display-text/format';
import arrowDownInRect from 'assets/images/arrow-down-rect.svg';
import arrowUpInRect from 'assets/images/arrow-up-rect.svg';

interface IDepositLimitItemProps {
  direction: string;
  label: string;
  sourceToken: Asset;
  amount: string;
}

interface IDepositLimitProps {
  sourceToken: Asset;
  minAmount: string;
  maxAmount: string;
}

const DepositLimitItem: React.FC<IDepositLimitItemProps> = ({
  direction,
  label,
  amount,
  sourceToken,
}) => {
  return (
    <div className="tw-flex tw-justify-between tw-items-center">
      <DepositLimitIconWrapper>
        <img
          src={direction === 'down' ? arrowDownInRect : arrowUpInRect}
          alt={`Deposit Limit: ${label}`}
        />
      </DepositLimitIconWrapper>
      <DepositLimitContentWrapper className="tw-px-2">
        <p className="tw-mb-3 tw-text-left tw-text-tiny tw-text-black">
          {label}
        </p>
        <div className="tw-flex tw-justify-between">
          <p
            className="tw-mb-0 tw-text-xs tw-text-black tw-overflow-ellipsis"
            title={amount}
          >
            {weiToNumberFormat(amount, 4)}{' '}
          </p>
          <AssetSymbolRenderer
            className="tw-text-black tw-text-xs"
            asset={sourceToken}
          />
        </div>
      </DepositLimitContentWrapper>
    </div>
  );
};

export const DepositLimit: React.FC<IDepositLimitProps> = ({
  sourceToken,
  minAmount,
  maxAmount,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="tw-text-sm tw-text-left tw-mb-2 tw-text-black tw-uppercase">
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
            sourceToken={sourceToken}
          />
          <DepositLimitItem
            direction="up"
            label="MAX"
            amount={maxAmount}
            sourceToken={sourceToken}
          />
        </div>
        <DepositLimitDivider />
      </div>
    </div>
  );
};
