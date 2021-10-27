import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import iconNewTab from 'assets/images/iconNewTab.svg';
import { usePageViews } from 'app/hooks/useAnalytics';
import { MenuItem, Menu as BPMenu, Position, Popover } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { translations } from 'locales/i18n';
import WalletConnector from '../../containers/WalletConnector';
import { LanguageToggle } from '../LanguageToggle';
import { currentNetwork } from 'utils/classifiers';
import styles from './index.module.scss';
import {
  StyledBurger,
  StyledHeader,
  StyledLogo,
  StyledMenu,
  StyledMenuWrapper,
} from './styled';

const bridgeURL =
  currentNetwork === 'mainnet'
    ? 'https://bridge.sovryn.app'
    : 'https://bridge.test.sovryn.app/';

export function Header() {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const node = useRef(null);

  usePageViews();

  const Menu = ({ open, setOpen }) => {
    return <StyledMenu open={open}>{menuItems}</StyledMenu>;
  };
  const Burger = ({ open, setOpen }) => {
    return (
      <StyledBurger open={open} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </StyledBurger>
    );
  };
  const pages = [
    { to: '/buy-sov', title: t(translations.mainMenu.buySov), exact: true },
    {
      to: '/swap',
      title: t(translations.mainMenu.swap),
    },
    {
      to: '/spot',
      title: t(translations.mainMenu.spotTrade),
    },
    {
      to: 'https://bitocracy.sovryn.app',
      title: t(translations.mainMenu.governance),
    },
    { to: '/stake', title: t(translations.mainMenu.staking) },
    { to: '/reward', title: t(translations.mainMenu.reward) },
    { to: '/wallet', title: t(translations.mainMenu.wallet) },
    {
      to: bridgeURL,
      title: t(translations.mainMenu.bridge),
    },
    { to: '/origins', title: t(translations.mainMenu.origins) },
    { to: '/origins/claim', title: t(translations.mainMenu.originsClaim) },
    {
      to: 'https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp',
      title: t(translations.mainMenu.help),
    },
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
        />
      );
    }

    return (
      <MenuItem
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
      // [SECTION_TYPE.TRADE]: ['/buy-sov', '/trade', '/swap'],
      // [SECTION_TYPE.FINANCE]: ['/lend', '/yield-farm'],
      // [SECTION_TYPE.ORIGINS]: ['/origins', '/origins/claim'],
      [SECTION_TYPE.BITOCRACY]: ['/stake'],
      [SECTION_TYPE.PORTFOLIO]: ['/wallet'],
      [SECTION_TYPE.LAUNCHPAD]: ['/launchpad'],
      [SECTION_TYPE.CLAIM]: ['/claim'],
    };
    return !!section && paths[section].includes(location.pathname);
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
      <StyledHeader className={classNames(styles.header, open && styles.open)}>
        <div className="tw-container tw-flex tw-justify-between tw-items-center tw-pt-2 tw-pb-8 tw-px-4 tw-mx-auto">
          <div className="xl:tw-hidden">
            <div ref={node}>
              <Burger open={open} setOpen={setOpen} />
              <Menu open={open} setOpen={setOpen} />
            </div>
          </div>
          <div className="xl:tw-flex tw-flex-row tw-items-center">
            <div className="tw-mr-5 2xl:tw-mr-20">
              <Link to="/">
                <StyledLogo />
              </Link>
            </div>
            <div className="tw-hidden xl:tw-flex tw-flex-row tw-flex-nowrap tw-space-x-4 2xl:tw-space-x-10 tw-ml-8">
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.staking)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/stake');
                      }}
                    />
                    <MenuItem
                      icon={
                        <img
                          src={iconNewTab}
                          alt="newTab"
                          className="tw-w-4 tw-h-4"
                        />
                      }
                      href="https://bitocracy.sovryn.app/"
                      target="_blank"
                      text={t(translations.mainMenu.governance)}
                      className="bp3-popover-dismiss"
                    />
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
                      className="bp3-popover-dismiss"
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.BITOCRACY) && 'font-weight-bold'
                  }`}
                >
                  <StyledMenuWrapper
                    selected={isSectionOpen(SECTION_TYPE.BITOCRACY)}
                    className="tw-mr-2 2xl:tw-mr-3"
                  >
                    <span className="tw-cursor-pointer tw-px-1 tw-uppercase">
                      {t(translations.mainMenu.bitocracy)}
                    </span>
                  </StyledMenuWrapper>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <StyledMenuWrapper
                selected={isSectionOpen(SECTION_TYPE.PORTFOLIO)}
                className="tw-mr-2 2xl:tw-mr-3"
              >
                <NavLink
                  className="tw-header-link tw-px-1 tw-uppercase"
                  to="/wallet"
                >
                  {t(translations.mainMenu.wallet)}
                </NavLink>
              </StyledMenuWrapper>
              <StyledMenuWrapper
                selected={isSectionOpen(SECTION_TYPE.LAUNCHPAD)}
                className="tw-mr-2 2xl:tw-mr-3"
              >
                <NavLink
                  className="tw-header-link tw-px-1 tw-uppercase"
                  to="/launchpad"
                >
                  {t(translations.mainMenu.launchpad)}
                </NavLink>
              </StyledMenuWrapper>
              <StyledMenuWrapper
                selected={isSectionOpen(SECTION_TYPE.CLAIM)}
                className="tw-mr-2 2xl:tw-mr-3"
              >
                <NavLink
                  className="tw-header-link tw-px-1 tw-uppercase"
                  to="/claim"
                >
                  {t(translations.mainMenu.claim)}
                </NavLink>
              </StyledMenuWrapper>
            </div>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center">
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-header-link tw-hidden xl:tw-block"
            >
              {t(translations.mainMenu.help)}
            </a>
            <div className="2xl:tw-mr-4">
              <LanguageToggle />
            </div>
            <WalletConnector simpleView={false} />
          </div>
        </div>
      </StyledHeader>
    </>
  );
}
