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
  return contractWriter.send(
    contractName,
    'propose',
    [targets, values, signatures, calldatas, description, { from: account }],
    // {
    //   type: 'propose',
    // },
  );
}

export function governance_queue(
  contractName: ContractName,
  proposalId: number,
  account,
) {
  return contractWriter.send(contractName, 'queue', [
    proposalId,
    { from: account },
  ]);
}

export function governance_cancel(contractName, proposalId: number, account) {
  return contractWriter.send(contractName, 'cancel', [
    proposalId,
    { from: account },
  ]);
}

export function governance_execute(
  contractName: ContractName,
  proposalId: number,
  account,
) {
  return contractWriter.send(contractName, 'execute', [
    proposalId,
    { from: account },
  ]);
}
