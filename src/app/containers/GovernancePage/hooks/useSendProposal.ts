import { ContractName } from 'utils/types/contracts';
import { useSendContractTx } from 'app/hooks/useSendContractTx';

export const useSendProposal = (contractName: ContractName) => {
  const { send, ...rest } = useSendContractTx(contractName, 'propose');

  return {
    propose: (
      targets: string[],
      values: string[],
      signatures: string[],
      calldatas: string[],
      description: string,
    ) => {
      send([targets, values, signatures, calldatas, description]);
    },
    ...rest,
  };
};
