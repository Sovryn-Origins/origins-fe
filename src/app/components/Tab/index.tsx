import React from 'react';
import classNames from 'classnames';
import styled, { css } from 'styled-components/macro';
import { Text } from '@blueprintjs/core';
import { Theme } from 'types/theme';

interface Props {
  text: string;
  active: boolean;
  onClick: () => void;
  theme?: Theme;
}

export function Tab(props: Props) {
  return (
    <StyledTab
      className={classNames('btn', {
        'tw-text-white hover:tw-text-sov-white': props.theme !== Theme.LIGHT,
        'tw-text-black hover:tw-text-gray-4': props.theme === Theme.LIGHT,
      })}
      active={props.active}
      onClick={() => props.onClick()}
    >
      <Text className="tw-font-rowdies" ellipsize>
        {props.text}
      </Text>
    </StyledTab>
  );
}

interface StyledProps {
  active: boolean;
}
const StyledTab = styled.button.attrs(_ => ({
  type: 'button',
  // className: 'btn hover:tw-text-gray-9',
}))`
  color: var(--sov-white);
  padding: 5px 0px;
  margin-right: 2rem;
  background: transparent;
  font-size: 0.875rem;
  font-weight: normal;
  text-transform: uppercase;
  ${(props: StyledProps) =>
    props.active &&
    css`
      border-bottom: 4px solid #fec004;
    `}
`;
