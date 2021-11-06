import React from 'react';
import { Trans } from 'react-i18next';

import { translations } from 'locales/i18n';
import { AppSection, PromotionColor } from '../../types';
import imgYellowBg from '../../../../../../../assets/images/home/promotion-yellow.svg';
import imgBlueBg from '../../../../../../../assets/images/home/promotion-blue.svg';
import imgPurpleBg from '../../../../../../../assets/images/home/promotion-purple.svg';
import imgGreenBg from '../../../../../../../assets/images/home/promotion-green.svg';

export const getBackgroundImageUrl = (color: PromotionColor): string => {
  switch (color) {
    case PromotionColor.Blue:
      return imgBlueBg;
    case PromotionColor.Yellow:
      return imgYellowBg;
    case PromotionColor.Green:
      return imgGreenBg;
    case PromotionColor.Purple:
      return imgPurpleBg;
    default:
      return imgBlueBg;
  }
};

export const getSectionTitle = (section: AppSection): JSX.Element => {
  switch (section) {
    case AppSection.Lend:
      return (
        <Trans i18nKey={translations.landingPage.promotions.sections.lending} />
      );

    case AppSection.Borrow:
      return (
        <Trans
          i18nKey={translations.landingPage.promotions.sections.borrowing}
        />
      );

    case AppSection.MarginTrade:
      return (
        <Trans
          i18nKey={translations.landingPage.promotions.sections.marginTrading}
        />
      );

    case AppSection.YieldFarm:
      return (
        <Trans
          i18nKey={translations.landingPage.promotions.sections.yieldFarming}
        />
      );

    case AppSection.Spot:
      return (
        <Trans
          i18nKey={translations.landingPage.promotions.sections.spotTrading}
        />
      );

    default:
      return (
        <Trans i18nKey={translations.landingPage.promotions.sections.swap} />
      );
  }
};
