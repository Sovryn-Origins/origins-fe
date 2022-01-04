/**
 *
 * BuyPage
 *
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useAccount } from '../../hooks/useAccount';
import { BuyFormContainer } from './components/BuyFormContainer';
import { BondingCurve } from './components/BondingCurve';
import Tabbar from './components/Tabbar';
import { SwapHistory } from '../../containers/SwapHistory';

import styles from './index.module.scss';

const TabbarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2em 0 3em;
`;

interface Props {}

export function BuyPage(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const [selectedTab, setSelectedTab] = useState(false);
  const comingSoon = false;

  return (
    <>
      <Helmet>
        <title>{t(translations.buyPage.meta.title)}</title>
        <meta name="description" content={t(translations.buyPage.title)} />
      </Helmet>
      <Header />
      <div className={classNames(styles.swapPage, 'tw-container')}>
        <TabbarContainer>
          <Tabbar
            setSelectedTab={(e: boolean) => setSelectedTab(e)}
            selectedTab={selectedTab}
          />
        </TabbarContainer>
        {!selectedTab && <BuyFormContainer />}
        {selectedTab && <BondingCurve />}
        {comingSoon || !selectedTab ? (
          <>
            <div>
              <div className={styles.swapHistoryTableContainer}>
                {!account ? (
                  <SkeletonRow
                    loadingText={t(translations.topUpHistory.walletHistory)}
                    className="tw-mt-2"
                  />
                ) : (
                  <SwapHistory tabState={selectedTab} />
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
