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
        <div className="tw-absolute tw-w-full tw-h-full tw-top-0 tw-left-0 tw-flex tw-flex-col tw-justify-center tw-text-center">
          <p className={styles.welcomeTitle}>
            {t(translations.landingPage.welcomeTitle)}
          </p>
        </div>
      </div>
      <BannerPromotion />
    </div>
  );
};
