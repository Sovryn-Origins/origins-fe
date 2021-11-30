import { useEffect, useState } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { contractReader } from 'utils/sovryn/contract-reader';

export const useGetDepositAmount = tierId => {
  const account = useAccount();
  const [depositAmount, setDepositAmount] = useState('0');

  useEffect(() => {
    if (!account) return;
    contractReader
      .call<string>('originsBase', 'getTokensBoughtByAddressOnTier', [
        account,
        tierId,
      ])
      .then(result => {
        setDepositAmount(result);
      })
      .catch();
  }, [account, tierId]);

  return depositAmount;
};
