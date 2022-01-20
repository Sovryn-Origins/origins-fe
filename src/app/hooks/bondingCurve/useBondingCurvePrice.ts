import { useEffect, useMemo, useState } from 'react';
import { bondingCurveTreasuryAddress, currentChainId } from 'utils/classifiers';
import { contractReader } from 'utils/sovryn/contract-reader';

const treasuryAddress = bondingCurveTreasuryAddress[currentChainId];
const connectorWeight = 400000;

export const useBondingCurvePrice = (amount: string, isPurchase: boolean) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [treasuryBalance, setTreasuryBalance] = useState('');
  const [totalSupply, setTotalSupply] = useState('');

  useEffect(() => {
    contractReader
      .call<string>('SOV_token', 'balanceOf', [treasuryAddress])
      .then(result => {
        setTreasuryBalance(result);
      });
  });

  useEffect(() => {
    contractReader
      .call<string>('MYNT_token', 'totalSupply', [])
      .then(result => setTotalSupply(result));
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!totalSupply || !treasuryBalance || !amount) return;

    const getSalePrice = async () => {
      setLoading(true);
      const salePrice = await contractReader.call<string>(
        'BancorFormula',
        isPurchase ? 'calculatePurchaseReturn' : 'calculateSaleReturn',
        [totalSupply, treasuryBalance, connectorWeight, amount],
      );

      if (!cancelled) {
        setLoading(false);
        setValue(salePrice);
      }
    };

    getSalePrice();

    return () => {
      cancelled = true;
      // clearTimeout(retryTimer);
    };
  });

  return useMemo(() => ({ loading, value }), [loading, value]);
};
