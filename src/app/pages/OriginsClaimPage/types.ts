import { ResetTxResponseInterface } from 'app/hooks/useSendContractTx';

export interface ISaleStats {
  tokenBoughtByAddress: string;
  totalTokenOnTier: string;
  tokenSoldPerTier: string;
  saleEndTS: number;
}

export interface IClaimRequestProps {
  tierId: number;
  address: string;
}

export interface IClaimRequestResult extends ResetTxResponseInterface {
  send: () => void;
}
