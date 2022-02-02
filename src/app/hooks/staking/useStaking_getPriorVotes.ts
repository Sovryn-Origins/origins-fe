import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useStaking_getPriorVotes(
  address: string,
  blockNumber: number,
  timestamp: number,
) {
  return useCacheCallWithValue(
    'staking',
    'getPriorVotes',
    '0',
    address,
    blockNumber,
    timestamp,
  );
}
