import React from 'react';
import { Dialog } from '@blueprintjs/core';
import classNames from 'classnames';

interface Props {
  show: boolean;
  content?: any;
  className?: string;
}

export function Modal(props: Props) {
  return (
    <Dialog
      isOpen={props.show}
      className={classNames(
        'tw-bg-gray-1 tw-border-0 tw-max-w-md tw-w-full tw-px-6 tw-py-6 md:tw-px-9 md:tw-py-7 sm:tw-p-4 tw-rounded-lg tw-relative',
        props.className,
      )}
    >
      {props.content}
    </Dialog>
  );
}
