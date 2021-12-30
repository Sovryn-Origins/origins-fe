import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Rsk3 from '@rsksmart/rsk3';
import { Spinner, Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { weiTo4, toWei, fromWei } from 'utils/blockchain/math-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import {
  staking_allowance,
  staking_approve,
} from 'utils/blockchain/requests/staking';
import { Asset } from '../../../types';
import { Modal } from '../../components/Modal';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CurrentVests } from './components/CurrentVests';
import { CurrentStakes } from './components/CurrentStakes';
import { DelegateForm } from './components/DelegateForm';
import { ExtendStakeForm } from './components/ExtendStakeForm';
import { IncreaseStakeForm } from './components/IncreaseStakeForm';
import { WithdrawForm } from './components/WithdrawForm';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { HistoryEventsTable } from './components/HistoryEventsTable';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { useStaking_kickoffTs } from '../../hooks/staking/useStaking_kickoffTs';
import { useStaking_balanceOf } from '../../hooks/staking/useStaking_balanceOf';
import { useStaking_WEIGHT_FACTOR } from '../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { useStaking_getCurrentVotes } from '../../hooks/staking/useStaking_getCurrentVotes';
import { useStaking_computeWeightByDate } from '../../hooks/staking/useStaking_computeWeightByDate';
import { StakeForm } from './components/StakeForm';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useStakeIncrease } from '../../hooks/staking/useStakeIncrease';
import { useStakeStake } from '../../hooks/staking/useStakeStake';
import { useStakeWithdraw } from '../../hooks/staking/useStakeWithdraw';
import { useStakeExtend } from '../../hooks/staking/useStakeExtend';
import { useStakeDelegate } from '../../hooks/staking/useStakeDelegate';
import { useVestingDelegate } from '../../hooks/staking/useVestingDelegate';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ConnectWalletWarning } from 'app/components/ConnectWalletWarning';
import styles from './index.module.scss';

const now = new Date();

