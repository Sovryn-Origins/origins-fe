import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Text } from '@blueprintjs/core';

interface Props {
  text: string;
  active: boolean;
  onClick: () => void;
}

export function Tab(props: Props) {
  return (
    <StyledTab active={props.active} onClick={() => props.onClick()}>
      <Text ellipsize>{props.text}</Text>
    </StyledTab>
  );
}

interface StyledProps {
  active: boolean;
}
const StyledTab = styled.button.attrs(_ => ({
  type: 'button',
  className: 'btn hover:tw-text-gray-9',
}))`
  color: var(--sov-white);
  padding: 5px 0px;
  margin-right: 2rem;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 100;
  font-family: Montserrat;
  text-transform: uppercase;
  ${(props: StyledProps) =>
    props.active &&
    css`
      font-weight: 400;
      &:hover {
        color: var(--white);
      }
      border-bottom: 4px solid #fec004;
    `}
`;
