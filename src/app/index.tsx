/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { currentNetwork } from 'utils/classifiers';
import { useAppTheme } from './hooks/app/useAppTheme';
import { useMaintenance } from './hooks/useMaintenance';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  actions as maintenanceActions,
  maintenanceSlice,
  reducer as maintenanceReducer,
} from 'store/global/maintenance-store/slice';
import { maintenanceStateSaga } from 'store/global/maintenance-store/saga';
import { useDispatch } from 'react-redux';

import { NetworkRibbon } from './components/NetworkRibbon/NetworkRibbon';
import { MaintenancePage } from './containers/MaintenancePage';
import { WalletProvider } from './containers/WalletProvider';

import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { WalletPage } from './containers/WalletPage/Loadable';
import { StakePage } from './containers/StakePage/Loadable';
import { GovernancePage } from './containers/GovernancePage/Loadable';
import { LandingPage } from './pages/LandingPage/Loadable';
import { BridgeDepositPage } from './pages/BridgeDepositPage/Loadable';
import { BridgeWithdrawPage } from './pages/BridgeWithdrawPage/Loadable';

import { OriginsLaunchpadPage } from './pages/OriginsLaunchpad/Loadable';
import { OriginsClaimPage } from './pages/OriginsClaimPage/Loadable';
import { usePriceFeeds_tradingPairRates } from './hooks/price-feeds/usePriceFeeds_tradingPairRates';

const title =
  currentNetwork !== 'mainnet'
    ? `Sovryn Origins ${currentNetwork}`
    : 'Sovryn Origins';

export function App() {
  useAppTheme();

  useInjectReducer({ key: maintenanceSlice, reducer: maintenanceReducer });
  useInjectSaga({ key: maintenanceSlice, saga: maintenanceStateSaga });
  const dispatch = useDispatch();

  const { checkMaintenance, States } = useMaintenance();
  const siteLocked = checkMaintenance(States.FULL);
  usePriceFeeds_tradingPairRates();

  useEffect(() => {
    dispatch(maintenanceActions.fetchMaintenance());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      {siteLocked ? (
        <MaintenancePage />
      ) : (
        <WalletProvider>
          <NetworkRibbon />
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/stake" component={StakePage} />
            <Route path="/governance" component={GovernancePage} />
            <Route exact path="/wallet" component={WalletPage} />
            <Route path="/launchpad" component={OriginsLaunchpadPage} />
            <Route exact path="/claim" component={OriginsClaimPage} />
            <Route
              exact
              path="/cross-chain/deposit"
              component={BridgeDepositPage}
            />
            <Route
              exact
              path="/cross-chain/withdraw"
              component={BridgeWithdrawPage}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </WalletProvider>
      )}
    </BrowserRouter>
  );
}
