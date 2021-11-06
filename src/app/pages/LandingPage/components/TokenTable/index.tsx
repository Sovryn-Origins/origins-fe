import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { LoadableValue } from 'app/components/LoadableValue';
import styles from './index.module.scss';

interface ITokenTableProps {
  className?: string;
}

const assets = [Asset.RBTC, Asset.SOV, Asset.OG, Asset.FISH];

interface ITokenRowProps {
  asset: Asset;
  price: string;
  changeOfDay: number;
  changeOf7Days: number;
  marketCap: string;
  circulatingSupply: string;
}

const TokenListData: ITokenRowProps[] = [
  {
    asset: Asset.RBTC,
    price: '97434140 STATS',
    changeOfDay: 4.68,
    changeOf7Days: 19.03,
    marketCap: 'USD 131,311,852',
    circulatingSupply: '209,914',
  },
  {
    asset: Asset.SOV,
    price: '61268 STATS',
    changeOfDay: 5.02,
    changeOf7Days: 20.02,
    marketCap: 'USD 3,382,886,198',
    circulatingSupply: '5,003,885',
  },
  {
    asset: Asset.OG,
    price: '20234 STATS',
    changeOfDay: 4.61,
    changeOf7Days: 17.5,
    marketCap: 'USD 24,280,068',
    circulatingSupply: '309,914',
  },
  {
    asset: Asset.FISH,
    price: '1000 STATS',
    changeOfDay: 0.178,
    changeOf7Days: 0.55,
    marketCap: 'USD 2,283,060',
    circulatingSupply: '109,914',
  },
];

export const TokenTable: React.FC<ITokenTableProps> = ({ className }) => {
  const { t } = useTranslation();
  return (
    <div className={classNames(className, styles.wrapper)}>
      <p className={styles.title}>
        {t(translations.landingPage.tokensTable.title)}
      </p>
      <div className="sovryn-table tw-pt-6">
        <table className="tw-w-full">
          <thead>
            <tr>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">Asset</td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">Price</td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">24h%</td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">7d%</td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">
                Market Cap
              </td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">
                Circulating Supply
              </td>
            </tr>
          </thead>
          <tbody>
            {TokenListData.map(tokenInfo => (
              <TokenRow key={tokenInfo.asset} {...tokenInfo} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TokenRow: React.FC<ITokenRowProps> = ({
  asset,
  price,
  changeOfDay,
  changeOf7Days,
  marketCap,
  circulatingSupply,
}) => {
  return (
    <tr>
      <td className="tw-font-inter">
        <AssetRenderer asset={asset} showImage />
      </td>
      <td className="tw-font-inter">{price}</td>
      <td
        className={classNames('tw-text-left tw-font-inter', {
          'tw-text-trade-long': changeOfDay > 0,
          'tw-text-trade-short': changeOfDay < 0,
        })}
      >
        {changeOfDay} %
      </td>
      <td
        className={classNames(
          'tw-text-left tw-font-inter tw-hidden md:tw-table-cell',
          {
            'tw-text-trade-long': changeOf7Days > 0,
            'tw-text-trade-short': changeOf7Days < 0,
          },
        )}
      >
        {changeOf7Days} %
      </td>
      <td className="tw-font-inter">{marketCap}</td>
      <td className="tw-font-inter">{circulatingSupply}</td>
    </tr>
  );
};
