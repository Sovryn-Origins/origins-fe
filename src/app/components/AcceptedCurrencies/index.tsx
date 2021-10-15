import React, { useState } from 'react';
import { SimpleShow } from './components/SimpleShow';
import { ListShow } from './components/ListShow';
import { ToggleButton } from './styled';
import chevronDown from 'assets/images/chevron-down.svg';
import chevronUp from 'assets/images/chevron-up.svg';

interface AcceptedCurrciesProps {
  showMore?: boolean;
}

export const AcceptedCurrencies: React.FC<AcceptedCurrciesProps> = ({
  showMore: defaultShowMore,
}) => {
  const [showMore, setShowMore] = useState<boolean>(defaultShowMore || false);
  return (
    <div>
      <div className="tw-relative tw-h-6 tw-w-full">
        {!showMore && <SimpleShow />}
        {showMore && <ListShow />}
        <ToggleButton
          className="tw-cursor-pointer"
          onClick={() => setShowMore(!showMore)}
        >
          <span className="tw-pr-3">{showMore ? 'LESS' : 'MORE'}</span>
          <img
            src={showMore ? chevronUp : chevronDown}
            alt="Toggle Show More/Less"
          />
        </ToggleButton>
      </div>
    </div>
  );
};
