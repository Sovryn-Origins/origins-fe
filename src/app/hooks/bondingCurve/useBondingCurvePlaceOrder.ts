import { Asset } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { contractWriter } from 'utils/sovryn/contract-writer';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { useAccount } from 'app/hooks/useAccount';

export const useBondingCurvePlaceOrder = (isPurchase: boolean) => {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'MYNT_Controller',
    isPurchase ? 'openBuyOrder' : 'openSellOrder',
  );

  return {
    placeOrder: async (weiAmount: string) => {
      const tx = await contractWriter.checkAndApprove(
        isPurchase ? Asset.SOV : Asset.MYNT,
        // getContract(isPurchase ? 'SOV_token' : 'MYNT_token').address,
        getContract('MYNT_MarketMaker').address,
        weiAmount,
      );

      if (tx.rejected) return;

      send([getContract('SOV_token').address, weiAmount], { from: account });
    },
    ...rest,
  };
};
