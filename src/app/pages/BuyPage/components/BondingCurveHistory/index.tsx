import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { translations } from 'locales/i18n';

import { Pagination } from 'app/components/Pagination';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetDetails } from 'utils/models/asset-details';

import { AssetRow, AssetRowData } from './components/AssetRow';
import { useGetBondingCurveHistory } from '../../hooks/useGetBondingCurveHistory';

import styles from './index.module.scss';

export const BondingCurveHistory: React.FC = () => {
  const transactions = useSelector(selectTransactionArray);
  const [currentHistory, setCurrentHistory] = useState([]) as any;
  const { t } = useTranslation();
  const assets = AssetsDictionary.list();
  const [hasOngoingTransactions, setHasOngoingTransactions] = useState(false);
  const { loading, value: history } = useGetBondingCurveHistory();

  // const getBondingCurveOrders = useCallback(async () => {
  //   bondHistory
  //     .getPastEvents('MYNT_MarketMaker', 'ClaimBuyOrder', {
  //       fromBlock: 0,
  //       toBlock: 'latest',
  //     })
  //     .then(res => {
  //       setHistory([]);
  //       setCurrentHistory([]);
  //       setHistory(res.sort((x, y) => y.timestamp - x.timestamp));
  //       setLoading(false);
  //       countOfLoadingHistory.current++;
  //     })
  //     .catch(e => {});
  // }, []);

  // useEffect(() => {
  //   if (!account) return;
  //   if (countOfLoadingHistory.current === 0) {
  //     setLoading(true);
  //   }
  //   getBondingCurveOrders();
  // }, [account, getBondingCurveOrders, retry]);

  const onPageChanged = data => {
    const { currentPage, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    setCurrentHistory(history.slice(offset, offset + pageLimit));
  };

  const onGoingTransactions = useMemo(() => {
    return transactions.map(item => {
      const { customData } = item;

      if (!hasOngoingTransactions) {
        setHasOngoingTransactions(true);
      }

      const assetFrom = assets.find(
        currency => currency.asset === customData?.sourceToken,
      );
      const assetTo = assets.find(
        currency => currency.asset === customData?.targetToken,
      );

      const data: AssetRowData = {
        status: item.status,
        timestamp: customData?.date,
        transaction_hash: item.transactionHash,
        returnVal: {
          _fromAmount: customData?.amount,
          _toAmount: customData?.minReturn || null,
        },
      };

      return (
        <AssetRow
          key={item.transactionHash}
          data={data}
          itemFrom={assetFrom!}
          itemTo={assetTo!}
        />
      );
    });
  }, [assets, hasOngoingTransactions, transactions]);

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
            {!hasOngoingTransactions && history.length === 0 && !loading && (
              <tr key={'empty'}>
                <td className="tw-text-center" colSpan={99}>
                  {t(translations.swapHistory.emptyState)}
                </td>
              </tr>
            )}
            {/* {onGoingTransactions} */}
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
                  getContractNameByAddress(item.to_token).includes(
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
};
