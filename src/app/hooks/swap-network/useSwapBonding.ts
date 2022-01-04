import { Asset } from 'types/asset';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';
import { useSwapBonding_External } from './useSwapBonding_External';
import { getContract } from '../../../utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';

export function useSwapsBonding(
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
  hash: string,
) {
  const { send, ...txState } = useSwapBonding_External(
    sourceToken,
    destToken,
    receiver,
    returnToSender,
    sourceTokenAmount,
    requiredDestTokenAmount,
    minReturn,
    swapData,
    stage,
    batchId,
  );

  return {
    send: async () => {
      let tx: CheckAndApproveResult = {};
      if (stage === 'buy') {
        tx = await contractWriter.checkAndApprove(
          sourceToken,
          getContract('MYNT_MarketMaker').address,
          sourceTokenAmount,
        );
        if (tx.rejected) {
          return;
        }
      } else {
        let nonce = await contractReader.nonce(receiver);
        tx.nonce = nonce;
        tx.approveTx = hash;
      }
      await send(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}