export const StakePage: React.FC = () => {
  const { t } = useTranslation();

  const isConnected = useIsConnected();
  if (isConnected) {
    return <InnerStakePage />;
  }
  return (
    <>
      <Helmet>
        <title>{t(translations.stake.title)}</title>
        <meta name="description" content={t(translations.stake.meta)} />
      </Helmet>
      <Header />
      <main>
        <div className="tw-tracking-normal">
          <div className="tw-container tw-mx-auto tw-px-6 tw-mb-44 tw-pt-2">
            <ConnectWalletWarning
              className="tw-mt-16"
              title={t(translations.stake.connectWalletWarning.title)}
              description={t(translations.stake.connectWalletWarning.alert)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const InnerStakePage: React.FC = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const [amount, setAmount] = useState('0');
  const [stakedAmount, setStakedAmount] = useState('');
  const weiAmount = useWeiAmount(amount);
  const [weight, setWeight] = useState('');
  const kickoffTs = useStaking_kickoffTs();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { dates } = useStaking_getStakes(account).value;
  const balanceOf = useStaking_balanceOf(account);
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();
  const [stakeAmount, setStakeAmount] = useState('0');
  const [stakeForm, setStakeForm] = useState(false);
  const [extendForm, setExtendForm] = useState(false);
  const [until, setUntil] = useState(0);
  const [delegateForm, setDelegateForm] = useState(false);
  const [isStakeDelegate, setIsStakeDelegate] = useState(true);
  const [withdrawForm, setWithdrawForm] = useState(false);
  const [increaseForm, setIncreaseForm] = useState(false);
  const voteBalance = useStaking_getCurrentVotes(account);
  const [lockDate, setLockDate] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [vestingContractAddress, setVestingContractAddress] = useState('');
  const [votingPower, setVotingPower] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const weiWithdrawAmount = useWeiAmount(withdrawAmount);
  const [prevTimestamp, setPrevTimestamp] = useState<number | undefined>(
    undefined,
  );
  const getWeight = useStaking_computeWeightByDate(
    Number(lockDate),
    Math.round(now.getTime() / 1e3),
  );
  const { value: ogBalance, loading: ogBalanceLoading } = useAssetBalanceOf(
    Asset.OG,
  );
  const { increase, ...increaseTx } = useStakeIncrease();
  const { stake, ...stakeTx } = useStakeStake();
  const { extend, ...extendTx } = useStakeExtend();
  const { withdraw, ...withdrawTx } = useStakeWithdraw();
  const { delegate, ...delegateTx } = useStakeDelegate();
  const {
    delegate: vestingDelegate,
    ...vestingDelegateTx
  } = useVestingDelegate(vestingContractAddress);

  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = checkMaintenance(States.STAKING);

  useEffect(() => {
    if (
      timestamp &&
      weiAmount &&
      (stakeForm || increaseForm || extendForm || withdrawForm)
    ) {
      setLockDate(timestamp);
      setWeight(getWeight.value);
      setVotingPower(
        (Number(weiAmount) * Number(weight)) / Number(WEIGHT_FACTOR.value),
      );
    } else {
      setLockDate(timestamp);
      setWeight('');
      setVotingPower(0);
    }
  }, [
    getWeight.value,
    weight,
    stakeForm,
    WEIGHT_FACTOR.value,
    weiAmount,
    timestamp,
    increaseForm,
    extendForm,
    withdrawForm,
  ]);

  //Form Validations
  const validateStakeForm = useCallback(() => {
    if (loading || stakeTx.loading) return false;
    const num = toWei(amount);
    if (!num || bignumber(num).lessThanOrEqualTo(0)) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return bignumber(num).lessThanOrEqualTo(ogBalance);
  }, [loading, amount, ogBalance, timestamp, stakeTx.loading]);

  const validateDelegateForm = useCallback(() => {
    if (loading) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return Rsk3.utils.isAddress(address.toLowerCase());
  }, [loading, address, timestamp]);

  const validateIncreaseForm = useCallback(() => {
    if (loading || increaseTx.loading) return false;
    const num = bignumber(toWei(amount)).sub(toWei(stakedAmount));
    if (!num || bignumber(num).lessThanOrEqualTo(0)) return false;
    return bignumber(num).lessThanOrEqualTo(ogBalance);
  }, [loading, amount, stakedAmount, ogBalance, increaseTx.loading]);

  const validateWithdrawForm = useCallback(
    amount => {
      if (loading) return false;
      const num = toWei(withdrawAmount);
      if (!num || bignumber(num).lessThanOrEqualTo(0)) return false;
      return bignumber(num).lessThanOrEqualTo(toWei(amount));
    },
    [withdrawAmount, loading],
  );
  const validateExtendTimeForm = useCallback(() => {
    if (loading || extendTx.loading || timestamp === prevTimestamp)
      return false;
    return timestamp >= Math.round(now.getTime() / 1e3);
  }, [loading, timestamp, extendTx.loading, prevTimestamp]);

  //Submit Forms
  const handleWithdrawSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!withdrawTx.loading) {
        if (bignumber(weiWithdrawAmount).greaterThan(stakeAmount)) {
          withdraw(stakeAmount.toString(), until);
        } else {
          withdraw(weiWithdrawAmount, until);
        }
      }
      setLoading(false);
      setWithdrawForm(!withdrawForm);
    },
    [
      weiWithdrawAmount,
      until,
      withdrawForm,
      stakeAmount,
      withdrawTx.loading,
      withdraw,
    ],
  );

  const handleStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        setLoading(true);
        let nonce = await contractReader.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        if (bignumber(allowance).lessThan(weiAmount)) {
          await staking_approve(ogBalance);
          nonce += 1;
        }
        if (!stakeTx.loading) {
          stake(weiAmount, timestamp + 3600, nonce);
          setStakeForm(!stakeForm);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [
      weiAmount,
      ogBalance,
      account,
      timestamp,
      stakeForm,
      stakeTx.loading,
      stake,
    ],
  );

  const handleDelegateSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!delegateTx.loading) {
        delegate(address.toLowerCase(), Number(timestamp));
        setLoading(false);
        setDelegateForm(!delegateForm);
      }
    },
    [address, timestamp, delegateForm, delegateTx.loading, delegate],
  );

  const handleVestingDelegateSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!vestingDelegateTx.loading) {
        vestingDelegate(address.toLowerCase());
        setLoading(false);
        setDelegateForm(!delegateForm);
      }
    },
    [vestingDelegateTx.loading, vestingDelegate, address, delegateForm],
  );

  const handleIncreaseStakeSubmit = useCallback(
    async e => {
      try {
        e.preventDefault();
        setLoading(true);
        const increaseAmount = bignumber(weiAmount)
          .sub(toWei(stakedAmount))
          .toFixed();
        let nonce = await contractReader.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        if (bignumber(allowance).lessThan(increaseAmount)) {
          await staking_approve(increaseAmount);
          nonce += 1;
        }
        if (!increaseTx.loading) {
          increase(increaseAmount, timestamp, nonce);
          setLoading(false);
          setIncreaseForm(!increaseForm);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [
      weiAmount,
      account,
      timestamp,
      increaseForm,
      increaseTx.loading,
      increase,
      stakedAmount,
    ],
  );

  const handleExtendTimeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!extendTx.loading) {
        extend(Number(prevTimestamp), Number(timestamp) + 3600);
        setLoading(false);
        setExtendForm(!extendForm);
      }
    },
    [prevTimestamp, timestamp, extendForm, extendTx.loading, extend],
  );

  const onDelegate = useCallback((a, b) => {
    setTimestamp(b);
    setIsStakeDelegate(true);
    setAmount(fromWei(a));
    setDelegateForm(delegateForm => !delegateForm);
  }, []);
  const onExtend = useCallback((a, b) => {
    setPrevTimestamp(b);
    setTimestamp(b);
    setAmount(fromWei(a));
    setStakeForm(false);
    setExtendForm(true);
    setIncreaseForm(false);
    setWithdrawForm(false);
  }, []);
  const onIncrease = useCallback((a, b) => {
    setTimestamp(b);
    setAmount(fromWei(a));
    setStakedAmount(fromWei(a));
    setUntil(b);
    setStakeForm(false);
    setExtendForm(false);
    setIncreaseForm(true);
    setWithdrawForm(false);
  }, []);
  const onUnstake = useCallback((a, b) => {
    setAmount(fromWei(a));
    setWithdrawAmount('0');
    setStakeAmount(a);
    setTimestamp(b);
    setUntil(b);
    setStakeForm(false);
    setExtendForm(false);
    setIncreaseForm(false);
    setWithdrawForm(true);
  }, []);

  const onDelegateVest = useCallback((timestamp, contractAddress) => {
    setTimestamp(timestamp);
    setIsStakeDelegate(false);
    setVestingContractAddress(contractAddress);
    setDelegateForm(delegateForm => !delegateForm);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t(translations.stake.title)}</title>
      </Helmet>
      <Header />
      <main>
        <div className="tw-tracking-normal">
          <div className="tw-container tw-mx-auto tw-px-6 tw-mb-44">
            <h2
              className="tw-text-black tw-mb-6 tw-pl-10 tw-text-center tw-text-xl tw-font-rowdies tw-font-semibold tw-uppercase"
              style={{ marginTop: '4.5rem', lineHeight: '30px' }}
            >
              {t(translations.stake.title)}
            </h2>
            <div className="tw-max-w-screen-lg tw-mx-auto lg:tw-flex tw-items-stretch tw-justify-around tw-mt-2 tw-py-8 tw-px-4 tw-bg-gray-1 tw-border-solid tw-border-4 tw-border-black tw-rounded-lg">
              <div className="tw-staking-box tw-bg-gray-3 tw-p-8 tw-pb-6 tw-mb-5 tw-rounded-lg lg:tw-w-1/2 lg:tw-mx-2 lg:tw-mb-0">
                <p className="tw-text-base tw--mt-1 tw-mb-0 tw-font-rowdies tw-uppercase">
                  {t(translations.stake.total)}
                </p>
                <div className={styles.cardTitle}>
                  {weiTo4(balanceOf.value)} OG
                  {balanceOf.loading && (
                    <Spinner size={20} className="tw-inline-block tw-m-2" />
                  )}
                </div>
                <Modal
                  className="lg:tw-max-w-3xl"
                  show={stakeForm}
                  content={
                    <>
                      <StakeForm
                        handleSubmit={handleStakeSubmit}
                        amount={amount}
                        timestamp={timestamp}
                        onChangeAmount={e => setAmount(e)}
                        onChangeTimestamp={e => setTimestamp(e)}
                        ogBalance={ogBalance}
                        isValid={validateStakeForm()}
                        kickoff={kickoffTs}
                        stakes={dates}
                        votePower={votingPower}
                        onCloseModal={() => setStakeForm(!stakeForm)}
                      />
                    </>
                  }
                />
                {ogBalance !== '0' && !stakingLocked ? (
                  <button
                    type="button"
                    className={styles.addNewStake}
                    onClick={() => {
                      setTimestamp(0);
                      setAmount('0');
                      setStakeForm(!stakeForm);
                      setExtendForm(false);
                      setIncreaseForm(false);
                      setWithdrawForm(false);
                    }}
                  >
                    {t(translations.stake.addStake)}
                  </button>
                ) : (
                  <Tooltip
                    position="bottom"
                    hoverOpenDelay={0}
                    hoverCloseDelay={0}
                    interactionKind="hover"
                    content={
                      <>
                        {stakingLocked
                          ? t(translations.maintenance.staking)
                          : t(translations.stake.noUnlockedOg)}
                      </>
                    }
                  >
                    <button
                      type="button"
                      className="tw-bg-primary tw-font-normal tw-bg-opacity-10 hover:tw-text-primary tw-transition tw-duration-500 tw-ease-in-out tw-text-lg tw-text-primary tw-py-3 tw-px-8 tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-primary tw-rounded-xl tw-bg-transparent tw-opacity-50 tw-cursor-not-allowed"
                    >
                      {t(translations.stake.addStake)}
                    </button>
                  </Tooltip>
                )}
              </div>
              <div className="tw-staking-box tw-bg-gray-3 tw-p-8 tw-pb-6 tw-mb-5 tw-rounded-lg lg:tw-w-1/2 lg:tw-mx-2 lg:tw-mb-0">
                <p className="tw-text-base tw--mt-1 tw-font-rowdies tw-uppercase">
                  {t(translations.stake.votingPower)}
                </p>
                <div className={styles.cardTitle}>
                  {weiTo4(voteBalance.value)}
                  {voteBalance.loading && (
                    <Spinner size={20} className="tw-inline-block tw-m-2" />
                  )}
                </div>
                <div className="tw-flex tw-flex-col tw-items-start">
                  <div className="tw-bg-primary tw-font-normal tw-bg-opacity-40 tw-hover:text-primary tw-focus:outline-none tw-focus:bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-px-8 tw-py-3 tw-text-sm tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-primary tw-rounded-lg hover:tw-no-underline tw-no-underline tw-inline-block tw-uppercase">
                    <Link
                      to="/governance"
                      className="tw-text-black tw-font-rowdies hover:tw-no-underline"
                    >
                      {t(translations.stake.viewGovernance)}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              show={delegateForm}
              content={
                <>
                  <DelegateForm
                    handleSubmit={e =>
                      isStakeDelegate
                        ? handleDelegateSubmit(e)
                        : handleVestingDelegateSubmit(e)
                    }
                    address={address}
                    timestamp={Number(timestamp)}
                    weiAmount={weiAmount}
                    onChangeAddress={e => setAddress(e)}
                    isValid={validateDelegateForm()}
                    onCloseModal={() => setDelegateForm(!delegateForm)}
                  />
                </>
              }
            />
            <div className="tw-bg-gray-1 tw-rounded-lg tw-border-4 tw-border-sold tw-border-black tw-py-6 tw-px-4 tw-mt-16">
              <CurrentStakes
                onDelegate={onDelegate}
                onExtend={onExtend}
                onIncrease={onIncrease}
                onUnstake={onUnstake}
              />
              <CurrentVests onDelegate={onDelegateVest} />
              <HistoryEventsTable />
            </div>
          </div>
          <TxDialog tx={increaseTx} />
          <TxDialog tx={stakeTx} />
          <TxDialog tx={extendTx} />
          <TxDialog tx={withdrawTx} />
          <TxDialog tx={delegateTx} />
          <TxDialog tx={vestingDelegateTx} />
          <>
            {balanceOf.value !== '0' && (
              <>
                {increaseForm === true && (
                  <Modal
                    className="lg:tw-max-w-3xl"
                    show={increaseForm}
                    content={
                      <>
                        <IncreaseStakeForm
                          handleSubmit={handleIncreaseStakeSubmit}
                          amount={amount}
                          currentStakedAmount={stakedAmount}
                          timestamp={timestamp}
                          onChangeAmount={e => setAmount(e)}
                          ogBalance={ogBalance}
                          isValid={validateIncreaseForm()}
                          balanceOf={balanceOf}
                          votePower={votingPower}
                          onCloseModal={() => setIncreaseForm(!increaseForm)}
                        />
                      </>
                    }
                  />
                )}
                {extendForm === true && (
                  <Modal
                    className="lg:tw-max-w-3xl"
                    show={extendForm}
                    content={
                      <>
                        {kickoffTs.value !== '0' && prevTimestamp && (
                          <ExtendStakeForm
                            handleSubmit={handleExtendTimeSubmit}
                            amount={amount}
                            timestamp={0}
                            onChangeTimestamp={e => setTimestamp(e)}
                            ogBalance={ogBalance}
                            isOgBalanceLoading={ogBalanceLoading}
                            kickoff={kickoffTs}
                            isValid={validateExtendTimeForm()}
                            stakes={dates}
                            balanceOf={balanceOf}
                            votePower={votingPower}
                            prevExtend={prevTimestamp}
                            onCloseModal={() => setExtendForm(!extendForm)}
                          />
                        )}
                      </>
                    }
                  />
                )}
                {withdrawForm === true && (
                  <Modal
                    className="lg:tw-max-w-3xl"
                    show={withdrawForm}
                    content={
                      <>
                        <WithdrawForm
                          handleSubmit={handleWithdrawSubmit}
                          withdrawAmount={withdrawAmount}
                          amount={amount}
                          until={timestamp}
                          onChangeAmount={e => setWithdrawAmount(e)}
                          balanceOf={balanceOf}
                          isValid={validateWithdrawForm(amount)}
                          onCloseModal={() => setWithdrawForm(!withdrawForm)}
                          votePower={votingPower}
                        />
                      </>
                    }
                  />
                )}
              </>
            )}
          </>
        </div>
      </main>
      <Footer />
    </>
  );
};
