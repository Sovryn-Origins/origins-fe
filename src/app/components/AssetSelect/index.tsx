import React, { useState } from 'react';
import { Position, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { AssetRenderer } from '../AssetRenderer';
import { AssetList } from './components/AssetList';
import { ArrowDown, ArrowUp } from './components/Arrows';
import { Asset } from 'types/asset';

interface AssetSelectProps {
  selected?: Asset;
  selectedAssetString?: string;
  onChange?: (asset: Asset) => void;
}

export const AssetSelect: React.FC<AssetSelectProps> = ({
  selected,
  selectedAssetString,
  onChange,
}) => {
  const [isOpen, setOpen] = useState(false);
  const handleOnSelect = (asset: Asset): void => {
    setOpen(false);
    onChange?.(asset);
  };
  return (
    <div className="tw-cursor-pointer">
      <Popover
        interactionKind={PopoverInteractionKind.CLICK}
        openOnTargetFocus={false}
        minimal={true}
        isOpen={isOpen}
        captureDismiss={true}
        fill={true}
        targetClassName="tw-text-left"
        // popoverClassName="tw-mt-5"
        content={
          <AssetList
            selected={selected || (selectedAssetString as Asset)}
            onSelect={handleOnSelect}
          />
        }
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        position={Position.BOTTOM_RIGHT}
      >
        <div
          className="tw-flex tw-justify-between tw-pr-2 tw-items-center"
          onClick={() => setOpen(true)}
        >
          <AssetRenderer
            className="tw-text-left tw-font-rowdies tw-text-base"
            asset={selected}
            assetString={selectedAssetString}
          />
          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
      </Popover>
    </div>
  );
};
