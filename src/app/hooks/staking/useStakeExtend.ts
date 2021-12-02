import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useStakeExtend() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'staking',
    'extendStakingDuration',
  );
  return {
    extend: (prevTimestamp: number, timestamp: number) => {
      send([prevTimestamp, timestamp], { from: account, gas: 450000 });
    },
    ...rest,
  };
}
