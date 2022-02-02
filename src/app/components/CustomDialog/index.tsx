/**
 *
 * CustomDialog
 *
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog, Icon } from '@blueprintjs/core';
import styles from './index.module.scss';

interface Props {
  show: boolean;
  children: React.ReactNode;
}

export function CustomDialog(props: Props) {
  const history = useHistory();
  const closeModal = e => {
    e.stopPropagation();
    history.goBack();
  };

  React.useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <Dialog
      isOpen={props.show}
      className="custom-dialog xl:tw-w-4/5 tw-w-11/12 tw-rounded-lg tw-relative"
    >
      <div className="tw-flex tw-justify-end">
        <button onClick={closeModal} className={styles.styledClose}>
          <Icon icon="cross" iconSize={35} color="white" />
        </button>
      </div>
      <div className="">{props.children}</div>
    </Dialog>
  );
}
