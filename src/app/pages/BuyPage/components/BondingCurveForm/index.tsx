import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { SlippageDialog } from 'app/components/Dialogs/SlippageDialog';
import { Input } from 'app/components/Form/Input';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { SwapAssetSelector } from 'app/containers/SwapFormContainer/components/SwapAssetSelector';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useSlippage } from 'app/hooks/useSlippage';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useBondingCurvePrice } from '../../hooks/useBondingCurvePrice';
import { useBondingCurvePlaceOrder } from '../../hooks/useBondingCurvePlaceOrder';
import comingIcon from 'assets/images/swap/coming.svg';
import swapIcon from 'assets/images/buy/buy_exchange.svg';
import settingIcon from 'assets/images/swap/ic_setting.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { weiToNumberFormat } from 'utils/display-text/format';
import { discordInvite } from 'utils/classifiers';

import { AmountInput } from '../AmountInput';
import { BuyButton } from '../Button/buy';
import { TxDialog } from '../TxDialog';
import { useClaimOrder } from '../../hooks/useClaimOrder';
import { useIsBatchFinished } from '../../hooks/useIsBatchFinished';
import { BuyStatus, sellAssets, buyAssets } from '../../types';

import styles from './index.module.scss';

const sellOptions = sellAssets.map(asset => ({
  key: asset,
  label: asset as string,
}));

const buyOptions = buyAssets.map(asset => ({
  key: asset,
  label: asset as string,
}));

interface IBondingCurveFormProps {
  comingSoon?: boolean;
}

export const BondingCurveForm: React.FC<IBondingCurveFormProps> = ({
  comingSoon = true,
}) => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const swapLocked = checkMaintenance(States.SWAP_TRADES);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(Asset.MYNT);
  const [targetToken, setTargetToken] = useState(Asset.SOV);
  const [slippage, setSlippage] = useState(0.5);
  const [isPurchase, setIsPurchase] = useState(false);
  const sourceOptions = useMemo(() => (isPurchase ? buyOptions : sellOptions), [
    isPurchase,
  ]);
  const targetOptions = useMemo(() => (isPurchase ? sellOptions : buyOptions), [
    isPurchase,
  ]);

  const weiAmount = useWeiAmount(amount);
  const bondingCurvePrice = useBondingCurvePrice(weiAmount, isPurchase);
  const { minReturn } = useSlippage(bondingCurvePrice.value, slippage);

  const [orderHash, setOrderHash] = useState('');
  const { placeOrder, ...orderTx } = useBondingCurvePlaceOrder(isPurchase);
  const { claim, ...claimTx } = useClaimOrder();

  const { isBatchFinished, blockNumber: orderBlockNumber } = useIsBatchFinished(
    orderHash,
  );

  const buyStatus: BuyStatus = useMemo(() => {
    if (
      orderTx.status === TxStatus.FAILED ||
      claimTx.status === TxStatus.FAILED
    )
      return BuyStatus.FAILED;

    if (orderTx.status === TxStatus.PENDING) return BuyStatus.OPENING;

    if (orderHash && !isBatchFinished) return BuyStatus.WAIT_FOR_BATCH;

    if (isBatchFinished) {
      if (claimTx.status === TxStatus.NONE) return BuyStatus.CLAIMABLE;
      if (claimTx.status === TxStatus.PENDING) return BuyStatus.CLAIMING;
    }

    return BuyStatus.NONE;
  }, [orderTx.status, claimTx.status, orderHash, isBatchFinished]);

  useEffect(() => {
    if (orderTx.status === TxStatus.CONFIRMED) {
      setOrderHash(orderTx.txHash);
    }
  }, [orderTx]);

  useEffect(() => {
    if (isBatchFinished) {
      const batchId = Math.floor(orderBlockNumber / 10) * 10;
      claim(batchId, isPurchase);
      setOrderHash('');
    }
  }, [isBatchFinished, orderBlockNumber, isPurchase, claim]);

  const handleSwapAssets = () => {
    const _sourceToken = sourceToken;
    setSourceToken(targetToken);
    setTargetToken(_sourceToken);
    setAmount('0');
    setIsPurchase(!isPurchase);
  };

  const handleOnSwap = () => {
    setOrderHash('');
    placeOrder(weiAmount);
  };

  return (
    <>
      <SlippageDialog
        isOpen={dialogOpen}
        amount={bondingCurvePrice.value}
        value={slippage}
        asset={targetToken}
        onClose={() => setDialogOpen(false)}
        onChange={value => setSlippage(value)}
      />

      {!comingSoon ? (
        <>
          <div className={styles.swapFormContainer}>
            <div className={styles.swapForm}>
              <div className={styles.title}>{t(translations.swap.send)}</div>
              <div className={styles.currency}>
                <SwapAssetSelector
                  value={sourceToken}
                  items={sourceOptions}
                  placeholder={t(
                    translations.swapTradeForm.fields.currency_placeholder,
                  )}
                  onChange={value => setSourceToken(value.key)}
                />
              </div>
              <div className={styles.availableBalance}>
                <AvailableBalance asset={sourceToken} />
              </div>
              <div className={styles.amount}>
                <AmountInput
                  value={amount}
                  onChange={value => setAmount(value)}
                  asset={sourceToken}
                />
              </div>
            </div>
            <div className={styles.swapRevertWrapper}>
              <div
                className={styles.swapRevert}
                style={{ backgroundImage: `url(${swapIcon})` }}
                onClick={handleSwapAssets}
              />
            </div>
            <div className={styles.swapForm}>
              <div className={styles.title}>{t(translations.swap.receive)}</div>
              <div className={styles.currency}>
                <SwapAssetSelector
                  value={targetToken}
                  items={targetOptions}
                  placeholder={t(
                    translations.swapTradeForm.fields.currency_placeholder,
                  )}
                  onChange={value => setTargetToken(value.key)}
                />
              </div>
              <div className={styles.availableBalance}>
                <AvailableBalance asset={targetToken} />
              </div>
              <div className={styles.amount}>
                <Input
                  value={weiToFixed(bondingCurvePrice.value, 6)}
                  readOnly={true}
                  appendElem={<AssetRenderer asset={targetToken} />}
                />
              </div>
            </div>
          </div>

          <div className={styles.swapBtnContainer}>
            <div className={styles.swapBtnHelper}>
              <span>
                {t(translations.swap.minimumReceived)}{' '}
                {weiToNumberFormat(minReturn, 6)}
              </span>
              <img
                src={settingIcon}
                alt="settings"
                onClick={() => setDialogOpen(true)}
              />
            </div>
            {swapLocked && (
              <ErrorBadge
                content={
                  <Trans
                    i18nKey={translations.maintenance.swapTrades}
                    components={[
                      <a
                        href={discordInvite}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                      >
                        x
                      </a>,
                    ]}
                  />
                }
              />
            )}
            <BuyButton
              disabled={false}
              onClick={handleOnSwap}
              text={t(translations.swap.cta)}
              className={'buy-btn'}
            />
          </div>
        </>
      ) : (
        <ComingSoon />
      )}

      <TxDialog
        tx={orderTx}
        openOrderTx={orderTx}
        claimOrderTx={claimTx}
        buyStatus={buyStatus}
      />
    </>
  );
};

const ComingSoon = () => (
  <div className={styles.swapFormContainer}>
    <div className={styles.comingForm}>
      <div className={styles.comingIconWrapper}>
        <img src={comingIcon} alt="ss" />
      </div>
      <p className={styles.comingText}>COMING SOON...</p>
    </div>
  </div>
);
