import { useEffect, useState } from 'react';

import { useAccount } from 'app/hooks/useAccount';
import { eventReader } from 'utils/sovryn/event-reader';

export const useGetBondingCurveClaimOrder = (
  batchId: number,
  isPurchase: boolean,
) => {
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    if (!account) return;

    // if (loadingCount.current === 0) {
    setLoading(true);
    // }
    const filter = isPurchase
      ? { buyer: account, batchId }
      : { seller: account, batchId };

    eventReader
      .getPastEvents(
        'MYNT_MarketMaker',
        isPurchase ? 'ClaimBuyOrder' : 'ClaimSellOrder',
        filter,
        {
          fromBlock: batchId - 1,
          toBlock: batchId + 10,
        },
      )
      .then(([claimEvent]) => {
        setValue(claimEvent);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account, batchId, isPurchase]);

  return { value, loading };
};
