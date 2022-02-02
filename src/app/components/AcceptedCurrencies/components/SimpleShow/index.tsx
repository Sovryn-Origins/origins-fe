import React from 'react';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { AcceptedCurrencies } from 'types/asset';
import styles from './index.module.scss';

export const SimpleShow: React.FC = () => {
  return (
    <div className={styles.truncatedWrapper}>
      {AcceptedCurrencies.map((currency, i) => (
        <AssetRenderer
          className="tw-mr-2 tw-text-lg tw-font-rowdies"
          asset={currency}
          key={i}
        />
      ))}
    </div>
  );
};
