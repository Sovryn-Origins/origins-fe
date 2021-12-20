import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Asset } from 'types';
import { fromWei } from 'utils/blockchain/math-helpers';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { Input } from '../Input';
import { AssetSelect } from 'app/components/AssetSelect';
import {
  stringToFixedPrecision,
  toNumberFormat,
} from 'utils/display-text/format';

interface Props {
  value: string;
  onChange: (value: string, isTotal?: boolean | undefined) => void;
  decimalPrecision?: number;
  asset?: Asset;
  assetString?: string;
  selectable?: boolean;
  onSelectAsset?: (asset: Asset) => void;
  subText?: string;
  placeholder?: string;
  maxAmount?: string;
  readonly?: boolean;
  theme?: 'dark' | 'white';
  showAmountSelector?: boolean;
}

export function AmountInput({
  value,
  onChange,
  placeholder = toNumberFormat(0, 6),
  decimalPrecision = 6,
  asset,
  assetString,
  selectable = false,
  onSelectAsset,
  subText,
  maxAmount,
  readonly,
  theme = 'dark',
  showAmountSelector = true,
}: Props) {
  return (
    <>
      <Input
        value={stringToFixedPrecision(value, decimalPrecision)}
        onChange={onChange}
        type="number"
        placeholder={placeholder}
        appendElem={
          asset || assetString ? (
            selectable ? (
              <AssetSelect
                selected={asset}
                selectedAssetString={assetString}
                onChange={onSelectAsset}
              />
            ) : (
              <AssetRenderer
                className="tw-text-white tw-font-rowdies tw-text-lg"
                asset={asset}
                assetString={assetString}
              />
            )
          ) : null
        }
        className={classNames('tw-rounded-lg', `theme-${theme}`)}
        readOnly={readonly}
        leftDivider={selectable}
      />
      {subText && (
        <div className="tw-text-xs tw-mt-1 tw-font-thin">{subText}</div>
      )}
      {showAmountSelector &&
        !readonly &&
        (asset || maxAmount !== undefined) && (
          <AmountSelector
            asset={asset}
            maxAmount={maxAmount}
            onChange={onChange}
          />
        )}
    </>
  );
}

const amounts = [10, 25, 50, 75, 100];

interface AmountSelectorProps {
  asset?: Asset;
  maxAmount?: string;
  onChange: (value: string, isTotal: boolean) => void;
}

export function AmountSelector(props: AmountSelectorProps) {
  const { value } = useAssetBalanceOf(props.asset || Asset.RBTC);
  const balance = useMemo(() => {
    if (props.maxAmount !== undefined) {
      return props.maxAmount;
    }
    return value;
  }, [props.maxAmount, value]);

  const handleChange = (percent: number) => {
    let value = '0';
    let isTotal = false;
    if (percent === 100) {
      value = balance;
      isTotal = true;
    } else if (percent === 0) {
      value = '0';
    } else {
      value = bignumber(balance)
        .mul(percent / 100)
        .toString();
    }
    props.onChange(fromWei(value), isTotal);
  };
  return (
    <div className="tw-mt-2.5 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border-3 tw-border-gray-1 tw-rounded-md tw-divide-x tw-divide-gray-1 tw-bg-gray-3">
      {amounts.map(value => (
        <AmountSelectorButton
          key={value}
          text={`${value}%`}
          onClick={() => handleChange(value)}
        />
      ))}
    </div>
  );
}

interface AmountButtonProps {
  text?: string;
  onClick?: () => void;
}

export function AmountSelectorButton(props: AmountButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className="tw-text-white tw-bg-secondary tw-bg-opacity-0 tw-font-medium tw-font-rowdies tw-text-xs tw-leading-none tw-px-4 tw-py-1 tw-text-center tw-w-full tw-transition hover:tw-bg-opacity-25"
    >
      {props.text}
    </button>
  );
}
