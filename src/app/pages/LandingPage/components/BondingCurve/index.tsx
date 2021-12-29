import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { ChartD3 } from './ChartD3';
import imgOGPromotion from 'assets/images/home/og-promotion.png';
import styles from './index.module.scss';

interface IBondingCurveProps {
  className: string;
}

export const BondingCurve: React.FC<IBondingCurveProps> = ({ className }) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <div className="tw-flex tw-justify-center">
        <img src={imgOGPromotion} alt="It's OG" />
      </div>
      <p className={styles.promotionText}>
        <span className="tw-font-rowdies tw-font-semibold tw-mr-8">OMG</span>
        {t(translations.landingPage.its)}
        <span className="tw-font-rowdies tw-font-semibold tw-ml-8">OG</span>
      </p>
      <p className={styles.title}>
        {t(translations.landingPage.bondingCurve.bondingCurve)}
      </p>
      <p className={styles.description}>
        {t(translations.landingPage.bondingCurve.description)}
      </p>
      <ChartD3 />
      <p className={styles.bctitle}>Why Bonding Curve?</p>
      <div className="tw-max-w-4xl tw-mx-auto tw-grid tw-grid-cols-1 md:tw-grid-cols-3 md:tw-gap-4">
        {[0, 1, 2].map(i => (
          <CharacterItem
            key={i}
            title={t(translations.landingPage.bondingCurve.characters[i].title)}
            description={t(
              translations.landingPage.bondingCurve.characters[i].description,
            )}
          />
        ))}
      </div>
      <p className={classNames(styles.bcExtraText, 'tw-mt-16')}>
        {t(translations.landingPage.bondingCurve.extraDescription[0])}
      </p>
      <p className={classNames(styles.bcExtraText, 'tw-mt-12')}>
        {t(translations.landingPage.bondingCurve.extraDescription[1])}
      </p>
    </div>
  );
};

interface ICharacterItemProps {
  title: string;
  description: string;
}

const CharacterItem: React.FC<ICharacterItemProps> = ({
  title,
  description,
}) => {
  return (
    <div className="tw-mb-8 tw-max-w-xl tw-mx-auto lg:tw-w-60">
      <p className={styles.itemTitle}>{title}</p>
      <p className={styles.itemDescription}>{description}</p>
    </div>
  );
};
