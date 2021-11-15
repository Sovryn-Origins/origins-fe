export interface Proposal {
  id: number;
  proposer: string;
  eta: number;
  startBlock: number;
  endBlock: number;
  startTime: number;
  forVotes: string;
  againstVotes: string;
  quorum: string;
  canceled: boolean;
  executed: boolean;
}

export enum ProposalState {
  Pending = '0',
  Active = '1',
  Canceled = '2',
  Defeated = '3',
  Succeeded = '4',
  Queued = '5',
  Expired = '6',
  Executed = '7',
}
