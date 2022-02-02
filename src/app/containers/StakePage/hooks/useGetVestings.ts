import { useEffect, useState } from 'react';
import { ethGenesisAddress } from 'utils/classifiers';
import { useAccount } from 'app/hooks/useAccount';
import { contractReader } from 'utils/sovryn/contract-reader';
import { IVesting, IVestItem, VestGroup } from '../types';

interface IVestingParam {
  cliff: string;
  duration: string;
  creationType: string;
}

export const useGetVestings = () => {
  const account = useAccount();
  const [vestings, setVestings] = useState<IVesting[]>([]);
  const [vestingParams, setVestingParams] = useState<IVestingParam[]>([]);
  const [state, setState] = useState<{
    items: IVestItem[];
    error: string;
    loading: boolean;
  }>({
    items: [],
    error: '',
    loading: false,
  });

  useEffect(() => {
    contractReader
      .call<any[]>('vestingRegistry', 'getVestingsOf', [account])
      .then(result => {
        setVestings(
          result.map(vesting => ({
            address: vesting?.vestingAddress,
            creationType: vesting.vestingCreationType,
            type: vesting.vestingType,
          })),
        );
      });
  }, [account]);

  useEffect(() => {
    Promise.all(
      vestings.map(vesting =>
        contractReader
          .call('vestingRegistry', 'getVestingDetails', [vesting.address])
          .then((result: any) => ({
            cliff: result.cliff,
            duration: result.duration,
            creationType: vesting.creationType,
          }))
          .catch(() => false),
      ),
    )
      .then(results => results.filter(it => !!it))
      .then(results => {
        setVestingParams(results as IVestingParam[]);
      });
  }, [vestings]);

  useEffect(() => {
    const promiseVesting = Promise.all(
      vestingParams.map((vestingParam, i) =>
        contractReader.call<string>('vestingRegistry', 'getVestingAddr', [
          account,
          vestingParam.cliff,
          vestingParam.duration,
          vestingParam.creationType,
        ]),
      ),
    );

    const promiseTeamVesting = Promise.all(
      vestingParams.map((vestingParam, i) =>
        contractReader.call<string>('vestingRegistry', 'getTeamVesting', [
          account,
          vestingParam.cliff,
          vestingParam.duration,
          vestingParam.creationType,
        ]),
      ),
    );

    Promise.all([promiseVesting, promiseTeamVesting]).then(
      ([vestingAddresses, teamVestingAddreses]) => {
        setState(prevValue => ({
          ...prevValue,
          loading: false,
          items: vestingAddresses
            .filter(addr => addr !== ethGenesisAddress)
            .map(address => ({ address, type: 'genesis' as VestGroup }))
            .concat(
              teamVestingAddreses
                .filter(addr => addr !== ethGenesisAddress)
                .map(address => ({
                  address,
                  type: 'team',
                })),
            ),
        }));
      },
    );
  }, [account, vestingParams]);

  return state;
};
