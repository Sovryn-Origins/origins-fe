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
