import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useMaintenance } from 'app/hooks/useMaintenance';
import { translations } from 'locales/i18n';
import { getContract } from 'utils/blockchain/contract-helpers';
import { weiTo4 } from 'utils/blockchain/math-helpers';
import {
  vesting_getEndDate,
  vesting_getStartDate,
} from 'utils/blockchain/requests/vesting';
import { ethGenesisAddress } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { weiToUSD } from 'utils/display-text/format';

import { Asset } from '../../../../types';
import { LoadableValue } from '../../../components/LoadableValue';
import { Modal } from '../../../components/Modal';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import { useStaking_WEIGHT_FACTOR } from '../../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { useStaking_computeWeightByDate } from '../../../hooks/staking/useStaking_computeWeightByDate';
import { useStaking_getAccumulatedFees } from '../../../hooks/staking/useStaking_getAccumulatedFees';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useCachedAssetPrice } from '../../../hooks/trading/useCachedAssetPrice';
import { useAccount } from '../../../hooks/useAccount';
import { useDollarValue } from 'app/hooks/useDollarValue';
import { WithdrawVesting } from './WithdrawVesting';
import { VestGroup } from '../types';
import { governanceToken } from 'app/constants';

interface Props {
  vestingAddress: string;
  type: VestGroup;
  onDelegate: (a: number) => void;
}

const getAssetByVestingType = (type: VestGroup) => {
  switch (type) {
    case 'genesis':
      return Asset.CSOV;
    case 'fish':
      return Asset.FISH;
    default:
      return Asset.OG;
  }
};

const getTokenContractNameByVestingType = (type: VestGroup) => {
  switch (type) {
    case 'genesis':
      return 'CSOV_token';
    case 'fish':
      return 'FISH_token';
    default:
      return 'SOV_token';
  }
};

