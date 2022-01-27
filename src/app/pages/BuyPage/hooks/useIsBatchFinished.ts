import { useEffect, useState } from 'react';
import { useBlockSync } from 'app/hooks/useAccount';
import { Sovryn } from 'utils/sovryn';

export const useIsBatchFinished = (txHash: string) => {
  const blockSync = useBlockSync();
  const [isBatchFinished, setIsBatchFinished] = useState(false);

  useEffect(() => {
    if (!txHash) return;
    Sovryn.getWeb3()
      .eth.getTransactionReceipt(txHash)
      .then(tx =>
        setIsBatchFinished(tx && tx.status && blockSync > tx.blockNumber + 10),
      );
  }, [blockSync, txHash]);

  return isBatchFinished;
};
