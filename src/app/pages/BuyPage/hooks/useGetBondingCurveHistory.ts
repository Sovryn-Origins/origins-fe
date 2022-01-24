import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAccount } from 'app/hooks/useAccount';
import { getContract } from 'utils/blockchain/contract-helpers';
import { eventReader } from 'utils/sovryn/event-reader';

export type ReaderOption = { fromBlock: number; toBlock: number | 'latest' };

interface returnVal {
  _fromAmount: string;
  _fromToken: string;
  _toAmount: string;
  _toToken: string;
  _trader: string;
}

interface History {
  returnVal: returnVal;
  beneficiary: string;
  from_token: string;
  to_token: string;
  timestamp: number;
  transaction_hash: string;
  block: number;
  event: string;
  state: string;
}

export const useGetBondingCurveHistory = () => {
  const account = useAccount();
  const [buyHistory, setBuyHistory] = useState<History[]>([]);
  const [sellHistory, setSellHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(false);
  const loadingCount = useRef(0);

  const generateReturnData = useCallback(
    (orderEvent: any): History => {
      const fromTokenAddr =
        orderEvent.event === 'OpenBuyOrder'
          ? getContract('SOV_token').address
          : getContract('MYNT_token').address;
      const toTokenAddr =
        orderEvent.event === 'OpenBuyOrder'
          ? getContract('MYNT_token').address
          : getContract('SOV_token').address;
      const fromAmount =
        orderEvent.returnValues.value || orderEvent.returnValues.amount;

      return {
        beneficiary: account,
        returnVal: {
          _fromAmount: fromAmount,
          _fromToken: fromTokenAddr,
          _toAmount: fromAmount,
          _toToken: toTokenAddr,
          _trader: account,
        },
        from_token: fromTokenAddr,
        to_token: toTokenAddr,
        timestamp: 0,
        transaction_hash: orderEvent.transactionHash,
        block: orderEvent.blockNumber,
        event: orderEvent.event,
        state: '',
      };
    },
    [account],
  );

  useEffect(() => {
    if (!account) return;

    if (loadingCount.current === 0) {
      setLoading(true);
    }

    eventReader
      .getPastEvents('MYNT_MarketMaker', 'OpenBuyOrder', {
        buyer: account,
      })
      .then(buyOrders => {
        setBuyHistory(buyOrders.map(generateReturnData));
      })
      .finally(() => {
        loadingCount.current++;
        setLoading(false);
      });
  }, [account, generateReturnData]);

  useEffect(() => {
    if (!account) return;

    if (loadingCount.current === 0) {
      setLoading(true);
    }

    eventReader
      .getPastEvents('MYNT_MarketMaker', 'OpenSellOrder', {
        seller: account,
      })
      .then(sellOrders => {
        setSellHistory(sellOrders.map(generateReturnData));
      })
      .finally(() => {
        loadingCount.current++;
        setLoading(false);
      });
  }, [account, generateReturnData]);

  const value = useMemo(
    () => [...buyHistory, ...sellHistory].sort((a, b) => a.block - b.block),
    [buyHistory, sellHistory],
  );

  return { value, loading };
};
