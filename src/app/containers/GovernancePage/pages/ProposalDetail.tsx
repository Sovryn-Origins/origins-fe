import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { WalletContext } from '@sovryn/react-wallet';
import { Icon } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { Scrollbars } from 'react-custom-scrollbars';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Linkify from 'react-linkify';
import { Classes, Tooltip2, Popover2 } from '@blueprintjs/popover2';

import { useAccount, useBlockSync, useIsConnected } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { toastSuccess } from 'utils/toaster';
import { useGetProposalState } from 'app/hooks/useGetProposalState';
import { MergedProposal } from 'app/hooks/useProposalList';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { contractReader } from 'utils/sovryn/contract-reader';
import { eventReader } from 'utils/sovryn/event-reader';
import { dateByBlocks, kFormatter, prettyTx } from 'utils/helpers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { Proposal, ProposalState } from '../types';
import { blockExplorers, currentChainId } from 'utils/classifiers';
import { VoteCaster } from '../components/VoteCaster';
import { ProposalActions } from '../components/ProposalActions';
import { ProposalHistory } from '../components/ProposalHistory';
import {
  governance_queue,
  governance_execute,
  governance_cancel,
} from '../functions';
import styles from './index.module.scss';

// const governor = 'governorAdmin';

// const initRow = {
//   target: '',
//   value: '',
//   signature: '',
//   calldata: '',
// };

