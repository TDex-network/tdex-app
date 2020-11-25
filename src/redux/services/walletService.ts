import axios from 'axios';

//  for local testing
export const explorerUrl = 'http://localhost:3001';
//  for device testing
// export const explorerUrl = 'https://nigiri.network/liquid/api';
//  for prod
// export const explorerUrl = 'https://blockstream.info/liquid/api';

export const providerUrl = 'https://provider.tdex.network';
export const coinGeckoUrl = 'https://api.coingecko.com/api/v3';

export const axiosExplorerObject = axios.create({ baseURL: explorerUrl });
export const axiosProviderObject = axios.create({ baseURL: providerUrl });
export const axiosCoinGeckoObject = axios.create({ baseURL: coinGeckoUrl });

export const getAssetsRequest = (path: string, options?: any) => {
  return axiosExplorerObject.request({
    method: 'get',
    url: path,
    params: options?.params,
  });
};

export const getCoinsRequest = (path: string, options?: any) => {
  return axiosCoinGeckoObject.request({
    method: 'get',
    url: path,
    params: options?.params,
  });
};