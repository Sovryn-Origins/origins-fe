/**
 * Do not import this file directly.
 * Use getContract(contractName) helper
 * @example getContract('sovrynProtocol');
 */

import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import LiquidityPoolV1Converter from './abi/LiquidityPoolV1Converter.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';
import RBTCWrapperProxy from './abi/RBTCWrapperProxy.json';
import tokenAbi from './abi/abiTestToken.json';
import TestTokenABI from './abi/abiTestToken.json';
import abiTestWBRTCToken from './abi/abiTestWBRTCToken.json';
import LoanTokenLogicWrbtc from './abi/LoanTokenLogicWrbtc.json';
import LoanTokenLogicStandard from './abi/LoanTokenLogicStandard.json';
import SwapNetworkABI from './abi/SovrynSwapNetwork.json';
import ConverterRegistryABI from './abi/ConverterRegistry.json';
import CrowdSaleAbi from './abi/CrowdSale.json';
import SovrynNFTAbi from './abi/SovrynNFT.json';
import CSOVTokenAbi from './abi/CSOVToken.json';
import VestingAbi from './abi/Vesting.json';
import VestingRegistryAbi from './abi/VestingRegistry.json';
import VestingRegistryOriginAbi from './abi/VestingRegistryOrigin.json';
import StakingAbi from './abi/Staking.json';
import OriginClaimAbi from './abi/OriginInvestorsClaim.json';
import EscrowRewardsAbi from './abi/EscrowRewardsAbi.json';
import LiquidityMiningAbi from './abi/LiquidityMining.json';
import LockedSovAbi from './abi/LockedSOV.json';
import feeSharingProxyAbi from './abi/FeeSharingProxy.json';
import stakingRewardsProxyAbi from './abi/StakingRewards.json';
import FISHTokenAbi from './abi/FISH.json';
import OriginsBaseAbi from './abi/OriginsBase.json';
import LockedFundAbi from './abi/LockedFund.json';
import BabelfishAggregatorAbi from './abi/BabelfishAggregator.json';
import SwapsExternalAbi from './abi/SwapsExternalAbi.json';
import nftAbi from './abi/nftAbi.json';
import multicallABI from './abi/multicall.json';
import GovernorAdminABI from './abi/GovernorAdmin.json';
import OGTokenAbi from './abi/OG.json';
import OGMarketMakerAbi from './abi/OGMarketMaker.json';

