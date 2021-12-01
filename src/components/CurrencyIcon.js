import React from 'react';
import PropTypes from 'prop-types';
import './CurrencyIcon.css';
import ValorantAPI from '../util/ValorantAPI';

function CurrencyIcon(props) {
  const { id, alt } = props;
  return (
    <img className="currency-icon" src={ValorantAPI.url('currencyIcon', id)} alt={alt} />
  );
}

CurrencyIcon.propTypes = {
  id: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default CurrencyIcon;
