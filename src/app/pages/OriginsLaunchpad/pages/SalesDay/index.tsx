import React, { useState } from 'react';
import classNames from 'classnames';
// import imgTitle from 'assets/images/OriginsLaunchpad/FishSale/title_image.png';
import { TitleContent } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { EngageWalletStep } from './pages/EngageWalletStep/index';
import { AccessCodeVerificationStep } from './pages/AccessCodeVerificationStep/index';
import { useIsConnected } from 'app/hooks/useAccount';
import { ImportantInformationStep } from './pages/ImportantInformationStep';
import { BuyStep } from './pages/BuyStep';
import { SaleSummary } from './components/SaleSummary';
import { useGetSaleInformation } from '../../hooks/useGetSaleInformation';

interface ISalesDayProps {
  tierId: number;
  saleName: string;
}

export const SalesDay: React.FC<ISalesDayProps> = ({ tierId, saleName }) => {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const info = useGetSaleInformation(tierId);

  const [step, setStep] = useState(1);

  const getActiveStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <AccessCodeVerificationStep
            tierId={tierId}
            saleName={saleName}
            onVerified={() => setStep(2)}
          />
        );
      case 2:
        return (
          <ImportantInformationStep
            tierId={tierId}
            onSubmit={() => setStep(3)}
          />
        );
      case 3:
        return (
          <BuyStep tierId={tierId} saleInformation={info} saleName={saleName} />
        );
      default:
        return <EngageWalletStep saleName={saleName} />;
    }
  };

  return (
    <div className="tw-mb-52">
      {info.isSaleActive && (
        <div className="tw-text-center tw-items-center tw-justify-center tw-flex tw-mb-12">
          <TitleContent>
            {t(translations.originsLaunchpad.saleDay.title)}
          </TitleContent>
        </div>
      )}

      <div className="tw-justify-center tw-flex tw-text-center">
        {!connected ? (
          <EngageWalletStep saleName={saleName} />
        ) : (
          info.isSaleActive && getActiveStep(step)
        )}
      </div>
      <SaleSummary
        saleInfo={info}
        className={classNames({ 'tw-mt-56': info.isSaleActive })}
      />
    </div>
  );
};
