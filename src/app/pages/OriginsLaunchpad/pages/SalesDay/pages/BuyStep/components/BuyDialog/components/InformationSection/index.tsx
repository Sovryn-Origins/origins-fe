import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Asset } from 'types';
import { BuyInformationWrapper } from './styled';
import { InfoItem } from './InfoItem';
import { AllocationRemaining } from './AllocationRemaining';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { ISaleInformation } from '../../../../../../../../types';
import { btcInSatoshis } from 'app/constants';

interface IInformationSectionProps {
  saleName: string;
  info: ISaleInformation;
}

const depositRateToSatoshis = (depositRate: number) =>
  toNumberFormat(btcInSatoshis / depositRate);

export const InformationSection: React.FC<IInformationSectionProps> = ({
  saleName,
  info,
}) => {
  const { t } = useTranslation();

  return (
    <BuyInformationWrapper>
      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .allocationRemaining,
        )}
        value={
          <AllocationRemaining
            totalSaleAllocation={info.totalSaleAllocation}
            remainingTokens={info.remainingTokens}
            saleName={saleName}
          />
        }
        className="tw-text-primary"
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
            .price,
        )}
        value={`${depositRateToSatoshis(info.depositRate)} Sats`}
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
            <AssetSymbolRenderer asset={info.depositToken} />
          </>
        }
        isLastItem={true}
      />
    </BuyInformationWrapper>
  );
};
