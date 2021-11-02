import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

interface ITabProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export const Tab: React.FC<ITabProps> = ({ label, selected, onSelect }) => {
  return (
    <div
      className={classNames(
        'tw-px-3 tw-text-lg tw-font-rowdies tw-uppercase tw-cursor-pointer',
        {
          'tw-text-gray-8 hover:tw-text-gray-6': !selected,
          'tw-text-black': selected,
        },
      )}
      onClick={onSelect}
    >
      <div>{label}</div>
      <StyledTabBorder
        className={classNames('tw-border-yellow-3 tw-border-b-4', {
          'tw-border-solid': selected,
          'tw-border-none': !selected,
        })}
      />
    </div>
  );
};

const StyledTabBorder = styled.div`
  max-width: 5.75rem;
  margin: auto;
  border-radius: 0.5rem;
`;