export const contracts = {
  sovrynProtocol: {
    address: '0x25380305f223B32FDB844152abD2E82BC5Ad99c3',
    abi: [...bzxAbi, ...SwapsExternalAbi],
    blockNumber: 1218686,
  },
  BTCWrapperProxy: {
    address: '0x6b1a4735b1E25ccE9406B2d5D7417cE53d1cf90e',
    abi: RBTCWrapperProxy,
    blockNumber: 1319117,
  },
  priceFeed: {
    address: '0x7f38c422b99075f63C9c919ECD200DF8d2Cf5BD4',
    abi: priceFeedsAbi,
    blockNumber: 1218689,
  },
  swapNetwork: {
    address: '0x61172B53423E205a399640e5283e51FE60EC2256',
    abi: SwapNetworkABI,
    blockNumber: 1218795,
  },
  converterRegistry: {
    address: '0x7816c4E1b61eE09c25974325cc20B056963423b1',
    abi: ConverterRegistryABI,
    blockNumber: 1218799,
  },
  WRBTC_token: {
    address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
    abi: abiTestWBRTCToken,
    blockNumber: 1205599,
  },
  RBTC_token: {
    address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
    abi: abiTestWBRTCToken,
    blockNumber: 1205599,
  },
  RBTC_lending: {
    address: '0xe67Fe227e0504e8e96A34C3594795756dC26e14B',
    abi: LoanTokenLogicWrbtc,
    blockNumber: 1218742,
  },
  DOC_token: {
    address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
    abi: TestTokenABI,
    blockNumber: 202559,
  },
  DOC_lending: {
    address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
    abi: LoanTokenLogicStandard,
    blockNumber: 1218721,
  },
  DOC_amm: {
    address: '0x497b0517dd24f66c456e93bc0adbb2a2bf159ec4',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  RDOC_token: {
    address: '0xc3de9f38581f83e281f260d0ddbaac0e102ff9f8',
    abi: TestTokenABI,
    blockNumber: 1764664,
  },
  MOC_token: {
    address: '0x45a97b54021a3f99827641afe1bfae574431e6ab',
    abi: TestTokenABI,
    blockNumber: 202559,
  },
  // MOC_lending: {
  //   address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1218721,
  // },
  MOC_amm: {
    address: '0x478133b66B54e55bfA46b1182e274b5cCE47C60E',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  RIF_token: {
    address: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  // RIF_lending: {
  //   address: '',
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1406290,
  // },
  RIF_amm: {
    address: '0xA82881bceb367f8653559937A6eFBFffBF2E06DD',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  USDT_token: {
    address: '0x4D5a316D23eBE168d8f887b4447bf8DbFA4901CC',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  USDT_lending: {
    address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
    abi: LoanTokenLogicStandard,
    blockNumber: 1406290,
  },
  USDT_amm: {
    address: '0x133eBE9c8bA524C9B1B601E794dF527f390729bF',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  XUSD_token: {
    address: '0x74858FE37d391f81F89472e1D8BC8Ef9CF67B3b1',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  XUSD_lending: {
    address: '0x9bD0cE087b14ef67C3D37C891139AaE7d94a961A',
    abi: LoanTokenLogicStandard,
    blockNumber: 1406290,
  },
  XUSD_amm: {
    address: '0x169B7A8Fc9615797e118B464b4fF1f594Dcad7a4',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  BPRO_token: {
    address: '0x4dA7997A819bb46B6758b9102234c289Dd2ad3bf',
    abi: TestTokenABI,
    blockNumber: 202562,
  },
  BPRO_lending: {
    address: '0x6226b4B3F29Ecb5f9EEC3eC3391488173418dD5d',
    abi: LoanTokenLogicStandard,
    blockNumber: 1218721,
  },
  BPRO_amm: {
    address: '0xe4E467D8B5f61b5C83048d857210678eB86730A4',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  ETH_token: {
    address: '0x0Fd0d8D78Ce9299Ee0e5676a8d51F938C234162c',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  // ETH_lending: {
  //   address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1406290,
  // },
  ETH_amm: {
    address: '0xf46DC974edD1754D4815AaE44Ab4542fF39B898D',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  BNBS_token: {
    address: '0x801F223Def9A4e3a543eAcCEFB79dCE981Fa2Fb5',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  // BNBS_lending: {
  //   address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1406290,
  // },
  BNBS_amm: {
    address: '0x4F87d545B6E747433a80a6AA0dbEc962478aB271',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  CrowdSale: {
    address: '0x62BDB11190f538274bD55A4DC74fA4665e7CB752',
    abi: CrowdSaleAbi,
    blockNumber: 1218833,
  },
  SovrynNFTCommunity: {
    address: '0xC5452Dbb2E3956C1161cB9C2d6DB53C2b60E7805',
    abi: SovrynNFTAbi,
    blockNumber: 1218834,
  },
  SovrynNFTHero: {
    address: '0x420fECFda0975c49Fd0026f076B302064ED9C6Ff',
    abi: SovrynNFTAbi,
    blockNumber: 1218835,
  },
  SovrynNFTSuperhero: {
    address: '0x78c0D49d003bf0A88EA6dF729B7a2AD133B9Ae25',
    abi: SovrynNFTAbi,
    blockNumber: 1218836,
  },
  SovrynNFTBday: {
    address: '0x8ffB12De9e7602843e4792DB0bC2863e9d137d06',
    abi: SovrynNFTAbi,
    blockNumber: 1218836,
  },
  vesting: {
    address: '0x6390E950096C49FF615D78FdF69EC287dE9Cd293',
    abi: VestingAbi,
    blockNumber: 1218836,
  },
  vestingRegistry: {
    address: '0xF5DBc29B1FA3Ce5467a22F93daF5bC45748B8C0E',
    abi: VestingRegistryAbi,
    blockNumber: 1218836,
  },
  vestingRegistryOrigin: {
    address: '0x310006E356b0818C3Eaf86a9B2f13013d4691a1c',
    abi: VestingRegistryOriginAbi,
    blockNumber: 1218836,
  },
  vestingRegistryLM: {
    address: '0x52E4419b9D33C6e0ceb2e7c01D3aA1a04b21668C',
    abi: VestingRegistryOriginAbi,
    blockNumber: 1218836,
  },
  vestingRegistry3: {
    address: '0x52E4419b9D33C6e0ceb2e7c01D3aA1a04b21668C',
    abi: VestingRegistryAbi,
  },
  staking: {
    address: '0xfde370d9cC48F871172db7374327086c7F890c83',
    abi: StakingAbi,
    blockNumber: 1218836,
  },
  CSOV_token: {
    address: '0x75bbf7f4d77777730eE35b94881B898113a93124',
    abi: CSOVTokenAbi,
    blockNumber: 1218833,
  },
  CSOV2_token: {
    address: '0x1dA260149ffee6fD4443590ee58F65b8dC2106B9',
    abi: CSOVTokenAbi,
    blockNumber: 1218833,
  },
  OriginInvestorsClaim: {
    address: '0xfc6594B5f59027228cfBe007C2fD52f2e6c6915C',
    abi: OriginClaimAbi,
  },
  SOV_token: {
    address: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
    abi: tokenAbi,
    blockNumber: 1606431,
  },
  SOV_amm: {
    address: '0x1Cecc8B488abcF9A0932E54328dD51980cbe86Ea',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  // SOV_lending: {
  //   address: '0x09c5faf7723b13434abdf1a65ab1b667bc02a902', // todo
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1218742,
  // },
  NFT_tier1: {
    address: '0xC5452Dbb2E3956C1161cB9C2d6DB53C2b60E7805',
    abi: tokenAbi,
  },
  escrowRewards: {
    address: '0x8205153fA1492DFA191395bEABA3a210FeDf5A60',
    abi: EscrowRewardsAbi,
  },
  liquidityMiningProxy: {
    address: '0xe28aEbA913c34EC8F10DF0D9C92D2Aa27545870e',
    abi: LiquidityMiningAbi,
  },
  lockedSov: {
    address: '0x7476d0245384C4106C2ebdF20b559a3Db85b1C6F',
    abi: LockedSovAbi,
  },
  feeSharingProxy: {
    address: '0xFAd185a605403d3F4e45C8b6605F035612B23AaE',
    abi: feeSharingProxyAbi,
  },
  stakingRewards: {
    address: '0x18eF0ff12f1b4D30104B4680D485D026C26D164D',
    abi: stakingRewardsProxyAbi,
  },
  FISH_token: {
    address: '0xaa7038D80521351F243168FefE0352194e3f83C3',
    abi: FISHTokenAbi,
  },
  FISH_amm: {
    address: '0x179caA42B5024ec1C3D8513A262fC9986F565295',
    abi: LiquidityPoolV1Converter,
  },
  FISH_staking: {
    address: '0xc1fc98FEFA2130fC1CE352ec85f7aa61021eFE97',
    abi: StakingAbi,
    blockNumber: 1218836,
  },
  originsBase: {
    address: '0x2269aCc85288c23E29B79A373240681eed66F82E',
    abi: OriginsBaseAbi,
  },
  lockedFund: {
    address: '0xF43f43aA08E93b9ec4A4c7009108b6c5BDcd148F',
    abi: LockedFundAbi,
  },
  vestingRegistryFISH: {
    address: '0xFd8ea2e5e8591fA791d44731499cDF2e81CD6a41',
    abi: VestingRegistryAbi,
  },
  babelfishAggregator: {
    address: '0x1572D7E4a78A8AD14AE722E6fE5f5600a2c7A149',
    abi: BabelfishAggregatorAbi,
  },
  sovrynNFT: {
    address: '0x576ae218aecfd4cbd2dbe07250b47e26060932b1', // todo
    abi: nftAbi,
  },
  multicall: {
    address: '0x9e469e1fc7fb4c5d17897b68eaf1afc9df39f103',
    abi: multicallABI,
  },
  governorAdmin: {
    address: '0x6e22f07d4eDc6B13B07B7369f11371E7e5286de6',
    abi: GovernorAdminABI as any,
  },
  governorOwner: {
    address: '0x058FD3F6a40b92b311B49E5e3E064300600021D7',
    abi: GovernorAdminABI as any,
  },
  OG_token: {
    address: '0x010C233B4F94d35CaDb71D12D7058aAb58789e8f',
    abi: OGTokenAbi,
  },
  OGMarketMaker: {
    address: '',
    abi: OGMarketMakerAbi,
  },
};
