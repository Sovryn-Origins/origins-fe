import React from 'react';
import styled, { css } from 'styled-components/macro';

interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props extends BtnProps {
  text: React.ReactNode;
  className?: string;
}

const StyledButton = styled.button`
  height: 50px;
  margin: 40px auto 0 auto;
  border: 1px solid #17C3B2;
  color: #000;
  padding: 0.75rem 4rem;
  font-size: 0.875rem;
  font-family: 'Rowdies';
  font-weight: 900;
  background: #17C3B2;
  border-radius: 0.75rem;
  text-transform: none;
  line-height: 1;
  transition: background 0.3s;
  text-transform: uppercase;

  &:hover {
    background: #17C3BF;
  }

  ${(props: BtnProps) =>
    props.disabled &&
    css`
      opacity: 25%;
    `}
`;

export function ConfirmButton(props: Props) {
  return (
    <StyledButton
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
    >
      {props.text}
    </StyledButton>
  );
}
