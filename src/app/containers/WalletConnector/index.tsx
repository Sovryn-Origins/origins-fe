import React from 'react';
import { Icon, Menu, MenuItem, Popover, Spinner } from '@blueprintjs/core';
import { useWalletContext } from '@sovryn/react-wallet';
import blockies from 'ethereum-blockies';
import classNames from 'classnames';

import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toastSuccess } from 'utils/toaster';
import { translations } from 'locales/i18n';
import { prettyTx } from 'utils/helpers';

import styles from './index.module.scss';

type Props = {
  simpleView: boolean;
};

const WalletConnectorContainer: React.FC<Props> = props => {
  const {
    connected,
    address,
    connect,
    disconnect,
    connecting,
  } = useWalletContext();
  const { t } = useTranslation();
  const simpleView = props.simpleView;
  const simpleViewClass = simpleView ? styles.simpleView : '';

  const getWalletAddrBlockieImg = (): string => {
    return blockies
      .create({
        // All options are optional
        seed: address, // seed used to generate icon data, default: random
        color: '#dfe', // to manually specify the icon color, default: random
        bgcolor: '#aaa', // choose a different background color, default: random
        size: 8, // width/height of the icon in blocks, default: 8
        scale: 3, // width/height of each block in pixels, default: 4
        spotcolor: '#000', // each pixel has a 13% chance of being of a third color,
      })
      .toDataURL();
  };

  return (
    <div className="tw-justify-center tw-items-center tw-flex">
      {!connected && !address ? (
        <button
          onClick={() => connect()}
          className={classNames(
            styles.button,
            'tw-flex tw-justify-center tw-items-center tw-bg-primary hover:tw-opacity-90',
          )}
        >
          {connecting && <Spinner size={22} />}
          {!connecting && (
            <span className="tw-hidden xl:tw-inline tw-truncate tw-uppercase tw-leading-30px">
              {t(translations.wallet.connect_btn)}
            </span>
          )}
        </button>
      ) : (
        <div className={simpleViewClass}>
          <Popover
            placement={'bottom'}
            content={
              address ? (
                <Menu>
                  <CopyToClipboard
                    text={address}
                    onCopy={() =>
                      toastSuccess(
                        <>{t(translations.onCopy.address)}</>,
                        'copy',
                      )
                    }
                  >
                    <MenuItem
                      icon="duplicate"
                      text={t(translations.wallet.copy_address)}
                    />
                  </CopyToClipboard>
                </Menu>
              ) : undefined
            }
          >
            <>
              <div className={styles.engageWallet}>
                <span className="tw-flex tw-flex-nowrap tw-flex-row tw-items-center tw-w-full tw-justify-between tw-truncate">
                  <span>{prettyTx(address || '', 4, 4)}</span>
                  <span className="tw-pl-2">
                    <img
                      className="tw-rounded"
                      src={getWalletAddrBlockieImg()}
                      alt="wallet address"
                    />
                  </span>
                  <Icon
                    icon="log-out"
                    className={styles.logout}
                    onClick={() => disconnect()}
                  />
                </span>
              </div>
              <button className={classNames(styles.button, 'xl:tw-hidden')}>
                <Icon icon="user" />
              </button>
            </>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default WalletConnectorContainer;
