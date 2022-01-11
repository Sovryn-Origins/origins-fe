import React, { useEffect } from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { Dashboard } from './pages/Dashboard';
import { SalesDay } from './pages/SalesDay';
import { SaleSummary } from './pages/SalesDay/components/SaleSummary';
import { useGetSaleInformation } from './hooks/useGetSaleInformation';
/* undo once Fish contract has active sale tier reset to 0 */
import { useGetActiveSaleTierId } from './hooks/useGetActiveSaleTierId';

export const OriginsLaunchpad: React.FC = () => {
  const { t } = useTranslation();
  const { url } = useRouteMatch();
  const history = useHistory();
  /* undo once Fish contract has active sale tier reset to 0 */
  const activeTierId = useGetActiveSaleTierId();
  const info = useGetSaleInformation(activeTierId);

  // useEffect(() => {
  //   console.log('[Info]', info);
  // }, [info]);

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
            <SalesDay tierId={activeTierId} info={info} saleName="OG" />
          </Route>
        </Switch>

        <SaleSummary
          saleInfo={info}
          className={classNames('tw-mb-80', { 'tw-mt-56': info.isSaleActive })}
        />
      </div>
      <Footer />
    </>
  );
};
