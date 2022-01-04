import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const BuyPage = lazyLoad(
  () => import('./index'),
  module => module.BuyPage,
  { fallback: <PageSkeleton /> },
);
