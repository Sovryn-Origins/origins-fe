import { useAccount } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';
import { VerificationType } from '../types';
import { useGetSaleInformation } from './useGetSaleInformation';

export const useIsAddressVerified = (tierId: number) => {
  const account = useAccount();
  const saleInfo = useGetSaleInformation(tierId);
  const [isVerified, setIsVerified] = useState(false);
  const [isStaked, setIsStaked] = useState(false);

  useEffect(() => {
    if (!account) return;

    contractReader
      .call<boolean>('originsBase', 'isAddressApproved', [account, tierId])
      .then(result => setIsVerified(result));
  }, [account, tierId]);

  useEffect(() => {
    if (!account) return;

    contractReader
      .call<boolean>('originsBase', 'checkStakesByTier', [tierId, account])
      .then(result => setIsStaked(result));
  }, [account, tierId]);

  if (saleInfo.verificationType === VerificationType.Everyone) {
    return true;
  } else if (saleInfo.verificationType === VerificationType.ByAddress) {
    return isVerified;
  } else if (saleInfo.verificationType === VerificationType.ByStake) {
    return isStaked;
  } else {
    return false;
  }
};
