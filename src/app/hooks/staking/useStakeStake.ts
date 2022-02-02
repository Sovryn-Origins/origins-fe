import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useStakeStake() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('staking', 'stake');
  return {
    stake: (weiAmount: string, timestamp: number, nonce: number) => {
      send([weiAmount, timestamp, account, ethGenesisAddress], {
        from: account,
        nonce: nonce,
      });
    },
    ...rest,
  };
}
