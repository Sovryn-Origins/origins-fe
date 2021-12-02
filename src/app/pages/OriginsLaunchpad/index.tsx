import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { Dashboard } from './pages/Dashboard';
import { SalesDay } from './pages/SalesDay';
/* undo once Fish contract has active sale tier reset to 0 */
import { useGetActiveSaleTierId } from './hooks/useGetActiveSaleTierId';

export const OriginsLaunchpad: React.FC = () => {
  const { t } = useTranslation();
  const { url } = useRouteMatch();
  const history = useHistory();
  /* undo once Fish contract has active sale tier reset to 0 */
  const activeTierId = useGetActiveSaleTierId();

  useEffect(() => {
    document.body.classList.add('originsLaunchpad');
    if (activeTierId > 0) {
      history.push(`${url}/sales`);
    }
    return () => document.body.classList.remove('originsLaunchpad');
  }, [history, url, activeTierId]);

  return (
    <>
      <Helmet>
        <title>{t(translations.escrowPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.escrowPage.meta.description)}
        />
      </Helmet>
      <Header />

      <div
        className="tw-container tw-font-rowdies"
        style={{ paddingTop: '4.5rem' }}
      >
        <Switch>
          <Route path={`${url}/dashbaord`} exact component={Dashboard} />
          <Route path={`${url}/sales`}>
            <SalesDay tierId={activeTierId} saleName="OG" />
          </Route>
          <Redirect to={`${url}/dashbaord`} />
        </Switch>
      </div>
      <Footer />
    </>
  );
};
