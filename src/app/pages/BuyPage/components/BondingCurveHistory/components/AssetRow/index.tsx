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
import { BlockInfo, IOrderHistory, BuyStatus } from '../../../../types';

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
  const isPurchase = useMemo(() => itemFrom.asset === Asset.SOV, [itemFrom]);

  const {
    value: claimOrder,
    loading: loadingClaimOrder,
  } = useGetBondingCurveClaimOrder(data.returnVal.batchId, isPurchase);

  const isBatchFinished = useMemo(() => currentBlock.number - data.block > 10, [
    currentBlock,
    data.block,
  ]);

  const {
    value: toWeiAmountBondingCurve,
    loading: loadingToAmount,
  } = useBondingCurvePrice(data.returnVal._fromAmount, isPurchase);

  const claimedWeiAmount = useMemo(() => {
    if (!claimOrder || !claimOrder.returnValues) return '';
    return claimOrder && claimOrder.event === 'ClaimBuyOrder'
      ? claimOrder.returnValues.amount
      : claimOrder.returnValues.value;
  }, [claimOrder]);

  const toWeiAmount = useMemo(
    () => claimedWeiAmount || toWeiAmountBondingCurve,
    [claimedWeiAmount, toWeiAmountBondingCurve],
  );

  const dollarValue = useMemo(() => {
    return bignumber(toWeiAmount)
      .mul(dollars.value)
      .div(10 ** itemTo.decimals)
      .toFixed(0);
  }, [dollars.value, itemTo.decimals, toWeiAmount]);

  const txHash = useMemo(
    () => claimOrder?.transactionHash || data.transaction_hash,
    [data, claimOrder],
  );

  const timestamp = useMemo(
    () =>
      timestampByBlocks(
        currentBlock.timestamp,
        currentBlock.number,
        data.block,
      ),
    [data, currentBlock],
  );

  const { value: openTransaction } = useGetTransactionReceipt(
    data.transaction_hash,
  );

  const { value: claimTransaction } = useGetTransactionReceipt(
    claimOrder?.transactionHash,
  );

  const buyStatus = useMemo(() => {
    if (!openTransaction) return BuyStatus.OPENING;
    if (!openTransaction?.status || !claimTransaction?.status) {
      return BuyStatus.FAILED;
    }
    if (openTransaction?.status) {
      if (!isBatchFinished) return BuyStatus.WAIT_FOR_BATCH;
      if (isBatchFinished) {
        if (!claimTransaction) return BuyStatus.CLAIMABLE;
        return BuyStatus.SUCCESS;
      }
    }
    return BuyStatus.NONE;
  }, [openTransaction, claimTransaction, isBatchFinished]);

  const statusText = useMemo(() => {
    const statusTextMap = {
      [BuyStatus.OPENING]: 'Pending',
      [BuyStatus.WAIT_FOR_BATCH]: 'Pending',
      [BuyStatus.CLAIMABLE]: 'Claimable',
      [BuyStatus.CLAIMING]: 'Pending',
      [BuyStatus.SUCCESS]: 'Confirmed',
      [BuyStatus.FAILED]: 'Failed',
    };
    return statusTextMap[buyStatus];
  }, [buyStatus]);

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
              txHash={txHash}
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
