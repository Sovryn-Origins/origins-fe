import { useEffect, useRef, useState } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { useAccount } from 'app/hooks/useAccount';
import { SovrynNetwork } from 'utils/sovryn/sovryn-network';
import { Sovryn } from 'utils/sovryn/index';
import { ContractName } from 'utils/types/contracts';
import { getContract } from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
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
  const [value, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(false);
  const loadingCount = useRef(0);

  useEffect(() => {
    if (!account) return;

    if (loadingCount.current === 0) {
      setLoading(true);
    }
    Promise.all([
      eventReader.getPastEvents('MYNT_MarketMaker', 'ClaimBuyOrder', {
        buyer: account,
      }),
      eventReader.getPastEvents('MYNT_MarketMaker', 'ClaimSellOrder', {
        seller: account,
      }),
    ])
      .then(([buyOrders, sellOrders]) => {
        console.log({ buyOrders, sellOrders });
        setHistory(
          [...buyOrders, ...sellOrders]
            .sort((a, b) => b.blockNumber - a.blockNumber)
            .map(orderEvent => {
              const fromTokenAddr =
                orderEvent.event === 'ClaimBuyOrder'
                  ? getContract('SOV_token').address
                  : getContract('MYNT_token').address;
              const toTokenAddr =
                orderEvent.event === 'ClaimBuyOrder'
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
            }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account]);

  return { value, loading };
};
