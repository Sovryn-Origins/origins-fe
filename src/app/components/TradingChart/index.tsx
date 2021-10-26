/**
 *
 * TradingChart
 *
 * Implementation of TradingView Charting Library (v18.043). Please check the following link
 * and make any relevant changes before updating the library version:
 * https://github.com/tradingview/charting_library/wiki/Breaking-Changes
 */
// import React, { useEffect, useLayoutEffect, useState } from 'react';
import React, { useState } from 'react';
import cn from 'classnames';

import { Skeleton } from '../PageSkeleton';
// import Datafeed from './datafeed';
// import Storage from './storage';
// import { noop } from '../../constants';

export enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export interface ChartContainerProps {
  symbol: string;
  theme?: Theme;
}

export function TradingChart(props: ChartContainerProps) {
  const [hasCharts] = useState<boolean>(false);

  return (
    <div
      className={cn(
        'tw-w-full tw-h-full tw-flex tw-rounded tw-items-center tw-justify-center tw-overflow-hidden tw-rounded',
        hasCharts && 'tw-border',
      )}
      style={{ minWidth: 270, minHeight: 500 }}
    >
      <>
        <div
          id="tv_chart_container"
          className={cn(
            'tv-chart-container tw-flex-grow',
            !hasCharts && 'tw-hidden',
          )}
        >
          TradingView Charts disabled for external contributors
        </div>
        <div
          className={cn(
            'tw-w-full tw-h-full tw-content-end tw-gap-4',
            hasCharts ? 'tw-hidden' : 'tw-flex',
          )}
        >
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="50%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="30%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="80%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="70%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="65%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="30%" />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-content-end tw-h-full tw-w-full">
            <Skeleton height="55%" />
          </div>
        </div>
      </>
    </div>
  );
}

TradingChart.defaultProps = {
  theme: Theme.DARK,
};
