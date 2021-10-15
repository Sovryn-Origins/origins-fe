import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AmountInput } from 'app/components/Form/AmountInput';
import { TxDialog } from '../TxDialog';
import { DepositLimit } from './components/DepositLimit';

import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { BuyWrapper, BuyButton } from './styled';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { bignumber } from 'mathjs';
import { noop } from 'app/constants';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useApproveAndBuyToken } from 'app/pages/OriginsLaunchpad/hooks/useApproveAndBuyToken';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

interface IBuySectionProps {
  saleName: string;
  depositRate: number;
  sourceToken: Asset;
  tierId: number;
  maxAmount: string;
  minAmount: string;
}

export const BuySection: React.FC<IBuySectionProps> = ({
  saleName,
  depositRate,
  sourceToken: initSourceToken,
  tierId,
  maxAmount,
  minAmount,
}) => {
  const { t } = useTranslation();
  const connected = useCanInteract(true);

  const [sourceToken, setSourceToken] = useState<Asset>(initSourceToken);
  const [amount, setAmount] = useState('');
  const [isOverMaxLimit, setIsOverMaxLimit] = useState(false);
  const weiAmount = useWeiAmount(amount);

  const [tokenAmount, setTokenAmount] = useState(amount);
  const weiTokenAmount = useWeiAmount(tokenAmount);

  const isValidAmount = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiTokenAmount).greaterThan(0) &&
      !isOverMaxLimit
    );
  }, [isOverMaxLimit, weiAmount, weiTokenAmount]);

  useEffect(() => setTokenAmount(`${Number(amount) * depositRate}`), [
    amount,
    depositRate,
  ]);

  useEffect(
    () => setIsOverMaxLimit(bignumber(weiAmount).greaterThan(maxAmount)),
    [weiAmount, maxAmount],
  );

  const { buy, ...buyTx } = useApproveAndBuyToken();

  const onBuyClick = useCallback(
    () => buy(tierId, weiTokenAmount, saleName, weiAmount, sourceToken),
    [buy, saleName, sourceToken, tierId, weiAmount, weiTokenAmount],
  );

  return (
    <BuyWrapper>
      <div className="tw-max-w-md tw-mx-auto">
        <DepositLimit
          sourceToken={sourceToken}
          minAmount={minAmount}
          maxAmount={maxAmount}
        />
        <div className="tw-mb-10">
          <div className="tw-text-sm tw-text-left tw-mb-2 tw-text-black tw-uppercase">
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog
                .enterAmount,
            )}
            :
          </div>
          <AmountInput
            value={amount}
            onChange={value => setAmount(value)}
            asset={sourceToken}
            selectable={true}
            onSelectAsset={asset => {
              console.log('[BuySection]', asset);
              setSourceToken(asset);
            }}
          />
          {isOverMaxLimit && (
            <ErrorBadge
              content={
                <span>
                  {t(
                    translations.originsLaunchpad.saleDay.buyStep.buyDialog
                      .isOverMaxLimit,
                  )}
                </span>
              }
            />
          )}
        </div>

        <div>
          <div className="tw-text-sm tw-text-left tw-mb-2 tw-text-black tw-uppercase">
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog
                .tokenReceived,
              { token: saleName },
            )}
            :
          </div>
          <AmountInput
            value={tokenAmount}
            assetString={saleName}
            readonly={true}
            onChange={noop}
          />
        </div>

        <BuyButton
          disabled={buyTx.loading || !isValidAmount || !connected}
          onClick={onBuyClick}
        >
          <span>
            {t(
              translations.originsLaunchpad.saleDay.buyStep.buyDialog.buyButton,
              { token: saleName },
            )}
          </span>
        </BuyButton>

        <TxDialog tx={buyTx} />
      </div>
    </BuyWrapper>
  );
};
