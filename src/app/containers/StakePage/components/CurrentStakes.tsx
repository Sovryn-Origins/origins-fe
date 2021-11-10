import React, { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from '../../../../types';
import dayjs from 'dayjs';
// import logoSvg from 'assets/images/tokens/sov.svg';
import { useAccount } from '../../../hooks/useAccount';
import { weiToUSD } from 'utils/display-text/format';
import { StyledTable } from './StyledTable';
import { translations } from 'locales/i18n';
import { AddressBadge } from '../../../components/AddressBadge';
import { contractReader } from 'utils/sovryn/contract-reader';
import { LoadableValue } from '../../../components/LoadableValue';
import { useTranslation } from 'react-i18next';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useCachedAssetPrice } from '../../../hooks/trading/useCachedAssetPrice';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useStaking_WEIGHT_FACTOR } from '../../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { weiTo4 } from 'utils/blockchain/math-helpers';
import { useStaking_computeWeightByDate } from '../../../hooks/staking/useStaking_computeWeightByDate';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { Tooltip, Spinner } from '@blueprintjs/core';
import type { RevertInstructionError } from 'web3-core-helpers';

interface StakeItem {
  stakedAmount: string;
  unlockDate: string;
  delegate: boolean | string | RevertInstructionError;
}

interface ICurrentStakesProps {
  onIncrease: (a: number, b: number) => void;
  onExtend: (a: number, b: number) => void;
  onUnstake: (a: string, b: number) => void;
  onDelegate: (a: number, b: number) => void;
}

export const CurrentStakes: React.FC<ICurrentStakesProps> = props => {
  const { t } = useTranslation();
  const account = useAccount();
  const { dates, stakes } = useStaking_getStakes(account).value;
  const [stakesArray, setStakesArray] = useState<StakeItem[]>();
  const [stakeLoad, setStakeLoad] = useState(false);

  useEffect(() => {
    async function getStakesEvent() {
      try {
        Promise.all(
          dates.map(
            async (value, index): Promise<StakeItem> => {
              const delegate = await contractReader
                .call('staking', 'delegates', [account, value])
                .then(res => {
                  if (res.toString().toLowerCase() !== account.toLowerCase()) {
                    return res;
                  }
                  return false;
                });
              return {
                stakedAmount: stakes[index],
                unlockDate: value,
                delegate,
              };
            },
          ),
        ).then(result => {
          setStakesArray(result);
        });
        setStakeLoad(false);
      } catch (e) {
        console.error(e);
      }
    }
    if (dates && stakes !== undefined) {
      setStakeLoad(true);
      getStakesEvent().finally(() => {
        setStakeLoad(false);
      });
    }
  }, [account, dates, stakes]);

  return (
    <>
      <p className="tw-font-semibold tw-text-xl tw-uppercase">
        {t(translations.stake.currentStakes.title)}
      </p>
      <div className="tw-bg-gray-1 tw-rounded-b tw-shadow">
        <div className="tw-sovryn-table tw-relative tw-rounded-lg tw-pt-1 tw-pb-0 tw-mb-5 tw-max-h-96 tw-overflow-y-auto">
          {stakeLoad && (
            <Spinner
              size={20}
              className="tw-absolute tw-top-4 tw-right-8 tw-text-white tw-z-index-100"
            />
          )}
          <StyledTable className="tw-w-full tw-text-sov-white">
            <thead>
              <tr>
                <th className="tw-font-rowdies tw-font-light tw-text-left tw-pl-0">
                  {t(translations.stake.currentStakes.lockedAmount)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentStakes.votingPower)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentStakes.stakingDate)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentStakes.stakingPeriod)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentStakes.unlockDate)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-left tw-hidden md:tw-table-cell tw-w-1/5">
                  {t(translations.stake.actions.title)}
                </th>
              </tr>
            </thead>
            <tbody className="tw-mt-5 tw-font-rowdies tw-text-xs">
              {!stakesArray?.length && (
                <tr key="empty">
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {t(translations.stake.nostake)}
                  </td>
                </tr>
              )}
              {stakesArray?.map(item => {
                return (
                  <AssetRow
                    item={item}
                    key={item.unlockDate}
                    onIncrease={props.onIncrease}
                    onExtend={props.onExtend}
                    onUnstake={props.onUnstake}
                    onDelegate={props.onDelegate}
                  />
                );
              })}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </>
  );
};

interface IAssetRowProps {
  item: StakeItem;
  onIncrease: (a: number, b: number) => void;
  onExtend: (a: number, b: number) => void;
  onUnstake: (a: string, b: number) => void;
  onDelegate: (a: number, b: number) => void;
}

