import type { ActionType } from '../../utils/types';
import {
  INIT_APP_FAIL,
  INIT_APP_SUCCESS,
  SET_IS_BACKUP_DONE,
  SET_IS_FETCHING_UTXOS,
  SET_SIGNED_UP,
} from '../actions/appActions';

export interface AppState {
  appInit: boolean;
  isSignedUp: boolean;
  backupDone: boolean;
  isFetchingUtxos: boolean;
}

const initialState: AppState = {
  appInit: false,
  isSignedUp: false,
  backupDone: false,
  isFetchingUtxos: false,
};

function appReducer(state = initialState, action: ActionType): AppState {
  switch (action.type) {
    case INIT_APP_SUCCESS:
    case INIT_APP_FAIL:
      return {
        ...state,
        appInit: true,
      };
    case SET_SIGNED_UP:
      return {
        ...state,
        isSignedUp: action.payload,
      };
    case SET_IS_BACKUP_DONE:
      return {
        ...state,
        backupDone: action.payload,
      };
    case SET_IS_FETCHING_UTXOS:
      return {
        ...state,
        isFetchingUtxos: action.payload,
      };
    default:
      return state;
  }
}

export default appReducer;
