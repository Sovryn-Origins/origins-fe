import styled from 'styled-components';

export const DialogWrapper = styled.div`
  background-color: #1f1f1f;
  padding: 3rem 3rem 2.5rem 3rem;
  border-radius: 0.5rem;
  width: 50rem;
  -webkit-text-stroke: 0px currentcolor;
`;

export const DialogTitle = styled.div`
  font-size: 2rem;
  letter-spacing: 0;
`;

export const ListItem = styled.div`
  align-items: center;
  position: relative;
  font-size: 1rem;
  font-family: Rowdies;
  line-height: 1.875;
  letter-spacing: 0;
  font-weight: 300;
  margin-bottom: 1.5rem;
  text-transform: uppercase;

  /* &:before {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #ededed;
    content: '';
    margin-right: 0.625rem;
    display: block;
    position: absolute;
    left: -1rem;
    top: 0.25rem;
  } */
`;
