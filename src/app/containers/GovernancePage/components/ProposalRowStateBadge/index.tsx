import React from 'react';
import { getStatus, ProposalState } from 'types/Proposal';
import styles from './index.module.scss';

const getStateClass = (state: ProposalState) => {
  switch (state) {
    case ProposalState.Succeeded:
    case ProposalState.Queued:
    case ProposalState.Executed:
      return 'proposal-state__active';
    case ProposalState.Canceled:
    case ProposalState.Defeated:
    case ProposalState.Expired:
    case ProposalState.Active:
      return 'proposal-state__failed';
    case ProposalState.Pending:
      return '';
  }
};

interface Props {
  state: ProposalState;
}

export function ProposalRowStateBadge({ state }: Props) {
  return (
    <div className={styles.styledDiv}>
      <div
        className={`proposal-state font-thin tracking-normal font-montserrat ${getStateClass(
          state,
        )}`}
      >
        {getStatus(state)}
      </div>
    </div>
  );
}
