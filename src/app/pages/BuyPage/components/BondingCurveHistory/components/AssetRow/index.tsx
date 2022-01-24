import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';

import { translations } from 'locales/i18n';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { LoadableValue } from 'app/components/LoadableValue';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { useCachedAssetPrice } from 'app/hooks/trading/useCachedAssetPrice';
import iconPending from 'assets/images/icon-pending.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconSuccess from 'assets/images/icon-success.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset, Nullable } from 'types';
import { AssetDetails } from 'utils/models/asset-details';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { weiToUSD } from 'utils/display-text/format';

import { useBondingCurvePrice } from '../../../../hooks/useBondingCurvePrice';

import styles from './index.module.scss';

export interface AssetRowData {
  status: TxStatus;
  timestamp: number;
  transaction_hash: string;
  returnVal: {
    _fromAmount: string;
    _toAmount: Nullable<string>;
  };
}

interface AssetProps {
  data: AssetRowData;
  itemFrom: AssetDetails;
  itemTo: AssetDetails;
}

export function AssetRow({ data, itemFrom, itemTo }: AssetProps) {
  const { t } = useTranslation();
  const dollars = useCachedAssetPrice(itemTo.asset, Asset.USDT);

  const dollarValue = useMemo(() => {
    //if (data.returnVal._toAmount === null) return '';
    if (data.status !== 'confirmed') return null;
    return bignumber(data.returnVal._toAmount)
      .mul(dollars.value)
      .div(10 ** itemTo.decimals)
      .toFixed(0);
  }, [dollars.value, data.returnVal._toAmount, itemTo.decimals, data.status]);

  const isPurchase = useMemo(() => itemFrom.asset === Asset.SOV, [itemFrom]);

  const { value: toWeiAmount, loading: loadingToAmount } = useBondingCurvePrice(
    data.returnVal._fromAmount,
    isPurchase,
  );

  if (data.status !== 'confirmed') {
    return (
      <tr>
        <td className="tw-hidden lg:tw-table-cell">
          <DisplayDate
            className={styles.dateTime}
            timestamp={new Date(data.timestamp).getTime().toString()}
          />
        </td>
        <td className="tw-hidden lg:tw-table-cell">
          <img
            className={styles.assetImg}
            src={itemFrom.logoSvg}
            alt={itemFrom.asset}
          />{' '}
          <AssetRenderer className={styles.assetLabel} asset={itemFrom.asset} />
        </td>
        <td className="tw-font-inter tw-text-base">
          {weiToFixed(data.returnVal._fromAmount, 6)}
        </td>
        <td>
          <img
            className={styles.assetImg}
            style={{ height: '40px' }}
            src={itemTo.logoSvg}
            alt={itemTo.asset}
          />{' '}
          <AssetRenderer className={styles.assetLabel} asset={itemTo.asset} />
        </td>
        <td className="tw-hidden lg:tw-table-cell tw-font-inter tw-text-base">
          <div className="tw-font-inter">
            <LoadableValue
              value={weiToFixed(toWeiAmount || '0', 8)}
              loading={loadingToAmount}
            />
          </div>
          ≈{' '}
          <LoadableValue
            value={weiToUSD(dollarValue || '0')}
            loading={dollars.loading}
          />
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-between tw-p-0">
            <div>
              <p className="tw-m-0 tw-font-inter tw-text-base">
                {!data.status && <>{t(translations.common.confirmed)}</>}
                {data.status === TxStatus.FAILED && (
                  <>{t(translations.common.failed)}</>
                )}
                {data.status === TxStatus.PENDING && (
                  <>{t(translations.common.pending)}</>
                )}
              </p>
              <LinkToExplorer
                txHash={data.transaction_hash}
                className="tw-text-primary tw-text-base tw-font-inter tw-font-normal tw-whitespace-nowrap"
              />
            </div>
            <div className="tw-hidden sm:tw-block lg:tw-hidden xl:tw-block">
              {!data.status && (
                <img src={iconSuccess} title="Confirmed" alt="Confirmed" />
              )}
              {data.status === TxStatus.FAILED && (
                <img src={iconRejected} title="Failed" alt="Failed" />
              )}
              {data.status === TxStatus.PENDING && (
                <img
                  src={iconPending}
                  title="Pending"
                  alt="Pending"
                  className="tw-animate-spin"
                />
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  } else return null;
}
