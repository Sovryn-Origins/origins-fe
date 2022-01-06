import classNames from 'classnames';
import React, { useCallback } from 'react';

import { handleNumber } from 'utils/helpers';
import styles from './index.module.scss';

type InputType = 'text' | 'email' | 'password' | 'number';

interface InputProps {
  value: string;
  onChange?: (value: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  appendElem?: React.ReactNode;
  type?: InputType;
  className?: string;
  inputClassName?: string;
  readOnly?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  leftDivider?: boolean;
}

export function Input({
  value,
  onChange,
  className,
  inputClassName,
  appendElem,
  ...props
}: InputProps) {
  const handleChange = useCallback(
    (newValue: string) => {
      if (onChange) {
        if (props.type === 'number') {
          onChange(handleNumber(newValue, true));
        } else {
          onChange(newValue);
        }
      }
    },
    [props.type, onChange],
  );

  return (
    <div
      className={classNames('tw-input-wrapper tw-bg-gray-3', className, {
        readonly: props.readOnly,
      })}
    >
      <input
        className={classNames(
          'tw-input tw-text-white',
          styles.input,
          inputClassName,
        )}
        lang={navigator.language}
        value={value}
        onChange={e => handleChange(e.currentTarget.value)}
        {...props}
      />
      {appendElem && (
        <div
          className={classNames(
            'tw-input-append',
            props.leftDivider
              ? 'tw-border-l-2 tw-border-solid tw-pl-2 tw-append-selectable'
              : '',
          )}
        >
          {appendElem}
        </div>
      )}
    </div>
  );
}

Input.defaultProps = {
  inputClassName: 'tw-text-left',
};

interface DummyProps {
  value: React.ReactNode;
  appendElem?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  readOnly?: boolean;
}

export function DummyInput({
  value,
  appendElem,
  className,
  inputClassName,
  ...props
}: DummyProps) {
  return (
    <div
      className={classNames('tw-input-wrapper', className, {
        readonly: props.readOnly,
      })}
    >
      <div className={classNames('tw-input', inputClassName)}>{value}</div>
      {appendElem && <div className="tw-input-append">{appendElem}</div>}
    </div>
  );
}

DummyInput.defaultProps = {
  inputClassName: 'tw-text-left',
  readOnly: true,
};
