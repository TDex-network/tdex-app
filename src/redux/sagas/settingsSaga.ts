import {
  setCurrency,
  setElectrumServer,
  SET_CURRENCY,
  SET_ELECTRUM_SERVER,
} from './../actions/settingsActions';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setTheme, STORE_THEME } from '../actions/settingsActions';
import { ActionType } from '../../utils/types';
import {
  setThemeToStorage,
  getThemeFromStorage,
} from '../services/settingsService';
import { SIGN_IN } from '../actions/appActions';
import {
  getCurrencyFromStorage,
  getExplorerFromStorage,
  setCurrencyInStorage,
  setExplorerInStorage,
} from '../../utils/storage-helper';

function* storeThemeSaga({ payload }: ActionType) {
  try {
    yield call(setThemeToStorage, payload);
    yield put(setTheme(payload));
  } catch (e) {
    console.error(e);
  }
}

function* restoreThemeSaga(action: ActionType) {
  try {
    const data = yield call(getThemeFromStorage);
    const theme = data.value || 'dark';
    yield put(setTheme(theme));
  } catch (e) {
    console.error(e);
  }
}

function* restoreExplorer() {
  try {
    const explorerEndpoint = yield call(getExplorerFromStorage);
    if (explorerEndpoint) {
      yield put(setElectrumServer(explorerEndpoint));
    }
  } catch (e) {
    console.error(e);
  }
}

function* persistExplorer(action: ActionType) {
  yield call(setExplorerInStorage, action.payload);
}

function* persistCurrency(action: ActionType) {
  yield call(setCurrencyInStorage, action.payload);
}

function* restoreCurrency() {
  try {
    const currency = yield call(getCurrencyFromStorage);
    yield put(setCurrency(currency));
  } catch (e) {
    console.error(e);
  }
}

export function* settingsWatcherSaga() {
  yield takeLatest(STORE_THEME, storeThemeSaga);
  yield takeLatest(SIGN_IN, restoreThemeSaga);
  yield takeLatest(SIGN_IN, restoreExplorer);
  yield takeLatest(SIGN_IN, restoreCurrency);
  yield takeLatest(SET_ELECTRUM_SERVER, persistExplorer);
  yield takeLatest(SET_CURRENCY, persistCurrency);
}
