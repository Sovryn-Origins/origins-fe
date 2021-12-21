import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';

import { AmountInput } from 'app/components/Form/AmountInput';
import { TxDialog } from '../TxDialog';
import { TxDialog as SwapTxDialog } from 'app/components/Dialogs/TxDialog';
import { DepositLimit } from './components/DepositLimit';

import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { TxStatus } from 'store/global/transactions-store/types';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useSlippage } from 'app/hooks/useSlippage';
import { useAccount } from 'app/hooks/useAccount';
import { usePrevious } from 'app/hooks/usePrevious';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useSwapsExternal_approveAndSwapExternal } from 'app/hooks/swap-network/useSwapsExternal_approveAndSwapExternal';
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

const slippage = 0.5;

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
  const account = useAccount();

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

  const { value: amountInSOV } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    Asset.SOV,
    weiAmount,
  );
  const { minReturn } = useSlippage(amountInSOV, slippage);

  const { send: sendSwap, ...txSwap } = useSwapsExternal_approveAndSwapExternal(
    sourceToken,
    Asset.SOV,
    account,
    account,
    weiAmount,
    '0',
    minReturn,
    '0x',
  );
  const oldSwapStatus = usePrevious(txSwap.status);

  const { buy, ...buyTx } = useApproveAndBuyToken();

  useEffect(() => setTokenAmount(`${Number(amount) * depositRate}`), [
    amount,
    depositRate,
  ]);

  useEffect(() => {
    if (
      sourceToken !== Asset.SOV &&
      txSwap?.status === TxStatus.CONFIRMED &&
      oldSwapStatus !== TxStatus.CONFIRMED
    ) {
      buy(
        tierId,
        bignumber(amountInSOV).mul(depositRate).toString(),
        saleName,
        amountInSOV,
        Asset.SOV,
      );
    }
  }, [
    buy,
    saleName,
    sourceToken,
    tierId,
    txSwap,
    amountInSOV,
    oldSwapStatus,
    depositRate,
  ]);

  useEffect(
    () => setIsOverMaxLimit(bignumber(weiAmount).greaterThan(maxAmount)),
    [weiAmount, maxAmount],
  );

  const onBuyClick = useCallback(() => {
    if (sourceToken === Asset.SOV) {
      buy(tierId, weiTokenAmount, saleName, weiAmount, sourceToken);
    } else {
      sendSwap();
    }
  }, [buy, saleName, sourceToken, tierId, weiAmount, weiTokenAmount, sendSwap]);

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
              <AssetRenderer asset={Asset.OG} />
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
          {txSwap && txSwap?.status !== TxStatus.CONFIRMED && (
            <SwapTxDialog tx={txSwap} />
          )}
        </div>
      </div>
    </div>
  );
};
