import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AcceptedCurrencies } from 'app/components/AcceptedCurrencies';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { InfoItem } from './InfoItem';
import { weiToNumberFormat } from 'utils/display-text/format';
import { ISaleInformation } from '../../../../../../../../types';
import styles from './index.module.scss';

interface IInformationSectionProps {
  saleName: string;
  info: ISaleInformation;
}

export const InformationSection: React.FC<IInformationSectionProps> = ({
  saleName,
  info,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.buyInformationWrapper}>
      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .totalDepositReceived,
        )}
        value={
          <>
            <span className="tw-pr-4">
              {weiToNumberFormat(info.totalDepositReceived)}
            </span>
            <AssetRenderer assetString={saleName} />
          </>
        }
        className="tw-border-2 tw-border-solid tw-border-yellow-3 tw-rounded-lg tw-px-5 tw-py-8"
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .saleAllocation,
        )}
        value={`${weiToNumberFormat(info.totalSaleAllocation)} ${saleName}`}
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .participatingWallets,
        )}
        value={`${info.participatingWallets}`}
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .tokenSaleEndTime,
        )}
        value={info.saleEnd}
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .acceptedCurrencies,
        )}
        value={
          <>
            <AcceptedCurrencies />
          </>
        }
        isLastItem={true}
      />
    </div>
  );
};
