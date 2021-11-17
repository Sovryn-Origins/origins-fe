/**
 *
 * ProposalRow
 *
 */

import React, { useEffect, useState } from 'react';
import { ProposalState } from 'types/Proposal';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import Linkify from 'react-linkify';
import { useGetProposalCreateEvent } from 'app/hooks/useGetProposalCreateEvent';
import { useGetProposalState } from 'app/hooks/useGetProposalState';
import { ProposalStatusBadge } from '../ProposalStatusBadge';
import { ProposalRowStateBadge } from '../ProposalRowStateBadge';
import { dateByBlocks } from 'utils/helpers';
import { MergedProposal } from 'app/hooks/useProposalList';
import { bignumber } from 'mathjs';
import styles from './index.module.scss';

interface Props {
  proposal: MergedProposal;
}

export function ProposalRow({ proposal }: Props) {
  const {
    loading: loadingCreated,
    value: created,
    event,
  } = useGetProposalCreateEvent(proposal);
  const { loading: loadingState, state } = useGetProposalState(proposal);
  const location = useLocation();
  const match = useRouteMatch();
  const [wasLoaded, setWasLoaded] = useState(false);

  useEffect(() => {
    if (!wasLoaded && !(loadingState || loadingCreated || !created || !state)) {
      setWasLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingState, loadingState, created, state, wasLoaded]);

  if (!created) return null;

  if (loadingState || loadingCreated || !created || !state) {
    return (
      <>
        <tr>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
        </tr>
      </>
    );
  }

  let blue = 50;
  if (proposal.forVotes !== proposal.againstVotes) {
    blue = Math.min(
      Math.round(
        bignumber(proposal.forVotes)
          .div(bignumber(proposal.forVotes).add(proposal.againstVotes))
          .mul(100)
          .toNumber() || 0,
      ),
    );
  }
  const red = 100 - blue;

  return (
    <>
      <tr key={proposal.id}>
        {state === ProposalState.Active ? (
          <>
            <td className="tw-font-inter tw-max-w-sm tw-truncate tw-pr-4 tw-pl-5">
              <Linkify>
                {String(proposal.id).padStart(3, '0')} • {created?.description}
              </Linkify>
            </td>
            <td className="tw-text-left tw-hidden xl:tw-table-cell tw-truncate tw-pr-4 tw-pl-4">
              #{proposal.startBlock}
            </td>
            <td className="tw-text-left tw-hidden xl:tw-table-cell tw-pr-4">
              <div className="tw-flex tw-flex-row tw-space-x-4 tw-items-center">
                <ProposalStatusBadge state={state} />
                <div className={styles.styledBar}>
                  <div
                    className="progress__blue"
                    style={{ width: `${blue}%` }}
                  />
                  <div className="progress__red" style={{ width: `${red}%` }} />
                </div>
              </div>
            </td>
            <td className="tw-text-left tw-hidden xl:tw-table-cell tw-truncate tw-pr-4">
              {dateByBlocks(
                proposal.startTime,
                proposal.startBlock,
                proposal.endBlock,
              )}{' '}
              - #{proposal.endBlock}
            </td>
            <td className="tw-text-left">
              <Link
                to={{
                  pathname: `/proposals/${proposal.id}/${proposal.contractName}`,
                  state: { background: location },
                }}
                className="tw-text-gold hover:tw-text-gold hover:tw-underline tw-font-thin tw-font-rowdies tw-tracking-normal tw-uppercase"
              >
                View Proposal
              </Link>
            </td>
          </>
        ) : (
          <>
            <td className="tw-font-montserrat tw-max-w-sm tw-truncate tw-pr-4 tw-pl-5">
              <Linkify>
                {String(proposal.id).padStart(3, '0')} • {created?.description}
              </Linkify>
            </td>
            <td className="tw-text-left tw-hidden xl:tw-table-cell tw-tracking-normal tw-truncate tw-pr-4">
              #{proposal.startBlock}
            </td>
            <td className="tw-text-left tw-hidden xl:tw-table-cell tw-pr-4">
              <ProposalRowStateBadge state={state} />
            </td>
            <td className="tw-text-left tw-hidden xl:tw-table-cell tw-tracking-normal tw-truncate tw-pr-4">
              {dateByBlocks(
                proposal.startTime,
                event?.blockNumber,
                proposal.endBlock,
              )}
            </td>
            <td className="tw-text-left">
              <Link
                to={{
                  pathname: `${match.url}/proposal/${proposal.id}/${proposal.contractName}`,
                  state: { background: location },
                }}
                className="tw-text-gold hover:tw-text-gold hover:tw-underline tw-font-thin tw-font-rowdies tw-tracking-normal tw-uppercase"
              >
                View Proposal
              </Link>
            </td>
          </>
        )}
      </tr>
    </>
  );
}
