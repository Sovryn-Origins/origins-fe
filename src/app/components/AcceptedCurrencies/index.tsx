import React, { useState } from 'react';
import { SimpleShow } from './components/SimpleShow';
import { ListShow } from './components/ListShow';
import chevronDown from 'assets/images/chevron-down.svg';
import chevronUp from 'assets/images/chevron-up.svg';
import styles from './index.module.scss';

interface AcceptedCurrciesProps {
  showMore?: boolean;
}

export const AcceptedCurrencies: React.FC<AcceptedCurrciesProps> = ({
  showMore: defaultShowMore,
}) => {
  const [showMore, setShowMore] = useState<boolean>(defaultShowMore || false);
  return (
    <div className="tw-relative tw-h-6 tw-w-full">
      {!showMore && <SimpleShow />}
      {showMore && <ListShow />}
      <div
        className={styles.toggleButton}
        onClick={() => setShowMore(!showMore)}
      >
        <span className="tw-pr-3 tw-text-xs tw-font-rowdies tw-text-yellow-3">
          {showMore ? 'LESS' : 'MORE'}
        </span>
        <img
          src={showMore ? chevronUp : chevronDown}
          alt="Toggle Show More/Less"
        />
      </div>
    </div>
  );
};
