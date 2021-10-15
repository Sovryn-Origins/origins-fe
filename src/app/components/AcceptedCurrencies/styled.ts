import styled from 'styled-components';

export const ToggleButton = styled.div`
  position: absolute;
  right: 0.5rem;
  bottom: 0;
  z-index: 2;
  min-width: 6rem;
  display: flex;
  justify-content: flex-end;
`;

export const TruncatedWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(100% - 6rem);
  white-space: nowrap;
  overflow: hidden;
  /* text-overflow: ellipsis; */
`;

export const ListShowWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #474747;
  width: 100%;
  padding: 1.25rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`;
