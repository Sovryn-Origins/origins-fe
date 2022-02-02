import React from 'react';
import classNames from 'classnames';
import { Text } from '@blueprintjs/core';
import { Theme } from 'types/theme';
import styles from './index.module.scss';

interface Props {
  text: string;
  active: boolean;
  onClick: () => void;
  theme?: Theme;
  textClassName?: string;
}

export function Tab(props: Props) {
  return (
    <button
      className={classNames('btn', styles.tab, {
        'tw-text-white hover:tw-text-sov-white': props.theme !== Theme.LIGHT,
        'tw-text-black hover:tw-text-gray-4': props.theme === Theme.LIGHT,
        [styles.active]: props.active,
      })}
      onClick={() => props.onClick()}
    >
      <Text
        className={classNames('tw-font-rowdies', props.textClassName)}
        ellipsize
      >
        {props.text}
      </Text>
    </button>
  );
}
