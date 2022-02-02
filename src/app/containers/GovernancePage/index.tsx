import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, useLocation, useRouteMatch } from 'react-router-dom';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { CustomDialog } from 'app/components/CustomDialog';
import { Proposals } from './pages/Proposals';
import { Propose } from './pages/Propose';
import { ProposalDetail } from './pages/ProposalDetail';

export function GovernancePage() {
  const match = useRouteMatch();
  const location = useLocation<{ background: any; location: any }>();
  const background = location.state && location.state.background;

  return (
    <>
      <Helmet>
        <title>SOVRYN Bitocracy</title>
        <meta name="description" content="SOVRYN Bitocracy" />
      </Helmet>
      <Header />
      <Switch location={background || location}>
        <Route exact path={match.url} component={Proposals} />
      </Switch>
      <Switch location={location}>
        <Route
          exact
          path={`${match.url}/propose`}
          children={() => (
            <CustomDialog show={true}>
              <Propose />
            </CustomDialog>
          )}
        />
        <Route
          exact
          path={`${match.url}/proposal/:id/:contractName`}
          children={() => (
            <CustomDialog show={true}>
              <ProposalDetail />
            </CustomDialog>
          )}
        />
      </Switch>
      <Footer />
    </>
  );
}
