import { TxType } from '../store/global/transactions-store/types';
import { AppMode } from '../types';

export const chains = {
  mainnet: 30,
  testnet: 31,
};

export const currentNetwork: AppMode | string =
  String(process.env.REACT_APP_NETWORK).toLowerCase() || AppMode.MAINNET;

export const currentChainId = chains[currentNetwork];

export const blockExplorers = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
  btc_30: 'https://live.blockcypher.com/btc',
  btc_31: 'https://live.blockcypher.com/btc-testnet',
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
};

export const readNodes = {
  30: 'wss://mainnet.sovryn.app/ws',
  31: 'wss://testnet.sovryn.app/ws',
};

export const fastBtcApis = {
  30: 'https://fastbtc.sovryn.app/',
  31: 'https://fastbtc.test.sovryn.app/',
};

export const databaseRpcNodes = {
  30: 'wss://mainnet.sovryn.app/websocket',
  31: 'wss://testnet.sovryn.app/ws',
};

export const backendUrl = {
  30: 'https://backend.sovryn.app',
  31: 'https://api.test.sovryn.app',
};

export const rpcNodes = {
  30: 'https://mainnet.sovryn.app/rpc',
  31: 'https://testnet.sovryn.app/rpc',
};

export const ethGenesisAddress = '0x0000000000000000000000000000000000000000';

export const sovAnalyticsCookie = { name: 'SovAnalytics', value: 'optout' };

export const originsSaleStorageKey = 'sovryn-origins.sales';
export const buyStatusKey = 'sovryn-origins.buy-status';

export const bondingCurveTreasuryAddress = {
  '30': '0x6FB7A6A5Bd3f800130443AE202A58Fdbe11B8D5C',
  '31': '0xc70882018136aaC283D287302932da56371d6514',
};

export const gasLimit = {
  [TxType.TRADE]: 3750000,
  [TxType.CLOSE_WITH_SWAP]: 2300000,
  [TxType.ADD_LIQUIDITY]: 500000,
  [TxType.REMOVE_LIQUIDITY]: 650000,
  [TxType.BORROW]: 1500000,
  [TxType.CONVERT_BY_PATH]: 750000,
  [TxType.LEND]: 300000,
  [TxType.UNLEND]: 350000,
  [TxType.SALE_BUY_SOV]: 260000,
  [TxType.SOV_REIMBURSE]: 100000,
  [TxType.SOV_CONVERT]: 2700000,
  [TxType.ESCROW_SOV_DEPOSIT]: 100000,
  [TxType.LM_DEPOSIT]: 150000,
  [TxType.LOCKED_SOV_CLAIM]: 3250000,
  [TxType.ORIGINS_SALE_BUY]: 300000,
  [TxType.CONVERT_RUSDT_TO_XUSD]: 150000,
  [TxType.CROSS_CHAIN_DEPOSIT]: 280000,
  [TxType.CROSS_CHAIN_WITHDRAW]: 280000,
  [TxType.SWAP_EXTERNAL]: 950000,
  [TxType.LOCKED_FUND_WAITED_CLAIM]: 3000000,
  [TxType.UNWRAP_WRBTC]: 50000,
  [TxType.STAKING_WITHDRAW]: 500000,
  [TxType.DEPOSIT_COLLATERAL]: 150000,
  [TxType.BONDING]: 5000000,
};

export const discordInvite = 'https://discord.gg/kBTNx4zjRf'; //unlimited use, no-expiry invite

// Block time in seconds
export const blockTime = 30;
