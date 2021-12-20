import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { MenuItem, Menu as BPMenu, Position, Popover } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { usePageViews } from 'app/hooks/useAnalytics';
import { translations } from 'locales/i18n';
import WalletConnector from '../../containers/WalletConnector';
import { LanguageToggle } from '../LanguageToggle';
import { Burger } from './components/Burger';
import iconNewTab from 'assets/images/iconNewTab.svg';
import headerBG from 'assets/images/header-background.svg';
import { ReactComponent as LogoSVG } from 'assets/images/origins-logo.svg';

import styles from './index.module.scss';

export function Header() {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const node = useRef(null);

  usePageViews();

  const Menu = ({ open }) => {
    return (
      <nav className={classNames(styles.menu, open && styles.open)}>
        {menuItems}
      </nav>
    );
  };

  const pages = [
    { to: '/stake', title: t(translations.mainMenu.staking) },
    { to: '/governance', title: t(translations.mainMenu.governance) },
    { to: '/wallet', title: t(translations.mainMenu.wallet) },
    { to: '/launchpad', title: t(translations.mainMenu.origins) },
    { to: '/claim', title: t(translations.mainMenu.originsClaim) },
  ];

  const menuItems = pages.map((item, index) => {
    let link: {
      to: string;
      title: string;
      onClick?: () => void;
      beforeOpen?: () => void;
    } = item;

    if (link.to.startsWith('http')) {
      return (
        <MenuItem
          key={index}
          text={link.title}
          href={link.to}
          target="_blank"
          rel="noreferrer noopener"
          className="tw-font-normal tw-uppercase"
        />
      );
    }

    return (
      <MenuItem
        className="tw-font-normal tw-uppercase"
        key={index}
        text={link.title}
        onClick={() => {
          link.beforeOpen && link.beforeOpen();
          link.onClick ? link.onClick() : history.push(link.to);
          setOpen(false);
        }}
      />
    );
  });

  const NavPopover = ({ content, children }) => {
    return (
      <Popover
        interactionKind="hover"
        minimal={true}
        popoverClassName={styles.headerNavPopover}
        content={content}
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        position={Position.BOTTOM_LEFT}
        className="hover:tw-text-secondary"
      >
        {children}
      </Popover>
    );
  };

  const SECTION_TYPE = {
    // TRADE: 'trade',
    // FINANCE: 'finance',
    // ORIGINS: 'origins',
    BITOCRACY: 'bitocracy',
    PORTFOLIO: 'portfolio',
    LAUNCHPAD: 'launchpad',
    CLAIM: 'claim',
  };

  const isSectionOpen = (section: string) => {
    const paths = {
      [SECTION_TYPE.BITOCRACY]: ['/stake', '/governance'],
      [SECTION_TYPE.PORTFOLIO]: ['/wallet'],
      [SECTION_TYPE.LAUNCHPAD]: ['/launchpad'],
      [SECTION_TYPE.CLAIM]: ['/claim'],
    };
    return (
      !!section &&
      paths[section].some(prefix => location.pathname.includes(prefix))
    );
  };

  useEffect(() => {
    const body = document.body;
    const root = document.getElementById('root');
    if (open) {
      window.scrollTo(0, 0);
      body.classList.add('overflow-hidden');
      root?.classList.add('openedMenu');
    } else {
      body.classList.remove('overflow-hidden');
      root?.classList.remove('openedMenu');
    }
    return () => {
      body.classList.remove('overflow-hidden');
      root?.classList.remove('openedMenu');
    };
  }, [open]);

  return (
    <>
      <header
        className={classNames(styles.header, open && styles.open)}
        style={{
          backgroundImage: `url(${headerBG})`,
        }}
      >
        <div className="tw-container tw-flex tw-justify-between tw-items-center tw-pt-2 tw-pb-6 tw-px-4 tw-mx-auto">
          <div className="xl:tw-hidden">
            <div ref={node}>
              <Burger open={open} setOpen={setOpen} />
              <Menu open={open} />
            </div>
          </div>
          <div className="xl:tw-flex tw-flex-row tw-items-center">
            <div className="tw-mr-5 2xl:tw-mr-20">
              <Link to="/">
                <LogoSVG className={styles.logo} />
              </Link>
            </div>
            <div className="tw-hidden xl:tw-flex tw-flex-row tw-flex-nowrap tw-space-x-4 2xl:tw-space-x-10 tw-ml-8">
              <NavPopover
                content={
                  <BPMenu>
                    <NavLink
                      className="tw-block tw-header-link tw-px-1 tw-uppercase"
                      to="/stake"
                    >
                      {t(translations.mainMenu.staking)}
                    </NavLink>
                    <NavLink
                      className="tw-block tw-header-link tw-px-1 tw-uppercase"
                      to="/governance"
                    >
                      {t(translations.mainMenu.governance)}
                    </NavLink>
                    <MenuItem
                      icon={
                        <img
                          src={iconNewTab}
                          alt="newTab"
                          className="tw-w-4 tw-h-4"
                        />
                      }
                      href="https://forum.sovryn.app/"
                      target="_blank"
                      text={t(translations.mainMenu.forum)}
                      className="bp3-popover-dismiss tw-uppercase"
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.BITOCRACY) && 'font-weight-bold'
                  }`}
                >
                  <div
                    className={classNames(styles.menuWrapper, {
                      [styles.selected]: isSectionOpen(SECTION_TYPE.BITOCRACY),
                    })}
                  >
                    <span className="tw-cursor-pointer tw-px-1 tw-uppercase">
                      {t(translations.mainMenu.bitocracy)}
                    </span>
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <div
                className={classNames(styles.menuWrapper, {
                  [styles.selected]: isSectionOpen(SECTION_TYPE.PORTFOLIO),
                })}
              >
                <NavLink
                  className="tw-header-link tw-px-1 tw-uppercase"
                  to="/wallet"
                >
                  {t(translations.mainMenu.wallet)}
                </NavLink>
              </div>
              <div
                className={classNames(styles.menuWrapper, {
                  [styles.selected]: isSectionOpen(SECTION_TYPE.LAUNCHPAD),
                })}
              >
                <NavLink
                  className="tw-header-link tw-px-1 tw-uppercase"
                  to="/launchpad"
                >
                  {t(translations.mainMenu.launchpad)}
                </NavLink>
              </div>
              <div
                className={classNames(styles.menuWrapper, {
                  [styles.selected]: isSectionOpen(SECTION_TYPE.CLAIM),
                })}
              >
                <NavLink
                  className="tw-header-link tw-px-1 tw-uppercase"
                  to="/claim"
                >
                  {t(translations.mainMenu.claim)}
                </NavLink>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center">
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-header-link tw-hidden xl:tw-block tw-px-4 tw-uppercase"
            >
              {t(translations.mainMenu.help)}
            </a>
            <div className="2xl:tw-mr-4 tw-pr-4">
              <LanguageToggle />
            </div>
            <WalletConnector simpleView={false} />
          </div>
        </div>
      </header>
    </>
  );
}
