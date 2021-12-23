import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ClaimForm } from './components/ClaimForm';
import { ConnectWalletWarning } from 'app/components/ConnectWalletWarning';
import { useAccount } from 'app/hooks/useAccount';

export const OriginsClaimPage: React.FC = () => {
  const { t } = useTranslation();
  const userAddress = useAccount();

  return (
    <>
      <Helmet>
        <title>{t(translations.originsClaim.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.originsClaim.meta.description)}
        />
      </Helmet>

      <Header />
      {!userAddress && (
        <div className="tw-tracking-normal">
          <div className="tw-container tw-mx-auto tw-px-6 tw-mb-44 tw-pt-2">
            <ConnectWalletWarning
              className="tw-mt-16"
              title={t(translations.originsClaim.walletConnect.title)}
              description={t(
                translations.originsClaim.walletConnect.description,
              )}
            />
          </div>
        </div>
      )}
      {userAddress && (
        <div className="tw-container tw-mt-28 tw-mb-12 tw-mx-auto tw-px-6">
          <div className="tw-max-w-screen-xl tw-mx-auto tw-py-20 tw-bg-gray-1 tw-items-center tw-flex tw-flex-col tw-rounded-lg tw-border-4 tw-border-solid tw-border-black">
            <ClaimForm address={userAddress} />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};
