import React, { FormEvent } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useDollarValueOg } from 'app/hooks/useDollarValueOg';
import { TxFeeCalculator } from 'app/components/TxFeeCalculator';
import { StakingDateSelector } from 'app/components/StakingDateSelector';
import { LoadableValue } from 'app/components/LoadableValue';
import { useAccount } from 'app/hooks/useAccount';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { ethGenesisAddress, discordInvite } from 'utils/classifiers';
import { weiToUSD } from 'utils/display-text/format';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { StretchInput } from 'app/components/Form/StretchInput';
import { Asset } from 'types/asset';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeAmount: (value: string) => void;
  onChangeTimestamp: (value: number) => void;
  ogBalance: string;
  isValid: boolean;
  kickoff: CacheCallResponse;
  stakes: string[];
  votePower?: number;
  onCloseModal: () => void;
}

export function StakeForm(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const weiAmount = useWeiAmount(props.amount);
  const dollarValue = useDollarValueOg(weiAmount);
  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = checkMaintenance(States.STAKING);
  const txConf = {
    gas: 450000,
  };
  // const formatAmount = useMemo(() => weiToNumberFormat(weiAmount, 3), [weiAmount]);

  return (
    <div>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.staking.title)}
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 tw-tracking-normal">
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
            <div>
              <label className="tw-block tw-font-rowdies tw-font-light tw-text-xl tw-uppercase tw-leading-7 tw-text-white tw-text-center">
                {t(translations.stake.staking.amountToStake)}:
              </label>
              <div className="tw-h-36 tw-bg-gray-3 tw-rounded-lg tw-p-8 tw-mt-3 lg:tw-mt-6">
                <div className="tw-flex tw-items-center tw-justify-center tw-font-rowdies tw-text-3xl tw-uppercase tw-text-white">
                  <StretchInput
                    className="tw-mr-2"
                    inputClassName="tw-bg-transparent"
                    type="text"
                    placeholder="0"
                    value={props.amount}
                    onChange={e => props.onChangeAmount(e.target.value)}
                  />
                  <span>OG</span>
                </div>
                <div className="tw-flex tw-items-center tw-justify-center tw-mb-0 tw-mt-2 tw-text-2xl tw-uppercase tw-text-white tw-text-center">
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
                {t(translations.stake.staking.votingPowerReceived)}:
              </label>
              <div className="tw-h-36 tw-bg-gray-3 tw-rounded-lg tw-p-8 tw-mt-3 lg:tw-mt-6">
                <p className="tw-mb-0 tw-mt-4 tw-text-3xl tw-uppercase tw-text-white tw-text-center">
                  {numberFromWei(props.votePower).toFixed()}
                </p>
              </div>
            </div>
          </div>

          <div className="tw-flex tw-text-xs tw-mt-4">
            <AvailableBalance
              className="tw-font-rowdies tw-text-base tw-leading-8 tw-uppercase tw-text-white"
              asset={Asset.OG}
              decimals={4}
            />
            <div className="tw-ml-1 tw-font-rowdies tw-text-base tw-leading-8 tw-uppercase tw-text-white">
              {t(translations.stake.og)}
            </div>
          </div>

          <StakingDateSelector
            className="tw-mb-6"
            title="Select new date"
            kickoffTs={Number(props.kickoff.value)}
            value={props.timestamp}
            onClick={value => props.onChangeTimestamp(value)}
            stakes={props.stakes}
          />

          <TxFeeCalculator
            args={[
              Math.floor(Number(props.amount)).toFixed(0).toString(),
              props.timestamp,
              account,
              ethGenesisAddress,
            ]}
            txConfig={txConf}
            methodName="stake"
            contractName="staking"
          />
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
            className={`tw-uppercase tw-w-full tw-text-white tw-bg-trade-long tw-bg-opacity-1 tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
              (!props.isValid || stakingLocked) &&
              'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
            }`}
            disabled={!props.isValid || stakingLocked}
          >
            {t(translations.stake.actions.confirm)}
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
    </div>
  );
}
