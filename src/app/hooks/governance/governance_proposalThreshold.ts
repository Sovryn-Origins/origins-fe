import { ContractName } from 'utils/types/contracts';
import { contractReader } from 'utils/sovryn/contract-reader';

export function governance_proposalThreshold(
  contractName: ContractName | undefined = 'governorAdmin',
) {
  return contractReader.call(contractName, 'proposalThreshold', []);
}
