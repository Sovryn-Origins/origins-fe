import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { translations } from 'locales/i18n';
import { toNumberFormat } from 'utils/display-text/format';
import { ISaleInformation, ISaleDetails, SaleType } from '../../../../types';
import { useGetSaleSummary } from '../../../../hooks/useGetSaleSummary';
import saleListBackgrouond from 'assets/images/OriginsLaunchpad/sale-list-background.svg';
import { Tab } from '../Tab';
import { PreviousSalesCard } from '../../../Dashboard/components/PreviousSalesCard';
import styles from './index.module.scss';

interface ISaleSummaryProps {
  saleInfo: ISaleInformation;
  className?: string;
}

export const SaleSummary: React.FC<ISaleSummaryProps> = ({
  // saleInfo,
  className,
}) => {
  const { t } = useTranslation();
  const saleSummary = useGetSaleSummary();
  const [activeTab, setActiveTab] = useState<SaleType>();

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(
        saleSummary.live.length
          ? SaleType.live
          : saleSummary.upcoming.length
          ? SaleType.upcoming
          : SaleType.previous,
      );
    }
  }, [activeTab, saleSummary]);

  const onSelectTab = (saleType: SaleType) => {
    setActiveTab(saleType);
  };

  return (
    <div
      className={classNames(
        'tw-max-w-screen-2xl tw-mx-auto tw-w-max',
        className,
      )}
    >
      <div className="tw-flex tw-justify-center">
        {Object.keys(SaleType).map(saleType => (
          <Tab
            key={saleType}
            label={t(
              translations.originsLaunchpad.saleDay.saleSummary.tabs[saleType],
            )}
            selected={SaleType[saleType] === activeTab}
            onSelect={() => onSelectTab(SaleType[saleType])}
          />
        ))}
      </div>

      <div
        className={classNames(styles.saleListPane, 'tw-mt-14')}
        style={{ backgroundImage: `url(${saleListBackgrouond})` }}
      >
        {activeTab &&
          saleSummary[activeTab] &&
          saleSummary[activeTab].map((sale: ISaleDetails) => (
            <PreviousSalesCard
              key={sale.saleName}
              saleName={sale.saleName}
              saleAllocation={`${toNumberFormat(sale.saleAllocation)} FISH`}
              totalRaised={sale.totalRaised}
              price={sale.price}
              participatingWallets={sale.participatingWallets}
              date={sale.date}
              saleDuration={sale.saleDuration}
              backgroundImage={sale.backgroundImage}
              className="tw-my-4 xl:tw-my-0"
            />
          ))}
      </div>
    </div>
  );
};
