import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isAddress } from 'web3-utils';
import { Icon } from '@blueprintjs/core';
import { bignumber } from 'mathjs';

import { useAccount } from 'app/hooks/useAccount';
import { useStaking_getCurrentVotes } from 'app/hooks/staking/useStaking_getCurrentVotes';
import { governance_proposalThreshold } from 'app/hooks/governance/governance_proposalThreshold';
import { governance_propose } from 'app/hooks/governance/governance_propose';
import { fromWei } from 'utils/blockchain/math-helpers';
import { toastError } from 'utils/toaster';

const initRow = {
  target: '',
  value: '',
  signature: '',
  calldata: '',
};

const governor = 'governorAdmin';

export const Propose: React.FC = () => {
  const history = useHistory();
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState([initRow]);
  const account = useAccount();
  const votes = useStaking_getCurrentVotes(account);

  const updateRow = (value, field, rowIndex) => {
    const newRows = [...rows.map(row => ({ ...row }))];
    newRows[rowIndex][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    if (invalidRows()) return;
    const newRows = [...rows];
    newRows.push(initRow);
    setRows(newRows);
  };

  const removeRow = index => {
    if (rows.length < 2) return;
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const invalidRows = () =>
    !!rows.find(
      row =>
        !isAddress(String(row.target).toLowerCase()) ||
        !row.value ||
        !row.signature ||
        !row.calldata,
    );

  const invalidForm = () => {
    return invalidRows() || !description || rows.length < 1;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (invalidForm()) return;

    try {
      const threshold = await governance_proposalThreshold(governor);
      if (bignumber(votes.value).lessThan(`${threshold}`)) {
        const minVotingPower = Number(fromWei(threshold)).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          },
        );
        toastError(
          `Your voting power must be at least ${minVotingPower} to make a proposal`,
        );
        return;
      }

      const targets = rows.map(row => row.target);
      const values = rows.map(row => row.value);
      const signatures = rows.map(row => row.signature);
      const calldatas = rows.map(row => row.calldata);

      await governance_propose(
        targets,
        values,
        signatures,
        calldatas,
        description,
        account,
        governor,
      );
      history.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container tw-max-w-screen-2xl tw-w-full tw-mx-auto tw-px-6 tw-py-8 tw-bg-gray-1 tw-rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="tw-relative tw-flex tw-flex-col md:tw-flex-row tw-items-start md:tw-items-center">
          <label className="tw-text-sm md:tw-text-base tw-font-rowdies tw-uppercase">
            Send proposal:
          </label>
        </div>

        <textarea
          className="tw-mb-2 tw-mt-8 tw-appearance-none tw-border tw-text-md tw-font-medium tw-font-inter tw-text-left tw-rounded-lg tw-w-full tw-p-4 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
          placeholder="Description"
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
        ></textarea>

        {rows.map((row, i) => {
          return (
            <div
              className="tw-relative tw-mt-2 tw-border tw-border-white tw-rounded-lg tw-pb-4 tw-pt-10 tw-px-4"
              key={i}
            >
              <Icon
                onClick={() => removeRow(i)}
                className={
                  'tw-absolute tw-top-2 tw-right-4' +
                  (rows.length < 2 ? ' tw-opacity-50' : ' tw-cursor-pointer')
                }
                icon="remove"
                iconSize={15}
                color="white"
              />
              <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-mb-2 tw-px-2 md:tw-px-0">
                <input
                  className="tw-mr-2 tw-appearance-none tw-border tw-text-sm tw-font-medium tw-font-inter tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-mb-2 md:tw-mb-0 tw-py-2 tw-px-2 md:tw-px-14 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
                  type="text"
                  value={row.target}
                  onChange={e => updateRow(e.target.value, 'target', i)}
                  placeholder="Target"
                />
                <input
                  className="tw-ml-2 tw-appearance-none tw-border tw-text-sm tw-font-medium tw-font-inter tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-2 md:tw-px-14 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
                  type="text"
                  value={row.value}
                  onChange={e => updateRow(e.target.value, 'value', i)}
                  placeholder="Value"
                />
              </div>
              <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-px-2 md:tw-px-0">
                <input
                  className="tw-mr-2 tw-appearance-none tw-border tw-text-sm tw-font-medium tw-font-inter tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-mb-2 md:tw-mb-0 tw-py-2 tw-px-2 md:tw-px-14 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
                  type="text"
                  value={row.signature}
                  onChange={e => updateRow(e.target.value, 'signature', i)}
                  placeholder="Signature"
                />
                <input
                  className="tw-ml-2 tw-appearance-none tw-border tw-text-sm tw-font-medium tw-font-inter tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-2 md:tw-px-14 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
                  type="text"
                  value={row.calldata}
                  onChange={e => updateRow(e.target.value, 'calldata', i)}
                  placeholder="Calldata"
                />
              </div>
            </div>
          );
        })}

        <div className="tw-text-center">
          <Icon
            onClick={() => addRow()}
            className={
              'tw-mt-2 tw-mb-8 tw-mx-auto tw-cursor-pointer' +
              (invalidRows() ? ' tw-opacity-50' : '')
            }
            icon="add"
            iconSize={35}
            color="white"
          />
        </div>

        <div className="tw-grid tw-grid-rows-1 tw-grid-flow-col tw-gap-4 tw-max-w-3xl tw-mx-auto">
          <button
            type="submit"
            className={`tw-uppercase tw-w-full tw-text-black tw-bg-primary tw-text-base tw-font-normal tw-font-rowdies tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
              invalidForm() &&
              'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
            }`}
            disabled={invalidForm()}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => history.goBack()}
            className="tw-border tw-border-primary tw-rounded-lg tw-text-primary tw-uppercase tw-w-full tw-text-base tw-font-normal tw-font-rowdies tw-px-4 tw-py-2 hover:tw-bg-primary hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
