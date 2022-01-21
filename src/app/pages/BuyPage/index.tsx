import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from 'locales/i18n';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { Tab } from 'app/components/Tab';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { SwapHistory } from 'app/containers/SwapHistory';
import { useAccount } from 'app/hooks/useAccount';
import { Theme } from 'types/theme';

import { BuyFormContainer } from './components/BuyFormContainer';
import { BondingCurve } from './components/BondingCurve';
import { BondingCurveHistory } from './components/BondingCurveHistory';
import { BuyType } from './types';

import styles from './index.module.scss';

interface Props {}

const comingSoon = false;

export function BuyPage(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const [currentTab, setCurrentTab] = useState<BuyType>(BuyType.SOVRYN_SWAP);

  return (
    <>
      <Helmet>
        <title>{t(translations.buyPage.meta.title)}</title>
        <meta name="description" content={t(translations.buyPage.title)} />
      </Helmet>
      <Header />
      <div className={classNames(styles.swapPage, 'tw-container')}>
        <div className="tw-w-full tw-flex tw-items-center tw-justify-center tw-mt-8 tw-mb-12 tw-mx-0">
          <div className="tw-mr-2 tw-ml-2">
            <Tab
              text={t(translations.buyPage.tab.sovrynSwap)}
              textClassName={styles.tab}
              active={currentTab === BuyType.SOVRYN_SWAP}
              onClick={() => setCurrentTab(BuyType.SOVRYN_SWAP)}
              theme={Theme.LIGHT}
            />
          </div>
          <div className="tw-mr-2 tw-ml-2">
            <Tab
              text={t(translations.buyPage.tab.bondingCurve)}
              textClassName={styles.tab}
              active={currentTab === BuyType.BONDING_CURVE}
              onClick={() => setCurrentTab(BuyType.BONDING_CURVE)}
              theme={Theme.LIGHT}
            />
          </div>
        </div>

        {currentTab === BuyType.SOVRYN_SWAP && <BuyFormContainer />}

        {currentTab === BuyType.BONDING_CURVE && (
          <BondingCurve comingSoon={comingSoon} />
        )}

        {!comingSoon ? (
          <>
            <div>
              <div className={styles.swapHistoryTableContainer}>
                {!account ? (
                  <SkeletonRow
                    loadingText={t(translations.topUpHistory.walletHistory)}
                    className="tw-mt-2"
                  />
                ) : currentTab === BuyType.SOVRYN_SWAP ? (
                  <SwapHistory />
                ) : (
                  <BondingCurveHistory />
                )}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </>
  );
}
