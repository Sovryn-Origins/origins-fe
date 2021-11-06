import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from 'app/components/Header';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

// import { backendUrl, currentChainId } from 'utils/classifiers';
import { useInterval } from 'app/hooks/useInterval';
import { Footer } from 'app/components/Footer';
import { TopBanner } from './components/TopBanner';
import { TokenTable } from './components/TokenTable';
import { BondingCurve } from './components/BondingCurve';
import { SovrynsUnite } from './components/SovrynsUnite';

// const url = backendUrl[currentChainId];

interface ILandingPageProps {
  refreshInterval?: number;
}

export const LandingPage: React.FC<ILandingPageProps> = ({
  refreshInterval = 300000,
}) => {
  const { t } = useTranslation();

  useInterval(
    () => {
      //to-do: add something for periodic update.
    },
    refreshInterval,
    { immediate: true },
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.landingPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.landingPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="container tw-max-w-screen-2xl tw-mx-auto tw-mt-16 tw-px-4 2xl:tw-px-0 tw-w-full">
        <TopBanner />
        <TokenTable className="tw-mt-24" />
        <BondingCurve className="tw-mt-36" />
      </div>
      <SovrynsUnite />
      <Footer />
    </>
  );
};
