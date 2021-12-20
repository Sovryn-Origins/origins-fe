import React, { useEffect, useRef } from 'react';
import { AssetRenderer } from '../../../AssetRenderer';
import { Asset } from 'types/asset';
import { useDetectOutsideClick } from '../../hooks/useClickedOutside';
import styles from './index.module.scss';

const assets: Asset[] = [
  Asset.RBTC,
  Asset.SOV,
  Asset.ETH,
  Asset.XUSD,
  Asset.BNB,
];

interface AssetListProps {
  selected: Asset;
  onSelect?: (asset: Asset) => void;
}

export const AssetList: React.FC<AssetListProps> = ({ selected, onSelect }) => {
  const wrapperRef = useRef(null);
  const outsideClicked = useDetectOutsideClick(wrapperRef);
  useEffect(() => {
    if (outsideClicked && onSelect) {
      onSelect(selected);
    }
  }, [selected, onSelect, outsideClicked]);
  return (
    <ul className="tw-bg-white tw-rounded-lg" ref={wrapperRef}>
      {assets.map(asset => (
        <div
          className={styles.assetSelectItemWrapper}
          onClick={() => onSelect?.(asset)}
          key={asset}
        >
          <AssetRenderer className="tw-text-lg tw-font-rowdies" asset={asset} />
        </div>
      ))}
    </ul>
  );
};
