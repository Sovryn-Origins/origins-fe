import React from 'react';
import styled from 'styled-components/macro';
import { media } from '../../../styles/media';
import { Spinner } from '@blueprintjs/core';

export const StyledButton = styled.button.attrs(_ => ({
  type: 'button',
  className:
    'tw-flex tw-flex-row tw-justify-center tw-items-center tw-uppercase',
}))`
  border: 1px solid var(--primary);
  background: var(--primary);
  border-radius: 0.5rem;
  color: black;
  min-width: 48px;
  height: 48px;
  font-family: 'Rowdies';
  font-weight: 400;
  letter-spacing: 0px;
  font-size: 0.875rem;
  line-height: 1.875rem;
  text-align: center;
  text-transform: inherit;
  transition: background 0.3s;
  padding: 0 4.2%;
  margin: 0 auto;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover {
    text-decoration: none;
    color: var(--primary);
  }
  ${media.xl`
    min-width: 180px;
    height: 44px;
    padding: 2px 20px 2px 20px;

    &:hover, &:focus {
      &:not([disabled]) {
        background: var(--primary-25) !important;
      }
    }
    &:active:hover {
      &:not([disabled]) {
        background: var(--primary-50) !important;
      }
    }
    `}
`;

interface Props {
  text: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function SalesButton({
  text,
  onClick,
  disabled,
  loading,
}: Props) {
  return (
    <StyledButton onClick={() => onClick()} disabled={disabled}>
      {text}
      {loading && <Spinner size={18} className="tw-ml-2" />}
    </StyledButton>
  );
}
