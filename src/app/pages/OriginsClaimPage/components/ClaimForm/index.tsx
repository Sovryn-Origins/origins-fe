import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { bignumber } from 'mathjs';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { FormGroup } from 'app/components/Form/FormGroup';
import { Button } from 'app/components/Button';
import { Asset } from 'types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { useGetSaleStats } from '../../hooks/useGetSaleStats';
import { useClaimAndWithdraw } from '../../hooks/useClaimAndWithdraw';

interface IClaimFormProps {
  address: string;
  className?: string;
}

interface ITierRow {
  tier: number;
  name: string;
}

const tierRows: ITierRow[] = [
  { tier: 1, name: 'OG - SOV Stakers Round' },
  { tier: 2, name: 'OG - Public Round' },
];

const token = Asset.OG;

export const ClaimForm: React.FC<IClaimFormProps> = ({
  className,
  address,
}) => {
  const { t } = useTranslation();
  const [tierId, setTierId] = useState(0);
  const { checkMaintenance, States } = useMaintenance();
  const rewardsLocked = checkMaintenance(States.CLAIM_REWARDS);
  const saleStats = useGetSaleStats(tierId);

  const availableAmount = useMemo(() => {
    const {
      totalTokenOnTier,
      tokenSoldPerTier,
      tokenBoughtByAddress,
    } = saleStats;
    if (bignumber(tokenSoldPerTier).equals('0')) return '0';

    const distributedAmount = bignumber(totalTokenOnTier)
      .mul(tokenBoughtByAddress)
      .div(tokenSoldPerTier);

    return bignumber(tokenBoughtByAddress).lessThan(distributedAmount)
      ? tokenBoughtByAddress
      : distributedAmount;
  }, [saleStats]);

  const { value: getWaitedTS } = useCacheCallWithValue(
    'lockedFund',
    'getWaitedTS',
    '0',
  );

  const { value: getWaitedUnlockedBalance } = useCacheCallWithValue(
    'lockedFund',
    'getWaitedUnlockedBalance',
    '0',
    address,
  );

  const { value: getVestedBalance } = useCacheCallWithValue(
    'lockedFund',
    'getVestedBalance',
    '0',
    address,
  );

  // const balance = useMemo(
  //   () => bignumber(getVestedBalance).add(getWaitedUnlockedBalance).toFixed(0),
  //   [getVestedBalance, getWaitedUnlockedBalance],
  // );

  const unlockTime = useMemo(() => Number(getWaitedTS) * 1000, [getWaitedTS]);

  const { send, ...tx } = useClaimAndWithdraw({ tierId, address });

  return (
    <div
      className={cn(
        className,
        'tw-trading-form-card tw-max-w-xl tw-bg-gray-3 tw-rounded-lg tw-py-8 tw-px-6 tw-mx-auto xl:tw-mx-0 tw-flex tw-flex-col',
      )}
    >
      <div className="text-center tw-text-xl tw-uppercase tw-font-rowdies">
        {t(translations.originsClaim.claimForm.title)}
      </div>
      <div className="tw-px-8 tw-mt-10 tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <div>
          <FormGroup
            label={t(translations.originsClaim.claimForm.selectToken)}
            labelClassName="tw-text-sm tw-mb-4 tw-uppercase tw-font-rowdies"
            className="tw-mb-12"
          >
            <select
              className="tw-font-inter tw-text-gray-6 tw-text-lg tw-w-full tw-py-2 tw-px-2 tw-rounded-lg"
              value={tierId}
              onChange={e => setTierId(Number(e.target.value))}
            >
              <option
                className="tw-text-left tw-font-inter tw-text-gray-6"
                value={0}
              >
                {t(translations.originsClaim.claimForm.chooseToken)}
              </option>
              {tierRows.map(tierRow => (
                <option
                  key={tierRow.name}
                  className="tw-text-black tw-font-inter"
                  value={tierRow.tier}
                >
                  {tierRow.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup
            label={t(translations.originsClaim.claimForm.availble)}
            labelClassName="tw-text-sm tw-mb-4 tw-uppercase tw-font-rowdies"
          >
            <Input
              className="tw-max-w-none"
              value={weiToNumberFormat(availableAmount, 4)}
              readOnly={false}
              appendElem={token ? <AssetRenderer asset={token} /> : undefined}
            />
          </FormGroup>
        </div>
        <div className={!rewardsLocked ? 'tw-mt-12' : undefined}>
          {rewardsLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.claimOrigins}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-Red tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}
          {!rewardsLocked && (
            <div className="tw-flex tw-justify-center">
              <Button
                disabled={!tierId || availableAmount === '0'}
                onClick={send}
                className="tw-mx-auto tw-uppercase"
                text={t(translations.originsClaim.claimForm.cta)}
              />
            </div>
          )}

          <div className="tw-text-sm tw-font-light tw-font-rowdies tw-uppercase tw-mt-8">
            {token &&
              t(translations.originsClaim.claimForm.note, {
                date: new Date(unlockTime).toLocaleString(),
              })}
            {parseFloat(getWaitedUnlockedBalance) > 0 && (
              <div className="tw-mt-1">
                {t(translations.originsClaim.claimForm.unlockedNote, {
                  amount: weiToNumberFormat(getWaitedUnlockedBalance, 4),
                })}
              </div>
            )}
            {parseFloat(getVestedBalance) > 0 && (
              <div className="tw-mt-1">
                {t(translations.originsClaim.vestForm.note, {
                  amount: weiToNumberFormat(getVestedBalance, 4),
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <TxDialog tx={tx} />
    </div>
  );
};
