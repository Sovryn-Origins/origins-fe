import React, { useCallback, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { useWalletContext } from '@sovryn/react-wallet';

import { translations } from 'locales/i18n';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { ConfirmButton } from 'app/components/Form/ConfirmButton';
import { Dialog } from 'app/containers/Dialog';
import { ResetTxResponseInterface } from 'app/hooks/useSendContractTx';
import { usePrevious } from 'app/hooks/usePrevious';
import txFailed from 'assets/images/failed-tx.svg';
import txConfirm from 'assets/images/confirm-tx.svg';
import txPending from 'assets/images/pending-tx.svg';
import txWaitForBatch from 'assets/images/wait-tx.svg';
// import txPending from 'assets/images/buy-pending-tx.svg';
import closeImg from 'assets/images/closeImg.svg';
import wMetamask from 'assets/wallets/metamask.svg';
import wNifty from 'assets/wallets/nifty.png';
import wLiquality from 'assets/wallets/liquality.svg';
import wPortis from 'assets/wallets/portis.svg';
import wLedger from 'assets/wallets/ledger.svg';
import wTrezor from 'assets/wallets/trezor.svg';
import wWalletConnect from 'assets/wallets/walletconnect.svg';
import { selectTransactions } from 'store/global/transactions-store/selectors';
import { TxStatus } from 'store/global/transactions-store/types';
import { detectWeb3Wallet, prettyTx } from 'utils/helpers';

import { BuyStatus } from '../../types';
import styles from './index.module.scss';

interface Props {
  openOrderTx: ResetTxResponseInterface;
  claimOrderTx: ResetTxResponseInterface;
  buyStatus: BuyStatus;
  onStartClaim: () => void;
  onSwapSuccess: () => void;
  onUserConfirmed?: () => void;
  onSuccess?: () => void;
}

export function TxDialog({
  openOrderTx,
  claimOrderTx,
  buyStatus,
  onStartClaim,
  onSwapSuccess,
  onUserConfirmed,
  onSuccess,
}: Props) {
  const transactions = useSelector(selectTransactions);
  const { t } = useTranslation();
  const { address } = useWalletContext();

  const tx = useMemo(
    () =>
      ![TxStatus.NONE, TxStatus.CONFIRMED].includes(openOrderTx.status)
        ? openOrderTx
        : claimOrderTx,
    [openOrderTx, claimOrderTx],
  );

  const isInNonTransaction = useMemo(
    () => [BuyStatus.WAIT_FOR_BATCH, BuyStatus.CLAIMABLE].includes(buyStatus),
    [buyStatus],
  );

  const close = useCallback(() => {
    openOrderTx.reset();
    claimOrderTx.reset();
    onSwapSuccess();
  }, [openOrderTx, claimOrderTx, onSwapSuccess]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);

  const oldStatus = usePrevious(tx.status);

  useEffect(() => {
    if (
      oldStatus === TxStatus.PENDING_FOR_USER &&
      tx.status === TxStatus.PENDING &&
      onUserConfirmed
    ) {
      onUserConfirmed();
    }
  }, [oldStatus, tx.status, onUserConfirmed]);

  useEffect(() => {
    if (tx.status === TxStatus.CONFIRMED && onSuccess) {
      onSuccess();
    }
  }, [tx.status, onSuccess]);

  const getLastTransaction = t => {
    const keys = Object.keys(t);
    return t[keys[keys.length - 1]];
  };

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={tx.status !== TxStatus.NONE || isInNonTransaction}
      onClose={close}
      className={styles.dialog}
    >
      {!isInNonTransaction && tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <h1>{t(translations.buySovPage.txDialog.pendingUser.title)}</h1>
          <WalletLogo wallet={wallet} />
          <p
            className="tw-text-center tw-mx-auto tw-w-full"
            style={{ maxWidth: 266 }}
          >
            {t(translations.buySovPage.txDialog.pendingUser.text, {
              walletName: getWalletName(wallet),
            })}
          </p>
        </>
      )}
      {buyStatus === BuyStatus.WAIT_FOR_BATCH && (
        <>
          <h1>{t(translations.buySovPage.txDialog.txStatus.title)}</h1>
          <StyledStatus>
            <img className="" src={txWaitForBatch} alt="Wait For Batch" />
            <p>
              {t(translations.buySovPage.txDialog.txStatus.waitingForClaiming)}
            </p>
          </StyledStatus>
          <div className="tw-flex tw-justify-center">
            <ConfirmButton
              onClick={close}
              text={t(translations.common.close)}
            />
          </div>
        </>
      )}
      {buyStatus === BuyStatus.CLAIMABLE && (
        <>
          <h1>{t(translations.buySovPage.txDialog.txStatus.title)}</h1>
          <StyledStatus>
            <img className="" src={txWaitForBatch} alt="Claimable" />
            <p>{t(translations.buySovPage.txDialog.txStatus.claimable)}</p>
          </StyledStatus>
          <div className="tw-flex tw-justify-center">
            <ConfirmButton
              primary={true}
              onClick={onStartClaim}
              text={t(translations.common.claim)}
            />
          </div>
        </>
      )}
      {!isInNonTransaction &&
        [TxStatus.PENDING, TxStatus.CONFIRMED, TxStatus.FAILED].includes(
          tx.status,
        ) && (
          <ModalWrap>
            <CloseButton data-close="" onClick={close}>
              {/* <span className="tw-sr-only">Close Dialog</span> */}
              <img src={closeImg} alt="close" />
            </CloseButton>
            <h1>{t(translations.buySovPage.txDialog.txStatus.title)}</h1>
            <StatusComponent
              status={tx.status}
              bond={getLastTransaction(transactions)}
            />

            {!!tx.txHash && (
              <StyledHashContainer>
                <StyledHash>
                  <strong>Hash:</strong>{' '}
                  <span className="tw-text-primary">{prettyTx(tx.txHash)}</span>
                </StyledHash>
                <ExplorerLink>
                  <LinkToExplorer
                    txHash={tx.txHash}
                    text={t(translations.buySovPage.txDialog.txStatus.cta)}
                    className="tw-text-blue"
                  />
                </ExplorerLink>
              </StyledHashContainer>
            )}

            {!tx.txHash && tx.status === TxStatus.FAILED && (
              <>
                <p className="tw-text-center">
                  {t(translations.buySovPage.txDialog.txStatus.aborted)}
                </p>
                {wallet === 'ledger' && (
                  <p className="tw-text-center">
                    {t(translations.buySovPage.txDialog.txStatus.abortedLedger)}
                  </p>
                )}
              </>
            )}

            <div className="tw-flex tw-justify-center">
              <ConfirmButton
                onClick={close}
                text={t(translations.common.close)}
              />
            </div>
          </ModalWrap>
        )}
    </Dialog>
  );
}

