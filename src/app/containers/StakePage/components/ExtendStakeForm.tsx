import React, { FormEvent } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberFromWei, toWei } from 'utils/blockchain/math-helpers';
import { Asset } from 'types';
import { weiToNumberFormat } from 'utils/display-text/format';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { useDollarValue } from 'app/hooks/useDollarValue';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { StakingDateSelector } from '../../../components/StakingDateSelector';
import { TxFeeCalculator } from 'app/components/TxFeeCalculator';
import { discordInvite } from 'utils/classifiers';
import { weiToUSD } from 'utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { LoadableValue } from 'app/components/LoadableValue';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeTimestamp: (value: number) => void;
  ogBalance: string;
  isOgBalanceLoading: boolean;
  isValid: boolean;
  kickoff: CacheCallResponse;
  balanceOf: CacheCallResponse;
  stakes: string[];
  votePower?: number;
  prevExtend: number;
  onCloseModal: () => void;
}

export function ExtendStakeForm(props: Props) {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const weiAmount = useWeiAmount(props.amount);
  const dollarValue = useDollarValue(Asset.OG, weiAmount);
  const stakingLocked = checkMaintenance(States.STAKING);
  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.extending.title)}
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 tw-tracking-normal">
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
            <div>
              <label className="tw-block tw-font-rowdies tw-font-light tw-text-xl tw-uppercase tw-leading-7 tw-text-white tw-text-center">
                {t(translations.stake.extending.amountCurrentlyStaked)}:
              </label>
              <div className="tw-h-36 tw-bg-gray-3 tw-rounded-lg tw-p-8 tw-mt-3 lg:tw-mt-6">
                <div className="tw-flex tw-items-center tw-justify-center tw-font-rowdies tw-text-3xl tw-uppercase tw-text-white">
                  <div className="tw-mr-2">
                    {weiToNumberFormat(toWei(props.amount), 3)}
                  </div>{' '}
                  OG
                </div>
                <div className="tw-flex tw-items-center tw-justify-center tw-mb-0 tw-mt-2 tw-text-2xl tw-uppercase tw-text-white">
                  <span className="tw-pr-2">≈</span>
                  <LoadableValue
                    loading={dollarValue.loading}
                    value={weiToUSD(dollarValue.value, 2)
                      ?.replace('USD', '')
                      .trim()}
                  />
                  <span className="tw-pl-2">USD</span>
                </div>
              </div>
            </div>

            <div className="tw-mt-6 lg:tw-mt-0">
              <label className="tw-block tw-font-rowdies tw-font-light tw-text-xl tw-uppercase tw-leading-7 tw-text-white tw-text-center">
                {t(translations.stake.extending.newVotingPower)}:
              </label>
              <div className="tw-h-36 tw-bg-gray-3 tw-rounded-lg tw-p-8 tw-mt-3 lg:tw-mt-6">
                <p className="tw-mb-0 tw-mt-4 tw-text-3xl tw-uppercase tw-text-white tw-text-center">
                  {numberFromWei(props.votePower)}
                </p>
              </div>
            </div>
          </div>

          <StakingDateSelector
            title="Select new date"
            kickoffTs={Number(props.kickoff.value)}
            value={props.timestamp}
            onClick={value => props.onChangeTimestamp(value)}
            stakes={props.stakes}
            prevExtend={props.prevExtend}
            delegate={false}
          />

          <div className="tw-flex tw-justify-center">
            <TxFeeCalculator
              args={[Number(props.prevExtend), Number(props.timestamp)]}
              methodName="extendStakingDuration"
              contractName="staking"
            />
          </div>
          <div className="tw-text-gray-1 tw-text-xs tw-mt-3 tw-hidden">
            {t(translations.stake.extending.balance)}:{' '}
            <span
              className={`tw-text-gray-6 ${
                props.isOgBalanceLoading && 'tw-skeleton'
              }`}
            >
              {numberFromWei(props.ogBalance).toLocaleString()}
            </span>{' '}
            {t(translations.stake.sov)}
            {Number(props.votePower) > 0 && (
              <>
                <br />
                {t(translations.stake.extending.willAddedVote)}: +{' '}
                {numberFromWei(props.votePower).toLocaleString()}
              </>
            )}
          </div>
        </div>
        {stakingLocked && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.stakingModal}
                components={[
                  <a
                    href={discordInvite}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                  >
                    x
                  </a>,
                ]}
              />
            }
          />
        )}
        <div className="tw-grid tw-grid-rows-1 tw-grid-flow-col tw-gap-4">
          <button
            type="submit"
            className={`tw-uppercase tw-w-full tw-text-white tw-bg-trade-long tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
              (!props.isValid || stakingLocked) &&
              'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
            }`}
            disabled={!props.isValid || stakingLocked}
          >
            {t(translations.stake.actions.extendStake)}
          </button>
          <button
            type="button"
            onClick={() => props.onCloseModal()}
            className="tw-border tw-border-trade-long tw-rounded-lg tw-text-trade-long tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-trade-long hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
          >
            {t(translations.stake.actions.cancel)}
          </button>
        </div>
      </form>
    </>
  );
}