export const ProposalDetail: React.FC = () => {
  const { id, contractName } = useParams<any>();
  const account = useAccount();
  const blockSync = useBlockSync();

  const { value: guardian } = useCacheCallWithValue(
    contractName,
    'guardian',
    '',
  );

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
  const isGaurdian = account.toLowerCase() === guardian.toLowerCase();

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

  const governanceQueue = async () => {
    try {
      await governance_queue(contractName, data.id, account);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const governanceExecute = async () => {
    try {
      await governance_execute(contractName, data.id, account);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const governanceCancel = async () => {
    try {
      await governance_cancel(contractName, data.id, account);
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <div className="container tw-max-w-screen-xl tw-w-full tw-mx-auto tw-mb-64 tw-mt-24 tw-px-6 tw-py-8 tw-bg-gray-1 tw-border-4 tw-border-solid tw-border-black tw-rounded-lg">
      <div className="proposap-detail">
        <div className="xl:tw-flex tw-justify-between tw-items-start">
          <h3
            className={`proposal__title tw-font-semibold tw-break-all tw-w-2/3 tw-mt-2 tw-overflow-hidden tw-max-h-24 tw-leading-12 tw-truncate ${
              createdEventLoading && 'tw-skeleton'
            }`}
          >
            <Linkify>
              {createdEvent?.returnValues?.description || 'No description'}
            </Linkify>
          </h3>
          <div className="tw-text-right tw-font-semibold">
            <p
              className={`tw-mt-2 tw-text-lg tw-leading-6 tw-tracking-normal ${
                createdEventLoading && 'skeleton'
              }`}
            >
              Voting ends:{' '}
              {dateByBlocks(
                data?.startTime,
                createdEvent?.blockNumber,
                data?.endBlock,
              )}
            </p>
          </div>
        </div>
        <div
          className={`tw-flex tw-justify-center xl:tw-mt-20 tw-mt-10
        ${proposalLoading && 'skeleton'}`}
        >
          <div className="tw-mr-10 tw-text-right">
            <span className="xl:tw-text-3xl tw-text-xl tw-font-semibold tw-leading-5 tw-tracking-normal">
              {(votesForProgressPercents || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
            {/* <Tooltip2
              className={Classes.TOOLTIP2_INDICATOR}
              minimal={true}
              content={
                <p className="tw-text-white tw-text-sm tw-tracking-normal">
                  {numberFromWei(data?.forVotes || 0)} votes
                </p>
              }
              placement="top"
            >
              <p className="xl:tw-text-lg tw-text-sm tw-font-light tw-tracking-normal">
                {kFormatter(numberFromWei(data?.forVotes || 0))} votes
              </p>
            </Tooltip2> */}
          </div>
          <div className={styles.styledBar}>
            <div className="progress__blue" />
            <div className="progress__red" />
            {!isNaN(votesForProgressPercents) &&
              !isNaN(votesAgainstProgressPercents) && (
                <div
                  className="progress__circle"
                  style={{ left: votesAgainstProgressPercents + '%' }}
                />
              )}
          </div>
          <div className="tw-ml-10">
            <span className="xl:tw-text-3xl tw-text-xl tw-font-semibold tw-leading-5 tw-tracking-normal">
              {(votesAgainstProgressPercents || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
            {/* <Tooltip2
              className={Classes.TOOLTIP2_INDICATOR}
              minimal={true}
              content={
                <p className="text-white text-sm tracking-normal">
                  {numberFromWei(data?.againstVotes || 0)} votes
                </p>
              }
              placement="top"
            >
              <p className="xl:text-lg text-sm font-light tracking-normal">
                {kFormatter(numberFromWei(data?.againstVotes || 0))} votes
              </p>
            </Tooltip2> */}
          </div>
        </div>

        {data?.id &&
          isConnected &&
          state !== ProposalState.Active &&
          !proposalLoading && (
            <div className="xl:tw-flex tw-items-center tw-justify-between tw-mt-16">
              <div className="tw-tracking-normal vote__success tw-rounded-xl tw-bg-opacity-30 tw-bg-turquoise tw-mb-4 xl:tw-mb-0 tw-border xl:tw-px-12 tw-px-3 tw-py-3 tw-text-center xl:tw-text-lg tw-text-sm tw-text-turquoise tw-border-turquoise">
                {kFormatter(numberFromWei(data?.forVotes || 0))} Votes For
              </div>
              <div className="tw-tracking-normal vote__danger tw-rounded-xl tw-bg-opacity-30 tw-bg-red tw-border xl:tw-px-12 tw-px-3 tw-py-3 tw-text-center xl:tw-text-lg tw-text-sm tw-text-white tw-border-red">
                {kFormatter(numberFromWei(data?.againstVotes || 0))} Votes
                Against
              </div>
            </div>
          )}

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
          <Scrollbars
            className="tw-rounded-2xl tw-border tw-mb-4 xl:tw-mb-0 xl:tw-w-2/4 sovryn-table tw-pt-1 tw-pb-3 tw-pr-3 tw-pl-3 tw-mx-2 tw-overflow-y-auto tw-h-48"
            style={{ height: 195 }}
          >
            <div className="tw-mx-4">
              <VotingTable
                items={votes}
                showSupporters={true}
                loading={votesLoading}
              />
            </div>
          </Scrollbars>
          <Scrollbars
            className="tw-rounded-2xl tw-border xl:tw-w-2/4 sovryn-table tw-pt-1 tw-pb-3 tw-pr-3 tw-pl-3 tw-mx-2 tw-overflow-y-auto tw-h-48"
            style={{ height: 195 }}
          >
            <div className="mx-4">
              <VotingTable
                items={votes}
                showSupporters={false}
                loading={votesLoading}
              />
            </div>
          </Scrollbars>
        </div>
        <div className="xl:tw-flex tw-mt-10">
          <div className="xl:tw-w-3/4 tw-w-full tw-mb-5 xl:tw-mb-0">
            <div className="tw-bg-gray-100 xl:tw-py-8 tw-py-4 xl:tw-px-20 tw-px-4 tw-rounded-2xl">
              {/*<h4 className="mb-8 font-semibold xl:text-2xl text-xl tracking-widest">*/}
              {/*  {createdEvent.description}*/}
              {/*</h4>*/}
              <p className="tw-break-all tw-mt-8">
                <Linkify>
                  {createdEvent?.returnValues?.description || 'No description'}
                </Linkify>
              </p>
              {/* <p className="text-sm">Resolved:</p>
            <ol className="list-decimal text-sm pl-5 leading-6">
              <li>
                The Sovryn protocol will issue up to 2,000,000 cSOV tokens.
                This represent a 200,000 increase from 1,800,000 of SIP 0002.
              </li>
              <li>
                cSOV tokens will provide a pre-reservation mechanism for
                community members to stake funds in order to receive the right
                to SOV tokens, on a 1:1 basis with cSOV tokens subject to a
                vote by SOV holders.
              </li>
              <li>
                These cSOV tokens will be distributed to stakers who have the
                early community NFTS.
              </li>
              <li>The required stake per cSOV token will be 2500 Satoshis</li>
              <li>
                Any cSOV tokens converted to SOV will be subject to 10 months
                linear vesting (with 1/10 of the total amount released on a
                monthly basis) from the date of the end of the SOV public
                sale.
              </li>
              <li>
                Any cSOV holder that does not actively convert their cSOV to
                SOV within a two month period after TGE will be able to
                receive their staked funds.
              </li>
            </ol>
            <p className="font-semibold text-md mt-5 break-words">
              sha256:{' '}
              63817f1519ef0bf4699899acd747ef7a856ddbda1bba7a20ec75eb9da89650b7
            </p> */}
              <ProposalActions
                proposalId={data?.id}
                contractName={data?.contractName}
              />
            </div>
          </div>
          <div className="xl:tw-w-1/4 tw-w-full tw-px-6 tw-pr-0">
            <ProposalHistory proposal={data} createdEvent={createdEvent} />
            {/* <a
            href="#!"
            className="border rounded-xl bg-gold bg-opacity-10 text-center hover:bg-opacity-40 transition duration-500 ease-in-out text-gold hover:text-gold hover:no-underline text-lg px-6 xl:inline-block block py-3 border-gold"
          >
            Verify on Github
          </a> */}
            <p
              className={`tw-text-gold tw-text-sm tw-tracking-normal tw-leading-3 tw-pt-3 ${
                proposalLoading && 'tw-skeleton'
              }`}
            >
              Proposal id: {String(data?.id).padStart(3, '0')}
            </p>

            <div className="tw-flex tw-mt-5 tw-items-center tw-justify-around">
              {data?.id &&
                isConnected &&
                state !== ProposalState.Executed &&
                isGaurdian && (
                  <button
                    onClick={governanceCancel}
                    type="button"
                    className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-no-underline hover:tw-bg-gold hover:tw-bg-opacity-30 tw-mx-1 tw-px-5 tw-py-2 tw-bordered tw-transition tw-duration-500 tw-ease-in-out tw-rounded-full tw-border tw-border-gold tw-text-sm tw-font-light tw-font-montserrat"
                  >
                    Cancel
                  </button>
                )}
              {data?.id && isConnected && state === ProposalState.Succeeded && (
                <button
                  onClick={governanceQueue}
                  type="button"
                  className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-no-underline hover:tw-bg-gold hover:tw-bg-opacity-30 tw-mx-1 tw-px-5 tw-py-2 tw-bordered tw-transition tw-duration-500 tw-ease-in-out tw-rounded-full tw-border tw-border-gold tw-text-sm tw-font-light tw-font-montserrat"
                >
                  Queue
                </button>
              )}
              {data?.id &&
                isConnected &&
                state === ProposalState.Queued &&
                data.eta <= new Date().getTime() / 1000 && (
                  <button
                    onClick={governanceExecute}
                    type="button"
                    className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-no-underline hover:tw-bg-gold hover:tw-bg-opacity-30 tw-mx-1 tw-px-5 tw-py-2 tw-bordered tw-transition tw-duration-500 tw-ease-in-out tw-rounded-full tw-border tw-border-gold tw-text-sm tw-font-light tw-font-montserrat"
                  >
                    Execute
                  </button>
                )}
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
      (props.items || []).filter(item => item.support === props.showSupporters),
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
        <tr>
          <th>Addresses</th>
          <th className="hidden md:table-cell">Tx Hash</th>
          <th>Votes</th>
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
        <td className="skeleton">--------------</td>
        <td className="skeleton tw-hidden md:tw-table-cell">--------------</td>
        <td className="skeleton">--------------</td>
      </tr>
    );
  }

  if (!voter && !votes) {
    return (
      <tr>
        <td>-</td>
        <td className="tw-hidden md:tw-table-cell">-</td>
        <td>-</td>
      </tr>
    );
  }

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
          <p className="tw-text-gold tw-p-0 tw-m-0 tw-duration-300 hover:tw-opacity-70 tw-transition tw-cursor-pointer">
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
          <p className="tw-text-gold tw-p-0 tw-m-0 tw-duration-300 hover:tw-opacity-70 tw-transition tw-cursor-pointer">
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
          {kFormatter(votes)}
        </Tooltip2>
      </td>
    </tr>
  );
}
