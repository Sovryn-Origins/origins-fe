import React, { FormEvent, useCallback, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { handleNumberInput } from 'utils/helpers';
import { numberFromWei, toWei } from 'utils/blockchain/math-helpers';
import { CacheCallResponse } from 'app/hooks/useCacheCall';
import { contractReader } from 'utils/sovryn/contract-reader';
import { useAccount } from 'app/hooks/useAccount';
import { weiToNumberFormat } from 'utils/display-text/format';
import { WithdrawConfirmationForm } from './WithdrawConfimationForm';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  withdrawAmount: string;
  until: number;
  onChangeAmount: (value: string) => void;
  balanceOf: CacheCallResponse;
  isValid: boolean;
  votePower?: number;
  onCloseModal: () => void;
}

export function WithdrawForm(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const unstakingLocked = checkMaintenance(States.UNSTAKING);
  const [forfeitWithdraw, setForfeitWithdraw] = useState<number>(0);
  const [forfeitPercent, setForfeitPercent] = useState<number>(0);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [withdrawFormConfirmation, setWithdrawFormConfirmation] = useState(
    false,
  );

  const getEvent = useCallback(
    async amount => {
      setLoadingWithdraw(true);
      await contractReader
        .call(
          'staking',
          'getWithdrawAmounts',
          [toWei(amount), Number(props.until)],
          account,
        )
        .then(res => {
          setForfeitWithdraw(res[1]);
          setForfeitPercent(
            Number(((Number(res[1]) / Number(toWei(amount))) * 100).toFixed(1)),
          );
          setLoadingWithdraw(false);
        })
        .catch(error => {
          setLoadingWithdraw(false);
          console.log('forfeit error', error);
          return false;
        });
    },
    [account, props.until],
  );

  return (
    <>
      <form onSubmit={props.handleSubmit}>
        {withdrawFormConfirmation ? (
          <WithdrawConfirmationForm
            forfeit={forfeitWithdraw}
            until={props.until}
            onCloseModal={() => props.onCloseModal()}
          />
        ) : (
          <>
            <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
              {t(translations.stake.withdraw.title)}
            </h3>
            <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
                <div>
                  <label className="tw-block tw-font-rowdies tw-font-light tw-text-xl tw-uppercase tw-leading-7 tw-text-white tw-text-center">
                    {t(translations.stake.withdraw.amountCurrentlyStaked)}
                  </label>
                  <div className="tw-h-36 tw-bg-gray-3 tw-rounded-lg tw-p-8 tw-mt-3 lg:tw-mt-6">
                    <div className="tw-flex tw-items-center tw-font-rowdies tw-text-3xl tw-uppercase tw-text-white">
                      <div className="tw-mr-2">
                        {weiToNumberFormat(toWei(props.amount), 6)}
                      </div>
                      <span>OG</span>
                    </div>
                    <p className="tw-mb-0 tw-mt-2 tw-text-2xl tw-uppercase tw-text-white">
                      ≈ 0.00 USD
                    </p>
                  </div>
                </div>

                <div className="tw-mt-6 lg:tw-mt-0">
                  <label className="tw-block tw-font-rowdies tw-font-light tw-text-xl tw-uppercase tw-leading-7 tw-text-white tw-text-center">
                    {t(translations.stake.withdraw.votingPower)}
                  </label>
                  <div className="tw-h-36 tw-bg-gray-3 tw-rounded-lg tw-p-8 tw-mt-3 lg:tw-mt-6">
                    <p className="tw-mb-0 tw-mt-4 tw-text-3xl tw-uppercase tw-text-white tw-text-center">
                      {numberFromWei(props.votePower)}
                    </p>
                  </div>
                </div>
              </div>

              <label
                className="tw-leading-4 tw-block tw-text-sov-white tw-text-xl tw-text-center tw-font-light tw-font-rowdies tw-uppercase tw-mb-4 tw-mt-12"
                htmlFor="amountAdd"
              >
                {t(translations.stake.withdraw.amountToUnstake)}:
              </label>
              <div className="tw-bg-white tw-rounded-lg tw-text-black tw-text-xl tw-uppercase tw-font-light tw-flex tw-justify-center tw-py-4 tw-px-6">
                <div className="tw-mr-4 tw-font-rowdies">
                  <input
                    className="tw-mr-2 tw-text-right tw-font-rowdies"
                    id="amountAdd"
                    type="text"
                    value={weiToNumberFormat(toWei(props.withdrawAmount), 6)}
                    onChange={e => {
                      props.onChangeAmount(handleNumberInput(e));
                      getEvent(handleNumberInput(e).toString());
                    }}
                  />
                  {t(translations.stake.og)}
                </div>
                <div className="tw-font-rowdies">≈ 0.00 USD</div>
              </div>

              <div className="tw-flex tw-justify-between tw-rounded tw-mt-4 tw-mb-2">
                <div
                  onClick={() => {
                    let num = Number(props.amount) / 4;
                    props.onChangeAmount(num.toString());
                    getEvent(num.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-primary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-3 tw-text-center tw-text-xl tw-text-primary tw-tracking-tighter tw-bg-gray-3 tw-rounded-lg"
                >
                  25%
                </div>
                <div
                  onClick={() => {
                    let num = Number(props.amount) / 2;
                    props.onChangeAmount(num.toString());
                    getEvent(num.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-primary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-3 tw-text-center tw-text-xl tw-text-primary tw-tracking-tighter tw-bg-gray-3 tw-rounded-lg"
                >
                  50%
                </div>
                <div
                  onClick={() => {
                    let num = (Number(props.amount) / 4) * 3;
                    props.onChangeAmount(num.toString());
                    getEvent(num.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-primary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-3 tw-text-center tw-text-xl tw-text-primary tw-tracking-tighter tw-bg-gray-3 tw-rounded-lg"
                >
                  75%
                </div>
                <div
                  onClick={() => {
                    props.onChangeAmount(props.amount);
                    getEvent(props.amount.toString());
                  }}
                  className="tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-primary hover:tw-bg-opacity-30 tw-w-1/5 tw-py-3 tw-text-center tw-text-xl tw-text-primary tw-tracking-tighter tw-bg-gray-3 tw-rounded-lg"
                >
                  100%
                </div>
              </div>
              {Number(props.until) > Math.round(new Date().getTime() / 1e3) && (
                <>
                  <label
                    className="tw-block tw-text-sov-white tw-text-xl tw-uppercase tw-text-center tw-font-rowdies tw-font-light tw-mb-2 tw-mt-8"
                    htmlFor="unstake"
                  >
                    {t(translations.stake.withdraw.forfeit)}:
                  </label>
                  <div className="tw-flex tw-space-x-4">
                    <input
                      readOnly
                      className={`tw-border tw-border-gray-3 tw-border-opacity-100 tw-border-solid tw-bg-white tw-text-gray-1 tw-appearance-none tw-text-xl tw-font-light tw-font-rowdies tw-text-center tw-rounded-lg tw-w-full tw-py-4 tw-px-6 tw-bg-transparent tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline ${
                        loadingWithdraw && 'tw-skeleton'
                      }`}
                      id="unstake"
                      type="text"
                      placeholder="0"
                      value={
                        forfeitPercent +
                        '% ≈ ' +
                        numberFromWei(forfeitWithdraw).toFixed(2) +
                        ' SOV'
                      }
                    />
                  </div>
                </>
              )}

              <div className="tw-flex tw-justify-center">
                <TxFeeCalculator
                  args={[
                    toWei(props.withdrawAmount),
                    Number(props.until),
                    account,
                  ]}
                  methodName="withdraw"
                  contractName="staking"
                />
              </div>
            </div>
            {unstakingLocked && (
              <ErrorBadge
                content={
                  <Trans
                    i18nKey={translations.maintenance.unstakingModal}
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
              {Number(props.until) > Math.round(new Date().getTime() / 1e3) ? (
                <button
                  type="button"
                  className={`tw-uppercase tw-w-full tw-text-white tw-bg-trade-long tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
                    (!props.isValid ||
                      loadingWithdraw ||
                      forfeitWithdraw === 0 ||
                      unstakingLocked) &&
                    'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
                  }`}
                  disabled={
                    !props.isValid ||
                    loadingWithdraw ||
                    forfeitWithdraw === 0 ||
                    unstakingLocked
                  }
                  onClick={e => {
                    e.preventDefault();
                    setWithdrawFormConfirmation(true);
                  }}
                >
                  {t(translations.stake.actions.confirm)}
                </button>
              ) : (
                <button
                  type="submit"
                  className={`tw-uppercase tw-w-full tw-text-white tw-bg-trade-long tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
                    (!props.isValid || unstakingLocked) &&
                    'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
                  }`}
                  disabled={!props.isValid || unstakingLocked}
                >
                  {t(translations.stake.actions.confirm)}
                </button>
              )}
              <button
                type="button"
                onClick={() => props.onCloseModal()}
                className="tw-border tw-border-trade-long tw-rounded-lg tw-text-trade-long tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-trade-long hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
              >
                {t(translations.stake.actions.cancel)}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
