import { SovrynNetwork } from 'utils/sovryn/sovryn-network';
import { Sovryn } from 'utils/sovryn/index';
import { ContractName } from 'utils/types/contracts';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { getContract } from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
export type ReaderOption = { fromBlock: number; toBlock: number | 'latest' };

interface returnVal {
  _fromAmount: string;
  _fromToken: string;
  _toAmount: string;
  _toToken: string;
  _trader: string;
}
interface History {
  returnVal: returnVal;
  beneficiary: string;
  from_token: string;
  to_token: string;
  timestamp: number;
  transaction_hash: string;
  block: number;
  event: string;
  state: string;
}
class useBondHistory {
  private sovryn: SovrynNetwork;
  private contracts: { [address: string]: Contract } = {};
  constructor() {
    this.sovryn = Sovryn;
  }

  public async getPastEvents(
    contractName: ContractName,
    eventName: string,
    options: ReaderOption = { fromBlock: 0, toBlock: 'latest' },
  ) {
    window.ethereum.enable();
    const web3 = new Web3(Web3.givenProvider);
    const { address, abi } = getContract(contractName);
    const contractMarket = new web3.eth.Contract(abi, address);
    const accounts = await web3.eth.getAccounts();

    var history = await contractMarket.getPastEvents(eventName, {
      fromBlock: 0,
      toBlock: 'latest',
    });

    let historyList: History[] = [];

    const listLength = 50;
    var listTemp = 0;
    for (let i = history.length; i > 0; i--) {
      var returnValue: returnVal = {
        _fromAmount: '0',
        _fromToken: '0',
        _toAmount: '0',
        _toToken: '0',
        _trader: '0',
      };
      var oneData: History = {
        returnVal: returnValue,
        beneficiary: '',
        from_token: '',
        to_token: '',
        timestamp: 0,
        transaction_hash: '',
        block: 0,
        event: '',
        state: '',
      };
      if (history[i - 1]?.returnValues?.buyer === accounts[0].toString()) {
        listTemp++;
        oneData.beneficiary = accounts[0].toString();
        oneData.returnVal._trader = accounts[0].toString();
        oneData.transaction_hash = history[i - 1].transactionHash;
        oneData.block = history[i - 1].blockNumber;
        oneData.event = history[i - 1].event;
        const fromToken =
          history[i - 1].event === 'ClaimBuyOrder'
            ? getContract('SOV_token').address
            : getContract('MYNT_token').address;
        const toToken =
          history[i - 1].event === 'ClaimBuyOrder'
            ? getContract('MYNT_token').address
            : getContract('SOV_token').address;
        oneData.from_token = fromToken;
        oneData.returnVal._toToken = toToken;
        oneData.to_token = toToken;
        const fromAmount = history[i - 1].returnValues.amount;
        oneData.returnVal._fromAmount = fromAmount;
        oneData.returnVal._fromToken = fromToken;

        try {
          const val = await contractReader.call(
            'sovrynProtocol',
            'getSwapExpectedReturn',
            [fromToken, toToken, fromAmount],
            accounts[0] || undefined,
          );
          oneData.returnVal._toAmount = val.toString();
        } catch (e) {}

        historyList.push(oneData);
        if (listTemp === listLength) {
          break;
        }
      }
    }

    historyList.forEach(async (item, index) => {
      let transactionDetail = await web3.eth.getBlock(item.block);
      historyList[index].timestamp = parseInt(
        transactionDetail.timestamp.toString(),
      );
    });
    return historyList;
  }
}

export const bondHistory = new useBondHistory();
