import { Asset } from 'types';

export const noop = () => {};

export const btcInSatoshis = 100000000;

export const rskWalletAddressLength = 42;

export const defaultDollarValueMap: Map<Asset, Number> = new Map<Asset, Number>(
  [[Asset.OG, 0.3]],
);

export const governanceToken = Asset.OG;