function getWalletName(wallet) {
  if (wallet === 'liquality') return 'Liquality';
  if (wallet === 'nifty') return 'Nifty';
  if (wallet === 'portis') return 'Portis';
  if (wallet === 'ledger') return 'Ledger';
  if (wallet === 'trezor') return 'Trezor';
  if (wallet === 'wallet-connect') return 'Wallet Connect';
  return 'MetaMask';
}

function getWalletImage(wallet) {
  if (wallet === 'liquality') return wLiquality;
  if (wallet === 'nifty') return wNifty;
  if (wallet === 'portis') return wPortis;
  if (wallet === 'ledger') return wLedger;
  if (wallet === 'trezor') return wTrezor;
  if (wallet === 'wallet-connect') return wWalletConnect;
  return wMetamask;
}

function getStatusImage(tx: TxStatus, bonding: any) {
  if (tx === TxStatus.FAILED) return txFailed;
  if (tx === TxStatus.CONFIRMED) {
    if (
      bonding.type === 'bonding' &&
      bonding.status === 'pending' &&
      bonding.customData.stage === 'buy'
    ) {
      return txPending;
    } else {
      return txConfirm;
    }
  }
  return txPending;
}

function getStatus(tx: TxStatus, bonding: any) {
  if (tx === TxStatus.FAILED)
    return <Trans i18nKey={translations.common.failed} />;
  if (tx === TxStatus.CONFIRMED) {
    if (
      bonding.type === 'bonding' &&
      bonding.status === 'pending' &&
      bonding.customData.stage === 'buy'
    ) {
      return <Trans i18nKey={translations.common.pending} />;
    } else {
      return <Trans i18nKey={translations.common.confirmed} />;
    }
  }
  return <Trans i18nKey={translations.common.pending} />;
}

const StyledStatus = styled.div`
  margin: 0 auto 35px;
  text-align: center;
  img {
    width: 5rem;
    height: 5rem;
    margin: auto;
  }
  p {
    margin-top: 2.813rem;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
  }
`;

const StyledHashContainer = styled.div`
  max-width: 215px;
  width: 100%;
  margin: 0 auto;
`;

const StyledHash = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 300;
  margin-bottom: 35px;
  strong {
    font-weight: 500;
    margin-right: 14px;
    display: inline-block;
  }
`;

const ExplorerLink = styled.div.attrs(_ => ({
  className: 'tw-text-secondary',
}))`
  text-align: center;
  a {
    text-decoration: underline !important;
    font-weight: 500 !important;
    text-transform: uppercase;
    &:hover {
      text-decoration: none !important;
    }
  }
`;

function StatusComponent({ status, bond }: { status: TxStatus; bond: any }) {
  return (
    <StyledStatus>
      <img
        src={getStatusImage(status, bond)}
        className={`${status === 'pending' && 'tw-animate-spin'}`}
        alt="Status"
      />
      <p>{getStatus(status, bond)}</p>
    </StyledStatus>
  );
}

const WLContainer = styled.div`
  width: 98px;
  height: 98px;
  border-radius: 1.25rem;
  border: 1px solid #e8e8e8;
  margin: 0 auto 35px;
  div {
    font-size: 0.75rem;
  }
`;
const WLImage = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  object-fit: contain;
`;

function WalletLogo({ wallet }: { wallet: string }) {
  return (
    <WLContainer className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-overflow-hidden">
      <WLImage src={getWalletImage(wallet)} alt="Wallet" />
      <div className="tw-truncate">{getWalletName(wallet)}</div>
    </WLContainer>
  );
}

const CloseButton = styled.div`
  position: absolute;
  top: -10px;
  right: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWrap = styled.div`
  position: relative;
`;