const AssetRow: React.FC<IAssetRowProps> = ({
  item,
  onIncrease,
  onExtend,
  onUnstake,
}) => {
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.STAKING]: stakingLocked,
    [States.UNSTAKING]: unstakingLocked,
    // [States.DELEGATE_STAKES]: delegateStakesLocked,
  } = checkMaintenances();

  const now = new Date();
  const [weight, setWeight] = useState('');
  const locked = Number(item.unlockDate) > Math.round(now.getTime() / 1e3); //check if date is locked
  const stakingPeriod = Math.abs(
    dayjs().diff(dayjs(new Date(parseInt(item.unlockDate) * 1e3)), 'days'),
  );
  const [votingPower, setVotingPower] = useState(0);
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();
  const getWeight = useStaking_computeWeightByDate(
    Number(item.unlockDate),
    Math.round(now.getTime() / 1e3),
  );

  const SOV = AssetsDictionary.get(Asset.SOV);
  const dollars = useCachedAssetPrice(Asset.SOV, Asset.USDT);
  const dollarValue = bignumber(Number(item.stakedAmount))
    .mul(dollars.value)
    .div(10 ** SOV.decimals)
    .toFixed(0);
  useEffect(() => {
    setWeight(getWeight.value);
    if (Number(WEIGHT_FACTOR.value) && Number(weight)) {
      setVotingPower(
        (Number(item.stakedAmount) * Number(weight)) /
          Number(WEIGHT_FACTOR.value),
      );
    }
  }, [getWeight.value, weight, item, WEIGHT_FACTOR.value]);

  return (
    <tr>
      <td className="tw-text-left tw-font-normal">
        {weiTo4(item.stakedAmount)} {t(translations.stake.og)}
        <br />≈{' '}
        <LoadableValue
          value={weiToUSD(dollarValue)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
        {weiTo4(votingPower)}
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
        {typeof item.delegate === 'string' && (
          <AddressBadge
            txHash={item.delegate}
            startLength={6}
            className="tw-text-secondary"
          />
        )}
        {!item.delegate && (
          <p className="tw-m-0">
            {t(translations.stake.delegation.noDelegate)}
          </p>
        )}
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
        {locked && t(translations.common.unit.day, { count: stakingPeriod })}
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
        <p className="tw-m-0">
          {dayjs
            .tz(parseInt(item.unlockDate) * 1e3, 'UTC')
            .tz(dayjs.tz.guess())
            .format('L - LTS Z')}
        </p>
      </td>
      <td className="md:tw-text-left lg:tw-text-right tw-hidden md:tw-table-cell">
        <div className="tw-flex tw-flex-nowrap">
          {stakingLocked ? (
            <>
              <Tooltip
                position="bottom"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                interactionKind="hover"
                content={<>{t(translations.maintenance.staking)}</>}
              >
                <button
                  type="button"
                  className="tw-border tw-border-primary tw-border-solid tw-rounded-lg tw-px-4 tw-py-2 tw-text-primary tw-text-sm tw-uppercase tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-rowdies tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent"
                >
                  {t(translations.stake.actions.increase)}
                </button>
              </Tooltip>
              <Tooltip
                position="bottom"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                interactionKind="hover"
                content={<>{t(translations.maintenance.staking)}</>}
              >
                <button
                  type="button"
                  className="tw-border tw-border-primary tw-border-solid tw-rounded-lg tw-px-4 tw-py-2 tw-text-primary tw-text-sm tw-uppercase tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-rowdies tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent"
                >
                  {t(translations.stake.actions.extend)}
                </button>
              </Tooltip>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`tw-border tw-border-primary tw-border-solid tw-rounded-lg tw-px-4 tw-py-2 tw-text-primary tw-text-sm tw-uppercase tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-rowdies ${
                  !locked &&
                  'tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent'
                }`}
                onClick={() =>
                  onIncrease(Number(item.stakedAmount), Number(item.unlockDate))
                }
                disabled={!locked}
              >
                {t(translations.stake.actions.increase)}
              </button>
              <button
                type="button"
                className="tw-border tw-border-primary tw-border-solid tw-rounded-lg tw-px-4 tw-py-2 tw-text-primary tw-text-sm tw-uppercase tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-rowdies"
                onClick={() =>
                  onExtend(Number(item.stakedAmount), Number(item.unlockDate))
                }
              >
                {t(translations.stake.actions.extend)}
              </button>
            </>
          )}

          {unstakingLocked ? (
            <Tooltip
              position="bottom"
              hoverOpenDelay={0}
              hoverCloseDelay={0}
              interactionKind="hover"
              content={<>{t(translations.maintenance.unstaking)}</>}
            >
              <button
                type="button"
                className="tw-border tw-border-primary tw-border-solid tw-rounded-lg tw-px-4 tw-py-2 tw-text-primary tw-text-sm tw-uppercase tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-rowdies tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent"
              >
                {t(translations.stake.actions.unstake)}
              </button>
            </Tooltip>
          ) : (
            <button
              type="button"
              className="tw-border tw-border-primary tw-border-solid tw-rounded-lg tw-px-4 tw-py-2 tw-text-primary tw-text-sm tw-uppercase tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-rowdies"
              onClick={() =>
                onUnstake(item.stakedAmount, Number(item.unlockDate))
              }
            >
              {t(translations.stake.actions.unstake)}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
