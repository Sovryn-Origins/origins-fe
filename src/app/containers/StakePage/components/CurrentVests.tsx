import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledTable } from './StyledTable';
import { VestingContract } from './VestingContract';
import { useGetVestings } from '../hooks/useGetVestings';

interface Props {
  onDelegate: (timestamp: number, vestingAddress: string) => void;
}

export function CurrentVests(props: Props) {
  const { items, loading, error } = useGetVestings();
  const { t } = useTranslation();

  return (
    <>
      <p className="tw-font-rowdies tw-text-xl tw-uppercase tw-mb-2 tw-mt-12">
        {t(translations.stake.currentVests.title)}
      </p>
      <div className="tw-bg-gray-1 tw-rounded-b tw-shadow">
        <div className="tw-rounded-lg sovryn-table tw-pt-1 tw-pb-0 tw-mb-5 max-h-96 tw-overflow-y-auto">
          <StyledTable className="tw-w-full">
            <thead>
              <tr style={{ lineHeight: '30px' }}>
                <th className="tw-font-rowdies tw-font-light tw-text-lg tw-text-left">
                  {t(translations.stake.currentVests.lockedAmount)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-lg tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentVests.votingPower)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-lg tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentVests.stakingPeriod)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-lg tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentVests.stakingDate)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-lg tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.currentVests.revenue)}
                </th>
                <th className="tw-font-rowdies tw-font-light tw-text-lg tw-text-left tw-hidden md:tw-table-cell">
                  {t(translations.stake.actions.title)}
                </th>
              </tr>
            </thead>
            <tbody className="tw-mt-5 tw-font-montserrat tw-text-base">
              {loading && !items.length && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {t(translations.stake.loading)}
                  </td>
                </tr>
              )}
              {!loading && !items.length && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {t(translations.stake.currentVests.noVestingContracts)}
                  </td>
                </tr>
              )}
              {!!error && (
                <tr>
                  <td colSpan={99} className="tw-text-center tw-font-normal">
                    {error}
                  </td>
                </tr>
              )}
              {items.map(item => (
                <VestingContract
                  key={item.address}
                  vestingAddress={item.address}
                  type={item.type}
                  onDelegate={timestamp =>
                    props.onDelegate(timestamp, item.address)
                  }
                />
              ))}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </>
  );
}
