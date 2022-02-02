import { Checkbox } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isMobile } from 'utils/helpers';

import { translations } from '../../../locales/i18n';
import { local } from '../../../utils/storage';
import { Dialog } from '../../containers/Dialog/Loadable';
import SalesButton from '../SalesButton';
import OriginsLogo from 'assets/images/sovryn-origin-logo-dark.png';

interface Props {}

const SESSION_KEY = 'mm-notify-shown';

const shouldModalBeVisible = () =>
  !isMobile() && !Number(local.getItem(SESSION_KEY));

export function MetaMaskDiscouragementNotifyModal(props: Props) {
  const { t } = useTranslation();
  const [show, setShow] = useState(shouldModalBeVisible());
  const [checked, setChecked] = useState(false);

  useEffect(() => setShow(shouldModalBeVisible()), []);

  const handleClose = () => {
    local.setItem(SESSION_KEY, '1');
    setShow(false);
  };

  return (
    <Dialog
      isOpen={show}
      onClose={handleClose}
      canOutsideClickClose={false}
      isCloseButtonShown={false}
      canEscapeKeyClose={false}
      className="tw-w-full tw-max-w-3xl tw-pt-12 tw-px-16"
    >
      <div className="tw-font-light tw-text-center tw-w-full tw-mx-auto">
        <div className="tw-flex tw-items-center">
          <img src={OriginsLogo} alt="Sovryn Origins" />
          <span className="tw-ml-5 tw-text-lg tw-font-consolas tw-uppercase">
            Sovryn Origins
          </span>
        </div>
        <div
          className="tw-font-bold tw-text-center tw-uppercase tw-mt-12 tw-mb-12"
          style={{ fontSize: '32px' }}
        >
          {t(translations.notifyDialog.heading)}
        </div>
        <GeneralAlert />
      </div>

      <div className="tw-flex tw-flex-col tw-items-center tw-mt-12 tw-mb-6">
        <Checkbox
          checked={checked}
          onChange={() => setChecked(!checked)}
          label={t(translations.notifyDialog.acceptTerms)}
          className="tw-text-left tw-uppercase tw-font-rowdies tw-mb-3"
        />
        <div className="tw-mt-24">
          <SalesButton
            text={t(translations.notifyDialog.salesBtn)}
            onClick={handleClose}
            disabled={!checked}
          />
        </div>
      </div>
    </Dialog>
  );
}

function GeneralAlert() {
  const { t } = useTranslation();
  return (
    <>
      <p
        className="tw-font-light tw-text-left tw-uppercase tw-mb-0"
        style={{ lineHeight: '34px' }}
      >
        {t(translations.notifyDialog.generalAlert.p1)}
      </p>
    </>
  );
}
