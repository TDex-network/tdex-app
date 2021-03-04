import { connect } from 'react-redux';
import ExchangeSearch from '../../components/ExchangeSearch';

const mapStateToProps = (state: any) => {
  return {
    prices: state.rates.prices,
    currency: state.settings.currency,
  };
};

export default connect(mapStateToProps)(ExchangeSearch);
