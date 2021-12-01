import React from 'react';
import PropTypes from 'prop-types';
import CurrencyIcon from './CurrencyIcon';
import './Item.css';
import ValorantAPI from '../util/ValorantAPI';

function Item(props) {
  const { id } = props;
  return (
    <div className="column item card">
      <div className="item card-image">
        <img className="skin-icon" src={ValorantAPI.url('skinIcon', id)} alt="weapon skin" />
      </div>
      <div className="item card-content">
        <p className="item price vertical-align-children">
          <span>{ValorantAPI.prices[id]}</span>
          {' '}
          <CurrencyIcon id={ValorantAPI.CURRENCIES.VP} alt="VALORANT points" />
        </p>
        <p className="item title is-5">{ValorantAPI.names[id]}</p>
      </div>
    </div>
  );
}

Item.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Item;
