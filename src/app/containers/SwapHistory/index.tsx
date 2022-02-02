import axios, { CancelTokenSource } from 'axios';
import { bignumber } from 'mathjs';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { LinkToExplorer } from 'app/components/LinkToExplorer';
import iconPending from 'assets/images/icon-pending.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconSuccess from 'assets/images/icon-success.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { weiToUSD } from 'utils/display-text/format';
import { AssetDetails } from 'utils/models/asset-details';
import { translations } from '../../../locales/i18n';
import { Asset } from '../../../types';
import { DisplayDate } from '../../components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from '../../components/AssetRenderer';
import { LoadableValue } from '../../components/LoadableValue';
import { Pagination } from '../../components/Pagination';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { useAccount } from '../../hooks/useAccount';
import { useTradeHistoryRetry } from '../../hooks/useTradeHistoryRetry';
import { Nullable } from 'types';
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

export function SwapHistory() {
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [currentHistory, setCurrentHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const assets = AssetsDictionary.list();
  const retry = useTradeHistoryRetry();

  let cancelTokenSource = useRef<CancelTokenSource>();

  const getData = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
    cancelTokenSource.current = axios.CancelToken.source();
    axios
      .get(`${url}/events/conversion-swap/${account}`, {
        cancelToken: cancelTokenSource.current.token,
      })
      .then(res => {
        setHistory(res.data.sort((x, y) => y.timestamp - x.timestamp));
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setHistory([]);
        setCurrentHistory([]);
        setLoading(false);
      });
  }, [url, account]);

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);
    setCurrentHistory([]);
    getData();
  }, [getData]);

  //GET HISTORY
  useEffect(() => {
    if (account) {
      getHistory();
    }
  }, [account, getHistory, retry]);

  const onPageChanged = data => {
    const { currentPage, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    setCurrentHistory(history.slice(offset, offset + pageLimit));
  };

  return (
    <section>
      <div className="sovryn-table tw-p-4 tw-mb-12 tw-bg-gray-1 tw-rounded-lg tw-border-4 tw-border-solid tw-border-black">
        <table className="tw-w-full">
          <thead className={styles.header}>
            <tr>
              <th className="tw-hidden lg:tw-table-cell">
                {t(translations.swapHistory.tableHeaders.time)}
              </th>
              <th className="tw-hidden lg:tw-table-cell">
                {t(translations.swapHistory.tableHeaders.from)}
              </th>
              <th>{t(translations.swapHistory.tableHeaders.amountSent)}</th>
              <th>{t(translations.swapHistory.tableHeaders.to)}</th>
              <th className="tw-hidden lg:tw-table-cell">
                {t(translations.swapHistory.tableHeaders.amountReceived)}
              </th>
              <th>{t(translations.swapHistory.tableHeaders.status)}</th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {loading && (
              <tr key={'loading'}>
                <td colSpan={99}>
                  <SkeletonRow
                    loadingText={t(translations.topUpHistory.loading)}
                  />
                </td>
              </tr>
            )}
            {history.length === 0 && !loading && (
              <tr key={'empty'}>
                <td className="tw-text-center" colSpan={99}>
                  {t(translations.swapHistory.emptyState)}
                </td>
              </tr>
            )}

            {currentHistory.map(item => {
              let assetFrom = {} as AssetDetails;
              let assetTo = {} as AssetDetails;
              assets.map(currency => {
                if (
                  getContractNameByAddress(item.from_token)?.includes(
                    currency.asset,
                  )
                ) {
                  assetFrom = currency;
                }
                if (
                  getContractNameByAddress(item.to_token)?.includes(
                    currency.asset,
                  )
                ) {
                  assetTo = currency;
                }
                return null;
              });

              return (
                <AssetRow
                  key={item.transaction_hash}
                  data={item}
                  itemFrom={assetFrom}
                  itemTo={assetTo}
                />
              );
            })}
          </tbody>
        </table>
        {history.length > 0 && (
          <Pagination
            totalRecords={history.length}
            pageLimit={6}
            pageNeighbours={1}
            onChange={onPageChanged}
          />
        )}
      </div>
    </section>
  );
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
          {numberFromWei(data.returnVal._fromAmount)}
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
            {numberFromWei(data.returnVal._toAmount)}
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
