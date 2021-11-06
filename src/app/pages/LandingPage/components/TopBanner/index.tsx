import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { BannerPromotion } from '../BannerPromotion';
import styles from './index.module.scss';

export const TopBanner = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <div className={styles.sunPatternWrapper}>
        <div className={styles.VHCenter}>
          <p className={styles.welcomeTitle}>
            {t(translations.landingPage.welcomeTitle)}
          </p>
        </div>
      </div>
      <BannerPromotion />
      {/* <div className="tw-bg-white tw--mt-10 tw-flex">
        <div className={styles.rewardItem}>
          <p>Yield farming</p>
          <p>Yield farming</p>
          <p>Yield farming</p>
        </div>
        <div className={styles.rewardItem}>
          <p>Yield farming</p>
          <p>Yield farming</p>
          <p>Yield farming</p>
        </div>
      </div> */}
    </div>
  );
};
