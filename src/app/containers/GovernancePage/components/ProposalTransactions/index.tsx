import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Popover2 } from '@blueprintjs/popover2';
import { Icon } from '@blueprintjs/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { WalletContext } from '@sovryn/react-wallet';

import { toastSuccess } from 'utils/toaster';
import { translations } from 'locales/i18n';
import { blockExplorers, currentChainId } from 'utils/classifiers';
import { prettyTx } from 'utils/helpers';
import { IProposalCreatedReturnValue, IProposalTransaction } from '../../types';
import styles from './index.module.scss';

interface IProposalTransactionsProps {
  className?: string;
  data: IProposalCreatedReturnValue;
  loading: boolean;
}

export const ProposalTransactions: React.FC<IProposalTransactionsProps> = ({
  className,
  loading,
  data,
}) => {
  const { t } = useTranslation();
  const transactions = useMemo(() => {
    if (loading || !data) return [];
    return data.targets.reduce(
      (transactions: IProposalTransaction[], target, i) => [
        ...transactions,
        {
          target,
          signature: data.signatures[i],
          calldata: data.calldatas[i],
          value: data.values[i],
        },
      ],
      [],
    );
  }, [loading, data]);

  return (
    <div
      className={classNames(
        className,
        'tw-bg-gray-1 tw-rounded-lg tw-px-8 tw-pt-4 tw-pb-6',
      )}
    >
      <p className="tw-text-white tw-text-xl tw-uppercase">
        {t(translations.governance.proposalDetail.transactions.title)}
      </p>

      <div className="tw-bg-gray-3 tw-rounded-lg tw-pt-9 tw-px-4 tw-pb-4">
        <table className={styles.table}>
          <thead>
            <tr className="tw-uppercase">
              <th className="tw-text-base">
                {t(translations.governance.proposalDetail.transactions.target)}
              </th>
              <th className="tw-text-base">
                {t(
                  translations.governance.proposalDetail.transactions.signature,
                )}
              </th>
              <th className="tw-text-base">
                {t(
                  translations.governance.proposalDetail.transactions.calldata,
                )}
              </th>
              <th className="tw-text-base">
                {t(translations.governance.proposalDetail.transactions.value)}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <TransactionRow data={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ITransactionRowProps {
  data: IProposalTransaction;
}

const TransactionRow: React.FC<ITransactionRowProps> = ({ data }) => {
  const { t } = useTranslation();
  const { chainId } = useContext(WalletContext);

  const getUrl = useCallback(() => {
    return blockExplorers[currentChainId];
  }, []);

  const [url, setUrl] = useState(getUrl());

  useEffect(() => {
    setUrl(getUrl());
  }, [chainId, getUrl]);

  return (
    <tr>
      <td>
        <Popover2
          minimal={true}
          placement="top"
          popoverClassName="bp3-tooltip2"
          content={
            <div className="tw-flex tw-items-center">
              <a
                href={`${url}/address/${data.target}`}
                target="_blank"
                rel="noreferrer"
                className="tw-text-gold tw-text-sm tw-tracking-normal tw-transition tw-no-underline tw-p-0 tw-m-0 tw-duration-300 hover:tw-underline hover:tw-text-gold"
              >
                {data.target}
              </a>
              <CopyToClipboard
                onCopy={() =>
                  toastSuccess(<>{t(translations.onCopy.address)}</>, 'copy')
                }
                text={data.target}
              >
                <Icon
                  title="Copy"
                  icon="duplicate"
                  className="tw-text-white tw-cursor-pointer hover:tw-text-gold ml-2"
                  iconSize={15}
                />
              </CopyToClipboard>
            </div>
          }
        >
          <p className="tw-uppercase tw-font-inter tw-p-0 tw-m-0 tw-duration-300 hover:tw-opacity-70 tw-transition tw-cursor-pointer">
            {prettyTx(data.target)}
          </p>
        </Popover2>
      </td>
      <td>{data.signature}</td>
      <td>
        <CopyToClipboard
          onCopy={() =>
            toastSuccess(
              <>
                {t(
                  translations.governance.proposalDetail.transactions
                    .copiedCalldata,
                )}
              </>,
              'copy',
            )
          }
          text={data.calldata}
        >
          <div className="tw-flex tw-items-center">
            <span className="tw-pr-2 tw-font-inter">
              {prettyTx(data.calldata)}
            </span>
            <Icon
              title="Copy"
              icon="duplicate"
              className="tw-text-white tw-cursor-pointer hover:tw-text-gold ml-2"
              iconSize={15}
            />
          </div>
        </CopyToClipboard>
      </td>
      <td>{data.value}</td>
    </tr>
  );
};
