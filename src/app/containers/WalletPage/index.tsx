import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../locales/i18n';
import { Theme } from 'types/theme';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { Tab } from '../../components/Tab';
import { UserAssets } from '../../components/UserAssets';
import { VestedAssets } from '../../components/UserAssets/VestedAssets';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { TopUpHistory } from '../FastBtcDialog/components/TopUpHistory';
import { VestedHistory } from '../VestedHistory';
import { OriginClaimBanner } from './components/OriginClaimBanner';

import './_overlay.scss';

export function WalletPage() {
  const { t } = useTranslation();
  const [activeAssets, setActiveAssets] = useState(0);
  const [activeHistory, setActiveHistory] = useState(0);
  const connected = useIsConnected();
  const account = useAccount();
  return (
    <>
      <Helmet>
        <title>{t(translations.walletPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.walletPage.meta.description)}
        />
      </Helmet>
      <Header />

      <div className="tw-container tw-mx-auto tw-px-4 tw-mt-4">
        <OriginClaimBanner />
      </div>

      <div className="tw-container tw-mx-auto tw-px-4 tw-max-w-screen-xl">
        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-mb-12 tw-mt-16">
          <h2 className="tw-text-black tw-text-xl tw-flex-shrink-0 tw-flex-grow-0 tw-mb-0">
            {t(translations.userAssets.meta.title)}
          </h2>
        </div>
        <div className="tw-bg-gray-1 tw-border-4 tw-border-solid tw-border-black tw-rounded-lg tw-pt-10 tw-px-6">
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-start tw-mb-8">
            <div className="tw-mr-2 tw-ml-2">
              <Tab
                text={t(translations.walletPage.tabs.unlocked)}
                active={activeAssets === 0}
                onClick={() => setActiveAssets(0)}
              />
            </div>
            <div className="tw-mr-2 tw-ml-2">
              <Tab
                text={t(translations.walletPage.tabs.vested)}
                active={activeAssets === 1}
                onClick={() => setActiveAssets(1)}
              />
            </div>
          </div>
          {connected && account ? (
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <div className="tw-col-span-12 tw-mt-2">
                {activeAssets === 0 && <UserAssets />}
                {activeAssets === 1 && <VestedAssets />}
              </div>
            </div>
          ) : (
            <div className="tw-grid tw-gap-8 tw-grid-cols-12">
              <div className="tw-col-span-12">
                <SkeletonRow
                  loadingText={t(translations.topUpHistory.walletHistory)}
                  className="tw-mt-2"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {connected && account && (
        <div className="tw-container tw-max-w-screen-xl tw-mt-16">
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-start">
            <div className="tw-mr-2 tw-ml-2">
              <Tab
                text={t(translations.topUpHistory.meta.title)}
                active={activeHistory === 0}
                onClick={() => setActiveHistory(0)}
                theme={Theme.LIGHT}
              />
            </div>
            <div className="tw-mr-2 tw-ml-2">
              <Tab
                text={t(translations.vestedHistory.title)}
                active={activeHistory === 1}
                onClick={() => setActiveHistory(1)}
                theme={Theme.LIGHT}
              />
            </div>
          </div>
          <div className="tw-bg-gray-1 tw-border-4 tw-border-solid tw-border-black tw-rounded-lg tw-py-8 tw-px-6 tw-mt-6">
            {activeHistory === 0 && <TopUpHistory />}
            {activeHistory === 1 && <VestedHistory />}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
