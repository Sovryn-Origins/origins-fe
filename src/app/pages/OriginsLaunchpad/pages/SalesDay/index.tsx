import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';

import { TitleContent } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { EngageWalletStep } from './pages/EngageWalletStep/index';
import { AccessCodeVerificationStep } from './pages/AccessCodeVerificationStep/index';
import { useIsConnected } from 'app/hooks/useAccount';
import { ImportantInformationStep } from './pages/ImportantInformationStep';
import { BuyStep } from './pages/BuyStep';
import { ISaleInformation } from '../../types';
import saleStorage from './storage';

interface ISalesDayProps {
  tierId: number;
  info: ISaleInformation;
  saleName: string;
}

export const SalesDay: React.FC<ISalesDayProps> = ({
  tierId,
  info,
  saleName,
}) => {
  const { t } = useTranslation();
  const { url } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const connected = useIsConnected();

  const setStep = (step: number) => {
    saleStorage.saveData({ step });
    history.push(`${url}/${step}`);
  };

  useEffect(() => {
    const { step } = saleStorage.getData();
    if (connected) {
      history.push(`${url}/${step}`);
    } else {
      history.push(`${url}/engage-wallet`);
    }
  }, [connected, location.pathname, history, url]);

  return (
    <div className="tw-mb-52">
      {info.isSaleActive && (
        <div className="tw-text-center tw-items-center tw-justify-center tw-flex tw-mb-12">
          <TitleContent>
            {t(translations.originsLaunchpad.saleDay.title)}
          </TitleContent>
        </div>
      )}

      <Switch>
        <Route exact path={`${url}/engage-wallet`}>
          <EngageWalletStep saleName={saleName} />
        </Route>
        <Route exact path={`${url}/1`}>
          <AccessCodeVerificationStep
            tierId={tierId}
            saleName={saleName}
            onVerified={() => setStep(2)}
          />
        </Route>
        <Route exact path={`${url}/2`}>
          <ImportantInformationStep
            saleName={saleName}
            tierId={tierId}
            onSubmit={() => setStep(3)}
          />
        </Route>
        <Route exact path={`${url}/3`}>
          <BuyStep tierId={tierId} saleInformation={info} saleName={saleName} />
        </Route>
        <Redirect to={`${url}/1`} />
      </Switch>
    </div>
  );
};
