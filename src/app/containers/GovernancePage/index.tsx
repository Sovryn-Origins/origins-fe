import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { Proposals } from './pages/Proposals';
import { Propose } from './pages/Propose';
import { ProposalDetail } from './pages/ProposalDetail';

export function GovernancePage() {
  const match = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>SOVRYN Bitocracy</title>
        <meta name="description" content="SOVRYN Bitocracy" />
      </Helmet>
      <Header />
      <Switch>
        <Route exact path={match.url} component={Proposals} />
        <Route exact path={`${match.url}/propose`} component={Propose} />
        <Route
          exact
          path={`${match.url}/proposal/:id`}
          component={ProposalDetail}
        />
        <Redirect to={match.url} />
      </Switch>
      <Footer />
    </>
  );
}
