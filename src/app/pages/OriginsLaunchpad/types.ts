import { Asset } from 'types';

export interface ISaleInformation {
  minAmount: string;
  maxAmount: string;
  remainingTokens: number;
  saleEnd: string;
  depositRate: number;
  participatingWallets: string;
  depositToken: Asset;
  depositType: DepositType;
  verificationType: VerificationType;
  totalSaleAllocation: number;
}

export enum SaleType {
  upcoming = 'upcoming',
  live = 'live',
  previous = 'previous',
}

export interface ISaleSummary {
  upcoming: ISaleDetails[];
  live: ISaleDetails[];
  previous: ISaleDetails[];
}

export interface ISaleDetails {
  saleName: string;
  saleAllocation: string;
  totalRaised: string;
  participatingWallets: string;
  date: string;
  saleDuration: string;
  backgroundImage: string;
  price: string;
}

export enum DepositType {
  RBTC = '0',
  Token = '1',
}

export enum VerificationType {
  None = '0',
  Everyone = '1',
  ByAddress = '2',
}
