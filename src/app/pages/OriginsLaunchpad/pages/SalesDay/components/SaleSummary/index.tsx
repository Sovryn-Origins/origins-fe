import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { toNumberFormat } from 'utils/display-text/format';
import { ISaleInformation, ISaleDetails, SaleType } from '../../../../types';
import { useGetSaleSummary } from '../../../../hooks/useGetSaleSummary';
import saleListBackgrouond from 'assets/images/OriginsLaunchpad/sale-list-background.svg';
import { Tab } from '../Tab';
import { PreviousSalesCard } from '../../../Dashboard/components/PreviousSalesCard';
import {
  PreviousSalesRowWrapper,
  PreviousSalesRow,
} from '../../../Dashboard/components/PreviousSalesCardSection/styled';

interface ISaleSummaryProps {
  saleInfo: ISaleInformation;
  className?: string;
}

export const SaleSummary: React.FC<ISaleSummaryProps> = ({
  saleInfo,
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
  }, [saleSummary]);

  const onSelectTab = (saleType: SaleType) => {
    setActiveTab(saleType);
  };

  return (
    <SaleSummaryWrapper className={className}>
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

      <SaleListPane className="tw-mt-14">
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
      </SaleListPane>
    </SaleSummaryWrapper>
  );
};

const SaleSummaryWrapper = styled.div`
  max-width: 1800px;
  margin: auto;
`;

const SaleListPane = styled.div`
  background-image: url(${saleListBackgrouond});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-origin: border-box;
  background-color: #1f1f1f;
  border: 5px solid #000000;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem;
  flex-direction: column;
  align-items: center;

  @media (min-width: 576px) {
    padding: 2.5rem 1rem;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    padding: 1rem;
  }

  @media (min-width: 1768px) {
    padding: 2.5rem;
  }
`;
