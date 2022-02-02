import { buyStatusKey } from 'utils/classifiers';
import { local } from 'utils/storage';

export interface ISalesData {
  step: number;
}

const defaultData: ISalesData = {
  step: 1,
};

const buyStorage = {
  saveData: (data: ISalesData): void => {
    local.setItem(buyStatusKey, JSON.stringify(data));
  },
  getData: (): ISalesData => {
    const data = local.getItem(buyStatusKey);
    return data ? JSON.parse(data) : defaultData;
  },
};

export default buyStorage;
