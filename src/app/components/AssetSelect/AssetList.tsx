import React from 'react';
import { AssetRenderer } from '../AssetRenderer';
import { AssetSelectItemWrapper } from './styled';
import { Asset } from 'types/asset';
const assets: Array<Asset> = [
  Asset.RBTC,
  Asset.RUSDT,
  Asset.SOV,
  Asset.ETH,
  Asset.XUSD,
];

interface AssetListProps {
  selected: Asset;
  onSelect?: (asset: Asset) => void;
}

export const AssetList: React.FC<AssetListProps> = ({ selected, onSelect }) => {
  return (
    <ul className="tw-bg-white tw-rounded-lg">
      {assets
        .filter(asset => asset !== selected)
        .map((asset, i) => (
          <AssetSelectItemWrapper
            className="tw-px-3 tw-py-1 tw-text-black"
            onClick={() => (onSelect !== undefined ? onSelect(asset) : {})}
            key={i}
          >
            <AssetRenderer
              className="tw-text-lg tw-font-rowdies"
              asset={asset}
            />
          </AssetSelectItemWrapper>
        ))}
    </ul>
  );
};
