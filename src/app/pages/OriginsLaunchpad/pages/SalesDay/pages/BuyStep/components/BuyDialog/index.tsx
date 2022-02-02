import React from 'react';
import { InformationSection } from './components/InformationSection';
import { BuySection } from './components/BuySection';
import { ISaleInformation } from 'app/pages/OriginsLaunchpad/types';
import styles from './index.module.scss';

interface IBuyDialogProps {
  saleName: string;
  saleInformation: ISaleInformation;
  tierId: number;
}

export const BuyDialog: React.FC<IBuyDialogProps> = ({
  saleName,
  saleInformation,
  tierId,
}) => (
  <div className={styles.wrapper}>
    <InformationSection saleName={saleName} info={saleInformation} />
    <BuySection
      saleName={saleName}
      depositRate={saleInformation.depositRate}
      depositToken={saleInformation.depositToken}
      tierId={tierId}
      maxAmount={saleInformation.maxAmount}
      minAmount={saleInformation.minAmount}
      myTotalDeposit={saleInformation.myTotalDeposit}
    />
  </div>
);
