import React, { useCallback, useState } from 'react';
import { Popover2 } from '@blueprintjs/popover2';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
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
  const { t } = useTranslation();
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
        [props.proposalId, support],
      );
      setTxHash(tx as string);
      setLoading(false);
    },
    [props.proposalId, props.contractName],
  );

  if (!isConnected || receipt.loading) {
    return <></>;
  }

  if (txHash) {
    return (
      <div className="tw-px-3 tw-py-2 tw-w-2/3">
        <div className="tw-text-lg tw-uppercase tw-text-gray-3 ">
          {t(translations.governance.proposalDetail.voteCaster.voteCast)}
        </div>
        <div className={`tw-truncate tw-text-base ${loading && 'tw-skeleton'}`}>
          <LinkToExplorer
            txHash={txHash}
            className="tw-text-primary hover:tw-text-primary"
          />
        </div>
      </div>
    );
  }

  if ((receipt?.value as any)?.hasVoted) {
    const d = receipt.value as any;
    return (
      <div className="xl:tw-flex tw-items-center tw-justify-between">
        {d.support ? (
          <div className="tw-tracking-normal tw-rounded-lg tw-bg-trade-long tw-mb-4 xl:tw-mb-0 xl:tw-px-12 tw-px-3 tw-py-3 tw-text-center xl:tw-text-lg tw-text-sm tw-text-white">
            {t(translations.governance.proposalDetail.voteCaster.youVotedFor, {
              votes: kFormatter(numberFromWei(d.votes)),
            })}
          </div>
        ) : (
          <div className="tw-tracking-normal tw-rounded-lg tw-bg-error xl:tw-px-12 tw-px-3 tw-py-3 tw-text-center xl:tw-text-lg tw-text-sm tw-text-red tw-border-red">
            {t(
              translations.governance.proposalDetail.voteCaster.youVotedAgainst,
              {
                votes: kFormatter(numberFromWei(d.votes)),
              },
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="xl:tw-flex tw-items-center tw-justify-between">
      <Popover2
        interactionKind="hover"
        minimal={true}
        placement="top"
        popoverClassName="bp3-tooltip2"
        content={
          <span className="tw-font-inter">
            {t(
              translations.governance.proposalDetail.voteCaster
                .youWillCastVotesFor,
              { votes: kFormatter(numberFromWei(votesCurrent.value || 0)) },
            )}
          </span>
        }
      >
        <p className="tw-p-0 tw-m-0 tw-duration-300 hover:tw-opacity-70 tw-transition tw-cursor-pointer">
          <button
            className="tw-tracking-normal tw-w-full xl:tw-w-auto tw-transition tw-duration-500 tw-ease-in-out
              hover:tw-bg-opacity-90
              focus:tw-bg-opacity-50 focus:tw-outline-none
              tw-bg-trade-long tw-rounded-lg tw-mb-4 xl:tw-mb-0 xl:tw-px-12 tw-px-3 tw-py-3
              tw-text-center tw-text-sm tw-text-white tw-uppercase"
            type="button"
            onClick={() => handleVote(true)}
          >
            {t(translations.governance.proposalDetail.voteCaster.voteFor)}
          </button>
        </p>
      </Popover2>
      <Popover2
        interactionKind="hover"
        minimal={true}
        placement="top"
        popoverClassName="bp3-tooltip2"
        content={
          <span className="tw-font-inter">
            {t(
              translations.governance.proposalDetail.voteCaster
                .youWillCastVotesAgainst,
              { votes: kFormatter(numberFromWei(votesCurrent.value || 0)) },
            )}
          </span>
        }
      >
        <p className="tw-p-0 tw-m-0 tw-duration-300 hover:tw-opacity-70 tw-transition tw-cursor-pointer">
          <button
            className="tw-tracking-normal tw-w-full xl:tw-w-auto tw-transition tw-duration-500 tw-ease-in-out
              hover:tw-bg-opacity-90
              focus:tw-bg-opacity-50 focus:tw-outline-none
              tw-bg-error tw-rounded-lg xl:tw-px-12 tw-px-3 tw-py-3
              tw-text-center tw-text-sm tw-text-white tw-uppercase"
            type="button"
            onClick={() => handleVote(false)}
          >
            {t(translations.governance.proposalDetail.voteCaster.voteAgainst)}
          </button>
        </p>
      </Popover2>
    </div>
  );
}
