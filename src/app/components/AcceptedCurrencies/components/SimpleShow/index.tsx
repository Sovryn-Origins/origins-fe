import React from 'react';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { TruncatedWrapper } from '../../styled';
import { AcceptedCurrencies } from 'types/asset';

export const SimpleShow: React.FC = () => {
  return (
    <div>
      <TruncatedWrapper>
        {AcceptedCurrencies.map((currency, i) => (
          <AssetRenderer
            className="tw-mr-2 tw-text-lg tw-font-rowdies"
            asset={currency}
            key={i}
          />
        ))}
      </TruncatedWrapper>
    </div>
  );
};
