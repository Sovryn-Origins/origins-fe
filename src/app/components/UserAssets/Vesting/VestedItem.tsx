import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@blueprintjs/core';
import { LoadableValue } from '../../LoadableValue';
import {
  weiToNumberFormat,
  weiToUSD,
} from '../../../../utils/display-text/format';
import { translations } from '../../../../locales/i18n';
import { ActionButton } from '../../Form/ActionButton';
import { AssetsDictionary } from '../../../../utils/dictionaries/assets-dictionary';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { FullVesting } from './useListOfUserVestings';
import { useDollarValue } from '../../../hooks/useDollarValue';
import { useGetVesting } from './useGetVesting';

type VestedItemProps = {
  vesting: FullVesting;
  onWithdraw: (vesting: FullVesting) => void;
};

export const VestedItem: React.FC<VestedItemProps> = ({
  vesting,
  onWithdraw,
}) => {
  const { value, loading } = useGetVesting(vesting);

  const { logoSvg, symbol } = AssetsDictionary.get(vesting.asset);

  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const withdrawLocked = checkMaintenance(States.WITHDRAW_VESTS);
  const dollarValue = useDollarValue(vesting.asset, value.balance);

  const handleOnWithdraw = useCallback(() => onWithdraw(value), [
    value,
    onWithdraw,
  ]);

  return (
    <tr>
      <td className="tw-font-inter tw-text-base">
        <img
          className="tw-inline tw-mr-2 tw-h-8 tw-w-8"
          src={logoSvg}
          alt={vesting.asset}
        />{' '}
        {vesting.label || symbol}
      </td>
      <td className="tw-text-left tw-font-inter tw-text-base">
        <LoadableValue
          loading={loading}
          value={weiToNumberFormat(value.balance, 4)}
        />
      </td>
      <td className="tw-text-left tw-font-inter tw-text-base">
        <LoadableValue
          value={weiToUSD(dollarValue.value)}
          loading={dollarValue.loading || loading}
        />
      </td>
      <td className="tw-text-left">
        {withdrawLocked ? (
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            interactionKind="hover"
            content={<>{t(translations.maintenance.withdrawVests)}</>}
          >
            <ActionButton
              className="tw-inline-block tw-cursor-not-allowed tw-uppercase"
              text={t(translations.userAssets.actions.withdraw)}
            />
          </Tooltip>
        ) : (
          <ActionButton
            className="tw-inline-block tw-uppercase"
            text={t(translations.userAssets.actions.withdraw)}
            onClick={handleOnWithdraw}
            disabled={loading}
          />
        )}
      </td>
    </tr>
  );
};
