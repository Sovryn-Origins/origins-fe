import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { SlippageDialog } from 'app/components/Dialogs/SlippageDialog';
import { Input } from 'app/components/Form/Input';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { SwapAssetSelector } from 'app/containers/SwapFormContainer/components/SwapAssetSelector/Loadable';
import { useAccount } from 'app/hooks/useAccount';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useSlippage } from 'app/hooks/useSlippage';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useBondingCurvePrice } from '../../hooks/useBondingCurvePrice';
import { useBondingCurvePlaceOrder } from '../../hooks/useBondingCurvePlaceOrder';
import comingIcon from 'assets/images/swap/coming.svg';
import swapIcon from 'assets/images/buy/buy_exchange.svg';
import settingIcon from 'assets/images/swap/ic_setting.svg';
import { Asset } from 'types';
import { IPromotionLinkState } from 'types/promotion';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { weiToNumberFormat } from 'utils/display-text/format';
import { getTokenContractName } from 'utils/blockchain/contract-helpers';
import { Sovryn } from 'utils/sovryn';
import { contractReader } from 'utils/sovryn/contract-reader';
import { discordInvite } from 'utils/classifiers';

import { AmountInput } from '../AmountInput';
import { BuyButton } from '../Button/buy';
import { TxDialog } from '../TxDialog';
import { useClaimOrder } from '../../hooks/useClaimOrder';
import { BuyStatus } from '../../types';

import styles from './index.module.scss';

interface Option {
  key: Asset;
  label: string;
}

const tokens = [
  '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
  '0x010C233B4F94d35CaDb71D12D7058aAb58789e8f',
  '0x139483e22575826183F5b56dd242f8f2C1AEf327',
  '0xAc5C5917e713581c8C8B78c7B12f2D67dA0323f0',
];

interface IBondingCurveFormProps {
  comingSoon?: boolean;
}

export const BondingCurveForm: React.FC<IBondingCurveFormProps> = ({
  comingSoon = true,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const swapLocked = checkMaintenance(States.SWAP_TRADES);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(Asset.MYNT);
  const [targetToken, setTargetToken] = useState(Asset.SOV);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);
  const [targetOptions, setTargetOptions] = useState<any[]>([]);
  const [slippage, setSlippage] = useState(0.5);
  const [swap, setSwap] = useState(true);
  const [buyStatus, setBuyStatus] = useState<BuyStatus>(BuyStatus.NONE);

  const weiAmount = useWeiAmount(amount);
  const [tokenBalance, setTokenBalance] = useState<any[]>([]);
  // const transactions = useSelector(selectTransactions);
  // const [method, setMethod] = useState('buy');
  // const [batchId, setBatchId] = useState(0);
  // const [hash, setHash] = useState('');
  const isPurchase = useMemo(() => sourceToken === Asset.SOV, [sourceToken]);
  const bondingCurvePrice = useBondingCurvePrice(weiAmount, isPurchase);
  const { placeOrder, ...orderTx } = useBondingCurvePlaceOrder(isPurchase);
  const { claim, ...claimTx } = useClaimOrder();

  // useEffect(() => {
  //   const start = async () => {
  //     const keys = Object.keys(transactions);
  //     const transaction = transactions[keys[keys.length - 1]];
  //     if (
  //       transaction?.status === 'confirmed' &&
  //       transaction?.type === 'bonding' &&
  //       transaction?.customData?.stage === 'buy'
  //     ) {
  //       window.ethereum.enable();
  //       const web3 = new Web3(Web3.givenProvider);
  //       const receipt = await web3.eth.getTransactionReceipt(
  //         transaction.transactionHash,
  //       );
  //       const blockNumber = receipt.blockNumber;
  //       const id = Math.floor(blockNumber / 10) * 10;
  //       setBatchId(id);
  //       setHash(transaction.transactionHash);
  //       setMethod('claim');
  //     }
  //     if (transaction?.customData?.stage !== 'buy') {
  //       setMethod('buy');
  //     }
  //   };
  //   start();
  // }, [transactions]);

  useEffect(() => {
    async function getOptions() {
      try {
        Promise.all(
          tokens.map(async item => {
            const asset = AssetsDictionary.getByTokenContractAddress(item);
            if (!asset || !asset.hasAMM) {
              return null;
            }
            let token: string = '';
            if (account) {
              if (asset.asset === Asset.SOV) {
                token = await Sovryn.getWeb3().eth.getBalance(account);
              } else {
                token = await contractReader.call(
                  getTokenContractName(asset.asset),
                  'balanceOf',
                  [account],
                );
              }
            }
            return {
              key: asset.asset,
              label: asset.symbol,
              value: token,
            };
          }),
        ).then(result => {
          setTokenBalance(result.filter(item => item !== null) as Option[]);
        });
      } catch (e) {
        console.error(e);
      }
    }
    if (tokens.length > 0) getOptions();
  }, [account]);

  useEffect(() => {
    var newOptions = [...tokenBalance];
    newOptions.forEach((item, index) => {
      if (item.key === 'SOV') {
        newOptions.splice(index, 1);
      }
    });
    if (swap) {
      if (newOptions) {
        setSourceOptions(newOptions);
      }
      if (
        !newOptions.find(item => item.key === sourceToken) &&
        newOptions.length
      ) {
        setSourceToken(newOptions[0].key);
      }
    } else {
      if (newOptions) {
        if (newOptions.length > 0) setTargetOptions(newOptions);
      }
      if (
        !newOptions.find(item => item.key === targetToken) &&
        newOptions.length
      ) {
        setTargetToken(newOptions[0].key);
      }
    }
  }, [tokenBalance, swap, sourceToken, targetToken]);

  useEffect(() => {
    var newOptions = [...tokenBalance];
    var targetOption: any = [];
    newOptions.forEach((item, index) => {
      if (item.key === 'SOV') {
        targetOption.push(item);
      }
    });

    if (swap) {
      if (targetOption) {
        if (targetOption.length > 0) setTargetOptions(targetOption);
      }
      if (
        !targetOption.find(item => item.key === targetToken) &&
        targetOption.length
      ) {
        setTargetToken(targetOption[0].key);
      }
    } else {
      if (targetOption) {
        setSourceOptions(targetOption);
      }
      if (
        !targetOption.find(item => item.key === sourceToken) &&
        targetOption.length
      ) {
        setSourceToken(targetOption[0].key);
      }
    }
  }, [tokenBalance, swap, sourceToken, targetToken]);

  const { minReturn } = useSlippage(bondingCurvePrice.value, slippage);

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  useEffect(() => {
    if (location.state?.asset) {
      const item = tokenBalance.find(
        item => item.key === location.state?.asset,
      );
      if (item) {
        setSourceToken(item.key);
      }
    }
    if (location.state?.target) {
      const item = tokenBalance.find(
        item => item.key === location.state?.target,
      );
      if (item) {
        setTargetToken(item.key);
        history.replace(location.pathname);
      }
    }
  }, [tokenBalance, location.state, location.pathname, history]);

  const handleSwapAssets = () => {
    const _sourceToken = sourceToken;
    setSourceToken(targetToken);
    setTargetToken(_sourceToken);
    setAmount('0');
    setSwap(!swap);
  };

  const handleOnSwap = () => {
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

      <TxDialog tx={orderTx} />
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
