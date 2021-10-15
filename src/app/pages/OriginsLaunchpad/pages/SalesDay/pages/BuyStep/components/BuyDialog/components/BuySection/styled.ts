import styled, { css } from 'styled-components';

export const BuyWrapper = styled.div`
  width: 64%;
  height: 100%;
  border-radius: 0.75rem;
  box-shadow: -11px 0px 25px #00000026;
  padding: 8px 8px 8px 0;
`;

export const BuyInnerWrapper = styled.div`
  background-color: #ffffff;
  height: 100%;
  border-radius: 8px;
  padding-top: 32px;
`;

interface IBuyButtonProps {
  disabled?: boolean;
}

export const BuyButton = styled.button<IBuyButtonProps>`
  height: 50px;
  width: 100%;
  margin-top: 4.3125rem;
  border: 1px solid #17c3b2;
  color: #ffffff;
  font-size: 20px;
  font-weight: normal;
  background: #17c3b2;
  border-radius: 0.625rem;
  transition: opacity 0.3s;
  text-transform: uppercase;
  padding: initial;

  &:hover {
    opacity: 75%;
  }

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`;
