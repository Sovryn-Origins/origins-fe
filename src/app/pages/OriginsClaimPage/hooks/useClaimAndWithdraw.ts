import { useCallback, useEffect, useMemo } from 'react';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { usePrevious } from 'app/hooks/usePrevious';
import { gasLimit } from 'utils/classifiers';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { IClaimRequestProps, IClaimRequestResult } from '../types';

export function useClaimAndWithdraw({
  tierId,
  address,
}: IClaimRequestProps): IClaimRequestResult {
  const { send: withdraw, ...withdrawTx } = useSendContractTx(
    'lockedFund',
    'withdrawAndStakeTokens',
  );

  const { send: claimPooled, ...claimPooledTx } = useSendContractTx(
    'originsBase',
    'claimPooled',
  );

  const prevClaimPooledStatus = usePrevious(claimPooledTx.status);

  const currentTransaction = useMemo(() => {
    return claimPooledTx.status === TxStatus.CONFIRMED &&
      withdrawTx.status === TxStatus.PENDING
      ? withdrawTx
      : claimPooledTx;
  }, [claimPooledTx, withdrawTx]);

  useEffect(() => {
    if (
      prevClaimPooledStatus !== TxStatus.CONFIRMED &&
      claimPooledTx.status === TxStatus.CONFIRMED
    ) {
      withdraw([address], {
        from: address,
      });
    }
  }, [prevClaimPooledStatus, claimPooledTx, withdraw, address]);

  const send = useCallback(() => {
    claimPooled(
      [tierId],
      {
        from: address,
        gas: gasLimit[TxType.LOCKED_FUND_WAITED_CLAIM],
      },
      {
        type: TxType.LOCKED_FUND_WAITED_CLAIM,
      },
    );
  }, [claimPooled, tierId, address]);

  return {
    send,
    ...currentTransaction,
  };
}
