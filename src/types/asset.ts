export enum Asset {
  CSOV = 'CSOV',
  RBTC = 'RBTC',
  WRBTC = 'WRBTC',
  ETH = 'ETH',
  DOC = 'DOC',
  RDOC = 'RDOC',
  USDT = 'USDT',
  RUSDT = 'RUSDT',
  XUSD = 'XUSD',
  BPRO = 'BPRO',
  SOV = 'SOV',
  MOC = 'MOC',
  BNB = 'BNBS',
  FISH = 'FISH',
  RIF = 'RIF',
  OG = 'OG',
  MYNT = 'MYNT',
  ZERO = 'ZERO',
}

export const AcceptedCurrencies: Array<Asset> = [
  Asset.RBTC,
  Asset.RUSDT,
  Asset.XUSD,
  Asset.SOV,
];

export const TradingAssets = [
  Asset.USDT,
  Asset.RBTC,
  Asset.SOV,
  Asset.FISH,
  Asset.MYNT,
  Asset.ZERO,
  Asset.OG,
];