export function VestingContract(props: Props) {
  const now = new Date();
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const {
    // [States.DELEGATE_VESTS]: delegateLocked,
    [States.WITHDRAW_VESTS]: withdrawLocked,
  } = checkMaintenances();

  const account = useAccount();
  const getStakes = useStaking_getStakes(props.vestingAddress);
  const lockedAmount = useStaking_balanceOf(props.vestingAddress);
  const dollarValue = useDollarValue(governanceToken, lockedAmount.value);
  const [stakingPeriodStart, setStakingPeriodStart] = useState('');
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();
  // const [weight, setWeight] = useState('');
  const [votingPower, setVotingPower] = useState(0);
  const [unlockDate, setUnlockDate] = useState('');
  const [vestLoading, setVestLoading] = useState(false);
  const [locked, setLocked] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const SOV = AssetsDictionary.get(Asset.SOV);
  const CSOV = AssetsDictionary.get(Asset.SOV);
  const weight = useStaking_computeWeightByDate(
    Number(unlockDate),
    Math.round(now.getTime() / 1e3),
  );

  const rbtc = useCachedAssetPrice(
    getAssetByVestingType(props.type),
    Asset.RBTC,
  );

  const tokenAddress = getContract(
    getTokenContractNameByVestingType(props.type),
  ).address;
  const currency = useStaking_getAccumulatedFees(
    props.vestingAddress,
    tokenAddress,
  );

  const rbtcValue = useMemo(() => {
    if (currency === null) return '';
    return bignumber(currency.value)
      .mul(rbtc.value)
      .div(10 ** (props.type === 'genesis' ? CSOV.decimals : SOV.decimals))
      .toFixed(0);
  }, [currency, CSOV.decimals, SOV.decimals, props.type, rbtc.value]);

  useEffect(() => {
    if (weight.loading) {
      setVotingPower(0);
    } else {
      setVotingPower(
        (Number(lockedAmount.value) * Number(weight.value)) /
          Number(WEIGHT_FACTOR.value),
      );
    }
  }, [weight, WEIGHT_FACTOR, lockedAmount]);

  useEffect(() => {
    async function getVestsList() {
      try {
        setVestLoading(true);
        Promise.all([
          vesting_getStartDate(props.vestingAddress).then(
            res => typeof res === 'string' && setStakingPeriodStart(res),
          ),
          vesting_getEndDate(props.vestingAddress).then(
            res => typeof res === 'string' && setUnlockDate(res),
          ),
        ]).then(_ => setVestLoading(false));
        setVestLoading(false);
      } catch (e) {
        console.error(e);
        setVestLoading(false);
      }
    }
    setVestLoading(false);
    if (props.vestingAddress !== ethGenesisAddress) {
      getVestsList().catch(console.error);
    }
  }, [props.vestingAddress, account]);

  useEffect(() => {
    if (unlockDate && !vestLoading && getStakes.value['dates'].length > 0) {
      setLocked(Number(unlockDate) > Math.round(new Date().getTime() / 1e3));
    }
  }, [vestLoading, unlockDate, getStakes.value]);

  return (
    <>
      {vestLoading ? (
        <tr>
          <td colSpan={7} className="skeleton" />
        </tr>
      ) : (
        <tr className="tw-text-base">
          <td className="tw-text-left tw-font-normal">
            <p
              className={`tw-m-0 tw-font-inter ${
                lockedAmount.loading && 'tw-skeleton'
              }`}
            >
              {lockedAmount.value && (
                <>
                  {weiTo4(lockedAmount.value)} {t(translations.stake.og)}
                  <br />≈{' '}
                  <LoadableValue
                    value={weiToUSD(dollarValue.value, 2)}
                    loading={dollarValue.loading}
                  />
                </>
              )}
            </p>
          </td>
          <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal tw-font-inter">
            {weiTo4(votingPower)}
          </td>
          <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
            {locked && (
              <p
                className={`tw-m-0 tw-font-inter ${
                  !unlockDate && 'tw-skeleton'
                }`}
              >
                {Math.abs(dayjs().diff(parseInt(unlockDate) * 1e3, 'days'))}{' '}
                {t(translations.stake.days)}
              </p>
            )}
          </td>
          <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
            <p
              className={`tw-m-0 tw-font-inter ${
                !stakingPeriodStart && 'tw-skeleton'
              }`}
            >
              {dayjs
                .tz(parseInt(unlockDate) * 1e3, 'UTC')
                .tz(dayjs.tz.guess())
                .format('L - HH:mm:ss')}
            </p>
          </td>
          <td className="tw-font-inter">
            <LoadableValue value={weiTo4(rbtcValue)} loading={rbtc.loading} />{' '}
            {t(translations.stake.sov)}
          </td>
          <td className="md:tw-text-left tw-hidden md:tw-table-cell">
            <div className="tw-flex tw-flex-nowrap">
              {withdrawLocked ? (
                <Tooltip
                  position="bottom"
                  hoverOpenDelay={0}
                  hoverCloseDelay={0}
                  interactionKind="hover"
                  content={<>{t(translations.maintenance.withdrawVests)}</>}
                >
                  <button
                    type="button"
                    className="tw-border tw-border-primary tw-border-solid tw-rounded-lg tw-px-4 tw-py-2 tw-text-primary tw-text-sm tw-uppercase tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-rowdies tw-bg-transparent hover:tw-bg-opacity-0 tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-transparent"
                  >
                    {t(translations.stake.actions.withdraw)}
                  </button>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  className="tw-border tw-border-primary tw-border-solid tw-rounded-lg tw-px-4 tw-py-2 tw-text-primary tw-text-sm tw-uppercase tw-tracking-normal hover:tw-text-primary hover:tw-underline tw-mr-1 xl:tw-mr-4 tw-p-0 tw-font-normal tw-font-rowdies"
                  onClick={() => setShowWithdraw(true)}
                  disabled={
                    !props.vestingAddress ||
                    props.vestingAddress === ethGenesisAddress
                  }
                >
                  {t(translations.stake.actions.withdraw)}
                </button>
              )}
            </div>
          </td>
        </tr>
      )}
      <Modal
        show={showWithdraw}
        content={
          <>
            <WithdrawVesting
              vesting={props.vestingAddress}
              onCloseModal={() => setShowWithdraw(false)}
            />
          </>
        }
      />
    </>
  );
}
