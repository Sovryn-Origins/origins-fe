import React from 'react';
import classNames from 'classnames';

import { Chart } from './Chart';
import imgOGPromotion from 'assets/images/home/og-promotion.png';
import styles from './index.module.scss';

interface IBondingCurveProps {
  className: string;
}

export const BondingCurve: React.FC<IBondingCurveProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="tw-flex tw-justify-center">
        <img src={imgOGPromotion} alt="It's OG" />
      </div>
      <p className={styles.promotionText}>
        <b>OMG</b> It's OG
      </p>
      <p className={styles.title}>Bonding Curve</p>
      <p className={styles.description}>
        OG Tokens are managed by bonding curve contracts. A bonding curve is a
        mathematical curve that defines a relationship between price and token
        supply. ie, the token price increases as the supply of the token
        increases and vice-versa.
      </p>
      <Chart />
      <p className={styles.bctitle}>Why Bonding Curve?</p>
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 lg:tw-gap-4">
        <CharacterItem
          title="Instant liquidity"
          description="Buy or Sell tokens instantaneously at any time, the bonding curve acts as an automated market maker."
        />
        <CharacterItem
          title="Deterministic price"
          description="The buy and sell prices of tokens increase and decrease with the number of tokens minted or burned."
        />
        <CharacterItem
          title="Continuous price"
          description="The price of token n is less than token n+1 and more than token n-1."
        />
      </div>
      <p className={classNames(styles.bcExtraText, 'tw-mt-16')}>
        Each subsequent buyer will have to pay a slightly higher price for each
        token, generating a potential profit for the early investors. As more
        people find out about the project and buying continues, the value of
        each token gradually increases along the bonding curve.
      </p>
      <p className={classNames(styles.bcExtraText, 'tw-mt-12')}>
        You can “buy up” a curve, meaning you mint (buy) new tokens, and because
        this increases the current token supply, the price moves up. You can
        also “sell down” a curve, meaning that as you are burning (selling)
        tokens, you are driving the price down by decreasing the supply.
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
    <div className="tw-mb-8 tw-max-w-xl tw-mx-auto lg:tw-max-w-max">
      <p className={styles.itemTitle}>{title}</p>
      <p className={styles.itemDescription}>{description}</p>
    </div>
  );
};
