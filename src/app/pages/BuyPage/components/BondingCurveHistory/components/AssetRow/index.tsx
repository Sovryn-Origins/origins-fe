import React, { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';

// import { translations } from 'locales/i18n';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { LoadableValue } from 'app/components/LoadableValue';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { useCachedAssetPrice } from 'app/hooks/trading/useCachedAssetPrice';
import { useGetTransactionReceipt } from 'app/hooks/useGetTransactionReceipt';
// import iconPending from 'assets/images/icon-pending.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
// import iconSuccess from 'assets/images/icon-success.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import { Asset, Nullable } from 'types';
import { AssetDetails } from 'utils/models/asset-details';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { weiToUSD } from 'utils/display-text/format';
import { timestampByBlocks } from 'utils/helpers';

import { useBondingCurvePrice } from '../../../../hooks/useBondingCurvePrice';
import { useGetBondingCurveClaimOrder } from '../../../../hooks/useGetBondingCurveClaimOrder';
import { BlockInfo, IOrderHistory } from '../../../../types';

import styles from './index.module.scss';

export interface AssetRowData {
  status: TxStatus;
  block: number;
  timestamp: number;
  transaction_hash: string;
  returnVal: {
    _fromAmount: string;
    _toAmount: Nullable<string>;
  };
}

interface AssetProps {
  data: IOrderHistory;
  itemFrom: AssetDetails;
  itemTo: AssetDetails;
  currentBlock: BlockInfo;
}

export function AssetRow({ data, itemFrom, itemTo, currentBlock }: AssetProps) {
  // const { t } = useTranslation();
  const dollars = useCachedAssetPrice(itemTo.asset, Asset.USDT);

  const dollarValue = useMemo(() => {
    //if (data.returnVal._toAmount === null) return '';
    return bignumber(data.returnVal._toAmount)
      .mul(dollars.value)
      .div(10 ** itemTo.decimals)
      .toFixed(0);
  }, [dollars.value, data.returnVal._toAmount, itemTo.decimals]);

  const isPurchase = useMemo(() => itemFrom.asset === Asset.SOV, [itemFrom]);
  const blockMined10 = useMemo(() => currentBlock.number - data.block > 10, [
    currentBlock,
    data.block,
  ]);

  const timestamp = useMemo(
    () =>
      timestampByBlocks(
        currentBlock.timestamp,
        currentBlock.number,
        data.block,
      ),
    [data, currentBlock],
  );

  const { value: toWeiAmount, loading: loadingToAmount } = useBondingCurvePrice(
    data.returnVal._fromAmount,
    isPurchase,
  );

  const {
    value: claimOrder,
    loading: loadingClaimOrder,
  } = useGetBondingCurveClaimOrder(data.returnVal.batchId, isPurchase);

  const { value: claimTransaction } = useGetTransactionReceipt(
    claimOrder?.transactionHash,
  );

  const statusText = useMemo(() => {
    if (!claimOrder) {
      if (!blockMined10) {
        return 'Pending';
      }
      return 'Claimable';
    } else if (!claimTransaction) {
      return 'Pending2';
    } else {
      return claimTransaction.status ? 'Success' : 'Failed';
    }
  }, [claimOrder, claimTransaction, blockMined10]);

  return (
    <tr>
      <td className="tw-hidden lg:tw-table-cell">
        <DisplayDate
          className={styles.dateTime}
          timestamp={new Date(timestamp).getTime().toString()}
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
              {/* {!data.status && <>{t(translations.common.confirmed)}</>}
              {data.status === TxStatus.FAILED && (
                <>{t(translations.common.failed)}</>
              )}
              {data.status === TxStatus.PENDING && (
                <>{t(translations.common.pending)}</>
              )} */}

              {statusText}
            </p>
            <LinkToExplorer
              txHash={data.transaction_hash}
              className="tw-text-primary tw-text-base tw-font-inter tw-font-normal tw-whitespace-nowrap"
            />
          </div>
          <div className="tw-hidden sm:tw-block lg:tw-hidden xl:tw-block">
            {/* {!data.status && (
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
              /> )}*/}

            <img src={iconRejected} title="Failed" alt="Failed" />
          </div>
        </div>
      </td>
    </tr>
  );
}
