import { connect } from 'react-redux';
import ExchangeRow from '../../components/ExchangeRow';

import { balancesSelector } from '../reducers/walletReducer';

const mapStateToProps = (state: any) => {
  return {
    prices: state.rates.prices,
    currency: state.settings.currency,
    balances: balancesSelector(state),
  };
};

export default connect(mapStateToProps)(ExchangeRow);
