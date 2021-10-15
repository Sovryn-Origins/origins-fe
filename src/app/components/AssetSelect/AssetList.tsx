import React from 'react';
import { AssetRenderer } from '../AssetRenderer';
import { AssetSelectItemWrapper } from './styled';
import { Asset } from 'types/asset';

interface AssetListProps {
  selected: Asset;
  onSelect?: (asset: Asset) => void;
}

export const AssetList: React.FC<AssetListProps> = ({ selected, onSelect }) => {
  return (
    <ul className="tw-bg-white tw-rounded-lg">
      {Object.keys(Asset)
        .filter(key => Asset[key] !== selected)
        .map((key, i) => (
          <AssetSelectItemWrapper
            className="tw-px-3 tw-py-1 tw-text-black"
            onClick={() => (onSelect !== undefined ? onSelect(Asset[key]) : {})}
            key={i}
          >
            <AssetRenderer asset={Asset[key]} />
          </AssetSelectItemWrapper>
        ))}
    </ul>
  );
};
