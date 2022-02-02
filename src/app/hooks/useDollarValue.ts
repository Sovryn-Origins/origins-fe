import { Asset } from 'types';
import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useCachedAssetPrice } from './trading/useCachedAssetPrice';
import { AssetsDictionary } from '../../utils/dictionaries/assets-dictionary';
import { defaultDollarValueMap } from 'app/constants';

// Converts asset amount in wei to RUSDT and returns dollar value in wei back
export function useDollarValue(asset: Asset, weiAmount: string) {
  const dollars = useCachedAssetPrice(asset, Asset.USDT);

  const value = useMemo(() => {
    const { decimals } = AssetsDictionary.get(asset);
    if ([Asset.USDT, Asset.DOC, Asset.RDOC].includes(asset)) {
      return weiAmount;
    } else if (asset === Asset.OG) {
      // todo: remove this once OG is integrated into AMM;
      const dollarValue = defaultDollarValueMap.get(asset)?.toString() || '0';
      return bignumber(weiAmount).mul(dollarValue).toFixed(0);
    } else {
      return bignumber(weiAmount)
        .mul(dollars.value)
        .div(10 ** decimals)
        .toFixed(0);
    }
  }, [asset, dollars, weiAmount]);

  return {
    value,
    loading: asset === Asset.OG ? false : dollars.loading,
    error: dollars.error,
  };
}
