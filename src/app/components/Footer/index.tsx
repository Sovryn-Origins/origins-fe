import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { discordInvite } from 'utils/classifiers';

import OptOutDialog from 'app/components/OptOutDialog';
import OriginsLogo from 'assets/images/origins-logo.svg';
import footerLogo from 'assets/images/footer-logo.svg';
import footerBackground from 'assets/images/footer-background.svg';
import discordIcon from 'assets/images/social-icon-discord.png';
import linkedinIcon from 'assets/images/social-icon-linkedin.png';
import twitterIcon from 'assets/images/social-icon-twitter.png';
import redditIcon from 'assets/images/social-icon-reddit.png';
import { StyledFooterWrapper } from './styled';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const commitHash = process.env.REACT_APP_GIT_COMMIT_ID || '';
  const [optDialogOpen, setOptDialogOpen] = useState<boolean>(false);

  return (
    <StyledFooterWrapper className="tw-mt-4 tw-text-sov-white tw-px-4 tw-pt-12 tw-pb-16">
      <div className="tw-max-w-screen-xl tw-w-full tw-mx-auto">
        <h6 className="tw-font-consolas tw-text-lg tw-text-center tw-w-full">
          "
          <Trans
            i18nKey={translations.footer.title}
            components={[<strong></strong>]}
          />
          "
        </h6>
        <div className="tw-relative tw-mt-16">
          <div className="tw-flex tw-justify-center">
            <img className="tw-mx-4" src={discordIcon} alt="Discord" />
            <img className="tw-mx-4" src={linkedinIcon} alt="LinkedIn" />
            <img className="tw-mx-4" src={twitterIcon} alt="Twitter" />
            <img className="tw-mx-4" src={redditIcon} alt="Reddit" />
          </div>

          <div className="tw-mt-8 md:tw-absolute md:tw-left-0 md:tw-bottom-0">
            <img className="tw-mx-auto" src={OriginsLogo} alt="Origins" />
          </div>
        </div>
      </div>

      <OptOutDialog
        open={optDialogOpen}
        onClose={() => setOptDialogOpen(false)}
      />
    </StyledFooterWrapper>
  );
};
