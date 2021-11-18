import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { WalletContext } from '@sovryn/react-wallet';
import { Icon } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Classes, Tooltip2, Popover2 } from '@blueprintjs/popover2';

import { useBlockSync, useIsConnected } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { toastSuccess } from 'utils/toaster';
import { useGetProposalState } from 'app/hooks/useGetProposalState';
import { MergedProposal } from 'app/hooks/useProposalList';
import { contractReader } from 'utils/sovryn/contract-reader';
import { eventReader } from 'utils/sovryn/event-reader';
import { dateByBlocks, kFormatter, prettyTx } from 'utils/helpers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { Proposal, ProposalState } from '../types';
import { blockExplorers, currentChainId } from 'utils/classifiers';
import { VoteCaster } from '../components/VoteCaster';
import { ProposalHistory } from '../components/ProposalHistory';
import imgInterface from 'assets/images/governance/example-interface.png';
import styles from './index.module.scss';

export const ProposalDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id, contractName } = useParams<any>();
  const blockSync = useBlockSync();

  const [votes, setVotes] = useState<
    { support: boolean; voter: string; votes: number; txs: string }[]
  >([]);

  const isConnected = useIsConnected();
  const [createdEventLoading, setCreatedEventLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null as any);
  const [votesLoading, setVotesLoading] = useState(true);
  const [data, setData] = useState<MergedProposal>(null as any);
  const { state } = useGetProposalState(data);
  const [proposalLoading, setProposalLoading] = useState(false);

  const votesForProgressPercents =
    (numberFromWei(data?.forVotes || 0) /
      (numberFromWei(data?.forVotes || 0) +
        numberFromWei(data?.againstVotes || 0))) *
    100;

  const votesAgainstProgressPercents = 100 - votesForProgressPercents;

  useEffect(() => {
    setProposalLoading(true);
    setCreatedEventLoading(true);

    const get = async () => {
      const proposal = ((await contractReader.call(contractName, 'proposals', [
        id,
      ])) as unknown) as Proposal;
      setData({ ...proposal, contractName });

      setProposalLoading(false);

      const events = await eventReader.getPastEvents(
        contractName,
        'ProposalCreated',
        { id: proposal.id },
        {
          fromBlock: proposal.startBlock - 1,
          toBlock: proposal.startBlock + 1,
        },
      );
      setCreatedEvent(events[0]);
      setCreatedEventLoading(false);
    };
    get().then().catch();
  }, [id, blockSync, contractName]);

  useEffect(() => {
    if (data?.id) {
      setVotesLoading(true);

      eventReader
        .getPastEvents(
          data.contractName,
          'VoteCast',
          { proposalId: data.id },
          { fromBlock: data.startBlock, toBlock: data.endBlock },
        )
        .then(events => {
          setVotes(
            events
              .filter(item => item.returnValues.proposalId === id)
              ?.map(({ returnValues, transactionHash }) => ({
                support: returnValues?.support,
                voter: returnValues?.voter,
                votes: returnValues?.votes,
                txs: transactionHash,
              })),
          );
          setVotesLoading(false);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), blockSync]);

  return (
    <div className="container tw-max-w-screen-xl tw-w-full tw-mx-auto tw-mb-64 tw-mt-24 tw-px-4 tw-pt-16 tw-pb-2 tw-bg-gray-1 tw-border-4 tw-border-solid tw-border-black tw-rounded-lg">
      <div className="proposap-detail">
        <div className="xl:tw-flex tw-justify-between tw-items-start">
          <div className="tw-text-2xl tw-text-white tw-font-normal tw-uppercase">
            <p className={`tw-mb-4 ${createdEventLoading && 'tw-skeleton'}`}>
              {createdEvent?.returnValues?.description.split(':')[0]}:
            </p>
            <p className={`tw-mb-0 ${createdEventLoading && 'tw-skeleton'}`}>
              {createdEvent?.returnValues?.description.split(':')[1]}
            </p>
          </div>

          <div className="tw-text-base tw-text-white tw-font-normal tw-uppercase">
            <p
              className={`tw-mb-4 tw-text-right ${
                createdEventLoading && 'tw-skeleton'
              }`}
            >
              Voting ends:{' '}
              {dateByBlocks(
                data?.startTime,
                createdEvent?.blockNumber,
                data?.endBlock,
              )}
            </p>
            <p
              className={`tw-mb-0 tw-text-right ${
                createdEventLoading && 'tw-skeleton'
              }`}
            >
              #{createdEvent?.blockNumber}
            </p>
          </div>
        </div>

        <div
          className={`tw-flex tw-justify-center tw-items-center xl:tw-mt-20 tw-mt-10 ${
            proposalLoading && 'tw-skeleton'
          }`}
        >
          <div className="tw-mr-4 tw-text-right">
            <span className="tw-text-xl tw-font-normal tw-leading-5 tw-tracking-normal">
              {(votesForProgressPercents || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
            <Tooltip2
              className={Classes.TOOLTIP2_INDICATOR}
              minimal={true}
              content={
                <p className="tw-text-white tw-text-sm tw-tracking-normal tw-mb-0">
                  {numberFromWei(data?.forVotes || 0)} votes
                </p>
              }
              placement="top"
            >
              <p className="tw-text-xl tw-font-light tw-tracking-normal tw-uppercase">
                {numberFromWei(data?.forVotes || 0)} votes
              </p>
            </Tooltip2>
          </div>
          <div className={styles.styledBar}>
            <div className={styles.progressBlue} />
            <div className={styles.progressRed} />
            {!isNaN(votesForProgressPercents) &&
              !isNaN(votesAgainstProgressPercents) && (
                <div
                  className={styles.progressCircle}
                  style={{ left: votesAgainstProgressPercents + '%' }}
                />
              )}
          </div>
          <div className="tw-ml-4">
            <span className="tw-text-xl tw-font-normal tw-leading-5 tw-tracking-normal">
              {(votesAgainstProgressPercents || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
            <Tooltip2
              className={Classes.TOOLTIP2_INDICATOR}
              minimal={true}
              content={
                <p className="tw-text-white tw-text-sm tw-tracking-normal tw-mb-0">
                  {numberFromWei(data?.againstVotes || 0)} votes
                </p>
              }
              placement="top"
            >
              <p className="tw-text-xl tw-font-light tw-tracking-normal tw-uppercase">
                {numberFromWei(data?.againstVotes || 0).toFixed(0)} votes
              </p>
            </Tooltip2>
          </div>
        </div>

        <div className="tw-bg-white tw-px-4 tw-pt-11 tw-pb-0 tw-rounded-lg">
          <button className="tw-bg-primary tw-border tw-border-black tw-text-black tw-text-sm tw-uppercase tw-px-6 tw-py-3 tw-rounded-lg tw-ml-6 tw-mb-12">
            I Understand
          </button>

          {data?.id && isConnected && state === ProposalState.Active && (
            <VoteCaster
              votesFor={data.forVotes}
              votesAgainst={data.againstVotes}
              proposalId={data.id}
              proposal={data}
              contractName={data.contractName}
            />
          )}

          <div className="xl:tw-flex tw--mx-2 tw-mt-8">
            <div className="tw-bg-gray-1 tw-rounded-lg tw-border tw-mb-4 xl:tw-mb-0 xl:tw-w-2/4 sovryn-table tw-p-4 tw-mx-2 tw-overflow-y-auto">
              <VotingTable
                items={votes}
                showSupporters={true}
                loading={votesLoading}
              />
            </div>
            <div className="tw-bg-gray-1 tw-rounded-lg tw-border xl:tw-w-2/4 sovryn-table tw-p-4 tw-mx-2 tw-overflow-y-auto">
              <VotingTable
                items={votes}
                showSupporters={false}
                loading={votesLoading}
              />
            </div>
          </div>

          <ProposalHistory proposal={data} createdEvent={createdEvent} />

          <div className="tw-bg-gray-1 tw-rounded-lg tw-px-4 tw-pb-10 tw-pt-12 tw-mt-8">
            <p className="tw-text-white tw-text-xl tw-uppercase tw-mb-4">
              {createdEvent?.returnValues?.description.split(':')[1]}
            </p>

            <div>
              <p className="tw-uppercase tw-font-inter tw-leaning-7 tw-mb-0">
                {t(translations.governance.proposalDetail.resolved)}
              </p>
              <ol className="tw-list-decimal tw-pl-5 tw-w-1/2">
                <li className="tw-font-inter tw-uppercase tw-leading-7">
                  The Origins protocol will issue up to 2,000,000 OG tokens.
                  This represent a 200,000 increase from 1,800,000 of OIP 0002.
                </li>
                <li className="tw-font-inter tw-uppercase tw-leading-7">
                  The Sovryn protocol will issue up to 2,000,000 cSOV tokens.
                  This represent a 200,000 increase from 1,800,000 of SIP 0002.
                </li>
              </ol>
            </div>

            <p className="tw-mt-24 tw-font-inter tw-text-base tw-uppercase tw-leading-7 tw-mb-0">
              sha256:{' '}
              63817f1519ef0bf4699899acd747ef7a856ddbda1bba7a20ec75eb9da89650b7
            </p>

            <div className="tw-mt-8">
              <p className="tw-uppercase tw-text-xl tw-leading-7 tw-mb-6">
                Function to invoke:{' '}
                <span
                  className={classNames({
                    'tw-skeleton tw-w-32 tw-h-4': createdEventLoading,
                  })}
                >
                  {createdEvent?.returnValues.signatures[0]}
                </span>
              </p>
              <p className="tw-font-inter tw-uppercase tw-text-base tw-leadning-7">
                <span
                  className={classNames({
                    'tw-skeleton tw-w-32 tw-h-4': createdEventLoading,
                  })}
                >
                  {createdEvent?.returnValues.calldatas[0]}
                </span>
              </p>
              <p className="tw-font-inter tw-uppercase tw-text-base tw-leadning-7">
                Contract Address:{' '}
                <span
                  className={classNames({
                    'tw-skeleton tw-w-32 tw-h-4': createdEventLoading,
                  })}
                >
                  {createdEvent?.returnValues.targets[0]}
                </span>
              </p>
              <p className="tw-font-inter tw-uppercase tw-text-base tw-leadning-7 tw-mb-6">
                Amount to transfer: 0 (r)BTC
              </p>
              <div className="tw-w-full lg:tw-w-2/3 tw-rounded-lg tw-bg-gray-3 tw-px-2 tw-pb-4 tw-pt-2">
                <img src={imgInterface} alt="Interface Reference" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TableProps {
  items: Array<{ support: boolean; voter: string; votes: number; txs: string }>;
  loading: boolean;
  showSupporters: boolean;
}

function VotingTable(props: TableProps) {
  const [items, setItems] = useState<
    { support: boolean; voter: string; votes: number; txs: string }[]
  >([]);

  useEffect(() => {
    setItems(
      (props.items || []).filter(
        item => !!item.support === props.showSupporters,
      ),
    );
  }, [props.items, props.showSupporters]);

  return (
    <table
      className={classNames(
        'w-full text-left table-small font-montserrat',
        styles.styledTable,
      )}
    >
      <thead>
        <tr className="tw-uppercase">
          <th className="tw-text-base">username</th>
          <th className="tw-text-base">Addresses</th>
          <th className="tw-text-base hidden md:table-cell">Tx Hash</th>
          <th className="tw-text-base">Votes</th>
        </tr>
      </thead>
      <tbody className="mt-5">
        {items.length > 0 && (
          <>
            {items.map((item, index) => (
              <VotingRow
                key={index}
                voter={item.voter}
                votes={numberFromWei(item.votes)}
                txs={item.txs}
                loading={props.loading}
              />
            ))}
          </>
        )}
        {items.length < 3 && (
          <>
            {Array(3 - items.length)
              .fill(0)
              .map((_, index) => (
                <VotingRow key={index} loading={props.loading} />
              ))}
          </>
        )}
      </tbody>
    </table>
  );
}

function VotingRow({
  voter,
  votes,
  txs,
  loading,
}: {
  voter?: string;
  votes?: number;
  txs?: string;
  loading?: boolean;
}) {
  const { chainId } = useContext(WalletContext);
  const { t } = useTranslation();

  const getUrl = useCallback(() => {
    return blockExplorers[currentChainId];
  }, []);

  const [url, setUrl] = useState(getUrl());

  useEffect(() => {
    setUrl(getUrl());
  }, [chainId, getUrl]);

  if (loading) {
    return (
      <tr>
        <td className="tw-skeleton tw-pl-4">--------------</td>
        <td className="tw-skeleton">--------------</td>
        <td className="tw-skeleton tw-hidden md:tw-table-cell">
          --------------
        </td>
        <td className="tw-skeleton">--------------</td>
      </tr>
    );
  }

  if (!voter && !votes) {
    return (
      <tr>
        <td className="tw-pl-4">-</td>
        <td>-</td>
        <td className="tw-hidden md:tw-table-cell">-</td>
        <td>-</td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="tw-uppercase tw-pl-4">LOREUM</td>
      <td>
        <Popover2
          minimal={true}
          placement="top"
          popoverClassName="bp3-tooltip2"
          content={
            <div className="tw-flex tw-items-center">
              <a
                href={`${url}/address/${voter?.toLocaleLowerCase()}`}
                target="_blank"
                rel="noreferrer"
                className="tw-text-gold tw-text-sm tw-tracking-normal tw-transition tw-no-underline tw-p-0 tw-m-0 tw-duration-300 hover:tw-underline hover:tw-text-gold"
              >
                {voter?.toLocaleLowerCase()}
              </a>
              <CopyToClipboard
                onCopy={() =>
                  toastSuccess(<>{t(translations.onCopy.address)}</>, 'copy')
                }
                text={voter?.toLocaleLowerCase() || '-'}
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
            {prettyTx(voter as string)}
          </p>
        </Popover2>
      </td>
      <td className="tw-hidden md:tw-table-cell">
        <Popover2
          minimal={true}
          placement="top"
          popoverClassName="bp3-tooltip2"
          content={
            <div className="tw-flex tw-items-center">
              <a
                href={`${url}/tx/${txs?.toLocaleLowerCase()}`}
                target="_blank"
                rel="noreferrer"
                className="tw-text-gold tw-text-sm tw-tracking-normal tw-transition tw-no-underline tw-p-0 tw-m-0 tw-duration-300 hover:tw-underline hover:tw-text-gold"
              >
                {txs?.toLocaleLowerCase()}
              </a>
              <CopyToClipboard
                onCopy={() =>
                  toastSuccess(<>{t(translations.onCopy.address)}</>, 'copy')
                }
                text={txs?.toLocaleLowerCase() || '-'}
              >
                <Icon
                  title="Copy"
                  icon="duplicate"
                  className="tw-text-white tw-cursor-pointer hover:tw-text-gold tw-ml-2"
                  iconSize={15}
                />
              </CopyToClipboard>
            </div>
          }
        >
          <p className="tw-uppercase tw-font-inter tw-p-0 tw-m-0 tw-duration-300 hover:tw-opacity-70 tw-transition tw-cursor-pointer">
            {prettyTx(txs as string)}
          </p>
        </Popover2>
      </td>
      <td>
        <Tooltip2
          className={Classes.TOOLTIP2_INDICATOR}
          minimal={true}
          content={
            <p className="tw-text-white tw-text-sm tw-tracking-normal">
              {votes} votes
            </p>
          }
          placement="top"
        >
          <span className="tw-font-inter">{kFormatter(votes)}</span>
        </Tooltip2>
      </td>
    </tr>
  );
}
