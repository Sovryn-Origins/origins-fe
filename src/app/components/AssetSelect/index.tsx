import React, { useState } from 'react';
import { Position, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { AssetList } from './AssetList';
import { AssetRenderer } from '../AssetRenderer';
import { ArrowUp } from './Arrows';
import { Asset } from 'types/asset';

type AssetOptionalType = Asset | string | undefined;

interface AssetSelectProps {
  selected: AssetOptionalType;
  onChange?: (asset: Asset) => void;
}

export const AssetSelect: React.FC<AssetSelectProps> = ({
  selected,
  onChange,
}) => {
  const [selectedAsset] = useState<Asset>(selected || Asset[0]);
  return (
    <div className="tw-cursor-pointer">
      <Popover
        interactionKind={PopoverInteractionKind.CLICK}
        openOnTargetFocus={false}
        minimal={true}
        fill={true}
        targetClassName="tw-text-left"
        popoverClassName="tw-mt-5"
        content={<AssetList selected={selectedAsset} onSelect={onChange} />}
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        position={Position.BOTTOM_RIGHT}
      >
        <div className="tw-flex tw-justify-between tw-pr-2 tw-items-center">
          <AssetRenderer className="tw-text-left" asset={selectedAsset} />
          <ArrowUp />
        </div>
      </Popover>
    </div>
  );
};
