/**
 *
 * Asynchronously loads the component for StakePage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const GovernancePage = lazyLoad(
  () => import('./index'),
  module => module.GovernancePage,
  { fallback: <PageSkeleton /> },
);
