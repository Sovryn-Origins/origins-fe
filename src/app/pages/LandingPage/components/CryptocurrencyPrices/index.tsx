import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { bignumber } from 'mathjs';

import { translations } from 'locales/i18n';
import { IPairs, IAssets, IAssetData } from './types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { numberToUSD, toNumberFormat } from 'utils/display-text/format';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { Asset } from 'types';
import { AssetDetails } from 'utils/models/asset-details';
import { LoadableValue } from 'app/components/LoadableValue';
import styles from './index.module.scss';

interface ICryptocurrencyPricesProps {
  pairs?: IPairs;
  isLoading: boolean;
  assetData?: IAssets;
  assetLoading: boolean;
  className?: string;
}

const listingTokens = ['USDT', 'RBTC', 'SOV', 'FISH', 'MYNT', 'ZERO', 'OG'];

export const CryptocurrencyPrices: React.FC<ICryptocurrencyPricesProps> = ({
  pairs,
  assetData,
  isLoading,
  assetLoading,
  className,
}) => {
  const { t } = useTranslation();

  const list = useMemo(() => {
    if (!pairs) return [];
    return Object.keys(pairs)
      .map(key => pairs[key])
      .filter(pair => listingTokens.includes(pair.base_symbol))
      .filter(pair => pair);
  }, [pairs]);

  if (!isLoading && !list.length) return null;

  return (
    <div className={classNames(className, styles.wrapper)}>
      <div className={styles.title}>
        {t(translations.landingPage.cryptocurrencyPrices.title)}
      </div>
      <div className="sovryn-table tw-pt-6">
        <table className="tw-w-full">
          <thead>
            <tr>
              <th className="tw-pl-6 tw-text-lg tw-font-rowdies tw-font-light tw-min-w-36">
                {t(translations.landingPage.cryptocurrencyPrices.asset)}
              </th>
              <th className="tw-text-left tw-pl-6 tw-font-rowdies tw-font-light">
                {t(translations.landingPage.cryptocurrencyPrices.price)}
              </th>
              <th className="tw-text-left tw-pl-6 tw-font-rowdies tw-font-light">
                {t(translations.landingPage.cryptocurrencyPrices['24h'])}
              </th>
              <th className="tw-text-left tw-pl-6 tw-font-rowdies tw-font-light">
                {t(translations.landingPage.cryptocurrencyPrices['7d'])}
              </th>
              <th className="tw-text-left tw-pl-6 tw-font-rowdies tw-font-light">
                <div className="tw-inline-flex tw-items-center">
                  {t(translations.landingPage.cryptocurrencyPrices.marketCap)}
                </div>
              </th>
              <th className="tw-text-left">
                {t(
                  translations.landingPage.cryptocurrencyPrices
                    .circulatingSupply,
                )}
              </th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {isLoading && (
              <tr key={'loading'}>
                <td colSpan={99}>
                  <SkeletonRow
                    loadingText={t(translations.topUpHistory.loading)}
                  />
                </td>
              </tr>
            )}

            {!isLoading &&
              list.map(pair => {
                const assetDetails = AssetsDictionary.getByTokenContractAddress(
                  pair.base_id,
                );
                if (!assetDetails) {
                  return <></>;
                }
                let rbtcRow;

                if (assetDetails.asset === Asset.USDT) {
                  const rbtcDetails = AssetsDictionary.getByTokenContractAddress(
                    pair.quote_id,
                  );
                  rbtcRow = (
                    <Row
                      assetDetails={rbtcDetails}
                      price24h={-pair.price_change_percent_24h}
                      priceWeek={-pair.price_change_week}
                      lastPrice={1 / pair.last_price}
                      assetData={assetData && assetData[pair?.quote_id]}
                      assetLoading={assetLoading}
                    />
                  );
                }

                return (
                  <React.Fragment key={pair.base_id}>
                    {rbtcRow}
                    {!rbtcRow && (
                      <Row
                        assetDetails={assetDetails}
                        price24h={pair.price_change_percent_24h_usd}
                        priceWeek={pair.price_change_week_usd}
                        lastPrice={pair.last_price_usd}
                        assetData={assetData && assetData[pair?.base_id]}
                        assetLoading={assetLoading}
                      />
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface IRowProps {
  assetData?: IAssetData;
  assetDetails?: AssetDetails;
  price24h: number;
  priceWeek: number;
  lastPrice: number;
  assetLoading: boolean;
}

const Row: React.FC<IRowProps> = ({
  assetData,
  assetDetails,
  price24h,
  priceWeek,
  lastPrice,
  assetLoading,
}) => {
  if (!assetDetails) return <></>;

  return (
    <>
      <tr>
        <td className="tw-text-left tw-text-sm tw-font-inter tw-whitespace-nowrap">
          <img
            className="tw-inline"
            style={{ width: '38px' }}
            src={assetDetails.logoSvg}
            alt={assetDetails.symbol}
          />
          <strong className="tw-ml-4">
            <AssetSymbolRenderer asset={assetDetails.asset} />
          </strong>
        </td>

        <td className="tw-text-left tw-text-sm tw-font-inter tw-whitespace-nowrap">
          {numberToUSD(lastPrice || 0)}
        </td>

        <td className={'tw-text-left tw-text-sm tw-whitespace-nowrap'}>
          <PriceChange value={price24h} />
        </td>

        <td className={'tw-text-left tw-text-sm tw-whitespace-nowrap'}>
          <PriceChange value={priceWeek} />
        </td>

        <td
          className={
            'tw-text-left tw-text-sm tw-font-inter tw-whitespace-nowrap'
          }
        >
          <LoadableValue
            loading={assetLoading}
            value={
              assetData?.circulating_supply
                ? `${numberToUSD(
                    bignumber(assetData?.circulating_supply || '0')
                      .mul(lastPrice || '0')
                      .toNumber(),
                    0,
                  )}`
                : ''
            }
          />
        </td>
        <td
          className={
            'tw-text-left tw-text-sm tw-font-inter tw-whitespace-nowrap'
          }
        >
          <LoadableValue
            loading={assetLoading}
            value={
              assetData?.circulating_supply
                ? toNumberFormat(assetData?.circulating_supply || 0, 2)
                : ''
            }
          />
        </td>
      </tr>
    </>
  );
};

interface IPriceChangeProps {
  value: number;
}

const PriceChange: React.FC<IPriceChangeProps> = ({ value }) => {
  let numberString = toNumberFormat(value || 0, 2);
  numberString =
    numberString === '0.00' || numberString === '-0.00' ? '0' : numberString;
  const noChange = numberString === '0';

  return (
    <div
      className={classNames(
        'tw-inline-flex tw-items-center tw-ml-auto tw-font-inter',
        {
          'tw-text-trade-short': value < 0 && !noChange,
          'tw-text-trade-long': value > 0 && !noChange,
        },
      )}
    >
      {numberString}%
      {/* {value > 0 && !noChange && (
        <img className="tw-w-3 tw-ml-2" src={arrowUp} alt={'up'} />
      )}
      {value < 0 && !noChange && (
        <img className="tw-w-3 tw-ml-2" src={arrowDown} alt={'down'} />
      )} */}
    </div>
  );
};
