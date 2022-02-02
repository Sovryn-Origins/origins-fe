import { useEffect, useMemo, useState } from 'react';
import { useBlockSync } from 'app/hooks/useAccount';
import { Sovryn } from 'utils/sovryn';

export const useIsBatchFinished = (txHash: string) => {
  const blockSync = useBlockSync();
  const [blockNumber, setBlockNumber] = useState<number>(0);

  const isBatchFinished = useMemo(
    () => blockNumber > 0 && blockSync >= blockNumber + 10,
    [blockNumber, blockSync],
  );

  useEffect(() => {
    if (blockNumber === 0) return;
  }, [blockSync, blockNumber]);

  useEffect(() => {
    if (!txHash) {
      setBlockNumber(0);
      return;
    }
    Sovryn.getWeb3()
      .eth.getTransactionReceipt(txHash)
      .then(tx => {
        setBlockNumber(tx.blockNumber);
      });
  }, [txHash]);

  return { isBatchFinished, blockNumber };
};
