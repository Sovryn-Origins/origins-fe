import { Asset } from 'types';

export enum BuyType {
  SOVRYN_SWAP,
  BONDING_CURVE,
}

export enum BuyStatus {
  NONE = 'none',
  OPENING = 'opening',
  WAIT_FOR_BATCH = 'wait_for_batch',
  CLAIMABLE = 'claimable',
  CLAIMING = 'claiming',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface BlockInfo {
  number: number;
  timestamp: number;
}

export interface IOrderReturnValue {
  _fromAmount: string;
  _fromToken: string;
  _toAmount: string;
  _toToken: string;
  _trader: string;
  batchId: number;
}

export interface IOrderHistory {
  returnVal: IOrderReturnValue;
  beneficiary: string;
  from_token: string;
  to_token: string;
  timestamp: number;
  transaction_hash: string;
  block: number;
  event: string;
  state: string;
}

export const sellAssets = [Asset.MYNT, Asset.OG, Asset.ZERO];

export const buyAssets = [Asset.SOV];
