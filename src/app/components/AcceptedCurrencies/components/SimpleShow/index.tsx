import React from 'react';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { TruncatedWrapper } from '../../styled';
import { Asset } from 'types/asset';

export const SimpleShow: React.FC = () => {
  return (
    <div>
      <TruncatedWrapper>
        {Object.keys(Asset).map(key => (
          <AssetRenderer className="tw-mr-2" asset={Asset[key]} />
        ))}
      </TruncatedWrapper>
    </div>
  );
};
