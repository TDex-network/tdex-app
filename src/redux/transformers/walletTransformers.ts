import { defaultPrecision } from '../../utils/constants';
import { BalanceInterface } from '../actionTypes/walletActionTypes';
import { getEdgeAsset } from '../../utils/helpers';

export const assetTransformer = (assets: any, balance: BalanceInterface) => {
  return assets.map((asset: any) => {
    const edgeAsset = getEdgeAsset(asset.data.asset_id);
    if (edgeAsset) {
      const { name, ticker } = edgeAsset;
      return {
        asset_id: asset.data.asset_id,
        name,
        ticker,
        precision: defaultPrecision,
        amount: balance[asset.data.asset_id],
        amountDisplay: (
          balance[asset.data.asset_id] /
          10 ** defaultPrecision
        ).toFixed(2),
      };
    }
    const { asset_id, precision, name, ticker, status } = asset.data;
    return {
      asset_id,
      name,
      ticker,
      blockHash: status?.block_hash || '',
      precision: precision || defaultPrecision,
      amount: balance[asset_id],
      amountDisplay: (
        balance[asset.data.asset_id] /
        10 ** (precision || defaultPrecision)
      ).toFixed(2),
    };
  });
};

export const coinsTransformer = (
  coins: Array<any>,
  rates: any,
  currency: string
) => {
  return coins.reduce((obj: any, coin: any) => {
    const symbol = coin.symbol === 'btc' ? 'lbtc' : coin.symbol;
    obj[symbol] = {
      name: coin.name,
      rate: {
        [currency]: rates[coin.id][currency],
      },
    };
    return obj;
  }, {});
};