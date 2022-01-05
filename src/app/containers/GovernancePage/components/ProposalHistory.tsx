import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { EventData } from 'web3-eth-contract';

import { translations } from 'locales/i18n';
import { dateByBlocks, prettyTx } from 'utils/helpers';
import { toastSuccess } from 'utils/toaster';
import { Proposal } from 'types/Proposal';

interface Props {
  proposal: Proposal;
  createdEvent: EventData;
}

export const ProposalHistory: React.FC<Props> = props => {
  const { t } = useTranslation();
  return (
    <div className="tw-bg-gray-1 tw-px-4 tw-pt-7 tw-pb-9 tw-flex tw-justify-between tw-rounded-lg tw-mt-6">
      <div className="tw-flex tw-justify-between">
        <div className="tw-font-inter tw-text-trade-long tw-text-base tw-uppercase tw-leading-30px">
          {t(translations.governance.proposalDetail.proposedBy)}:
        </div>
        <div className="tw-ml-4">
          <p className="tw-font-inter">
            {props.proposal?.proposer ? (
              <Popover2
                minimal={true}
                placement="top"
                popoverClassName="bp3-tooltip2"
                content={
                  <div className="tw-flex tw-items-center">
                    <p className="tw-text-primary tw-text-sm tw-tracking-normal tw-mb-0">
                      {props.proposal?.proposer || '0x00000000000000000'}
                    </p>
                    <CopyToClipboard
                      onCopy={() =>
                        toastSuccess(
                          <>{t(translations.onCopy.address)}</>,
                          'copy',
                        )
                      }
                      text={props.proposal?.proposer}
                    >
                      <Icon
                        title="Copy"
                        icon="duplicate"
                        className="tw-text-white tw-cursor-pointer hover:tw-text-primary tw-ml-2"
                        iconSize={15}
                      />
                    </CopyToClipboard>
                  </div>
                }
              >
                <p className="tw-text-white tw-text-base tw-leading-30px tw-font-inter tw-tracking-normal tw-cursor-pointer tw-duration-300 hover:tw-opacity-70 tw-transition">
                  {prettyTx(props.proposal?.proposer) || '0x00000000000000000'}
                </p>
              </Popover2>
            ) : (
              <p className="tw-skeleton tw-w-32 tw-h-4"></p>
            )}
          </p>
        </div>
      </div>

      <div className="tw-flex tw-justify-between">
        <div className="tw-font-inter tw-text-trade-long tw-text-base tw-uppercase tw-leading-30px">
          {t(translations.governance.proposalDetail.proposedOn)}:
        </div>
        <div className="tw-ml-4">
          {props.proposal && props.createdEvent ? (
            <>
              <p className="tw-font-inter tw-mb-0 tw-leading-30px">
                {dateByBlocks(
                  props.proposal.startTime,
                  props.createdEvent?.blockNumber,
                  props.createdEvent.blockNumber,
                )}
              </p>
              <p className="tw-font-inter tw-mb-0 tw-leading-30px">
                #{props.createdEvent.blockNumber}
              </p>
            </>
          ) : (
            <>
              <p className="tw-skeleton tw-w-32 tw-h-4"></p>
              <p className="tw-skeleton tw-w-32 tw-h-4"></p>
            </>
          )}
        </div>
      </div>

      <div className="tw-flex tw-justify-between">
        <div className="tw-font-inter tw-text-trade-long tw-text-base tw-uppercase tw-leading-30px">
          {t(translations.governance.proposalDetail.deadline)}:
        </div>
        <div className="tw-ml-4">
          {props.proposal ? (
            <>
              <p className="tw-font-inter tw-mb-0 tw-leading-30px">
                {dateByBlocks(
                  props.proposal.startTime,
                  props.createdEvent?.blockNumber,
                  props.proposal.endBlock,
                )}
              </p>
              <p className="tw-font-inter tw-mb-0 tw-leading-30px">
                #{props.proposal.endBlock}
              </p>
            </>
          ) : (
            <>
              <p className="tw-skeleton tw-w-32 tw-h-4"></p>
              <p className="tw-skeleton tw-w-32 tw-h-4"></p>
            </>
          )}
        </div>
      </div>

      <div>
        <button className="tw-bg-primary tw-px-6 tw-py-3 tw-rounded-lg tw-text-black tw-text-sm tw-uppercase tw-leading-30px">
          Verify On Github
        </button>
      </div>
    </div>
  );
};
