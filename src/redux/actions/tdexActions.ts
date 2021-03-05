import { TDEXProvider, TDEXMarket } from '../actionTypes/tdexActionTypes';
import { ActionType } from '../../utils/types';

export const ADD_PROVIDER = 'ADD_PROVIDER_ENDPOINT';
export const DELETE_PROVIDER = 'DELETE_PROVIDER';
export const UPDATE_MARKETS = 'UPDATE_MARKETS';
export const SET_MARKETS = 'SET_MARKETS';

export const setMarkets = (markets: TDEXMarket[]): ActionType => {
  return {
    type: SET_MARKETS,
    payload: markets,
  };
};

let nextId = 0;

export const addProvider = (provider: TDEXProvider): ActionType => {
  return {
    type: ADD_PROVIDER,
    payload: { ...provider, id: nextId++ },
  };
};

export const deleteProvider = (provider: TDEXProvider): ActionType => {
  return {
    type: DELETE_PROVIDER,
    payload: provider,
  };
};

export const updateMarkets = (): ActionType => {
  return {
    type: UPDATE_MARKETS,
  };
};
