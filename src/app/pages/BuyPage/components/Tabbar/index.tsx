import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../../constants';

interface ActiveProps {
  setSelectedTab: (e: boolean) => void;
  selectedTab: boolean;
}

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
`;
const BarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  cursor: pointer;
  @media (max-width: 600px) {
    height: 55px;
  }
  p {
    font-family: Rowdies;
    font-size: 32px;
    font-weight: 400;
    color: black;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    @media (max-width: 600px) {
      font-size: 24px;
    }
    &:hover {
      opacity: 0.8;
    }
  }
`;
const Bar = styled.div<{ active: boolean }>`
  width: 146px;
  height: 8px;
  border-radius: 4px;
  background: ${props => (!props.active ? 'transparent' : colors.main)};
  @media (max-width: 600px) {
    width: 106px;
  }
`;

const Tabbar: React.FC<ActiveProps> = ({ setSelectedTab, selectedTab }) => {
  return (
    <TabContainer>
      <BarWrapper>
        <p onClick={() => setSelectedTab(true)}>bonding curve</p>
        <Bar active={selectedTab} />
      </BarWrapper>
      <BarWrapper>
        <p onClick={() => setSelectedTab(false)}>sovryn swap</p>
        <Bar active={!selectedTab} />
      </BarWrapper>
    </TabContainer>
  );
};

export default Tabbar;
