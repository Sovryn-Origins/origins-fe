import React from 'react';
import classNames from 'classnames';

interface IInfoItemProps {
  label: string;
  value: string | JSX.Element;
  className?: string;
  isLastItem?: boolean;
}

export const InfoItem: React.FC<IInfoItemProps> = ({
  label,
  value,
  className,
  isLastItem,
}) => (
  <div
    className={classNames(
      'tw-text-left',
      isLastItem ? '' : 'tw-mb-8',
      className,
    )}
  >
    <div className="tw-text-base tw-font-rowdies tw-font-light tw-tracking-normal tw-uppercase tw-mb-3">
      {label}
    </div>
    <div className="tw-text-lg tw-font-rowdies tw-font-bold tw-uppercase tw-tracking-normal">
      {value}
    </div>
  </div>
);
