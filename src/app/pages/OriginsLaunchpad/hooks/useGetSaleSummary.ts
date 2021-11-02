import { useEffect, useState } from 'react';
import { ISaleSummary } from '../types';

// for demo data
import imgBabelfish from 'assets/origins_launchpad/BABELFISH_NFT.svg';
import imgGenesis from 'assets/origins_launchpad/GEN-NFT-COMMUNITY.svg';
import imgOrigins from 'assets/origins_launchpad/GURU_BADGER_NFT.svg';

const saleSummary: ISaleSummary = {
  upcoming: [
    {
      saleName: 'FISH',
      date: '10th - 13th Feb 2021',
      backgroundImage: imgBabelfish,
      price: '9736 SATS',
      saleAllocation: '20,000,000 SOV',
      totalRaised: '195 BTC',
      participatingWallets: '3267',
      saleDuration: 'APPROX 48HR',
    },
    {
      saleName: 'ORIGIN',
      date: '10th - 13th Feb 2021',
      backgroundImage: imgGenesis,
      price: '9736 SATS',
      saleAllocation: '20,000,000 SOV',
      totalRaised: '195 BTC',
      participatingWallets: '3267',
      saleDuration: 'APPROX 48HR',
    },
  ],
  live: [
    {
      saleName: 'FISH',
      date: '10th - 13th Feb 2021',
      backgroundImage: imgBabelfish,
      price: '9736 SATS',
      saleAllocation: '20,000,000 SOV',
      totalRaised: '195 BTC',
      participatingWallets: '3267',
      saleDuration: 'APPROX 48HR',
    },
    {
      saleName: 'SOV Origins sale',
      date: '10th - 13th Feb 2021',
      backgroundImage: imgGenesis,
      price: '9736 SATS',
      saleAllocation: '20,000,000 SOV',
      totalRaised: '195 BTC',
      participatingWallets: '3267',
      saleDuration: 'APPROX 48HR',
    },
    {
      saleName: 'SOV Genesis sale',
      date: '10th - 13th Feb 2021',
      backgroundImage: imgOrigins,
      price: '9736 SATS',
      saleAllocation: '20,000,000 SOV',
      totalRaised: '195 BTC',
      participatingWallets: '3267',
      saleDuration: 'APPROX 48HR',
    },
  ],
  previous: [
    {
      saleName: 'FISH',
      date: '10th - 13th Feb 2021',
      backgroundImage: imgBabelfish,
      price: '9736 SATS',
      saleAllocation: '20,000,000 SOV',
      totalRaised: '195 BTC',
      participatingWallets: '3267',
      saleDuration: 'APPROX 48HR',
    },
    {
      saleName: 'SOV Origins sale',
      date: '10th - 13th Feb 2021',
      backgroundImage: imgOrigins,
      price: '9736 SATS',
      saleAllocation: '20,000,000 SOV',
      totalRaised: '195 BTC',
      participatingWallets: '3267',
      saleDuration: 'APPROX 48HR',
    },
    {
      saleName: 'SOV Genesis sale',
      date: '10th - 13th Feb 2021',
      backgroundImage: imgGenesis,
      price: '9736 SATS',
      saleAllocation: '20,000,000 SOV',
      totalRaised: '195 BTC',
      participatingWallets: '3267',
      saleDuration: 'APPROX 48HR',
    },
  ],
};

export const useGetSaleSummary = () => {
  const [summary, setSummary] = useState<ISaleSummary>(saleSummary);
  return summary;
};
