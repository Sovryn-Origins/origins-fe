import React, { useState } from 'react';
import { Link, useRouteMatch, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useProposalList } from 'app/hooks/useProposalList';
import { ProposalRow } from '../components/ProposalRow';
import styles from './index.module.scss';

export function Proposals() {
  const match = useRouteMatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [proposalCount, setProposalCount] = useState(3);
  const { items, total, loading } = useProposalList(1, proposalCount);

  const loadAllProposals = () => {
    setProposalCount(25);
  };

  return (
    <main>
      <h2 className={styles.title}>{t(translations.governance.title)}</h2>
      <div className="container tw-max-w-screen-2xl tw-mx-auto tw-mb-64 tw-px-6">
        <div className="tw-px-4 tw-py-6 tw-bg-gray-1 tw-border-4 tw-border-solid tw-border-black tw-rounded-lg">
          <div className="tw-flex tw-justify-between tw-items-center">
            <h2 className="tw-font-normal tw-text-xl tw-font-rowdies tw-uppercase tw-mb-0 tw-tracking-normal">
              {t(translations.governance.proposals.mainTitle)}
            </h2>
            <button></button>
            <Link
              to={{
                pathname: `${match.url}/propose`,
                state: { background: location },
              }}
              className="tw-inline-block tw-text-center tw-px-4 tw-py-2 tw-text-sm tw-font-rowdies tw-font-light tw-uppercase tw-bg-primary tw-bg-opacity-40 hover:tw-bg-opacity-80 tw-rounded-lg tw-border-2 tw-border-solid tw-border-primary tw-text-black hover:tw-no-underline tw-tracking-normal"
            >
              Propose
            </Link>
          </div>
          <div className="tw-bg-gray-light tw-rounded-b tw-shadow tw-mt-8">
            <>
              <div className="tw-rounded-lg tw-bg-gray-lighter tw-sovryn-table tw-pt-1 tw-pb-3 tw-mb-5">
                <table
                  className={classNames(
                    styles.styledTable,
                    'tw-w-full tw-table-fixed',
                  )}
                >
                  <thead>
                    <tr>
                      <th className="tw-text-left tw-w-2/3 xl:tw-w-1/5">
                        {t(translations.governance.proposals.title)}
                      </th>
                      <th className="tw-text-left tw-hidden xl:tw-table-cell xl:tw-w-1/5">
                        {t(translations.governance.proposals.startBlock)}
                      </th>
                      <th className="tw-text-left tw-hidden xl:tw-table-cell xl:tw-w-1/5">
                        {t(translations.governance.proposals.voteStatus)}
                      </th>
                      <th className="tw-text-left tw-hidden xl:tw-table-cell xl:tw-w-1/5">
                        {t(translations.governance.proposals.votingEnds)}
                      </th>
                      <th className="tw-text-left tw-w-1/3 xl:tw-w-1/5">
                        {t(translations.governance.actions.title)}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tw-mt-5">
                    {loading && !items.length && (
                      <>
                        <tr>
                          <td>
                            <div className="tw-w-full tw-skeleton tw-h-4" />
                          </td>
                          <td>
                            <div className="tw-w-full tw-skeleton tw-h-4" />
                          </td>
                          <td>
                            <div className="tw-w-full tw-skeleton tw-h-4" />
                          </td>
                          <td>
                            <div className="tw-w-full tw-skeleton tw-h-4" />
                          </td>
                          <td>
                            <div className="tw-w-full tw-skeleton tw-h-4" />
                          </td>
                        </tr>
                      </>
                    )}
                    {!loading && total === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="tw-text-center tw-font-normal"
                        >
                          No proposals yet.
                        </td>
                      </tr>
                    )}
                    {!loading &&
                      items.map(item => (
                        <ProposalRow
                          key={item.id + item.contractName}
                          proposal={item}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </>
            {total > items.length && (
              <div className="tw-text-center tw-mb-5">
                <button
                  // to={`${match.url}/proposals`}
                  onClick={loadAllProposals}
                  className="tw-inline-block tw-text-center tw-px-3 tw-py-2 tw-text-sm tw-text-primary tw-uppercase tw-font-rowdies tw-font-light hover:tw-text-primary-75 hover:tw-no-underline tw-tracking-normal"
                >
                  View All Proposals
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
