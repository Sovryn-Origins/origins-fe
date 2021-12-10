import React, { useCallback, useState } from 'react';
import { Popover2 } from '@blueprintjs/popover2';
import { useIsConnected } from 'app/hooks/useAccount';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { contractWriter } from 'utils/sovryn/contract-writer';
import { useAccount } from '../../../hooks/useAccount';
import { useCacheCall } from 'app/hooks/useCacheCall';
import { kFormatter } from 'utils/helpers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { ContractName } from 'utils/types/contracts';
import { Proposal } from 'types/Proposal';
import { useStaking_getPriorVotes } from 'app/hooks/staking/useStaking_getPriorVotes';

interface Props {
  proposalId: number;
  contractName: ContractName;
  votesAgainst: string;
  proposal: Proposal;
  votesFor: string;
}

export function VoteCaster(props: Props) {
  const isConnected = useIsConnected();
  const account = useAccount();

  const receipt = useCacheCall(
    props.contractName || 'governorAdmin',
    'getReceipt',
    props.proposalId,
    account,
  );

  const votesCurrent = useStaking_getPriorVotes(
    account,
    props.proposal.startBlock,
    Number(props.proposal.startTime),
  );

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleVote = useCallback(
    async (support: boolean) => {
      setLoading(true);
      const tx = await contractWriter.send(
        props.contractName || 'governorAdmin',
        'castVote',
        [props.proposalId, support, { from: account }],
        // { type: 'vote' },
      );
      setTxHash(tx as string);
      setLoading(false);
    },
    [account, props.proposalId, props.contractName],
  );

  if (!isConnected || receipt.loading) {
    return <></>;
  }

  if (txHash) {
    return (
      <div className="tw-text-white tw-px-3 tw-py-2 tw-w-2/3 tw-mt-2">
        <div className="tw-text-xs tw-text-gray-500">Vote Cast</div>
        <div className={`tw-truncate tw-text-sm ${loading && 'tw-skeleton'}`}>
          <LinkToExplorer
            txHash={txHash}
            className="tw-text-white hover:tw-text-gold"
          />
        </div>
      </div>
    );
  }

  if ((receipt?.value as any)?.hasVoted) {
    const d = receipt.value as any;
    return (
      <div className="xl:tw-flex tw-items-center tw-justify-between tw-mt-20">
        {d.support ? (
          <div className="tw-tracking-normal vote__success tw-rounded-xl tw-bg-turquoise tw-bg-opacity-30 tw-mb-4 xl:tw-mb-0 tw-border xl:tw-px-12 tw-px-3 tw-py-3 tw-text-center xl:tw-text-lg tw-text-sm tw-text-turquoise tw-border-turquoise">
            You Voted {kFormatter(numberFromWei(d.votes))} for
          </div>
        ) : (
          <div className="tw-tracking-normal vote__danger tw-rounded-xl tw-bg-red tw-bg-opacity-30 tw-border xl:tw-px-12 tw-px-3 tw-py-3 tw-text-center xl:tw-text-lg tw-text-sm tw-text-red tw-border-red">
            You Voted {kFormatter(numberFromWei(d.votes))} against
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="xl:tw-flex tw-items-center tw-justify-between tw-mt-10">
      <Popover2
        interactionKind="hover"
        minimal={true}
        placement="top"
        popoverClassName="bp3-tooltip2"
        content={
          <>
            You will cast {kFormatter(numberFromWei(votesCurrent.value || 0))}{' '}
            votes for
          </>
        }
      >
        <p className="tw-text-gold tw-p-0 tw-m-0 tw-duration-300 hover:tw-opacity-70 tw-transition tw-cursor-pointer">
          <button
            className="tw-tracking-normal vote__success tw-w-full xl:tw-w-auto tw-bg-turquoise focus:tw-bg-opacity-50 hover:tw-bg-opacity-40 focus:tw-outline-none tw-transition tw-duration-500 tw-ease-in-out tw-bg-opacity-30 tw-rounded-lg tw-mb-4 xl:tw-mb-0 tw-border xl:tw-px-12 tw-px-3 tw-py-3 tw-text-center xl:tw-text-lg tw-text-sm tw-text-turquoise tw-text-black tw-uppercase tw-border-turquoise"
            type="button"
            onClick={() => handleVote(true)}
          >
            Vote For
          </button>
        </p>
      </Popover2>
      <Popover2
        interactionKind="hover"
        minimal={true}
        placement="top"
        popoverClassName="bp3-tooltip2"
        content={
          <>
            You will cast {kFormatter(numberFromWei(votesCurrent.value || 0))}{' '}
            votes against
          </>
        }
      >
        <p className="tw-text-gold tw-p-0 tw-m-0 tw-duration-300 hover:tw-opacity-70 tw-transition tw-cursor-pointer">
          <button
            className="tw-tracking-normal vote__danger tw-w-full xl:tw-w-auto tw-bg-red focus:tw-bg-opacity-50 hover:tw-bg-opacity-40 focus:tw-outline-none tw-transition tw-duration-500 tw-ease-in-out tw-bg-opacity-30 tw-rounded-lg tw-border xl:tw-px-12 tw-px-3 tw-py-3 tw-text-center xl:tw-text-lg tw-text-sm tw-text-black tw-uppercase tw-text-red tw-border-red"
            type="button"
            onClick={() => handleVote(false)}
          >
            Vote Against
          </button>
        </p>
      </Popover2>
    </div>
  );
}
