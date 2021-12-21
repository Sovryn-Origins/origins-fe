import { WalletProviderState } from 'app/containers/WalletProvider/types';
import { FastBtcFormState } from 'app/containers/FastBtcForm/types';
import { EventsStoreState } from '../store/global/events-store/types';
import { TransactionsStoreState } from '../store/global/transactions-store/types';
import { MaintenanceStoreState } from '../store/global/maintenance-store/types';
import { FastBtcDialogState } from 'app/containers/FastBtcDialog/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  walletProvider?: WalletProviderState;
  fastBtcForm?: FastBtcFormState;
  eventsState?: EventsStoreState;
  transactionsState?: TransactionsStoreState;
  maintenanceState?: MaintenanceStoreState;
  fastBtcDialog?: FastBtcDialogState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
