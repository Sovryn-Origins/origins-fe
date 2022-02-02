import React from 'react';
import classNames from 'classnames';

interface Props {
  content: React.ReactNode;
  className?: string;
}

export function ErrorBadge({ content, className = 'tw-py-4 tw-my-3' }: Props) {
  return (
    <div className={classNames('tw-text-xs tw-text-warning', className)}>
      {content}
    </div>
  );
}
