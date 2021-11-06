import React from 'react';
import classNames from 'classnames';

import { AppSection, PromotionColor } from './types';
import { PromotionCard } from './components/PromotionCard';
import styles from './index.module.scss';

interface IBannerPromotionProps {
  className?: string;
}

export const BannerPromotion: React.FC<IBannerPromotionProps> = ({
  className,
}) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <PromotionCard
        appSection={AppSection.YieldFarm}
        title="15K SOV rewards"
        linkText="Ongoing weekly rewards"
        linkUrl="https://www.sovryn.app/blog/bnb-btc-pool-is-live"
        backgroundColor={PromotionColor.Yellow}
      />
      <PromotionCard
        title="15K  OG rewards"
        linkText="Ongoing weekly rewards"
        linkUrl="https://www.sovryn.app/blog/bnb-btc-pool-is-live"
        backgroundColor={PromotionColor.Blue}
      />
      <PromotionCard
        appSection={AppSection.YieldFarm}
        title="15K SOV rewards"
        linkText="15K SOV rewards"
        linkUrl="https://www.sovryn.app/blog/bnb-btc-pool-is-live"
        backgroundColor={PromotionColor.Purple}
      />
      <PromotionCard
        appSection={AppSection.YieldFarm}
        title="15K FISH rewards"
        linkText="Ongoing weekly rewards"
        linkUrl="https://www.sovryn.app/blog/bnb-btc-pool-is-live"
        backgroundColor={PromotionColor.Green}
      />
    </div>
  );
};
