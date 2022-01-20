import { useSendContractTx } from '../useSendContractTx';
import { Asset } from '../../../types';
import { TxType } from '../../../store/global/transactions-store/types';
import { getTokenContract } from '../../../utils/blockchain/contract-helpers';
import { gasLimit } from '../../../utils/classifiers';

export function useSwapBonding_External(
  sourceToken: Asset,
  destToken: Asset,
  receiver: string,
  returnToSender: string,
  sourceTokenAmount: string,
  requiredDestTokenAmount: string,
  minReturn: string,
  swapData: string,
  stage: string,
  batchId: number,
) {
  const { send, ...rest } = useSendContractTx(
    'MYNT_Controller',
    stage === 'buy'
      ? sourceToken === 'SOV'
        ? 'openBuyOrder'
        : 'openSellOrder'
      : sourceToken === 'SOV'
      ? 'claimBuyOrder'
      : 'claimSellOrder',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) => {
      return send(
        stage === 'buy'
          ? [getTokenContract(sourceToken).address, sourceTokenAmount]
          : [receiver, batchId, getTokenContract(sourceToken).address],
        {
          value: sourceToken === Asset.RBTC ? sourceTokenAmount : '0',
          gas: gasLimit[TxType.BONDING],
        },
        {
          type: stage === 'buy' ? TxType.BONDING : TxType.CLAIMING,
          approveTransactionHash: approveTx,
          customData: {
            sourceToken,
            targetToken: destToken,
            amount: sourceTokenAmount,
            date: new Date().getTime() / 1000,
            minReturn: requiredDestTokenAmount,
            stage: stage,
            batchId: batchId,
          },
        },
      );
    },
    ...rest,
  };
}
