import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { InfoRow } from './InfoRow';
import cn from 'classnames';
import styles from './index.module.scss';

interface IPreviousSalesCardProps {
  saleName: string;
  saleAllocation: string;
  totalRaised: string;
  participatingWallets: string;
  date: string;
  saleDuration: string;
  backgroundImage: string;
  price: string;
  className?: string;
  cardClassName?: string;
}

export const PreviousSalesCard: React.FC<IPreviousSalesCardProps> = ({
  saleName,
  saleAllocation,
  totalRaised,
  participatingWallets,
  date,
  saleDuration,
  backgroundImage,
  price,
  className,
  cardClassName,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'tw-flex lg:tw-w-fit tw-flex-col tw-items-center sm:tw-flex-row tw-px-3 xl:tw-my-4',
        className,
      )}
    >
      <div
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className={cn(styles.cardImage, cardClassName)}
      ></div>
      <div className="tw-flex tw-flex-col tw-justify-center tw-ml-6 xl:tw-ml-4 tw-w-40">
        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard.date,
          )}
          value={date}
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard.saleName,
          )}
          value={saleName}
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard
              .saleAllocation,
          )}
          value={saleAllocation}
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard.price,
          )}
          value={price}
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard.totalRaised,
          )}
          value={totalRaised}
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard
              .participatingWallets,
          )}
          value={participatingWallets}
        />

        <InfoRow
          label={t(
            translations.originsLaunchpad.previousSales.projectCard
              .saleDuration,
          )}
          value={saleDuration}
        />
      </div>
    </div>
  );
};
