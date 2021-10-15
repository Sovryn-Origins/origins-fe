import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListShowWrapper } from '../../styled';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types/asset';
import { translations } from 'locales/i18n';

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
        {Object.keys(Asset).map((key, i) => (
          <li key={i}>
            <AssetRenderer asset={Asset[key]} />
          </li>
        ))}
      </ul>
    </ListShowWrapper>
  );
};
