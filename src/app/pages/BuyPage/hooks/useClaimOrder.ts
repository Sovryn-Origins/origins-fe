import { useCallback, useMemo, useState } from 'react';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { useAccount } from 'app/hooks/useAccount';
import { getContract } from 'utils/blockchain/contract-helpers';

const collateralAddress = getContract('SOV_token').address;

export const useClaimOrder = () => {
  const account = useAccount();
  const [isPurchase, setIsPurchase] = useState(false);

  const { send: claimBuyOrder, ...restOfClaimBuyOrder } = useSendContractTx(
    'MYNT_Controller',
    'claimBuyOrder',
  );

  const { send: claimSellOrder, ...restOfClaimSellOrder } = useSendContractTx(
    'MYNT_Controller',
    'claimSellOrder',
  );

  const transaction = useMemo(
    () => (isPurchase ? restOfClaimBuyOrder : restOfClaimSellOrder),
    [isPurchase, restOfClaimBuyOrder, restOfClaimSellOrder],
  );

  const claim = useCallback(
    (batchId: number, isPurchase: boolean) => {
      const claimOrder = isPurchase ? claimBuyOrder : claimSellOrder;
      setIsPurchase(isPurchase);
      claimOrder([account, batchId, collateralAddress], { from: account });
    },
    [claimBuyOrder, claimSellOrder, account],
  );

  return { claim, ...transaction };
};
