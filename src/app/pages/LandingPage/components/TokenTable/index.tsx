import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import { AssetRenderer } from 'app/components/AssetRenderer';
// import { LoadableValue } from 'app/components/LoadableValue';
import styles from './index.module.scss';

interface ITokenTableProps {
  className?: string;
}

interface ITokenRowProps {
  asset: Asset;
  price: string;
  percentOfDay: number;
  percentOf7Days: number;
  marketCap: string;
  circulatingSupply: string;
}

const TokenListData: ITokenRowProps[] = [
  {
    asset: Asset.RBTC,
    price: '97434140 STATS',
    percentOfDay: 4.68,
    percentOf7Days: 19.03,
    marketCap: 'USD 131,311,852',
    circulatingSupply: '209,914',
  },
  {
    asset: Asset.SOV,
    price: '61268 STATS',
    percentOfDay: 5.02,
    percentOf7Days: 20.02,
    marketCap: 'USD 3,382,886,198',
    circulatingSupply: '5,003,885',
  },
  {
    asset: Asset.OG,
    price: '20234 STATS',
    percentOfDay: 4.61,
    percentOf7Days: 17.5,
    marketCap: 'USD 24,280,068',
    circulatingSupply: '309,914',
  },
  {
    asset: Asset.FISH,
    price: '1000 STATS',
    percentOfDay: 0.178,
    percentOf7Days: 0.55,
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
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">
                {t(translations.landingPage.tokensTable.columns.asset)}
              </td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">
                {t(translations.landingPage.tokensTable.columns.price)}
              </td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">
                {t(translations.landingPage.tokensTable.columns.percentOfDay)}
              </td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">
                {t(translations.landingPage.tokensTable.columns.percentOf7Days)}
              </td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">
                {t(translations.landingPage.tokensTable.columns.marketCap)}
              </td>
              <td className="tw-pl-6 tw-font-rowdies tw-font-light">
                {t(
                  translations.landingPage.tokensTable.columns
                    .circulatingSupply,
                )}
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
  percentOfDay,
  percentOf7Days,
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
          'tw-text-trade-long': percentOfDay > 0,
          'tw-text-trade-short': percentOfDay < 0,
        })}
      >
        {percentOfDay} %
      </td>
      <td
        className={classNames(
          'tw-text-left tw-font-inter tw-hidden md:tw-table-cell',
          {
            'tw-text-trade-long': percentOf7Days > 0,
            'tw-text-trade-short': percentOf7Days < 0,
          },
        )}
      >
        {percentOf7Days} %
      </td>
      <td className="tw-font-inter">{marketCap}</td>
      <td className="tw-font-inter">{circulatingSupply}</td>
    </tr>
  );
};
