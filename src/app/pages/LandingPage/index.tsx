import React, { useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from 'app/components/Header';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import axios, { Canceler } from 'axios';

// import { backendUrl, currentChainId } from 'utils/classifiers';
import { useInterval } from 'app/hooks/useInterval';
import { Footer } from 'app/components/Footer';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { TopBanner } from './components/TopBanner';
import { BondingCurve } from './components/BondingCurve';
import { SovrynsUnite } from './components/SovrynsUnite';
import { CryptocurrencyPrices } from './components/CryptocurrencyPrices';
import { IPairsData, IAssets } from './components/CryptocurrencyPrices/types';

const url = backendUrl[currentChainId];

interface ILandingPageProps {
  refreshInterval?: number;
}

export const LandingPage: React.FC<ILandingPageProps> = ({
  refreshInterval = 300000,
}) => {
  const { t } = useTranslation();
  const [pairsLoading, setPairsLoading] = useState(false);
  const [pairsData, setPairsData] = useState<IPairsData>();
  const [assetData, setAssetData] = useState<IAssets>();
  const [assetLoading, setAssetLoading] = useState(false);

  const cancelDataRequest = useRef<Canceler>();
  const cancelPairsDataRequest = useRef<Canceler>();
  const cancelAssetDataRequest = useRef<Canceler>();

  const getPairsData = useCallback(() => {
    setPairsLoading(true);
    cancelPairsDataRequest.current && cancelPairsDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/api/v1/trading-pairs/summary', {
        cancelToken,
      })
      .then(res => {
        setPairsData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setPairsLoading(false);
      });
  }, []);

  const getAssetData = useCallback(() => {
    setAssetLoading(true);
    cancelAssetDataRequest.current && cancelAssetDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/api/v1/trading-pairs/assets', {
        cancelToken,
      })
      .then(res => {
        setAssetData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setAssetLoading(false);
      });
  }, []);

  useInterval(
    () => {
      getPairsData();
      getAssetData();
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

        <div className="tw-w-full tw-overflow-auto">
          <CryptocurrencyPrices
            className="tw-mt-24"
            pairs={pairsData?.pairs}
            isLoading={pairsLoading}
            assetData={assetData}
            assetLoading={assetLoading}
          />
        </div>

        <BondingCurve className="tw-mt-36" />
      </div>
      <SovrynsUnite />
      <Footer />
    </>
  );
};
