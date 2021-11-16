import React from 'react';
import cn from 'classnames';

interface IInfoRowProps {
  label: string;
  value: string;
  className?: string;
}

export const InfoRow: React.FC<IInfoRowProps> = ({
  label,
  value,
  className,
}) => (
  <div className={cn('tw-tracking-normal', className)}>
    <div className="tw-text-xs tw-tracking-normal tw-leading-7">{label}:</div>
    <div className="tw-text-xs tw-tracking-normal tw-leading-tight tw-font-normal">
      {value}
    </div>
  </div>
);
