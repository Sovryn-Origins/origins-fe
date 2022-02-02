import { useEffect, useState } from 'react';
import { TransactionReceipt } from 'web3-core';
import { Sovryn } from 'utils/sovryn';

export const useGetTransactionReceipt = (hash: string) => {
  const [value, setValue] = useState<TransactionReceipt>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hash) return;
    setLoading(true);
    Sovryn.getWeb3()
      .eth.getTransactionReceipt(hash)
      .then(transaction => {
        setValue(transaction);
        setLoading(false);
      });
  }, [hash]);

  return { value, loading };
};
