export enum VestingType {
  TeamVesting,
  Vesting,
}

export interface IVesting {
  type: VestingType;
  creationType: string;
  address: string;
}

export type VestGroup = 'genesis' | 'origin' | 'team' | 'reward' | 'fish';

export interface IVestItem {
  address: string;
  type: VestGroup;
}
