export enum BuyType {
  SOVRYN_SWAP,
  BONDING_CURVE,
}

export enum BuyStatus {
  NONE = 'none',
  APPROVE = 'approve',
  // PENDING = 'pending',
  PLACE_ORDER = 'place_order',
  WAIT_FOR_BATCH = 'wait_for_batch',
  CLAIMABLE = 'claimable',
  CLAIMING = 'claiming',
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
