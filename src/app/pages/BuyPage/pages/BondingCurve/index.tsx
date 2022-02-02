import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useAccount } from 'app/hooks/useAccount';
import { BondingCurveForm } from '../../components/BondingCurveForm';
import { BondingCurveHistory } from '../../components/BondingCurveHistory';
import styles from './index.module.scss';

interface IBondingCurveProps {
  comingSoon: boolean;
}

export const BondingCurve: React.FC<IBondingCurveProps> = ({ comingSoon }) => {
  const { t } = useTranslation();
  const account = useAccount();

  return (
    <>
      <BondingCurveForm comingSoon={comingSoon} />
      {!comingSoon && (
        <div className={styles.tableContainer}>
          {!account ? (
            <SkeletonRow
              loadingText={t(translations.topUpHistory.walletHistory)}
              className="tw-mt-2"
            />
          ) : (
            <BondingCurveHistory />
          )}
        </div>
      )}
    </>
  );
};
