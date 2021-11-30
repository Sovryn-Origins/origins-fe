import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AmountInput } from 'app/components/Form/AmountInput';
import { TxDialog } from '../TxDialog';
import { DepositLimit } from './components/DepositLimit';

import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { bignumber } from 'mathjs';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useApproveAndBuyToken } from 'app/pages/OriginsLaunchpad/hooks/useApproveAndBuyToken';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import styles from './index.module.scss';

interface IBuySectionProps {
  saleName: string;
  depositRate: number;
  depositToken: Asset;
  tierId: number;
  maxAmount: string;
  minAmount: string;
  myTotalDeposit: string;
}

export const BuySection: React.FC<IBuySectionProps> = ({
  saleName,
  depositRate,
  depositToken,
  tierId,
  maxAmount,
  minAmount,
  myTotalDeposit,
}) => {
  const { t } = useTranslation();
  const connected = useCanInteract(true);

  const [sourceToken, setSourceToken] = useState<Asset>(depositToken);
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
    <div className={styles.buyWrapper}>
      <div className={styles.buyInnerWrapper}>
        <div className="tw-max-w-md tw-mx-auto">
          <DepositLimit
            depositToken={depositToken}
            minAmount={minAmount}
            maxAmount={maxAmount}
          />
          <div>
            <div className="tw-text-base tw-text-left tw-font-rowdies tw-mb-2 tw-text-black tw-uppercase">
              {t(
                translations.originsLaunchpad.saleDay.buyStep.buyDialog
                  .yourTotalDeposit,
              )}
            </div>
            <div className="tw-text-left tw-text-xl tw-text-black">
              <span className="tw-mr-2">
                {weiToNumberFormat(myTotalDeposit)}
              </span>
              <AssetRenderer asset={Asset.RBTC} />
            </div>
          </div>
          <div className="tw-mt-32 tw-mb-10">
            <div className="tw-text-base tw-text-left tw-font-rowdies tw-mb-2 tw-text-black tw-uppercase">
              {t(
                translations.originsLaunchpad.saleDay.buyStep.buyDialog
                  .enterAmount,
              )}
            </div>
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={sourceToken}
              selectable={true}
              onSelectAsset={asset => setSourceToken(asset)}
              theme="white"
              showAmountSelector={false}
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

          <button
            className={styles.buyButton}
            disabled={buyTx.loading || !isValidAmount || !connected}
            onClick={onBuyClick}
          >
            <span className="tw-font-rowdies">
              {t(
                translations.originsLaunchpad.saleDay.buyStep.buyDialog
                  .buyButton,
                { token: saleName },
              )}
            </span>
          </button>

          <TxDialog tx={buyTx} />
        </div>
      </div>
    </div>
  );
};
