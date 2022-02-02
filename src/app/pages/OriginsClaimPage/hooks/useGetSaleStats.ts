import { useEffect, useState } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { contractReader } from 'utils/sovryn/contract-reader';
import { ISaleStats } from '../types';

export const useGetSaleStats = tierId => {
  const account = useAccount();

  const [saleStats, setSaleStats] = useState<ISaleStats>({
    tokenBoughtByAddress: '0',
    tokenSoldPerTier: '0',
    totalTokenOnTier: '0',
    saleEndTS: 0,
  });

  useEffect(() => {
    contractReader
      .call('originsBase', 'readTierPartA', [tierId])
      .then(result => {
        setSaleStats(prevValue => ({
          ...prevValue,
          saleEndTS: result['_saleEnd'],
        }));
      });
  }, [tierId]);

  useEffect(() => {
    if (!account) return;
    contractReader
      .call<string>('originsBase', 'getTokensBoughtByAddressOnTier', [
        account,
        tierId,
      ])
      .then(result => {
        setSaleStats(prevValue => ({
          ...prevValue,
          tokenBoughtByAddress: result,
        }));
      });
  }, [account, tierId]);

  useEffect(() => {
    contractReader
      .call<string>('originsBase', 'getTokensSoldPerTier', [tierId])
      .then(result => {
        setSaleStats(prevValue => ({
          ...prevValue,
          tokenSoldPerTier: result,
        }));
      });
  }, [tierId]);

  useEffect(() => {
    contractReader
      .call<string>('originsBase', 'getTotalTokenAllocationPerTier', [tierId])
      .then(result => {
        setSaleStats(prevValue => ({
          ...prevValue,
          totalTokenOnTier: result,
        }));
      });
  }, [tierId]);

  return saleStats;
};
