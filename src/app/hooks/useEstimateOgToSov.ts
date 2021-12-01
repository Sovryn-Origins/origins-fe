import { useEffect, useMemo, useState } from 'react';
import { bignumber } from 'mathjs';
import { contractReader } from 'utils/sovryn/contract-reader';
import { getContract } from 'utils/blockchain/contract-helpers';

const connectorWeight = 400000;

const marketMakerAddress = getContract('OGMarketMaker').address;

export const useEstimateOgToSov = (weiAmount: string) => {
  const [depositRate, setDepositRate] = useState(1);
  const [totalSupply, setTotalSupply] = useState('1');
  const [vaultAddress, setVaultAddress] = useState('');
  const [collateral, setCollateral] = useState('0');

  const sovAmount = useMemo(() => {
    if (!marketMakerAddress) {
      return bignumber(weiAmount).div(depositRate).toString();
    } else {
      return bignumber(weiAmount)
        .mul(collateral)
        .div(totalSupply)
        .div(connectorWeight)
        .toString();
    }
  }, [depositRate, totalSupply, collateral, weiAmount]);

  useEffect(() => {
    contractReader.call('originsBase', 'readTierPartA', [2]).then(result => {
      setDepositRate(result['_depositRate']);
    });
  }, []);

  useEffect(() => {
    contractReader.call<string>('OG_token', 'totalSupply', []).then(result => {
      setTotalSupply(result);
    });
  }, []);

  useEffect(() => {
    if (!marketMakerAddress) return;

    contractReader
      .call<string>('OGMarketMaker', 'reserve', [])
      .then(result => setVaultAddress(result));
  }, []);

  useEffect(() => {
    if (!vaultAddress) return;

    contractReader
      .call<string>('SOV_token', 'balanceOf', [vaultAddress])
      .then(result => {
        setCollateral(result);
      })
      .catch(() => {});
  }, [vaultAddress]);

  return sovAmount;
};
