import { SovrynNetwork } from 'utils/sovryn/sovryn-network';
import { Sovryn } from 'utils/sovryn/index';
import { ContractName } from 'utils/types/contracts';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { getContract } from 'utils/blockchain/contract-helpers';
export type ReaderOption = { fromBlock: number; toBlock: number | 'latest' };

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
    var history = await contractMarket.getPastEvents(eventName, {
      fromBlock: 0,
      toBlock: 'latest',
    });
    console.log('>>>>id::::', history);
    return history;
  }
}

export const bondHistory = new useBondHistory();
