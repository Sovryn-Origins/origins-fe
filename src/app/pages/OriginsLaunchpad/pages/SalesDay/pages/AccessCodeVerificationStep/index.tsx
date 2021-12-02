import React from 'react';
// import imgLargeNFT from 'assets/images/OriginsLaunchpad/FishSale/large_NFT.svg';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ActionButton } from 'app/components/Form/ActionButton';
import { useIsAddressVerified } from 'app/pages/OriginsLaunchpad/hooks/useIsAddressVerified';
import styles from './index.module.scss';

interface IAccessCodeVerificationStepProps {
  tierId: number;
  saleName: string;
  onVerified?: () => void;
}

export const AccessCodeVerificationStep: React.FC<IAccessCodeVerificationStepProps> = ({
  tierId,
  saleName,
  onVerified,
}) => {
  const { t } = useTranslation();
  const isVerified = useIsAddressVerified(tierId);

  return (
    <>
      <div className={styles.dialogWrapper}>
        <div className="tw-max-w-lg">
          <div className="tw-text-3xl tw-tracking-normal tw-mb-20 tw-text-center tw-uppercase">
            {t(
              translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                .dialogTitle,
            )}
          </div>
          <div className="tw-text-xl tw-font-extralight tw-mb-32 tw-text-center">
            {isVerified
              ? t(
                  translations.originsLaunchpad.saleDay
                    .accessCodeVerificationStep.verified[
                    tierId === 2 ? 'publicSale' : 'privateSale'
                  ],
                )
              : t(
                  translations.originsLaunchpad.saleDay
                    .accessCodeVerificationStep.notVerified,
                  { token: saleName },
                )}
          </div>

          {isVerified && (
            <div className="tw-max-w-80 tw-mx-auto">
              <ActionButton
                text={t(
                  translations.originsLaunchpad.saleDay
                    .accessCodeVerificationStep.cta,
                )}
                onClick={onVerified}
                className="tw-block tw-w-full tw-h-10 tw-px-9 tw-mt-8 tw-rounded-xl tw-bg-gray-1 tw-bg-opacity-10"
                textClassName="tw-text-lg tw-tracking-normal tw-leading-snug"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
