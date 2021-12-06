import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { handleNumberInput } from 'utils/helpers';
import { toWei, fromWei } from 'utils/blockchain/math-helpers';
import { weiToNumberFormat, weiToUSD } from 'utils/display-text/format';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { useAccount } from 'app/hooks/useAccount';
import { useDollarValueOg } from 'app/hooks/useDollarValueOg';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { ethGenesisAddress, discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { AvailableBalance } from '../../../components/AvailableBalance';
import { LoadableValue } from 'app/components/LoadableValue';
import { Asset } from 'types/asset';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  currentStakedAmount: string;
  timestamp?: number;
  onChangeAmount: (value: string) => void;
  ogBalance: string;
  balanceOf: CacheCallResponse;
  isValid: boolean;
  votePower?: number;
  onCloseModal: () => void;
}

export function IncreaseStakeForm(props: Props) {
  const { t } = useTranslation();
  const [addAmount, setAddAmount] = useState('0');
  const account = useAccount();
  const weiAmount = useWeiAmount(props.currentStakedAmount);
  const dollarValue = useDollarValueOg(weiAmount);
  const addAmountDollarValue = useDollarValueOg(toWei(addAmount));
  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = checkMaintenance(States.STAKING);
  const [initialStep, setInitialStep] = useState(true);
  const txConf = {
    gas: 450000,
  };

  const handleChangeAddAmount = useCallback(
    addValue => {
      setAddAmount(addValue);
      props.onChangeAmount(
        bignumber(props.currentStakedAmount).add(addValue).toString(),
      );
    },
    [props],
  );

  useEffect(() => {
    //setting the max value for staking by default
    // if (initialStep) props.onChangeAmount(fromWei(props.ogBalance));
    setInitialStep(false);
  }, [props, initialStep]);

  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.increase.title)}
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 tw-tracking-normal">
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
            <div>
              <label className="tw-block tw-font-rowdies tw-font-light tw-text-xl tw-uppercase tw-leading-7 tw-text-white tw-text-center">
                {t(translations.stake.increase.currentlyStaked)}:
              </label>
              <div className="tw-h-36 tw-bg-gray-3 tw-rounded-lg tw-p-8 tw-mt-3 lg:tw-mt-6">
                <div className="tw-flex tw-items-center tw-justify-center tw-font-rowdies tw-text-3xl tw-uppercase tw-text-white">
                  <p className="tw-mr-2 tw-mb-0">
                    {weiToNumberFormat(weiAmount, 3)}
                  </p>
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
                {t(translations.stake.increase.newVotingPower)}:
              </label>
              <div className="tw-h-36 tw-bg-gray-3 tw-rounded-lg tw-p-8 tw-mt-3 lg:tw-mt-6">
                <p className="tw-mb-0 tw-mt-4 tw-text-3xl tw-uppercase tw-text-white tw-text-center">
                  {weiToNumberFormat(props.votePower, 3)}
                </p>
              </div>
            </div>
          </div>

          <div className="md:tw-px-9 tw-max-w-xl tw-mx-auto">
            <label
              className="tw-leading-4 tw-block tw-text-sov-white tw-text-xl tw-text-center tw-font-light tw-font-rowdies tw-uppercase tw-mb-4 tw-mt-12"
              htmlFor="amountAdd"
            >
              {t(translations.stake.increase.amountToAdd)}:
            </label>
            <div className="tw-max-w-xl tw-flex tw-items-center tw-justify-center tw-mx-auto tw-bg-white tw-rounded-lg tw-text-black tw-text-xl tw-uppercase tw-font-light tw-py-4 tw-px-6">
              <div className="tw-mr-4 tw-font-rowdies">
                <input
                  className="tw-w-28 tw-mr-2 tw-text-left tw-font-rowdies"
                  id="amountAdd"
                  type="text"
                  maxLength={15}
                  value={weiToNumberFormat(toWei(addAmount), 3)}
                  onChange={e => handleChangeAddAmount(handleNumberInput(e))}
                />
                {t(translations.stake.og)}
              </div>
              <div className="tw-font-rowdies tw-flex tw-items-center tw-justify-center">
                <span className="tw-pr-2">≈</span>
                <LoadableValue
                  loading={addAmountDollarValue.loading}
                  value={weiToUSD(addAmountDollarValue.value, 2)
                    ?.replace('USD', '')
                    .trim()}
                />
                <span className="tw-pl-2">USD</span>
              </div>
            </div>

            <div className="tw-flex tw-justify-center tw-mt-4">
              <AvailableBalance
                className="tw-text-base tw-font-light tw-font-rowdies tw-text-white tw-uppercase"
                asset={Asset.OG}
                decimals={4}
              />
              <div className="tw-ml-1 tw-text-base tw-font-light tw-font-rowdies">
                {t(translations.stake.og)}
              </div>
            </div>

            <div className="tw-flex tw-justify-between tw-rounded tw-mt-4 tw-mb-2">
              <div
                onClick={() =>
                  handleChangeAddAmount(fromWei(Number(props.ogBalance) * 0.25))
                }
                className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-primary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-3 tw-text-center tw-text-xl tw-text-primary tw-tracking-tighter tw-bg-gray-3 tw-rounded-lg"
              >
                25%
              </div>
              <div
                onClick={() =>
                  handleChangeAddAmount(fromWei(Number(props.ogBalance) * 0.5))
                }
                className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-primary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-3 tw-text-center tw-text-xl tw-text-primary tw-tracking-tighter tw-bg-gray-3 tw-rounded-lg"
              >
                50%
              </div>
              <div
                onClick={() =>
                  handleChangeAddAmount(fromWei(Number(props.ogBalance) * 0.75))
                }
                className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-primary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-3 tw-text-center tw-text-xl tw-text-primary tw-tracking-tighter tw-bg-gray-3 tw-rounded-lg"
              >
                75%
              </div>
              <div
                onClick={() => handleChangeAddAmount(fromWei(props.ogBalance))}
                className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-primary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-3 tw-text-center tw-text-xl tw-text-primary tw-tracking-tighter tw-bg-gray-3 tw-rounded-lg"
              >
                100%
              </div>
            </div>

            <div className="tw-flex tw-justify-center">
              <TxFeeCalculator
                args={[
                  Number(props.amount).toFixed(0).toString(),
                  props.timestamp,
                  account,
                  ethGenesisAddress,
                ]}
                txConfig={txConf}
                methodName="stake"
                contractName="staking"
              />
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
              className={`tw-uppercase tw-text-white tw-bg-trade-long tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
                (!props.isValid || stakingLocked) &&
                'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
              }`}
              disabled={!props.isValid || stakingLocked}
            >
              {t(translations.stake.actions.addToStake)}
            </button>
            <button
              type="button"
              onClick={() => props.onCloseModal()}
              className="tw-border tw-border-trade-long tw-rounded-lg tw-text-trade-long tw-uppercase tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-trade-long hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
            >
              {t(translations.stake.actions.cancel)}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
