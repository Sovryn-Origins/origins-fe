import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from 'utils/classifiers';

export function useStaking_getPriorVotes(
  address: string,
  blockNumber: number,
  timestamp: number,
) {
  return useCacheCallWithValue(
    'staking',
    'getPriorVotes',
    '0',
    !!address && address !== ethGenesisAddress,
    address,
    blockNumber,
    timestamp,
  );
}
