import { RESET_UTXOS } from './../actions/walletActions';
import { Assets } from './../../utils/constants';
import { AddressInterface, UtxoInterface, Outpoint, isBlindedUtxo } from 'ldk';
import { ActionType } from '../../utils/types';
import {
  CLEAR_WALLET_STATE,
  SET_IS_AUTH,
  SET_WALLET_LOADING,
  SET_ADDRESSES,
  SET_UTXO,
  DELETE_UTXO,
} from '../actions/walletActions';
import { createSelector } from 'reselect';
import { groupBy } from '../../utils/helpers';
import { BalanceInterface } from '../actionTypes/walletActionTypes';

export interface WalletState {
  isAuth: boolean;
  loading: boolean;
  addresses: AddressInterface[];
  utxos: Record<string, UtxoInterface>;
}

const initialState: WalletState = {
  isAuth: false,
  loading: true,
  addresses: [],
  utxos: {},
};

function walletReducer(state = initialState, action: ActionType): WalletState {
  switch (action.type) {
    case SET_ADDRESSES:
      return { ...state, addresses: action.payload };
    case SET_IS_AUTH:
      return { ...state, isAuth: action.payload };
    case SET_WALLET_LOADING:
      return { ...state, loading: action.payload };
    case CLEAR_WALLET_STATE:
      return { ...initialState };
    case SET_UTXO:
      return addUtxoInState(state, action.payload);
    case DELETE_UTXO:
      return deleteUtxoInState(state, action.payload);
    case RESET_UTXOS:
      return { ...state, utxos: {} };
    default:
      return state;
  }
}

export function outpointToString(outpoint: Outpoint): string {
  return `${outpoint.txid}:${outpoint.vout}`;
}

const addUtxoInState = (state: WalletState, utxo: UtxoInterface) => {
  const newUtxosMap = { ...state.utxos };
  newUtxosMap[outpointToString(utxo)] = utxo;
  return { ...state, utxos: newUtxosMap };
};

const deleteUtxoInState = (
  state: WalletState,
  outpoint: Outpoint
): WalletState => {
  const newUtxosMap = { ...state.utxos };
  delete newUtxosMap[outpointToString(outpoint)];
  return { ...state, utxos: newUtxosMap };
};

const utxosMapSelector = ({ wallet }: { wallet: WalletState }) => wallet.utxos;
export const allUtxosSelector = createSelector(utxosMapSelector, (utxosMap) =>
  Array.from(Object.values(utxosMap))
);

export const balancesSelector = createSelector(
  allUtxosSelector,
  (utxos: UtxoInterface[]) => balancesFromUtxos(utxos)
);

function balancesFromUtxos(utxos: UtxoInterface[]): BalanceInterface[] {
  const balances: BalanceInterface[] = [];
  const utxosGroupedByAsset: Record<string, UtxoInterface[]> = groupBy(
    utxos,
    'asset'
  );

  for (const asset of Object.keys(utxosGroupedByAsset)) {
    const utxosForAsset = utxosGroupedByAsset[asset];
    const amount = sumUtxos(utxosForAsset);

    let ticker: string = asset.slice(0, 4);
    let coinGeckoID = undefined;
    const assetData = Object.values(Assets).find((a) => a.assetHash === asset);
    if (assetData) {
      ticker = assetData.ticker;
      coinGeckoID = assetData.coinGeckoID;
    }
    balances.push({ asset, amount, ticker, coinGeckoID });
  }

  return balances;
}

function sumUtxos(utxos: UtxoInterface[]): number {
  let sum = 0;
  for (const utxo of utxos) {
    if (!isBlindedUtxo(utxo) && utxo.value) {
      sum += utxo.value;
    }
  }
  return sum;
}

export default walletReducer;
