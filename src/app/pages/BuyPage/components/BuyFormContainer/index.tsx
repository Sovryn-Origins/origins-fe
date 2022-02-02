import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { fromWei, weiToFixed } from 'utils/blockchain/math-helpers';
import { Asset } from 'types';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { SwapAssetSelector } from 'app/containers/SwapFormContainer/components/SwapAssetSelector/Loadable';
import { AmountInput } from '../AmountInput';
import swapIcon from 'assets/images/buy/buy_exchange.svg';
import settingIcon from 'assets/images/swap/ic_setting.svg';
import { SlippageDialog } from 'app/components/Dialogs/SlippageDialog';
import { useSlippage } from 'app/hooks/useSlippage';
import { weiToNumberFormat } from 'utils/display-text/format';
import { BuyButton } from '../Button/buy';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { bignumber } from 'mathjs';
import { Input } from 'app/components/Form/Input';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { useAccount } from 'app/hooks/useAccount';
import { getTokenContractName } from 'utils/blockchain/contract-helpers';
import { Sovryn } from 'utils/sovryn';
import { contractReader } from 'utils/sovryn/contract-reader';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useSwapsExternal_approveAndSwapExternal } from 'app/hooks/swap-network/useSwapsExternal_approveAndSwapExternal';
import { IPromotionLinkState } from 'types/promotion';
import styles from './index.module.scss';
import { useSwapNetwork_approveAndConvertByPath } from 'app/hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';

const s = translations.swapTradeForm;

interface Option {
  key: Asset;
  label: string;
}

const xusdExcludes = [Asset.USDT, Asset.DOC];

export function BuyFormContainer() {
  const { t } = useTranslation();
  const isConnected = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const swapLocked = checkMaintenance(States.SWAP_TRADES);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(Asset.RBTC);
  const [targetToken, setTargetToken] = useState(Asset.SOV);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);
  const [targetOptions, setTargetOptions] = useState<any[]>([]);
  const [slippage, setSlippage] = useState(0.5);
  const account = useAccount();
  const weiAmount = useWeiAmount(amount);
  const { value: tokens } = useCacheCallWithValue<string[]>(
    'converterRegistry',
    'getConvertibleTokens',
    [],
  );
  const [tokenBalance, setTokenBalance] = useState<any[]>([]);

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
              if (asset.asset === Asset.RBTC) {
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
  }, [account, tokens]);

  useEffect(() => {
    const newOptions = tokenBalance;
    if (newOptions) {
      setSourceOptions(newOptions);
    }

    if (
      !newOptions.find(item => item.key === sourceToken) &&
      newOptions.length
    ) {
      setSourceToken(newOptions[0].key);
    }
  }, [tokens, targetToken, sourceToken, tokenBalance]);

  useEffect(() => {
    const newOptions = tokenBalance;

    if (newOptions) {
      const filteredOptions = newOptions.filter(option => {
        if (sourceToken === Asset.XUSD && xusdExcludes.includes(option.key))
          return false;
        if (xusdExcludes.includes(sourceToken) && option.key === Asset.XUSD)
          return false;
        return option.key !== sourceToken;
      });
      if (filteredOptions.length > 0) setTargetOptions(filteredOptions);
    }

    let defaultTo: Asset | null = null;
    if (sourceToken === targetToken) {
      switch (targetToken) {
        case Asset.RBTC: {
          defaultTo = Asset.SOV;
          break;
        }
        case Asset.SOV:
        default: {
          defaultTo = Asset.RBTC;
          break;
        }
      }
    }

    if (defaultTo && newOptions.find(item => item.key === defaultTo)) {
      setTargetToken(defaultTo);
    } else if (
      //default to RBTC if invalid XUSD pair used
      ((sourceToken === Asset.XUSD && xusdExcludes.includes(targetToken)) ||
        (xusdExcludes.includes(sourceToken) && targetToken === Asset.XUSD)) &&
      newOptions.find(item => item.key === Asset.RBTC)
    ) {
      setTargetToken(Asset.RBTC);
    } else if (
      !newOptions.find(item => item.key === targetToken) &&
      newOptions.length
    ) {
      setTargetToken(newOptions[0].key);
    }
  }, [tokens, sourceToken, targetToken, tokenBalance]);

  const { value: rateByPath } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    targetToken,
    weiAmount,
  );

  const { minReturn } = useSlippage(rateByPath, slippage);

  const { value: path } = useSwapNetwork_conversionPath(
    tokenAddress(sourceToken),
    tokenAddress(targetToken),
  );

  const { send: sendPath, ...txPath } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    minReturn,
  );

  const {
    send: sendExternal,
    ...txExternal
  } = useSwapsExternal_approveAndSwapExternal(
    sourceToken,
    targetToken,
    account,
    account,
    weiAmount,
    '0',
    minReturn,
    '0x',
  );

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
  }, [tokens, tokenBalance, location.state, location.pathname, history]);

  const onSwapAssets = () => {
    const _sourceToken = sourceToken;
    setSourceToken(targetToken);
    setTargetToken(_sourceToken);
    setAmount(fromWei(rateByPath));
  };

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(minReturn).greaterThan(0) &&
      targetToken !== sourceToken
    );
  }, [targetToken, sourceToken, minReturn, weiAmount]);

  const tx = useMemo(
    () =>
      targetToken === Asset.RBTC ||
      [targetToken, sourceToken].includes(Asset.RIF)
        ? txPath
        : txExternal,
    [targetToken, sourceToken, txExternal, txPath],
  );

  const send = useCallback(
    () =>
      targetToken === Asset.RBTC ||
      [targetToken, sourceToken].includes(Asset.RIF)
        ? sendPath()
        : sendExternal(),
    [targetToken, sourceToken, sendPath, sendExternal],
  );

  return (
    <>
      <SlippageDialog
        isOpen={dialogOpen}
        amount={rateByPath}
        value={slippage}
        asset={targetToken}
        onClose={() => setDialogOpen(false)}
        onChange={value => setSlippage(value)}
      />

      {/* <Arbitrage /> */}

      <div className={styles.swapFormContainer}>
        <div className={styles.swapForm}>
          <div className={styles.title}>{t(translations.swap.send)}</div>
          <div className={styles.currency}>
            <SwapAssetSelector
              value={sourceToken}
              items={sourceOptions}
              placeholder={t(s.fields.currency_placeholder)}
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
            onClick={onSwapAssets}
          />
        </div>
        <div className={styles.swapForm}>
          <div className={styles.title}>{t(translations.swap.receive)}</div>
          <div className={styles.currency}>
            <SwapAssetSelector
              value={targetToken}
              items={targetOptions}
              placeholder={t(s.fields.currency_placeholder)}
              onChange={value => setTargetToken(value.key)}
            />
          </div>
          <div className={styles.availableBalance}>
            <AvailableBalance asset={targetToken} />
          </div>
          <div className={styles.amount}>
            <Input
              value={weiToFixed(rateByPath, 6)}
              onChange={value => setAmount(value)}
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
          disabled={
            tx.loading ||
            !isConnected ||
            (!validate && isConnected) ||
            swapLocked
          }
          onClick={send}
          text={t(translations.swap.cta)}
        />
      </div>

      <TxDialog tx={tx} />
    </>
  );
}

function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}
