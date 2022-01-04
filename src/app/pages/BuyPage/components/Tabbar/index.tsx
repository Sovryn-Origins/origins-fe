import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
interface ActiveProps {
  setSelectedTab: (e: boolean) => void;
  selectedTab: boolean;
}

const Tabbar: React.FC<ActiveProps> = ({ setSelectedTab, selectedTab }) => {
  return (
    <div className={styles.tabContainer}>
      <div className={styles.barWrapper}>
        <p onClick={() => setSelectedTab(false)}>sovryn swap</p>
        <div
          className={classNames(styles.bar, {
            active: !selectedTab,
          })}
        ></div>
      </div>
      <div className={styles.barWrapper}>
        <p onClick={() => setSelectedTab(true)}>bonding curve</p>
        <div
          className={classNames(styles.bar, {
            active: selectedTab,
          })}
        ></div>
      </div>
    </div>
  );
};

export default Tabbar;
