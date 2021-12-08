import { ContractName } from 'utils/types/contracts';
import { contractWriter } from 'utils/sovryn/contract-writer';

export function governance_propose(
  targets: string[],
  values: string[],
  signatures: string[],
  calldatas: string[],
  description: string,
  account,
  contractName: ContractName | undefined = 'governorAdmin',
) {
  return contractWriter.send(contractName, 'propose', [
    targets,
    values,
    signatures,
    calldatas,
    description,
    // { from: account },
  ]);
}
