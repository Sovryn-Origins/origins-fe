import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { SwapHistory } from 'app/containers/SwapHistory';
import { useAccount } from 'app/hooks/useAccount';
import { BuyFormContainer } from '../../components/BuyFormContainer';
import styles from './index.module.scss';

interface ISovrynSwapProps {
  comingSoon: boolean;
}

export const SovrynSwap: React.FC<ISovrynSwapProps> = ({ comingSoon }) => {
  const { t } = useTranslation();
  const account = useAccount();

  return (
    <>
      <BuyFormContainer />
      {!comingSoon && (
        <div className={styles.tableContainer}>
          {!account ? (
            <SkeletonRow
              loadingText={t(translations.topUpHistory.walletHistory)}
              className="tw-mt-2"
            />
          ) : (
            <SwapHistory />
          )}
        </div>
      )}
    </>
  );
};
