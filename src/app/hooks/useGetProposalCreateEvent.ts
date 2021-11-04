import { EventData } from 'web3-eth-contract';
import { ProposalCreatedEvent } from 'types/Proposal';
import { eventReader } from 'utils/sovryn/event-reader';
import { useCallback, useEffect, useState } from 'react';
import { MergedProposal } from './useProposalList';

interface StateStatus {
  event: EventData;
  value: ProposalCreatedEvent;
  loading: boolean;
}

export function useGetProposalCreateEvent(proposal: MergedProposal) {
  const getEvent = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const events = await eventReader.getPastEvents(
      proposal.contractName,
      'ProposalCreated',
      { id: proposal.id },
      {
        fromBlock: proposal.startBlock - 1,
        toBlock: proposal.endBlock,
      },
    );
    if (events.length) {
      const event = events[0];
      return {
        value: event.returnValues,
        event: event,
        loading: false,
      };
    }
    return {
      event: null as any,
      value: null as any,
      loading: false,
    };
  }, [proposal]);

  const [state, setState] = useState<StateStatus>({
    event: null as any,
    value: null as any,
    loading: true,
  });

  useEffect(() => {
    if (proposal.id) {
      getEvent().then(setState);
    }
  }, [proposal, setState, getEvent]);

  return state;
}
