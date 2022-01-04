import { Asset } from 'types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { SpotPairType } from './trading';

export interface IPromotionLinkState {
  asset?: Asset;
  target?: Asset;
  marginTradingPair?: TradingPairType;
  spotTradingPair?: SpotPairType;
}
