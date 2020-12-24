import { takeLatest, put, call } from 'redux-saga/effects';
import { INIT_APP, initAppFail, initAppSuccess } from '../actions/appActions';
import {
  getCoinsList,
  setAddress,
  setIsAuth,
  setMnemonic,
  setIdentity,
} from '../actions/walletActions';
import { setProviderEndpoint } from '../actions/exchange/providerActions';
import { getAddress, getWallet } from '../services/walletService';
import { IdentityType, Mnemonic } from 'tdex-sdk';
import { Storage } from '@capacitor/core';
import { network, provider } from '../config';

function* initAppSaga({ type }: { type: string }) {
  try {
    const walletData = yield call(getWallet);
    const walletObj = JSON.parse(walletData.value);
    if (walletObj) {
      const addressData = yield call(getAddress);
      const addressObj = JSON.parse(addressData.value);
      const identity = new Mnemonic({
        chain: network.chain,
        type: IdentityType.Mnemonic,
        value: {
          mnemonic: walletObj.mnemonic,
        },
      });
      if (addressObj) {
        yield put(setAddress(addressObj));
      } else {
        const receivingAddress = identity.getNextAddress();
        Storage.set({
          key: 'address',
          value: JSON.stringify(receivingAddress),
        });
        yield put(setIdentity(identity));
        yield put(setAddress(receivingAddress));
      }
      yield put(setIsAuth(true));
      yield put(setMnemonic(walletObj.mnemonic));
      yield put(getCoinsList());
      yield put(setProviderEndpoint(provider.endpoint));
    } else {
      yield put(initAppSuccess());
    }
  } catch (e) {
    yield put(initAppFail());
    console.log(e);
  }
}

export function* appWatcherSaga() {
  yield takeLatest(INIT_APP, initAppSaga);
}
