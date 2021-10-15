import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListShowWrapper } from '../../styled';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { translations } from 'locales/i18n';
import { AcceptedCurrencies } from 'types/asset';

export const ListShow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ListShowWrapper>
      <div className="tw-text-xs tw-tracking-normal tw-uppercase tw-mb-3">
        {t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .acceptedCurrencies,
        )}
      </div>
      <ul>
        {AcceptedCurrencies.map((currency, i) => (
          <li key={i}>
            <AssetRenderer asset={currency} />
          </li>
        ))}
      </ul>
    </ListShowWrapper>
  );
};
