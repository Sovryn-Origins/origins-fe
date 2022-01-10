import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

import OptOutDialog from 'app/components/OptOutDialog';
import OriginsLogo from 'assets/images/origins-logo.svg';
import discordIcon from 'assets/images/social-icon-discord.png';
import linkedinIcon from 'assets/images/social-icon-linkedin.png';
import twitterIcon from 'assets/images/social-icon-twitter.png';
import redditIcon from 'assets/images/social-icon-reddit.png';
import telegramIcon from 'assets/images/social-icon-telegram.png';
import instagramIcon from 'assets/images/social-icon-instagram.png';
import facebookIcon from 'assets/images/social-icon-facebook.png';
import footerBackground from 'assets/images/footer-background.svg';

export const Footer: React.FC = () => {
  const [optDialogOpen, setOptDialogOpen] = useState<boolean>(false);

  return (
    <footer
      className="tw-mt-4 tw-text-sov-white tw-px-4 tw-pt-12 tw-pb-16 tw-bg-left-top tw-bg-origin-border tw-bg-cover tw-bg-no-repeat"
      style={{ backgroundImage: `url(${footerBackground})` }}
    >
      <div className="tw-max-w-screen-xl tw-w-full tw-mx-auto">
        <h6 className="tw-font-rowdies tw-font-bold tw-text-lg tw-text-center tw-w-full">
          "
          <Trans
            i18nKey={translations.footer.title}
            components={[<strong></strong>]}
          />
          "
        </h6>
        <div className="tw-relative tw-mt-16">
          <div className="tw-flex tw-justify-center">
            <a
              className="tw-mx-4"
              target="_blank"
              rel="noreferrer"
              href="https://discord.gg/gjkPdRT9kA"
            >
              <img src={discordIcon} alt="Discord" />
            </a>
            <a
              className="tw-mx-4"
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/OriginsXYZ"
            >
              <img src={twitterIcon} alt="Twitter" />
            </a>
            <a
              className="tw-mx-4"
              target="_blank"
              rel="noreferrer"
              href="https://www.reddit.com/r/OriginsXYZ/"
            >
              <img src={redditIcon} alt="Reddit" />
            </a>
            <a
              className="tw-mx-4"
              target="_blank"
              rel="noreferrer"
              href="https://t.me/OriginsXYZ"
            >
              <img src={telegramIcon} alt="Telegram" />
            </a>
            <a
              className="tw-mx-4"
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/originsxyz"
            >
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a
              className="tw-mx-4"
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/company/originsxyz/"
            >
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            <a
              className="tw-mx-4"
              target="_blank"
              rel="noreferrer"
              href="https://www.facebook.com/OriginsXYZ"
            >
              <img src={facebookIcon} alt="Facebook" />
            </a>
          </div>

          <div className="tw-mt-8 lg:tw-absolute lg:tw-left-0 lg:tw-bottom-0">
            <img className="tw-mx-auto" src={OriginsLogo} alt="Origins" />
          </div>
        </div>
      </div>

      <OptOutDialog
        open={optDialogOpen}
        onClose={() => setOptDialogOpen(false)}
      />
    </footer>
  );
};
